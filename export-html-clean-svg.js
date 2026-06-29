const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { pathToFileURL } = require("url");

const cliInputs = process.argv.slice(2);
const jobs = cliInputs.length
  ? cliInputs.map((input) => ({
      input,
      output: input.replace(/\.html?$/i, "") + "-html-clean.svg",
    }))
  : [
  {
    input: "ui-kit-components.html",
    output: "ui-kit-components-html-clean.svg",
  },
  {
    input: "ui-kit-decomposition.html",
    output: "ui-kit-decomposition-html-clean.svg",
  },
];

const viewport = {
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
  const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));

  if (!chrome) {
    throw new Error(
      "Chrome was not found. Install it or define CHROME_PATH.",
    );
  }

  return chrome;
}

async function buildEmbeddedFontCss() {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap";
  const response = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch Inter CSS: ${response.status}`);
  }

  let css = await response.text();
  const urls = Array.from(css.matchAll(/url\((https:\/\/[^)]+)\)/g)).map(
    (match) => match[1],
  );
  const fontData = new Map();

  for (const url of urls) {
    const fontResponse = await fetch(url);

    if (!fontResponse.ok) {
      throw new Error(`Could not fetch font file: ${url}`);
    }

    const buffer = Buffer.from(await fontResponse.arrayBuffer());
    const mime = url.includes(".ttf") ? "font/ttf" : "font/woff2";
    fontData.set(url, `data:${mime};base64,${buffer.toString("base64")}`);
  }

  for (const [url, dataUrl] of fontData.entries()) {
    css = css.replaceAll(`url(${url})`, `url("${dataUrl}")`);
  }

  return `${css}
text {
  font-family: "Inter", Arial, sans-serif;
}`;
}

function injectSvgStyle(svg, css) {
  const style = `<style><![CDATA[
${css}
]]></style>`;

  if (svg.includes("<defs>")) {
    return svg.replace("<defs>", `<defs>${style}`);
  }

  return svg.replace(/(<svg\b[^>]*>)/, `$1
<defs>${style}</defs>`);
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

  throw new Error("Chrome did not expose the remote debugging port in time.");
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
      if (waiters?.length) {
        waiters.shift()(message.params);
      }
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
    throw new Error("No controllable Chrome page was found.");
  }

  return page.webSocketDebuggerUrl;
}

async function stopChrome(chrome) {
  if (chrome.exitCode !== null) {
    return;
  }

  const closed = new Promise((resolve) => chrome.once("exit", resolve));
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

function pageSerializer() {
  const transparent = new Set([
    "transparent",
    "rgba(0, 0, 0, 0)",
    "rgba(0,0,0,0)",
  ]);
  const ignoredTags = new Set([
    "HTML",
    "HEAD",
    "META",
    "LINK",
    "STYLE",
    "SCRIPT",
    "TITLE",
    "NOSCRIPT",
  ]);
  let gradientIndex = 0;
  let clipIndex = 0;
  const defs = [];

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function num(value) {
    return Number(value || 0).toFixed(2).replace(/\.00$/, "");
  }

  function px(value) {
    return Number.parseFloat(value || "0") || 0;
  }

  function isVisible(element) {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function absoluteRect(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  }

  function colorVisible(value) {
    return value && !transparent.has(value);
  }

  function parseGradientStops(backgroundImage) {
    const colors = backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/g);

    if (!colors || colors.length < 2) {
      return null;
    }

    return colors;
  }

  function gradientFill(backgroundImage) {
    const colors = parseGradientStops(backgroundImage);

    if (!colors) {
      return null;
    }

    gradientIndex += 1;
    const id = `clean-gradient-${gradientIndex}`;
    const last = colors.length - 1;
    const stops = colors
      .map((color, index) => {
        const offset = last === 0 ? 0 : (index / last) * 100;
        return `<stop offset="${num(offset)}%" stop-color="${esc(color)}"/>`;
      })
      .join("");

    defs.push(
      `<linearGradient id="${id}" x1="0%" y1="0%" x2="0%" y2="100%">${stops}</linearGradient>`,
    );
    return `url(#${id})`;
  }

  function cornerRadii(rect, style) {
    const maxRadius = Math.max(0, Math.min(rect.width, rect.height) / 2);
    return {
      tl: Math.min(px(style.borderTopLeftRadius), maxRadius),
      tr: Math.min(px(style.borderTopRightRadius), maxRadius),
      br: Math.min(px(style.borderBottomRightRadius), maxRadius),
      bl: Math.min(px(style.borderBottomLeftRadius), maxRadius),
    };
  }

  function roundedRectPath(rect, radii) {
    const { x, y, width, height } = rect;
    const right = x + width;
    const bottom = y + height;

    return [
      `M ${num(x + radii.tl)} ${num(y)}`,
      `H ${num(right - radii.tr)}`,
      radii.tr
        ? `Q ${num(right)} ${num(y)} ${num(right)} ${num(y + radii.tr)}`
        : `L ${num(right)} ${num(y)}`,
      `V ${num(bottom - radii.br)}`,
      radii.br
        ? `Q ${num(right)} ${num(bottom)} ${num(right - radii.br)} ${num(bottom)}`
        : `L ${num(right)} ${num(bottom)}`,
      `H ${num(x + radii.bl)}`,
      radii.bl
        ? `Q ${num(x)} ${num(bottom)} ${num(x)} ${num(bottom - radii.bl)}`
        : `L ${num(x)} ${num(bottom)}`,
      `V ${num(y + radii.tl)}`,
      radii.tl
        ? `Q ${num(x)} ${num(y)} ${num(x + radii.tl)} ${num(y)}`
        : `L ${num(x)} ${num(y)}`,
      "Z",
    ].join(" ");
  }

  function rectMarkup(rect, style, fill, stroke = "none", strokeWidth = 0) {
    const radii = cornerRadii(rect, style);
    const sameRadius =
      radii.tl === radii.tr &&
      radii.tl === radii.br &&
      radii.tl === radii.bl;

    if (sameRadius) {
      return `<rect x="${num(rect.x)}" y="${num(rect.y)}" width="${num(rect.width)}" height="${num(rect.height)}" rx="${num(radii.tl)}" fill="${esc(fill)}" stroke="${esc(stroke)}" stroke-width="${num(strokeWidth)}"/>`;
    }

    return `<path d="${roundedRectPath(rect, radii)}" fill="${esc(fill)}" stroke="${esc(stroke)}" stroke-width="${num(strokeWidth)}"/>`;
  }

  function createClip(rect, style) {
    clipIndex += 1;
    const id = `clean-clip-${clipIndex}`;
    const radii = cornerRadii(rect, style);
    const sameRadius =
      radii.tl === radii.tr &&
      radii.tl === radii.br &&
      radii.tl === radii.bl;
    const shape = sameRadius
      ? `<rect x="${num(rect.x)}" y="${num(rect.y)}" width="${num(rect.width)}" height="${num(rect.height)}" rx="${num(radii.tl)}"/>`
      : `<path d="${roundedRectPath(rect, radii)}"/>`;

    defs.push(`<clipPath id="${id}">${shape}</clipPath>`);
    return id;
  }

  function imageFromBackground(element, rect, style, url) {
    const clipId = createClip(rect, style);
    return `<image href="${esc(url)}" x="${num(rect.x)}" y="${num(rect.y)}" width="${num(rect.width)}" height="${num(rect.height)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`;
  }

  function backgroundImageUrl(backgroundImage) {
    const match = backgroundImage.match(/url\(["']?(.+?)["']?\)/);
    return match?.[1] || null;
  }

  function elementBase(element) {
    const style = getComputedStyle(element);
    const rect = absoluteRect(element);
    const parts = [];
    const backgroundUrl = backgroundImageUrl(style.backgroundImage);

    if (backgroundUrl) {
      parts.push(imageFromBackground(element, rect, style, backgroundUrl));
    } else if (style.backgroundImage.includes("linear-gradient")) {
      const fill = gradientFill(style.backgroundImage);

      if (fill) {
        parts.push(rectMarkup(rect, style, fill));
      }
    } else if (colorVisible(style.backgroundColor)) {
      parts.push(rectMarkup(rect, style, style.backgroundColor));
    }

    const borderWidth = Math.max(
      px(style.borderTopWidth),
      px(style.borderRightWidth),
      px(style.borderBottomWidth),
      px(style.borderLeftWidth),
    );

    if (
      borderWidth > 0 &&
      style.borderStyle !== "none" &&
      colorVisible(style.borderColor)
    ) {
      parts.push(
        rectMarkup(rect, style, "none", style.borderColor, borderWidth),
      );
    }

    return parts.join("");
  }

  function serializeInlineSvg(element) {
    const rect = absoluteRect(element);
    const style = getComputedStyle(element);
    let markup = element.outerHTML
      .replace(/<svg\b/i, `<svg x="${num(rect.x)}" y="${num(rect.y)}"`)
      .replace(/\bwidth="[^"]*"/i, `width="${num(rect.width)}"`)
      .replace(/\bheight="[^"]*"/i, `height="${num(rect.height)}"`)
      .replace(/currentColor/g, style.color);

    if (!/\bwidth="/i.test(markup)) {
      markup = markup.replace(/<svg\b/i, `<svg width="${num(rect.width)}"`);
    }

    if (!/\bheight="/i.test(markup)) {
      markup = markup.replace(/<svg\b/i, `<svg height="${num(rect.height)}"`);
    }

    return markup;
  }

  function serializeImg(element) {
    const rect = absoluteRect(element);
    const style = getComputedStyle(element);
    const radii = cornerRadii(rect, style);
    const radius = Math.max(radii.tl, radii.tr, radii.br, radii.bl);
    const clipId =
      radius > 0 || style.overflow === "hidden"
        ? createClip(rect, style)
        : null;

    return `<image href="${esc(element.currentSrc || element.src)}" x="${num(rect.x)}" y="${num(rect.y)}" width="${num(rect.width)}" height="${num(rect.height)}" preserveAspectRatio="xMidYMid meet"${clipId ? ` clip-path="url(#${clipId})"` : ""}/>`;
  }

  function textTransform(text, style) {
    if (style.textTransform === "uppercase") {
      return text.toUpperCase();
    }

    if (style.textTransform === "lowercase") {
      return text.toLowerCase();
    }

    return text;
  }

  function serializeTextNode(node) {
    if (!node.nodeValue || !node.nodeValue.trim()) {
      return "";
    }

    const parent = node.parentElement;

    if (!parent || !isVisible(parent)) {
      return "";
    }

    const style = getComputedStyle(parent);
    const groups = [];

    for (let index = 0; index < node.nodeValue.length; index += 1) {
      const char = node.nodeValue[index];
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const rect = range.getBoundingClientRect();
      range.detach();

      if (rect.width === 0 && rect.height === 0) {
        continue;
      }

      const y = Math.round((rect.top + window.scrollY) * 2) / 2;
      let group = groups.find((item) => Math.abs(item.y - y) < 2);

      if (!group) {
        group = {
          x: rect.left + window.scrollX,
          y,
          bottom: rect.bottom + window.scrollY,
          text: "",
        };
        groups.push(group);
      }

      group.x = Math.min(group.x, rect.left + window.scrollX);
      group.bottom = Math.max(group.bottom, rect.bottom + window.scrollY);
      group.text += char;
    }

    const fontSize = px(style.fontSize);
    const rawFontFamily = style.fontFamily.split(",")[0].replace(/["']/g, "");
    const fontFamily = rawFontFamily.toLowerCase().includes("inter")
      ? "Inter, Arial, sans-serif"
      : `${rawFontFamily}, Arial, sans-serif`;
    const attrs = [
      `font-family="${esc(fontFamily)}"`,
      `font-size="${num(fontSize)}"`,
      `font-weight="${esc(style.fontWeight)}"`,
      `fill="${esc(style.color)}"`,
      style.letterSpacing !== "normal"
        ? `letter-spacing="${num(px(style.letterSpacing))}"`
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return groups
      .map((group) => {
        const text = textTransform(group.text.replace(/\s+/g, " "), style);

        if (!text.trim()) {
          return "";
        }

        const baseline = group.y + fontSize * 0.92;
        return `<text x="${num(group.x)}" y="${num(baseline)}" ${attrs}>${esc(text)}</text>`;
      })
      .join("");
  }

  function serializeNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return serializeTextNode(node);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node;

    if (
      ignoredTags.has(element.tagName) ||
      element.classList.contains("print-page-bg") ||
      !isVisible(element)
    ) {
      return "";
    }

    if (element.tagName === "SVG") {
      return serializeInlineSvg(element);
    }

    if (element.tagName === "IMG") {
      return serializeImg(element);
    }

    const childMarkup = Array.from(element.childNodes).map(serializeNode).join("");
    return `${elementBase(element)}${childMarkup}`;
  }

  const body = document.body;
  const html = document.documentElement;
  const elements = Array.from(document.querySelectorAll("body *"));
  const bounds = elements.reduce(
    (acc, element) => {
      if (!isVisible(element)) {
        return acc;
      }

      const rect = absoluteRect(element);
      acc.right = Math.max(acc.right, rect.x + rect.width);
      acc.bottom = Math.max(acc.bottom, rect.y + rect.height);
      return acc;
    },
    { right: 0, bottom: 0 },
  );
  const width = Math.ceil(
    Math.max(
      html.scrollWidth,
      body.scrollWidth,
      html.offsetWidth,
      body.offsetWidth,
      bounds.right,
    ),
  );
  const height = Math.ceil(
    Math.max(
      html.scrollHeight,
      body.scrollHeight,
      html.offsetHeight,
      body.offsetHeight,
      bounds.bottom,
    ),
  );
  const background = getComputedStyle(body).backgroundColor || "#050505";
  const content = Array.from(body.childNodes).map(serializeNode).join("");
  const defsMarkup = defs.length ? `<defs>${defs.join("")}</defs>` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${defsMarkup}
<rect x="0" y="0" width="${width}" height="${height}" fill="${esc(background)}"/>
${content}
</svg>
`;
}

async function renderCleanSvg(client, input) {
  const loaded = client.waitFor("Page.loadEventFired");

  await client.send("Page.navigate", {
    url: pathToFileURL(path.resolve(input)).href,
  });
  await loaded;
  await client.send("Runtime.evaluate", {
    expression:
      "document.fonts ? document.fonts.ready.then(() => true) : Promise.resolve(true)",
    awaitPromise: true,
  });
  await delay(750);

  const result = await client.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `(${pageSerializer.toString()})()`,
  });

  return result.result.value;
}

async function run() {
  const chromePath = findChrome();
  const fontCss = await buildEmbeddedFontCss();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "html-clean-svg-"));
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
      await client.send("Page.enable");
      await client.send("Runtime.enable");
      await client.send("Emulation.setEmulatedMedia", { media: "screen" });
      await client.send("Emulation.setDeviceMetricsOverride", {
        ...viewport,
        mobile: false,
      });

      for (const job of jobs) {
        const svg = await renderCleanSvg(client, job.input);
        fs.writeFileSync(path.resolve(job.output), injectSvgStyle(svg, fontCss), "utf8");

        const clipCount = (svg.match(/<clipPath\b/g) || []).length;
        console.log(`Exported ${job.output} with ${clipCount} clipPath(s).`);
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
