const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8765/", { waitUntil: "domcontentloaded", timeout: 15000 });

  const startLabel = await page.$eval("#primary-btn", (el) => el.textContent.trim());
  if (startLabel !== "Start") throw new Error(`expected Start, got ${startLabel}`);

  await page.click("#primary-btn");
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Go");
  await page.click("#round-btn");
  await page.click("#round-btn");
  const rounds = await page.$eval("#rounds", (el) => el.textContent.trim());
  if (rounds !== "2") throw new Error(`expected 2 rounds, got ${rounds}`);

  await page.click('.movement[data-i="0"]');
  await page.click('.movement[data-i="1"]');
  await page.click('.movement[data-i="2"]');
  const afterMovements = await page.$eval("#rounds", (el) => el.textContent.trim());
  if (afterMovements !== "3") throw new Error(`movement complete should add a round, got ${afterMovements}`);

  await page.click("#undo-btn");
  const undone = await page.$eval("#rounds", (el) => el.textContent.trim());
  if (undone !== "2") throw new Error(`undo should drop to 2, got ${undone}`);

  await page.click("#primary-btn");
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Paused");

  await page.click("#quick-log-btn");
  await page.waitForSelector("#modal:not([hidden])");
  await page.$eval("#step-value", (el) => {
    el.value = "14";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click("#modal-save");
  await page.waitForFunction(() => document.querySelector("#stat-today").textContent.trim() === "14");

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("cindy-tracker-v1")));
  const today = Object.values(stored.workouts)[0];
  if (!today || today.rounds !== 14) throw new Error("workout was not saved");

  await page.click('.tab[data-view="log"]');
  const history = await page.$eval("#history", (el) => el.textContent);
  if (!history.includes("14")) throw new Error("history missing saved score");

  await page.screenshot({ path: "/tmp/cindy-log.png" });
  console.log("ui tests ok");
  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
