#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const required = [
  "index.html",
  "styles.css",
  "app.js",
  "sw.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
];

for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`missing ${file}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const needle of [
  'rel="manifest"',
  "apple-mobile-web-app-capable",
  "apple-touch-icon",
  "5 pull-ups",
  "10 push-ups",
  "15 squats",
  "serviceWorker",
]) {
  if (!html.includes(needle) && needle !== "serviceWorker") {
    throw new Error(`index.html missing ${needle}`);
  }
}

const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
if (!js.includes("serviceWorker")) throw new Error("app.js does not register a service worker");
if (!js.includes("20 * 60 * 1000")) throw new Error("20-minute cap missing");
if (!js.includes("localStorage")) throw new Error("localStorage missing");

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
if (manifest.display !== "standalone") throw new Error("manifest must be standalone");
if (!manifest.icons.some((icon) => icon.sizes === "192x192")) throw new Error("192 icon missing");
if (!manifest.icons.some((icon) => icon.sizes === "512x512")) throw new Error("512 icon missing");

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const paths = ["/", "/manifest.json", "/app.js", "/styles.css", "/sw.js", "/icons/icon-192.png"];
  try {
    for (const p of paths) {
      const res = await fetch(base + p);
      if (!res.ok) throw new Error(`${p} -> ${res.status}`);
    }

    const chrome = spawn(
      "google-chrome",
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--virtual-time-budget=4000",
        `--dump-dom`,
        base + "/",
      ],
      { encoding: "utf8" }
    );
    let out = "";
    let err = "";
    chrome.stdout.on("data", (chunk) => {
      out += chunk;
    });
    chrome.stderr.on("data", (chunk) => {
      err += chunk;
    });
    chrome.on("close", (code) => {
      server.close();
      if (code !== 0) {
        console.error(err);
        process.exit(1);
      }
      if (!out.includes("Cindy") || !out.includes("Pull-ups")) {
        console.error("chrome DOM missing workout UI");
        process.exit(1);
      }
      if (!out.includes("20:00")) {
        console.error("timer not rendered");
        process.exit(1);
      }
      console.log("smoke ok");
    });
  } catch (error) {
    server.close();
    console.error(error);
    process.exit(1);
  }
});
