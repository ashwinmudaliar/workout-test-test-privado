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
  if (startLabel !== "Do it") throw new Error(`expected Do it, got ${startLabel}`);
  const startTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (startTheme !== "rick") throw new Error(`expected rick baseline, got ${startTheme}`);
  const startKicker = await page.$eval("#bit-card .bit-kicker", (el) => el.textContent.trim());
  if (startKicker !== "Rick") throw new Error(`expected Rick kicker, got ${startKicker}`);
  if (await page.$eval("#theme-mark", (el) => el.hidden)) {
    throw new Error("Rick mark should show on the baseline skin");
  }

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }),
    page.evaluate(() => {
      localStorage.setItem(
        "amrap-tracker-v1",
        JSON.stringify({
          workouts: {},
          settings: { sound: true, haptics: true, theme: "amrap" },
        })
      );
      location.reload();
    }),
  ]);
  await page.waitForFunction(() => {
    const stored = JSON.parse(localStorage.getItem("amrap-tracker-v1") || "{}");
    return stored.settings && stored.settings.theme === "rick" && stored.settings.themeBaseline === 1;
  });
  const migratedLabel = await page.$eval("#timer-label", (el) => el.textContent.trim());
  if (migratedLabel !== "Do it") throw new Error(`expected Do it after migrate, got ${migratedLabel}`);

  const rxIcons = await page.$$(".movement .rx-icon");
  if (rxIcons.length !== 3) throw new Error(`expected 3 movement icons, got ${rxIcons.length}`);
  const rowOrder = await page.$eval('.movement[data-i="0"]', (el) => {
    const cls = (node) => (node.getAttribute("class") || "").split(" ")[0];
    const kids = [...el.children].map(cls);
    const end = [...el.querySelector(".rx-end").children].map(cls);
    return { kids, end };
  });
  if (rowOrder.kids.join(" ") !== "reps name rx-end") {
    throw new Error(`expected reps/name/rx-end, got ${rowOrder.kids.join(" ")}`);
  }
  if (rowOrder.end.join(" ") !== "rx-icon check") {
    throw new Error(`expected icon then check, got ${rowOrder.end.join(" ")}`);
  }

  const bit0 = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (!bit0) throw new Error("expected a quote under the timer");
  if (!/deez nuts/i.test(bit0)) throw new Error(`opening line missing deez nuts: ${bit0}`);

  await page.click("#timer-btn");
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Keep going");
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
  await page.waitForFunction(() => document.querySelector("#timer-label").textContent === "Get up");

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
  if (stored.settings.theme !== "rick") throw new Error(`saved theme should stay rick, got ${stored.settings.theme}`);

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
  await page.waitForSelector('[data-theme-id="morty"]');
  await page.$eval('[data-theme-id="morty"]', (el) => el.click());
  const mortyTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (mortyTheme !== "morty") throw new Error(`expected morty theme, got ${mortyTheme}`);
  const trayClosedAfterMorty = await page.$eval("#theme-tray", (el) => !el.classList.contains("is-open"));
  if (!trayClosedAfterMorty) throw new Error("picking a skin should close the tray");

  await page.click("#theme-handle");
  await page.waitForFunction(() => document.querySelector("#theme-tray").classList.contains("is-open"));
  await page.waitForSelector('[data-theme-id="bofa"]');
  await page.$eval('[data-theme-id="bofa"]', (el) => el.click());
  const bofaTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (bofaTheme !== "bofa") throw new Error(`expected bofa theme, got ${bofaTheme}`);
  await page.click('.tab[data-view="workout"]');
  const bofaKicker = await page.$eval("#bit-card .bit-kicker", (el) => el.textContent.trim());
  if (bofaKicker !== "Walken") throw new Error(`expected Walken kicker, got ${bofaKicker}`);
  const bofaLine = await page.$eval("#bit-line", (el) => el.textContent.trim());
  if (!/deez nuts/i.test(bofaLine)) throw new Error(`expected a Walken deez-nuts line, got ${bofaLine}`);
  if (await page.$eval("#theme-mark", (el) => el.hidden)) throw new Error("Bofa mark should show");
  await page.screenshot({ path: "/tmp/amrap-log.png" });

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
  if (await page.$("#default-mark")) throw new Error("20 mark should be gone from the header");
  const markHidden = await page.$eval("#theme-mark", (el) => el.hidden);
  if (markHidden) throw new Error("character mark should show for Rick");

  console.log("ui tests ok");
  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
