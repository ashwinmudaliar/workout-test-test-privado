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
  "themes/bofa/mark.jpg",
  "themes/bofa/bust.jpg",
  "themes/rick/mark.jpg",
  "themes/rick/bust.jpg",
  "jokes.js",
  "jokes-wick.js",
  "jokes-boys.js",
  "themes/wick/john/bust.jpg",
  "themes/boys/homelander/bust.jpg",
  "themes/boys/butcher/bust.jpg",
  "themes/wick/john/mark.jpg",
  "themes/wick/winston/bust.jpg",
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
  "pack-select",
  "bit-card",
  "BOFA Protocol",
  "rx-icon",
  'data-theme="rick"',
  'data-pack="rnm"',
  "jokes-wick.js",
  "jokes-boys.js",
]) {
  if (!html.includes(needle)) throw new Error(`index.html missing ${needle}`);
}

const pullups = html.slice(html.indexOf('data-i="0"'), html.indexOf('data-i="1"'));
if (!/class="reps"[\s\S]*class="name"[\s\S]*class="rx-end"[\s\S]*class="rx-icon"[\s\S]*class="check"/.test(pullups)) {
  throw new Error("movement row should be reps, name, icon, then check");
}

const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
if (!js.includes("serviceWorker")) throw new Error("service worker registration missing");
if (!js.includes("20 * 60 * 1000")) throw new Error("20-minute cap missing");
if (!js.includes("nextBit")) throw new Error("round-shift quote advance missing");
if (!js.includes('const DEFAULT_THEME = "rick"')) throw new Error("Rick is not the baseline skin");
if (!js.includes('if (next.theme === "amrap") next.theme = "bofa"')) {
  throw new Error("old AMRAP skin should remap to Bofa");
}
if (!js.includes('id: "wick"') || !js.includes('defaultId: "john"')) {
  throw new Error("John Wick pack is missing");
}
if (!js.includes('id: "boys"') || !js.includes('defaultId: "homelander"')) {
  throw new Error("The Boys pack is missing");
}
if (!js.includes("applyPack") || !js.includes("packTheme")) {
  throw new Error("pack switching / last-face memory missing");
}

const jokes = fs.readFileSync(path.join(root, "jokes.js"), "utf8");
const vm = require("vm");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(jokes, context);
const wickJokes = fs.readFileSync(path.join(root, "jokes-wick.js"), "utf8");
vm.runInContext(wickJokes, context);
const boysJokes = fs.readFileSync(path.join(root, "jokes-boys.js"), "utf8");
vm.runInContext(boysJokes, context);
const pools = context.window.AMRAP_JOKES;
const kickers = context.window.AMRAP_JOKE_KICKERS;
const rnmKeys = [
  "bofa",
  "rick",
  "morty",
  "beth",
  "space-beth",
  "scary-terry",
  "birdperson",
  "evil-morty",
];
const wickKeys = [
  "john",
  "winston",
  "charon",
  "bowery-king",
  "caine",
  "adjudicator",
  "marquis",
  "koji",
];
const boysKeys = [
  "homelander",
  "butcher",
  "hughie",
  "mm",
  "frenchie",
  "soldier-boy",
  "deep",
  "stan-edgar",
];
if (kickers.bofa !== "Walken") throw new Error("Bofa kicker should be Walken");
if (kickers.john !== "John") throw new Error("Wick kicker should be John");
if (kickers.marquis !== "Marquis") throw new Error("Marquis kicker missing");
if (kickers.homelander !== "Homelander") throw new Error("Homelander kicker missing");
if (kickers.deep !== "The Deep") throw new Error("The Deep kicker missing");
if (pools.sophia || kickers.sophia) throw new Error("Sophia should be gone from the Wick pack");
if (pools.starlight || pools.kimiko) throw new Error("Starlight and Kimiko should not be in the Boys pack");
for (const key of [...rnmKeys, ...wickKeys, ...boysKeys]) {
  const pool = pools[key];
  if (!Array.isArray(pool)) throw new Error(`jokes missing ${key}`);
  if (pool.length !== 32) throw new Error(`${key} pool should be 32, found ${pool.length}`);
  const nuts = pool.filter((line) => /deez nuts/.test(line));
  if (nuts.length !== 32) {
    throw new Error(`${key} needs 32 lowercase deez nuts, found ${nuts.length}`);
  }
  const caps = pool.filter((line) => /Deez nuts/.test(line));
  if (caps.length) throw new Error(`${key} has capitalized Deez nuts`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
if (manifest.display !== "standalone") throw new Error("manifest must be standalone");
if (!manifest.short_name) throw new Error("manifest short_name missing");

console.log("smoke ok");
