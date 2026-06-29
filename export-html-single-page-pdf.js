const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { pathToFileURL } = require("url");

const jobs = [
  {
    input: "ui-kit-components.html",
    output: "ui-kit-components-html-single-page.pdf",
  },
  {
    input: "ui-kit-decomposition.html",
    output: "ui-kit-decomposition-html-single-page.pdf",
  },
];

const desktopViewport = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
};

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(
    process.env.LOCALAPPDATA || "",
    "Google\\Chrome\\Application\\chrome.exe",
  ),
].filter(Boolean);

function findChrome() {
  const localChrome = chromeCandidates.find((candidate) =>
    fs.existsSync(candidate),
  );

  if (localChrome) {
    return localChrome;
  }

  throw new Error(
    "No se encontro Chrome. Instalalo o define CHROME_PATH con la ruta al ejecutable.",
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDevToolsPort(userDataDir) {
  const portFile = path.join(userDataDir, "DevToolsActivePort");

  for (let i = 0; i < 100; i += 1) {
    if (fs.existsSync(portFile)) {
      const [port] = fs.readFileSync(portFile, "utf8").trim().split(/\r?\n/);
      return port;
    }

    await delay(100);
  }

  throw new Error("Chrome no abrio el puerto remoto a tiempo.");
}

class CdpClient {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.eventWaiters = new Map();
    this.ws = new WebSocket(wsUrl);

    this.opened = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }

        return;
      }

      const waiters = this.eventWaiters.get(message.method);
      if (!waiters?.length) {
        return;
      }

      const waiter = waiters.shift();
      waiter(message.params);
    });
  }

  async send(method, params = {}) {
    await this.opened;

    const id = this.nextId;
    this.nextId += 1;

    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    this.ws.send(JSON.stringify({ id, method, params }));
    return response;
  }

  waitFor(method) {
    return new Promise((resolve) => {
      const waiters = this.eventWaiters.get(method) || [];
      waiters.push(resolve);
      this.eventWaiters.set(method, waiters);
    });
  }

  close() {
    this.ws.close();
  }
}

async function getPageWebSocketUrl(port) {
  const tabs = await fetch(`http://127.0.0.1:${port}/json/list`).then((res) =>
    res.json(),
  );
  const page = tabs.find((tab) => tab.type === "page");

  if (!page?.webSocketDebuggerUrl) {
    throw new Error("No se encontro una pestaña de Chrome para controlar.");
  }

  return page.webSocketDebuggerUrl;
}

async function navigateAndMeasure(client, filePath) {
  const url = pathToFileURL(path.resolve(filePath)).href;

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setEmulatedMedia", { media: "screen" });
  await client.send("Emulation.setDeviceMetricsOverride", {
    ...desktopViewport,
    mobile: false,
  });

  const loaded = client.waitFor("Page.loadEventFired");
  await client.send("Page.navigate", { url });
  await loaded;

  await client.send("Runtime.evaluate", {
    expression:
      "document.fonts ? document.fonts.ready.then(() => true) : Promise.resolve(true)",
    awaitPromise: true,
  });
  await delay(500);

  const result = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const body = document.body;
      const html = document.documentElement;
      const elements = Array.from(document.querySelectorAll("body *"));
      const bounds = elements.reduce((acc, element) => {
        const rect = element.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          acc.right = Math.max(acc.right, rect.right + window.scrollX);
          acc.bottom = Math.max(acc.bottom, rect.bottom + window.scrollY);
        }

        return acc;
      }, { right: 0, bottom: 0 });

      return {
        width: Math.ceil(Math.max(
          html.scrollWidth,
          body.scrollWidth,
          html.offsetWidth,
          body.offsetWidth,
          bounds.right
        )),
        height: Math.ceil(Math.max(
          html.scrollHeight,
          body.scrollHeight,
          html.offsetHeight,
          body.offsetHeight,
          bounds.bottom
        )),
      };
    })()`,
  });

  return result.result.value;
}

async function printSinglePage(client, output, size) {
  const width = Math.ceil(size.width);
  const height = Math.ceil(size.height);
  const paperWidth = width / 96;
  const paperHeight = height / 96;

  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await delay(250);

  const result = await client.send("Page.printToPDF", {
    printBackground: true,
    landscape: false,
    displayHeaderFooter: false,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paperWidth,
    paperHeight,
    scale: 1,
    preferCSSPageSize: false,
  });

  fs.writeFileSync(path.resolve(output), Buffer.from(result.data, "base64"));
  console.log(`Exportado ${output} (${width}x${height}px, una pagina)`);
}

async function stopChrome(chrome) {
  if (chrome.exitCode !== null) {
    return;
  }

  const closed = new Promise((resolve) => {
    chrome.once("exit", resolve);
  });

  chrome.kill();
  await Promise.race([closed, delay(3000)]);
}

async function removeDirWithRetry(dir) {
  for (let i = 0; i < 10; i += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (i === 9) {
        throw error;
      }

      await delay(250);
    }
  }
}

async function run() {
  const chromePath = findChrome();
  const userDataDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "html-single-page-pdf-"),
  );
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);

  chrome.stderr.on("data", () => {});

  try {
    const port = await waitForDevToolsPort(userDataDir);
    const wsUrl = await getPageWebSocketUrl(port);
    const client = new CdpClient(wsUrl);

    try {
      for (const job of jobs) {
        const size = await navigateAndMeasure(client, job.input);
        await printSinglePage(client, job.output, size);
      }
    } finally {
      client.close();
    }
  } finally {
    await stopChrome(chrome);
    await removeDirWithRetry(userDataDir);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
