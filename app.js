(() => {
  const STORAGE_KEY = "amrap-tracker-v1";
  const LEGACY_STORAGE_KEY = "cindy-tracker-v1";
  const INSTALL_KEY = "amrap-install-dismissed";
  const LEGACY_INSTALL_KEY = "cindy-install-dismissed";
  const DEFAULT_THEME = "rick";
  const DEFAULT_PACK = "rnm";
  const THEME_BASELINE = 1;
  const WORKOUT_MS = 20 * 60 * 1000;
  const RING = 2 * Math.PI * 54;
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const THEMES = [
    {
      id: "bofa",
      name: "Bofa",
      bust: "themes/bofa/bust.jpg",
      mark: "themes/bofa/mark.jpg",
      bg: "#120e0a",
      labels: {
        idle: "Listen",
        running: "Continue",
        paused: "Wait",
        finished: "That's it",
      },
    },
    {
      id: "rick",
      name: "Rick",
      bust: "themes/rick/bust.jpg",
      mark: "themes/rick/mark.jpg",
      bg: "#0a1216",
      labels: {
        idle: "Do it",
        running: "Keep going",
        paused: "Get up",
        finished: "Time",
      },
    },
    {
      id: "morty",
      name: "Morty",
      bust: "themes/morty/bust.jpg",
      mark: "themes/morty/mark.jpg",
      bg: "#14120c",
      labels: {
        idle: "Aw geez",
        running: "Don't stop",
        paused: "Oh man",
        finished: "Time",
      },
    },
    {
      id: "beth",
      name: "Beth",
      bust: "themes/beth/bust.jpg",
      mark: "themes/beth/mark.jpg",
      bg: "#160d10",
      labels: {
        idle: "Let's go",
        running: "Hold it",
        paused: "Resume",
        finished: "Time",
      },
    },
    {
      id: "space-beth",
      name: "Space Beth",
      bust: "themes/space-beth/bust.jpg",
      mark: "themes/space-beth/mark.jpg",
      bg: "#070b16",
      labels: {
        idle: "Execute",
        running: "Stay sharp",
        paused: "Hold",
        finished: "Time",
      },
    },
    {
      id: "scary-terry",
      name: "Scary Terry",
      bust: "themes/scary-terry/bust.jpg",
      mark: "themes/scary-terry/mark.jpg",
      bg: "#090000",
      labels: {
        idle: "Tap, bitch",
        running: "Don't stop",
        paused: "Wake up",
        finished: "Time",
      },
    },
    {
      id: "birdperson",
      name: "Birdperson",
      bust: "themes/birdperson/bust.jpg",
      mark: "themes/birdperson/mark.jpg",
      bg: "#120e0a",
      labels: {
        idle: "In due time",
        running: "Endure",
        paused: "Rest",
        finished: "Time",
      },
    },
    {
      id: "evil-morty",
      name: "Evil Morty",
      bust: "themes/evil-morty/bust.jpg",
      mark: "themes/evil-morty/mark.jpg",
      bg: "#08080a",
      labels: {
        idle: "Begin",
        running: "Continue",
        paused: "Resume",
        finished: "Time",
      },
    },
  ];

  const PACKS = [
    { id: "rnm", name: "Rick and Morty", defaultId: "rick" },
    { id: "wick", name: "John Wick", defaultId: "john" },
  ];

  THEMES.forEach((theme) => {
    if (!theme.pack) theme.pack = "rnm";
  });

  THEMES.push(
    {
      id: "john",
      name: "John",
      pack: "wick",
      bust: "themes/wick/john/bust.jpg",
      mark: "themes/wick/john/mark.jpg",
      bg: "#070707",
      labels: { idle: "Yeah", running: "Don't stop", paused: "Get up", finished: "Done" },
    },
    {
      id: "winston",
      name: "Winston",
      pack: "wick",
      bust: "themes/wick/winston/bust.jpg",
      mark: "themes/wick/winston/mark.jpg",
      bg: "#070707",
      labels: { idle: "Rules", running: "Continue", paused: "Hold", finished: "Closed" },
    },
    {
      id: "charon",
      name: "Charon",
      pack: "wick",
      bust: "themes/wick/charon/bust.jpg",
      mark: "themes/wick/charon/mark.jpg",
      bg: "#070707",
      labels: { idle: "Ready", running: "Service", paused: "A moment", finished: "Complete" },
    },
    {
      id: "bowery-king",
      name: "Bowery King",
      pack: "wick",
      bust: "themes/wick/bowery-king/bust.jpg",
      mark: "themes/wick/bowery-king/mark.jpg",
      bg: "#070707",
      labels: { idle: "Preach", running: "Don't stop", paused: "Rise", finished: "Amen" },
    },
    {
      id: "caine",
      name: "Caine",
      pack: "wick",
      bust: "themes/wick/caine/bust.jpg",
      mark: "themes/wick/caine/mark.jpg",
      bg: "#070707",
      labels: { idle: "Easy", running: "Continue", paused: "Wait", finished: "Done" },
    },
    {
      id: "adjudicator",
      name: "Adjudicator",
      pack: "wick",
      bust: "themes/wick/adjudicator/bust.jpg",
      mark: "themes/wick/adjudicator/mark.jpg",
      bg: "#070707",
      labels: { idle: "Comply", running: "Continue", paused: "Hold", finished: "Closed" },
    },
    {
      id: "marquis",
      name: "Marquis",
      pack: "wick",
      bust: "themes/wick/marquis/bust.jpg",
      mark: "themes/wick/marquis/mark.jpg",
      bg: "#070707",
      labels: { idle: "Proceed", running: "Dance", paused: "Hold", finished: "Enough" },
    },
    {
      id: "koji",
      name: "Koji",
      pack: "wick",
      bust: "themes/wick/koji/bust.jpg",
      mark: "themes/wick/koji/mark.jpg",
      bg: "#070707",
      labels: { idle: "Begin", running: "Endure", paused: "Rest", finished: "Finished" },
    }
  );

  const LINES = window.AMRAP_JOKES;
  const LINE_KICKERS = window.AMRAP_JOKE_KICKERS;

  const els = {
    installBanner: document.getElementById("install-banner"),
    installCopy: document.getElementById("install-copy"),
    installBtn: document.getElementById("install-btn"),
    installDismiss: document.getElementById("install-dismiss"),
    settingsBtn: document.getElementById("settings-btn"),
    statToday: document.getElementById("stat-today"),
    statPb: document.getElementById("stat-pb"),
    statStreak: document.getElementById("stat-streak"),
    tabs: document.querySelectorAll(".tab"),
    views: {
      workout: document.getElementById("view-workout"),
      log: document.getElementById("view-log"),
    },
    timerWrap: document.getElementById("timer-btn"),
    ring: document.getElementById("ring-value"),
    timerLabel: document.getElementById("timer-label"),
    clock: document.getElementById("clock"),
    timerCap: document.getElementById("timer-cap"),
    movements: document.querySelectorAll(".movement"),
    rounds: document.getElementById("rounds"),
    undoBtn: document.getElementById("undo-btn"),
    roundBtn: document.getElementById("round-btn"),
    doneRow: document.getElementById("done-row"),
    saveBtn: document.getElementById("save-btn"),
    discardBtn: document.getElementById("discard-btn"),
    quickLogBtn: document.getElementById("quick-log-btn"),
    logNote: document.getElementById("log-note"),
    chart: document.getElementById("chart"),
    history: document.getElementById("history"),
    modal: document.getElementById("modal"),
    modalTitle: document.getElementById("modal-title"),
    modalCopy: document.getElementById("modal-copy"),
    stepDown: document.getElementById("step-down"),
    stepUp: document.getElementById("step-up"),
    stepValue: document.getElementById("step-value"),
    modalCancel: document.getElementById("modal-cancel"),
    modalSave: document.getElementById("modal-save"),
    settings: document.getElementById("settings"),
    settingSound: document.getElementById("setting-sound"),
    settingHaptics: document.getElementById("setting-haptics"),
    exportBtn: document.getElementById("export-btn"),
    importBtn: document.getElementById("import-btn"),
    importFile: document.getElementById("import-file"),
    clearBtn: document.getElementById("clear-btn"),
    settingsClose: document.getElementById("settings-close"),
    toast: document.getElementById("toast"),
    app: document.getElementById("app"),
    themeMark: document.getElementById("theme-mark"),
    themeBust: document.getElementById("theme-bust"),
    themeTray: document.getElementById("theme-tray"),
    themeHandle: document.getElementById("theme-handle"),
    themeHandleLabel: document.getElementById("theme-handle-label"),
    themeRow: document.getElementById("theme-row"),
    packSelect: document.getElementById("pack-select"),
    bitCards: document.querySelectorAll(".bit-card"),
    bitLines: document.querySelectorAll(".bit-line"),
    bitKickers: document.querySelectorAll(".bit-kicker"),
    themeColorMeta: document.querySelector('meta[name="theme-color"]'),
  };

  const memoryStore = { value: null };

  function canStore() {
    try {
      localStorage.setItem("__amrap", "1");
      localStorage.removeItem("__amrap");
      return true;
    } catch {
      return false;
    }
  }

  const persist = canStore();

  function todayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function shiftDate(key, days) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return todayKey(date);
  }

  function formatDay(key) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const now = new Date();
    if (key === todayKey(now)) return "Today";
    if (key === todayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function defaultLive() {
    return {
      status: "idle",
      remainingMs: WORKOUT_MS,
      anchorStart: null,
      remainingAtAnchor: WORKOUT_MS,
      rounds: 0,
      movements: [false, false, false],
    };
  }

  function defaultSettings() {
    return {
      sound: true,
      haptics: true,
      theme: DEFAULT_THEME,
      themeBaseline: THEME_BASELINE,
      pack: DEFAULT_PACK,
      packTheme: { rnm: "rick", wick: "john" },
    };
  }

  function packById(id) {
    return PACKS.find((pack) => pack.id === id) || PACKS[0];
  }

  function themeInPack(id, packId) {
    return THEMES.find((theme) => theme.id === id && theme.pack === packId);
  }

  function normalizeSettings(settings) {
    const prev = settings || {};
    const next = { ...defaultSettings(), ...prev };
    if ((prev.themeBaseline || 0) < THEME_BASELINE) {
      if (!prev.theme || prev.theme === "amrap") next.theme = DEFAULT_THEME;
      next.themeBaseline = THEME_BASELINE;
    }
    if (next.theme === "amrap") next.theme = "bofa";
    if (next.theme === "sophia") next.theme = "marquis";
    const known = THEMES.find((theme) => theme.id === next.theme);
    if (!known) next.theme = DEFAULT_THEME;
    const theme = THEMES.find((item) => item.id === next.theme) || THEMES[0];
    next.pack = theme.pack || DEFAULT_PACK;
    next.packTheme = { rnm: "rick", wick: "john", ...(prev.packTheme || {}) };
    if (next.packTheme.wick === "sophia") next.packTheme.wick = "marquis";
    PACKS.forEach((pack) => {
      if (!themeInPack(next.packTheme[pack.id], pack.id)) next.packTheme[pack.id] = pack.defaultId;
    });
    next.packTheme[next.pack] = next.theme;
    return next;
  }

  function load() {
    const fallback = {
      workouts: {},
      live: defaultLive(),
      settings: defaultSettings(),
    };
    try {
      const raw = persist
        ? localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY)
        : memoryStore.value;
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      return {
        workouts: data.workouts || {},
        live: { ...defaultLive(), ...(data.live || {}) },
        settings: normalizeSettings(data.settings),
      };
    } catch {
      return fallback;
    }
  }

  function save() {
    const payload = JSON.stringify({
      workouts: state.workouts,
      live: state.live,
      settings: state.settings,
    });
    if (persist) {
      localStorage.setItem(STORAGE_KEY, payload);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else memoryStore.value = payload;
  }

  const state = load();
  let tickId = 0;
  let wakeLock = null;
  let audioCtx = null;
  let deferredPrompt = null;
  let toastTimer = 0;
  let modalMode = "quick";

  function remainingNow() {
    const live = state.live;
    if (live.status !== "running" || !live.anchorStart) return live.remainingMs;
    return Math.max(0, live.remainingAtAnchor - (Date.now() - live.anchorStart));
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function personalBest() {
    const scores = Object.values(state.workouts).map((w) => w.rounds);
    return scores.length ? Math.max(...scores) : 0;
  }

  function streak() {
    let count = 0;
    let key = todayKey();
    if (!state.workouts[key]) key = shiftDate(key, -1);
    while (state.workouts[key]) {
      count += 1;
      key = shiftDate(key, -1);
    }
    return count;
  }

  function buzz(pattern) {
    if (!state.settings.haptics || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  }

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function beep() {
    if (!state.settings.sound || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  }

  async function lockScreen() {
    try {
      if (navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen");
    } catch {
      wakeLock = null;
    }
  }

  async function unlockScreen() {
    try {
      await wakeLock?.release();
    } catch {
      /* ignore */
    }
    wakeLock = null;
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
    }, 2200);
  }

  function reconcileLive() {
    if (state.live.status !== "running") return;
    const remaining = remainingNow();
    if (remaining <= 0) {
      finishClock();
      return;
    }
    state.live.remainingMs = remaining;
  }

  function finishClock() {
    state.live.status = "finished";
    state.live.remainingMs = 0;
    state.live.anchorStart = null;
    unlockScreen();
    beep();
    buzz([40, 80, 40, 80, 120]);
    save();
    render();
  }

  function startClock() {
    ensureAudio();
    state.live.status = "running";
    state.live.anchorStart = Date.now();
    state.live.remainingAtAnchor = state.live.remainingMs;
    lockScreen();
    save();
    loop();
    render();
  }

  function pauseClock() {
    state.live.remainingMs = remainingNow();
    state.live.status = "paused";
    state.live.anchorStart = null;
    unlockScreen();
    save();
    render();
  }

  function resetClock(force = false) {
    if (!force && state.live.status !== "idle") {
      const ok = window.confirm("Reset this workout? The timer and rounds will clear.");
      if (!ok) return;
    }
    state.live = defaultLive();
    unlockScreen();
    save();
    render();
  }

  function addRound() {
    state.live.rounds += 1;
    state.live.movements = [false, false, false];
    buzz(12);
    save();
    renderRounds();
    renderMovements();
    nextBit();
  }

  function undoRound() {
    const roundsBefore = state.live.rounds;
    if (state.live.movements.some(Boolean)) {
      const last = state.live.movements.lastIndexOf(true);
      state.live.movements[last] = false;
    } else if (state.live.rounds > 0) {
      state.live.rounds -= 1;
    }
    save();
    renderRounds();
    renderMovements();
    if (state.live.rounds !== roundsBefore) nextBit();
  }

  function toggleMovement(index) {
    state.live.movements[index] = !state.live.movements[index];
    let advanced = false;
    if (state.live.movements.every(Boolean)) {
      state.live.rounds += 1;
      state.live.movements = [false, false, false];
      buzz(12);
      advanced = true;
    }
    save();
    renderRounds();
    renderMovements();
    if (advanced) nextBit();
  }

  function saveWorkout(rounds, extra = {}) {
    const key = todayKey();
    const previous = personalBest();
    const elapsed =
      extra.elapsedSeconds ??
      Math.round((WORKOUT_MS - remainingNow()) / 1000);
    state.workouts[key] = {
      date: key,
      rounds,
      elapsedSeconds: Math.max(0, Math.min(1200, elapsed)),
      finishedEarly: extra.finishedEarly ?? remainingNow() > 0,
      savedAt: new Date().toISOString(),
    };
    save();
    render();
    if (rounds > previous && rounds > 0) toast(`New personal best: ${rounds}`);
    else toast(`Saved ${rounds} round${rounds === 1 ? "" : "s"}`);
  }

  function loop() {
    cancelAnimationFrame(tickId);
    const step = () => {
      if (state.live.status !== "running") return;
      const remaining = remainingNow();
      if (remaining <= 0) {
        finishClock();
        return;
      }
      renderTimer();
      tickId = requestAnimationFrame(step);
    };
    tickId = requestAnimationFrame(step);
  }

  function renderTimer() {
    const remaining = remainingNow();
    const progress = remaining / WORKOUT_MS;
    const status = state.live.status;
    els.clock.textContent = formatTime(remaining);
    els.ring.style.strokeDasharray = String(RING);
    els.ring.style.strokeDashoffset = String(RING * (1 - progress));
    els.timerWrap.classList.toggle("is-low", remaining > 0 && remaining <= 60_000);
    els.timerWrap.classList.toggle("is-pulse", remaining > 0 && remaining <= 10_000);
    els.timerWrap.classList.toggle("is-paused", status === "paused");
    els.timerWrap.classList.toggle("is-running", status === "running");
    const labels = currentTheme().labels;
    const caps = {
      idle: "20:00 cap",
      running: "hold to restart",
      paused: "hold to restart",
      finished: "20:00 cap",
    };
    const aria = {
      idle: "Start workout",
      running: "Pause workout",
      paused: "Resume workout",
      finished: "Workout finished",
    };
    els.timerLabel.textContent = labels[status];
    els.timerCap.textContent = caps[status];
    els.timerWrap.setAttribute("aria-label", aria[status]);
  }

  function renderRounds() {
    els.rounds.textContent = String(state.live.rounds);
    els.saveBtn.textContent = `Save ${state.live.rounds} round${
      state.live.rounds === 1 ? "" : "s"
    }`;
  }

  function renderMovements() {
    els.movements.forEach((btn, i) => {
      btn.classList.toggle("is-done", Boolean(state.live.movements[i]));
    });
  }

  function renderControls() {
    const status = state.live.status;
    els.doneRow.hidden = status !== "finished";
    els.quickLogBtn.hidden = status === "running" || status === "finished";
  }

  let trayOpen = false;
  let trayDrag = null;
  let trayHandled = false;
  let bitShift = 0;

  function setTrayOpen(open) {
    trayOpen = Boolean(open);
    els.themeTray.classList.toggle("is-open", trayOpen);
    els.themeHandle.setAttribute("aria-expanded", trayOpen ? "true" : "false");
    els.themeHandleLabel.textContent = trayOpen ? "Tap a face" : "Skins";
  }

  function themeById(id, packId) {
    const pack = packId || state.settings?.pack;
    const inPack = pack ? themeInPack(id, pack) : null;
    if (inPack) return inPack;
    const any = THEMES.find((theme) => theme.id === id);
    if (any) return any;
    const fallbackPack = packById(pack || DEFAULT_PACK);
    return (
      themeInPack(fallbackPack.defaultId, fallbackPack.id) ||
      THEMES.find((theme) => theme.id === DEFAULT_THEME) ||
      THEMES[0]
    );
  }

  function currentTheme() {
    return themeById(state.settings.theme, state.settings.pack);
  }

  function currentPack() {
    return packById(state.settings.pack);
  }

  function dayLineIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  function themeLines() {
    return LINES[currentTheme().id] || LINES.bofa;
  }

  function nextBit() {
    bitShift += 1;
    renderBit();
  }

  function renderBit() {
    const pool = themeLines();
    const text = pool[(dayLineIndex() + bitShift) % pool.length];
    const kicker = LINE_KICKERS[currentTheme().id] || LINE_KICKERS.bofa;
    els.bitLines.forEach((el) => {
      el.textContent = text;
    });
    els.bitKickers.forEach((el) => {
      el.textContent = kicker;
    });
  }

  function renderPackSelect() {
    if (!els.packSelect) return;
    const active = currentPack().id;
    els.packSelect.innerHTML = PACKS.map(
      (pack) =>
        `<option value="${pack.id}"${pack.id === active ? " selected" : ""}>${pack.name}</option>`
    ).join("");
  }

  function renderThemeTray() {
    const active = currentTheme().id;
    const packId = currentPack().id;
    const faces = THEMES.filter((theme) => theme.pack === packId);
    els.themeRow.innerHTML = faces
      .map((theme) => {
        const portrait = theme.mark
          ? `<img src="${theme.mark}" alt="">`
          : `<span class="theme-chip-fallback">B</span>`;
        return `<button type="button" class="theme-chip${theme.id === active ? " is-active" : ""}" data-theme-id="${theme.id}" role="option" aria-selected="${theme.id === active}">
        ${portrait}
        <span>${theme.name}</span>
      </button>`;
      })
      .join("");
  }

  function applyTheme(id, opts = {}) {
    const announce = typeof opts === "boolean" ? opts : Boolean(opts.announce);
    const closeTray = typeof opts === "boolean" ? announce : (opts.closeTray ?? announce);
    const theme = themeById(id);
    state.settings.theme = theme.id;
    state.settings.pack = theme.pack || DEFAULT_PACK;
    state.settings.packTheme = {
      ...state.settings.packTheme,
      [state.settings.pack]: theme.id,
    };
    document.documentElement.dataset.theme = theme.id;
    document.documentElement.dataset.pack = state.settings.pack;
    if (els.themeColorMeta) els.themeColorMeta.content = theme.bg;
    if (theme.mark) {
      els.themeMark.src = theme.mark;
      els.themeMark.hidden = false;
    } else {
      els.themeMark.hidden = true;
    }
    if (theme.bust) {
      els.themeBust.src = theme.bust;
      els.themeBust.hidden = false;
    } else {
      els.themeBust.hidden = true;
    }
    renderPackSelect();
    renderThemeTray();
    renderTimer();
    bitShift = 0;
    renderBit();
    save();
    if (closeTray) setTrayOpen(false);
    if (announce) {
      toast(
        theme.id === "scary-terry"
          ? "Scary Terry, bitch"
          : theme.id === "bofa"
            ? "Bofa deez nuts"
            : theme.name
      );
      buzz(16);
    }
  }

  function applyPack(packId) {
    const pack = packById(packId);
    const last = state.settings.packTheme?.[pack.id] || pack.defaultId;
    applyTheme(last, { announce: false, closeTray: false });
    toast(pack.name);
  }

  function toggleTimer() {
    const status = state.live.status;
    if (status === "running") pauseClock();
    else if (status === "idle" || status === "paused") startClock();
  }

  function renderStats() {
    const today = state.workouts[todayKey()];
    els.statToday.textContent = today ? String(today.rounds) : "—";
    const pb = personalBest();
    els.statPb.textContent = pb ? String(pb) : "—";
    const days = streak();
    els.statStreak.textContent = String(days);
  }

  function renderChart() {
    const today = todayKey();
    const keys = [];
    for (let i = 13; i >= 0; i -= 1) keys.push(shiftDate(today, -i));
    const max = Math.max(...keys.map((key) => state.workouts[key]?.rounds || 0), 1);
    els.chart.innerHTML = keys
      .map((key) => {
        const rounds = state.workouts[key]?.rounds || 0;
        const pct = Math.max(4, (rounds / max) * 100);
        const [y, m, d] = key.split("-").map(Number);
        const label = DAYS[new Date(y, m - 1, d).getDay()].slice(0, 1);
        const classes = ["chart-bar", rounds ? "has-score" : "", key === today ? "is-today" : ""]
          .filter(Boolean)
          .join(" ");
        return `<div class="chart-col"><div class="${classes}" style="height:${pct}%"></div><span>${label}</span></div>`;
      })
      .join("");
  }

  function renderHistory() {
    const items = Object.values(state.workouts).sort((a, b) => b.date.localeCompare(a.date));
    const pb = personalBest();
    if (!items.length) {
      els.history.innerHTML =
        '<li class="empty">No sessions yet. 5 pull-ups, 10 push-ups, 15 squats. As many rounds as possible in 20 minutes.</li>';
      return;
    }
    els.history.innerHTML = items
      .map((item) => {
        const mins = Math.floor(item.elapsedSeconds / 60);
        const secs = String(item.elapsedSeconds % 60).padStart(2, "0");
        const cap = item.finishedEarly ? `${mins}:${secs} elapsed` : "full 20:00";
        const pbClass = item.rounds === pb && pb > 0 ? "pb" : "";
        return `<li>
          <div>
            <span class="when">${formatDay(item.date)}</span>
            <span class="meta">${cap}${item.rounds === pb && pb > 0 ? " · personal best" : ""}</span>
          </div>
          <span class="score ${pbClass}">${item.rounds}</span>
        </li>`;
      })
      .join("");
  }

  function renderSettings() {
    els.settingSound.checked = state.settings.sound;
    els.settingHaptics.checked = state.settings.haptics;
  }

  function render() {
    renderTimer();
    renderRounds();
    renderMovements();
    renderControls();
    renderStats();
    renderChart();
    renderHistory();
    renderSettings();
    renderBit();
  }

  function openModal(mode, startValue) {
    modalMode = mode;
    els.stepValue.value = String(startValue);
    els.modalTitle.textContent = mode === "save" ? "Save today’s score" : "Log rounds";
    els.modalCopy.textContent =
      mode === "save"
        ? "Confirm full rounds completed before time expired."
        : "Already finished the 20 minutes? Log it for today.";
    els.modal.hidden = false;
    els.stepValue.focus();
    els.stepValue.select();
  }

  function closeModal() {
    els.modal.hidden = true;
  }

  function confirmReplaceToday() {
    if (!state.workouts[todayKey()]) return true;
    return window.confirm("You already logged a score today. Replace it?");
  }

  function applyModalSave() {
    const rounds = Math.max(0, Math.min(99, Number(els.stepValue.value) || 0));
    if (!confirmReplaceToday()) return;
    if (modalMode === "save") {
      saveWorkout(rounds, {
        elapsedSeconds: Math.round((WORKOUT_MS - remainingNow()) / 1000),
        finishedEarly: remainingNow() > 0,
      });
      state.live = defaultLive();
    } else {
      saveWorkout(rounds, { elapsedSeconds: 1200, finishedEarly: false });
      state.live = defaultLive();
    }
    closeModal();
    save();
    render();
  }

  function showInstall() {
    if (localStorage.getItem(INSTALL_KEY) || localStorage.getItem(LEGACY_INSTALL_KEY)) return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    els.installBanner.hidden = false;
    if (ios) {
      els.installCopy.textContent = "On iPhone: Share → Add to Home Screen.";
      els.installBtn.hidden = true;
    } else if (deferredPrompt) {
      els.installCopy.textContent = "Install BOFA Protocol for a home-screen timer.";
      els.installBtn.hidden = false;
    } else {
      els.installCopy.textContent = "Add this page to your home screen for gym use.";
      els.installBtn.hidden = true;
    }
  }

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      els.tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      Object.entries(els.views).forEach(([name, view]) => {
        view.classList.toggle("is-active", name === tab.dataset.view);
      });
    });
  });

  els.movements.forEach((btn) => {
    btn.addEventListener("click", () => toggleMovement(Number(btn.dataset.i)));
  });

  els.roundBtn.addEventListener("click", addRound);
  els.undoBtn.addEventListener("click", undoRound);

  els.themeRow.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-theme-id]");
    if (!chip) return;
    applyTheme(chip.dataset.themeId, { announce: true, closeTray: true });
  });

  els.packSelect.addEventListener("change", () => {
    applyPack(els.packSelect.value);
  });

  els.themeHandle.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    trayDrag = { id: event.pointerId, y: event.clientY, dragged: false };
    try {
      els.themeHandle.setPointerCapture(event.pointerId);
    } catch {
      /* older iOS */
    }
  });
  els.themeHandle.addEventListener("pointermove", (event) => {
    if (!trayDrag || event.pointerId !== trayDrag.id) return;
    if (Math.abs(event.clientY - trayDrag.y) > 10) trayDrag.dragged = true;
  });
  function endTrayDrag(event) {
    if (!trayDrag || event.pointerId !== trayDrag.id) return;
    const dy = event.clientY - trayDrag.y;
    const dragged = trayDrag.dragged;
    trayDrag = null;
    trayHandled = true;
    if (dragged) {
      if (dy > 28) setTrayOpen(true);
      else if (dy < -28) setTrayOpen(false);
      return;
    }
    setTrayOpen(!trayOpen);
  }
  els.themeHandle.addEventListener("pointerup", endTrayDrag);
  els.themeHandle.addEventListener("pointercancel", () => {
    trayDrag = null;
  });
  els.themeHandle.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault();
    },
    { passive: false }
  );
  els.themeHandle.addEventListener("click", (event) => {
    if (trayHandled) {
      event.preventDefault();
      trayHandled = false;
      return;
    }
    setTrayOpen(!trayOpen);
  });

  els.bitCards.forEach((card) => {
    card.addEventListener("click", () => {
      nextBit();
      buzz(8);
    });
  });

  let holdTimer = 0;
  let didHold = false;
  const HOLD_MS = 600;

  function clearHold() {
    clearTimeout(holdTimer);
    holdTimer = 0;
  }

  els.timerWrap.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    didHold = false;
    clearHold();
    holdTimer = setTimeout(() => {
      didHold = true;
      if (state.live.status === "idle") return;
      buzz(24);
      resetClock(false);
    }, HOLD_MS);
  });
  els.timerWrap.addEventListener("pointerup", clearHold);
  els.timerWrap.addEventListener("pointercancel", clearHold);
  els.timerWrap.addEventListener("pointerleave", clearHold);
  els.timerWrap.addEventListener("contextmenu", (event) => event.preventDefault());
  els.timerWrap.addEventListener("click", (event) => {
    if (didHold) {
      event.preventDefault();
      didHold = false;
      return;
    }
    toggleTimer();
  });

  els.discardBtn.addEventListener("click", () => resetClock(true));
  els.saveBtn.addEventListener("click", () => {
    if (!confirmReplaceToday()) return;
    saveWorkout(state.live.rounds, {
      elapsedSeconds: 1200,
      finishedEarly: false,
    });
    state.live = defaultLive();
    save();
    render();
  });
  els.quickLogBtn.addEventListener("click", () => {
    openModal("quick", state.workouts[todayKey()]?.rounds || state.live.rounds || 0);
  });

  els.stepDown.addEventListener("click", () => {
    els.stepValue.value = String(Math.max(0, Number(els.stepValue.value || 0) - 1));
  });
  els.stepUp.addEventListener("click", () => {
    els.stepValue.value = String(Math.min(99, Number(els.stepValue.value || 0) + 1));
  });
  els.modalCancel.addEventListener("click", closeModal);
  els.modalSave.addEventListener("click", applyModalSave);
  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeModal();
  });

  els.settingsBtn.addEventListener("click", () => {
    els.settings.hidden = false;
  });
  els.settingsClose.addEventListener("click", () => {
    els.settings.hidden = true;
  });
  els.settings.addEventListener("click", (event) => {
    if (event.target === els.settings) els.settings.hidden = true;
  });
  els.settingSound.addEventListener("change", () => {
    state.settings.sound = els.settingSound.checked;
    save();
  });
  els.settingHaptics.addEventListener("change", () => {
    state.settings.haptics = els.settingHaptics.checked;
    save();
  });

  els.exportBtn.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify({ workouts: state.workouts }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amrap-log.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  els.importBtn.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data.workouts || typeof data.workouts !== "object") throw new Error("bad file");
      state.workouts = data.workouts;
      save();
      render();
      toast("Log imported");
    } catch {
      toast("Could not import that file");
    }
    els.importFile.value = "";
  });

  els.clearBtn.addEventListener("click", () => {
    if (!window.confirm("Clear every saved session? This cannot be undone.")) return;
    state.workouts = {};
    save();
    render();
  });

  els.installDismiss.addEventListener("click", () => {
    els.installBanner.hidden = true;
    if (persist) localStorage.setItem(INSTALL_KEY, "1");
  });

  els.installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    els.installBanner.hidden = true;
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstall();
  });

  window.addEventListener("beforeunload", (event) => {
    if (state.live.status === "running") {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      reconcileLive();
      if (state.live.status === "running") {
        lockScreen();
        loop();
      }
      render();
    } else {
      state.live.remainingMs = remainingNow();
      save();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.code === "Space") {
      event.preventDefault();
      if (state.live.status === "running") pauseClock();
      else if (state.live.status === "paused" || state.live.status === "idle") startClock();
    } else if (event.key.toLowerCase() === "r") {
      addRound();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      undoRound();
    }
  });

  if ("serviceWorker" in navigator) {
    let hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.register("./sw.js?v=28", { updateViaCache: "none" });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      if (window.__amrapReloaded) return;
      window.__amrapReloaded = true;
      location.reload();
    });
  }

  reconcileLive();
  if (state.live.status === "running") loop();
  applyTheme(state.settings.theme || DEFAULT_THEME);
  render();
  showInstall();
})();
