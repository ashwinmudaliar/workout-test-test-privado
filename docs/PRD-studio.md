# BOFA Protocol — Studio, metrics, HealthKit

Status: draft, no build  
Owner: Ashwin  
Date: 2026-08-13

This is a requirements doc, not a promise to ship. The workout app stays a 20-minute AMRAP PWA until a later decision says otherwise.

---

## The actual product

A home-screen timer you will open sweaty. Skins and quotes are the reason it is not a Notes app with a clock.

Everything below is either **ops for that timer** or a **different app pretending to live inside it**.

---

## Current constraints (do not lie to yourself)

- Vanilla HTML/CSS/JS. No backend. GitHub Pages. `localStorage` is the database.
- One user: you. There is no account, no sync, no audience dashboard.
- Skins are hardcoded: theme tokens, `bust.jpg` / `mark.jpg`, 32-line quote pools, a service-worker cache bump, a Pages deploy.
- iOS home-screen PWA **cannot** talk to HealthKit. Not with a flag. Not with a library. Native wrapper or no.
- Image models already refused explicit anatomy and once drew a man who looked like a predator. “Generate pictures” is not a button, it is a review queue.
- Image models already refused explicit anatomy and once drew a man who looked like a predator. “Generate pictures” is not a button, it is a review queue.
- This GitHub Pages URL is public. Typing “Star Wars” into a private studio does not make a Vader face on github.io “personal use.” Personal means the pack lives on your phone / behind Studio auth, not on the live PWA.

If a requirement below needs accounts, a CMS, or a native binary, say so in the requirement. Do not hide it behind “elegant UI.”

---

## Verdict on the three asks

**1. Metrics.** Yes, tiny. You already store today / best / streak / history. An admin “metrics” surface that does not answer a question is a graveyard. Start with four numbers and a 14-day sparkline. Stop.

**2. Character clusters.** This is the real product expansion. Rick and Morty is one *pack*. Star Wars / Wick / LOTR / teams are more packs. The factory is a content pipeline with legal rails, not a skins tray with extra fields. This is also the only thing that justifies a backend.

**3. HealthKit.** This is a platform change, not a feature. Wrapping the PWA (Capacitor / native Swift) is a separate project with App Store review, entitlements, and a privacy nutrition label. Do not put it on the same board as “toggle in the top left.”

**The toggle in the top left is a bad idea.** The workout screen already fights a skins handle, a gear, an install banner, and a timer you tap with chalk on your fingers. An Admin switch there is founder-brain. Studio is a separate mode, gated, off the sweat path. If you need it on the phone, it is a hidden entry from Settings, not chrome on the clock.

---

## Goals

- You can inspect your own training without leaving the phone.
- You can mint a new character pack without editing `app.js` by hand.
- You never enable a pack that sexualizes a minor, or that you have not at least glanced at.
- Franchise packs are for you, not for the public site.
- Health data, if it happens at all, is an explicit native-app decision.

## Non-goals (this round)

- Multiplayer, social, leaderboards, or other people’s workouts.
- A general-purpose CMS for arbitrary apps.
- Publishing franchise packs to the public Pages app.
- Auto-enable a pack you have not opened.
- Android Health Connect until HealthKit is real or killed.
- Redesigning the AMRAP itself.

---

## Workstream A — Metrics (basic)

### Problem

You log rounds. You cannot see them except as three pills and a log list. That is fine for the gym. It is not “admin.”

### Requirements

1. Read-only view of existing `amrap-tracker-v1` data. No new tracking until you name why.
2. Surfaces, in this order:
   - Today, best, streak (already exist)
   - Last 14 days as a bar/spark (already sketched on Log)
   - Count of completed 20:00 caps vs quick-logged scores
   - Current skin, last workout timestamp
3. Create metric: **one** custom counter with a name and a number, stored locally, not a warehouse. Example: bodyweight, sleep hours, “felt like death (1–5).” If you cannot name the first custom metric in one sentence, do not build the constructor.
4. No charts library safari. If it does not fit on a phone in the existing visual language, it is too much.

### Non-goals

- Funnels, retention, Mixpanel, “engagement.”
- Comparing yourself to a population of zero other users.

### UX

- Lives under **Settings**, labeled **Stats**, not Admin.
- Workout tab stays dumb on purpose.

### Open questions

- Is a custom metric daily (one value per date) or free-form?
- Do you care about time-in-workout vs just rounds?

---

## Workstream B — Character packs (the factory)

Rename in the product: **Packs**, not “clusters.” Cluster sounds like ML. Pack is a tray of faces.

