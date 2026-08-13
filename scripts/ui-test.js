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

  const startLabel = await page.$eval("#timer-label", (el) => el.textContent.trim());
  if (startLabel !== "Tap to start") throw new Error(`expected Tap to start, got ${startLabel}`);

  const bit0 = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (!bit0) throw new Error("expected a quote under the timer");
  if (!/deez nuts/i.test(bit0)) throw new Error(`opening line missing deez nuts: ${bit0}`);

  await page.click("#timer-btn");
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Tap to pause");
  await page.click("#round-btn");
  const bit1 = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (bit1 === bit0) throw new Error("adding a round should change the quote");
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
  const bitAfterUndo = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (bitAfterUndo === bit1) throw new Error("undoing a round should change the quote");

  await page.click("#timer-btn");
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Tap to go");

  await page.click("#quick-log-btn");
  await page.waitForSelector("#modal:not([hidden])");
  await page.$eval("#step-value", (el) => {
    el.value = "14";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click("#modal-save");
  await page.waitForFunction(() => document.querySelector("#stat-today").textContent.trim() === "14");

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("amrap-tracker-v1")));
  const today = Object.values(stored.workouts)[0];
  if (!today || today.rounds !== 14) throw new Error("workout was not saved");

  const line = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (!line) throw new Error("expected a rotating line under the timer");
  if (!/deez nuts|sunken place|handshake/i.test(line)) {
    throw new Error(`unexpected opening line: ${line}`);
  }
  await page.click("#bit-card");
  const nextLine = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (nextLine === line) throw new Error("tapping the line should rotate it");

  await page.click('.tab[data-view="log"]');
  const history = await page.$eval("#history", (el) => el.textContent);
  if (!history.includes("14")) throw new Error("history missing saved score");
  const logHasBit = await page.$("#view-log .bit-card");
  if (logHasBit) throw new Error("quote card should not be on the log");

  await page.click("#theme-handle");
  await page.waitForFunction(() => document.querySelector("#theme-tray").classList.contains("is-open"));
  await page.waitForSelector('[data-theme-id="rick"]');
  await page.$eval('[data-theme-id="rick"]', (el) => el.click());
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (theme !== "rick") throw new Error(`expected rick theme, got ${theme}`);
  const trayClosed = await page.$eval("#theme-tray", (el) => !el.classList.contains("is-open"));
  if (!trayClosed) throw new Error("picking a skin should close the tray");

  await page.click('.tab[data-view="workout"]');
  const rickLine = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (!/deez nuts/i.test(rickLine)) {
    throw new Error(`expected a Rick deez-nuts line after skin change, got ${rickLine}`);
  }
  const kicker = await page.$eval("#bit-card .bit-kicker", (el) => el.textContent.trim());
  if (kicker !== "Rick") throw new Error(`expected Rick kicker, got ${kicker}`);

  await page.screenshot({ path: "/tmp/amrap-log.png" });
  console.log("ui tests ok");
  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
