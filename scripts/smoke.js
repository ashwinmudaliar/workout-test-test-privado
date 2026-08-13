#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

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
  "themes/rick/mark.jpg",
  "themes/rick/bust.jpg",
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`missing ${file}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const needle of [
  'rel="manifest"',
  "apple-mobile-web-app-capable",
  "apple-touch-icon",
  "Pull-ups",
  "Push-ups",
  "Squats",
  "theme-handle",
  "bit-card",
]) {
  if (!html.includes(needle)) throw new Error(`index.html missing ${needle}`);
}

const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
if (!js.includes("serviceWorker")) throw new Error("service worker registration missing");
if (!js.includes("20 * 60 * 1000")) throw new Error("20-minute cap missing");
if (!js.includes("deez nuts")) throw new Error("Peele department missing");
if (!js.includes("scary-terry")) throw new Error("character lines missing");

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
if (manifest.display !== "standalone") throw new Error("manifest must be standalone");
if (!manifest.short_name) throw new Error("manifest short_name missing");

console.log("smoke ok");