**Audience:** you. Not a store. Not other users. That is the product constraint. It is not a copyright spell. Personal use means packs stay in Studio on your device (or behind your login). It does **not** mean “dump Keanu and Vader onto the public Pages site.” The live AMRAP can keep the current Rick and Morty / Bofa pack. Franchise packs you type in do not auto-deploy to github.io.

A pack is: id, display name (usually your prompt), default character, and up to **10** characters. A character is: id, name, kicker, timer labels, palette, mark, bust, quote pool (≥32 lines, each containing `deez nuts` unless a pack-level rule says otherwise), plus a voice bible used only during generation.

Rick and Morty is pack `rnm`. Bofa Time Cops sit in it.

### The flow you want (this is the spec)

One wizard. Four screens. No extra fields until you ask for them.

**1. Prompt**

Full-screen. One question, huge:

> What sort of character pack do you want to create?

One text box. Placeholder: `John Wick`, `Star Wars`, `the 2010s Heat`, `my coworkers`. Keyboard open. Primary button: **Next**. Empty submit is blocked.

That string *is* the pack brief and the pack name until you rename it later. Do not make them fill vibe / rating / off-limits on this screen. Infer adult-cast from the existing app. Offer an optional “adult characters only” confirm only if the prompt looks like it includes kids (Star Wars, LOTR, high school sports).

**2. Cast — suggestions, up to 10**

Backend returns up to **10** character suggestions from the prompt (name + one-line why). Screen is a selectable list:

- Tap to select / deselect
- Selected count in the header, e.g. `4 of 10`
- **Add someone** at the bottom: type a name, they join the list selected
- Cannot select more than 10. If they add an 11th, they drop someone or we refuse
- Primary button: **Create pack** — disabled at 0 selected

No art yet. Placeholders only. This screen is cheap and should feel instant.

**3. Building**

You leave. The backend does the work for every selected character, in parallel where it can:

- Voice bible
- Timer labels + kicker + palette
- Mark (256²) + bust (640²)
- 32 quotes via the multi-agent writers + critic

Phone shows a single progress screen: pack name, `3 / 7 characters`, current step (`quotes`, `art`). You can background it. You cannot start a second pack until this one finishes or you cancel.

**4. Ready**

Not a spreadsheet. A tray preview of the new faces plus one sample line each. Actions:

- **Use this pack** — enables it on the workout tray (on-device / private)
- **Regen** on a single face (art, lines, or both)
- **Drop** a character
- **Back to cast** only if they want to add someone; that queues generation for the new names only

No per-character approve gauntlet during generation. You asked the machine to make the pack; it makes the pack. The ready screen is the escape hatch for the next Epstein / kiwi, not a second product.

### Why “create it all” still needs that last screen

You have already rejected art the pipeline was proud of. If step 4 auto-enables with no look, you will get a bad face on the timer mid-workout. Glance, then use. That is still your flow.

### Suggestions

- Up to 10. Rank by “would this be funny yelling deez nuts during squats,” not by franchise completeness. Skip the boring ones (C-3PO unless they ask).
- **Minors are not a copyright issue, they are a hard no.** If the prompt is Star Wars, do not suggest younglings, kid Anakin, or Grogu as a sexualized bit. If a suggestion reads under 18, it comes back flagged and unselectable. Same for school teams.
- Add-your-own is free text. Same minor check on the name + a yes/no “this is an adult.”

### Art + quotes (backend, after cast is locked)

- Cartoon caricature in the pack’s world. Not a film still, not a PNG ripped from Google.
- Two shots per character: header mark, timer bust. Generate at 48px preview in the ready screen or you will approve a kiwi.
- Quotes: three writers, different cadences, critic rejects misses, keep 32. Voice of that character, punch is `deez nuts`, gym-readable.
- Failures: if art is blocked (safety) or quotes come back short, that character sits in Ready as **failed** with Regen. Do not kill the whole pack.

### Backend

Generation does not run in the PWA. No keys on the phone.

- Studio auth: you.
- Job: `{prompt, characterNames[]}` → pack artifact.
- Store images + `pack.json` in private storage.
- Workout app pulls **enabled private packs** from that store when you are logged into Studio, or keeps them in device storage. Public Pages keeps shipping the current hardcoded pack until you explicitly say “put this on github.io.”

### Mobile UX notes

- Prompt screen is 80% text field. That is the elegance.
- Cast is a checklist with big hit targets, not chips that wrap into mush.
- Building is allowed to be boring. A progress bar that tells the truth beats a fake animation.
- Ready is the skins tray you already have, plus a sample line. If it needs a tutorial, the tray failed.

### Personal use (what that actually means)

| You can | You cannot pretend |
|---|---|
| Type John Wick / Star Wars / Lakers | That copyright vanished |
| Keep the pack on your phone | That github.io is private |
| Generate caricatures that look like the bit | That a still from the movie is fine to commit |

