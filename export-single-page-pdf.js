const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { pathToFileURL } = require("url");

const jobs = [
  {
    input: "ui-kit-components-editable.svg",
    output: "ui-kit-components-single-page.pdf",
  },
  {
    input: "ui-kit-decomposition-editable.svg",
    output: "ui-kit-decomposition-single-page.pdf",
  },
];

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

  const fallback = spawnSync("where", ["chrome"], {
    encoding: "utf8",
    shell: true,
  });

  if (fallback.status === 0) {
    return fallback.stdout.split(/\r?\n/).find(Boolean);
  }

  throw new Error(
    "No se encontro Chrome. Instalalo o define CHROME_PATH con la ruta al ejecutable.",
  );
}

function getSvgSize(svg, file) {
  const svgTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  const width = svgTag?.match(/\bwidth="([\d.]+)"/i)?.[1];
  const height = svgTag?.match(/\bheight="([\d.]+)"/i)?.[1];
  const viewBox = svgTag?.match(
    /\bviewBox="[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/i,
  );

  if ((!width || !height) && !viewBox) {
    throw new Error(`No pude leer width/height del SVG: ${file}`);
  }

  return {
    width: Number(width || viewBox[1]),
    height: Number(height || viewBox[2]),
  };
}

function buildPage(svg, width, height) {
  const widthIn = width / 96;
  const heightIn = height / 96;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Single page PDF export</title>
  <style>
    @page {
      size: ${widthIn}in ${heightIn}in;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    html,
    body {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #050505;
    }

    svg {
      display: block;
      width: ${width}px;
      height: ${height}px;
      margin: 0;
    }
  </style>
</head>
<body>
${svg}
</body>
</html>
`;
}

function exportPdf(chromePath, input, output) {
  const inputPath = path.resolve(input);
  const outputPath = path.resolve(output);
  const svg = fs.readFileSync(inputPath, "utf8");
  const { width, height } = getSvgSize(svg, input);
  const page = buildPage(svg, width, height);
  const tempPath = path.join(
    os.tmpdir(),
    `${path.basename(input, ".svg")}-single-page-${Date.now()}.html`,
  );

  fs.writeFileSync(tempPath, page, "utf8");

  try {
    const result = spawnSync(
      chromePath,
      [
        "--headless",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--allow-file-access-from-files",
        "--print-to-pdf-no-header",
        `--print-to-pdf=${outputPath}`,
        pathToFileURL(tempPath).href,
      ],
      {
        encoding: "utf8",
        stdio: "inherit",
      },
    );

    if (result.status !== 0) {
      throw new Error(`Chrome fallo exportando ${output}`);
    }
  } finally {
    fs.rmSync(tempPath, { force: true });
  }

  const sizeMb = fs.statSync(outputPath).size / 1024 / 1024;
  console.log(
    `Exportado ${output} en una pagina (${width}x${height}px, ${sizeMb.toFixed(2)} MB)`,
  );
}

const chromePath = findChrome();

for (const job of jobs) {
  exportPdf(chromePath, job.input, job.output);
}