Safety rails that stay even for you: no sexualized minors, no CSAM, no packing someone else’s nudes. “Personal” does not cover that.

### Non-goals

- Other people creating packs.
- More than 10 faces in a pack (tray death).
- Auto-push to the public site.
- Filling out a brand-guidelines form before the prompt.

### Open questions

- One active pack at a time, or append? **Default: replace the tray with the new pack.** Switching packs is Settings → Packs. Two handles on the workout screen is how you miss the clock.
- If generation takes 8 minutes, is push notification required, or is “leave this screen open” enough for v1?
- Rename pack after prompt? Default: pack title = the prompt string.

---

## Workstream C — Apple HealthKit

### The wall

A GitHub Pages PWA added to the home screen is still WKWebView with no HealthKit. `HealthKit` JS libraries that claim otherwise are lying or wrapping a native app.

### If you still want it

This becomes a native shell:

1. iOS app (Swift or Capacitor) that loads the existing UI.
2. HealthKit entitlement: write `HKWorkout` of type functional strength training / HIIT, duration = elapsed timer, calories optional (do not invent them).
3. Start workout when the timer starts, end when it ends or when you log rounds. Do not write a workout for a discarded session.
4. Privacy copy in-app and in App Store: we write workouts, we do not read your heart until you ask for that in a later spec.
5. Failure is silent-to-the-gym: if Health is denied, the timer still works.

### Requirements if native is approved

- Opt-in in Settings, default off.
- One Health workout per saved AMRAP. Quick-log also writes, with duration unknown → skip or write 20:00 only if they confirm.
- No read of steps/HR in v1.

### Non-goals

- Closing rings as a product strategy.
- Coaching from HR zones.
- Android.

### Open questions

- Are you willing to leave “just a PWA” for this? If no, HealthKit is cut, not deferred.

---

## Information architecture

```
Workout (default)     Log     Settings
                              ├ Stats          (Workstream A)
                              ├ Packs          (active pack only)
                              └ Studio         (gated, Workstream B)
Native shell only:            └ Apple Health   (Workstream C)
```

No Admin toggle on the workout header. Studio is behind Settings, ideally a PIN or a long-press on the version string so you do not open it mid-AMRAP with a bloody thumb.

---

## Suggested sequence (not a calendar)

1. **Stats in Settings** — cheapest honesty check. If you do not open it after a week, you did not want metrics.
2. **Pack format + fetch** — extract Rick and Morty into a pack JSON the PWA already understands. No generator yet. Prove you can add a face without editing `THEMES` in `app.js`.
3. **Studio wizard** — prompt → 10 suggestions → select/add → Create pack.
4. **Generation pipeline** — batch art + quotes after cast lock; Ready screen to glance / regen / use.
5. **HealthKit** — only after you decide the app is allowed to become native. Otherwise delete the ticket.

Do not start 3–5 in parallel. You will get a CMS that cannot publish and a Health app that cannot run.

---

## What I would cut if you made me

- Top-left Admin toggle. Dead.
- “Create metrics” as a generic constructor. One named custom field or nothing.
- Official franchise packs on the public Pages site.
- HealthKit until native is a real decision.
- Auto-enable with no Ready screen.

What I would not cut: **type a world, pick up to 10 faces, walk away while it builds, glance once, use.** That is the whole game.

---

## Acceptance tests (when something is actually built)

- Workout screen has no Admin control.
- Stats show last-14 from real localStorage without a network.
- A pack can be disabled and the tray falls back to the previous pack without a code edit.
- A suggested character flagged as a minor cannot be selected or typed in without an adult confirm, and never gets sexualized lines.
- Ready screen shows mark at 48px, not just 640.
- Every published line contains the required punch or the pack’s documented exception.
- Create pack does not enable the pack until Use this pack.
- A franchise pack does not appear on the public Pages app unless you explicitly publish it there.
- HealthKit write happens only after OS permission and only for a saved workout; deny does not break the timer.
- No API keys in the static PWA.

---

## Decision log

| Decision | Default until you override |
|---|---|
| Admin on workout header | No |
| Metrics | Personal stats only |
| Packs vs clusters | Call them packs |
| Tray | One active pack, max 10 |
| Prompt | Single free-text brief |
| Cast | Up to 10 suggestions; select or add |
| Generate | Batch on the backend after Create pack |
| IP | Personal/private packs OK to prompt; no public Pages dump; no film stills |
| Enable | Ready screen first, then Use this pack |
| HealthKit | Blocked on native-app decision |
| Backend | Required for factory; not required for stats |
