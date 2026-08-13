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
- Disney, Warner, NFL, NBA, and whatever holds John Wick will not care that it is a joke. Official likenesses and logos are out. Fan-style original caricature is the only honest path, and even that can get a letter if you get lazy.

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
- You never ship a pack that sexualizes a minor, uses an official still, or goes out without a human looking at the art and the lines.
- Health data, if it happens at all, is an explicit native-app decision.

## Non-goals (this round)

- Multiplayer, social, leaderboards, or other people’s workouts.
- A general-purpose CMS for arbitrary apps.
- Official IP, team logos, or photoreal celebrity faces.
- Auto-publish from a model with no review.
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

A pack is: id, display name, default character, legal notes, and N characters. A character is: id, name, kicker, timer labels, palette, mark, bust, quote pool (≥32 lines, each containing `deez nuts` unless a pack-level rule says otherwise), plus a voice bible.

Rick and Morty is pack `rnm`. Bofa Time Cops sit in it or in a `bofa` pack. Star Wars would be pack `sw-fan` — original caricatures, not Disney assets.

### Why this is hard (on purpose)

You did not like leftover header icons, a pike that was supposed to be doggy, a Walken who looked like Epstein, or balls that looked like a kiwi. The factory has to make that loop **shorter**, not more magical. Magic is how you ship another face you hate, faster.

### Requirements

**Pack lifecycle**

1. Create pack: name, one-line brief (“John Wick, dry, violent, hotel, pencils”), rating (the existing app is adult), off-limits list.
2. Suggest 6–12 characters from the brief. You pick 4–8. No pack bigger than 8 until the tray is redesigned; the current tray is a horizontal face row.
3. For each character: generate mark (256²) + bust (640²), palette, labels, kicker, 32 quotes.
4. Human review: reject / regen art / regen lines / approve. Nothing is live until approve.
5. Publish writes a pack JSON + images the PWA can load. Unpublished packs never appear in Skins.

**Suggestions**

- Model proposes names + one-sentence voice. You tap to keep.
- Hard rails: flag likely minors (padawans, younglings, hobbit children, “rookie” athletes under 18). Those cannot enter the quote pipeline.
- Sports packs: original mascot-like figures in team *colors*, not trademarks. If you cannot tell it is a joke caricature, regen.

**Art**

- Same contract as today: cartoon, original, not a still, not photoreal.
- Two shots: header mark (face) and timer bust (shoulders-up or creature bust).
- Regen is cheap. Approve is the expensive step. Show mark at 48px and bust in the timer mock, on the phone, before approve. If it looks like a kiwi at 48px, it is a kiwi.

**Quotes**

- Keep the rule that worked: multiple writers, different cadences, one editor pass, 32 keepers.
- Each character gets a voice bible (6–10 bullets). Writers do not see other packs.
- A critic agent rejects: missing `deez nuts`, wrong voice, minor-sexual content, generic bro-gym, duplicate punchlines.
- You still read them. The critic is a filter, not a publisher.

**Backend (this is the tax)**

Today publish = git commit. A factory implies:

- Auth: you, maybe a password, not “toggle.”
- Object storage for images.
- A pack manifest the PWA fetches (`packs/{id}/pack.json`) with cache-busting.
- The workout app stays dumb: download pack, apply theme. No generate-on-device.

Do not put OpenAI keys in the PWA. Generation runs on a server or in a Cloud Agent. The phone only reviews and enables.

**Mobile UX (this is the part you actually asked to be elegant)**

Studio is a full-screen wizard, not a nested settings page.

1. **Packs** — list, one primary button: New pack.
2. **Brief** — name, vibe, off-limits. Big type, few fields.
3. **Cast** — suggestion chips, tap to add, long-press to drop. Max 8. Faces are placeholders until art lands.
4. **Generate** — per character: spinner, then a review card (mark + 3 sample lines + labels). Swipe reject, tap regen art / regen lines, tap keep.
5. **Publish** — preview the real Skins tray and one workout frame. Then enable.

If a step needs a table, it is wrong for this phone.

### Legal / safety rails (non-negotiable)

- No official stills, logos, wordmarks as marks.
- No sexualized anyone who is or reads as a minor. Pack brief must state “adult characters only.”
- Display name can say “Wick-ish” or “a desert farm boy.” It cannot say “Official Star Wars Pack.”
- Kill switch: disable a pack remotely (or by flipping `enabled: false` in the manifest) without waiting for App Store.

### Non-goals

- User-generated packs from strangers.
- Infinite characters. Eight is the tray.

### Open questions

- Does a pack replace Rick and Morty in the tray, or append? (Recommendation: one active pack at a time. Eight faces is already a lot. Switching packs is a Studio/Settings action, not another handle.)
- Who pays for generation? Per-pack cost should be visible in Studio before you hit Generate.
- Do quotes stay 32 forever or scale with a “tap for another” boredom factor?

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
3. **Studio wizard on a branch** — suggestions + review UI against fake data.
4. **Generation pipeline** — art + multi-agent quotes + critic, still requiring your approve.
5. **HealthKit** — only after you decide the app is allowed to become native. Otherwise delete the ticket.

Do not start 3–5 in parallel. You will get a CMS that cannot publish and a Health app that cannot run.

---

## What I would cut if you made me

- Top-left Admin toggle. Dead.
- “Create metrics” as a generic constructor. One named custom field or nothing.
- Official franchises as labeled packs. Inspired packs only.
- HealthKit until native is a real decision.
- Any generate-and-auto-ship path. You have already seen why.

What I would not cut: **one active pack, eight faces, a phone wizard that makes saying no to a bad drawing easy.** That is the whole game.

---

## Acceptance tests (when something is actually built)

- Workout screen has no Admin control.
- Stats show last-14 from real localStorage without a network.
- A pack can be disabled and the tray falls back to the previous pack without a code edit.
- A suggested character flagged as a minor cannot reach quote generation.
- Approved art is inspected at 48px mark size, not just 640.
- Every published line contains the required punch or the pack’s documented exception.
- HealthKit write happens only after OS permission and only for a saved workout; deny does not break the timer.
- No API keys in the static PWA.

---

## Decision log

| Decision | Default until you override |
|---|---|
| Admin on workout header | No |
| Metrics | Personal stats only |
| Packs vs clusters | Call them packs |
| Tray | One active pack, max 8 |
| IP | Original caricature, never official |
| Publish | Human approve required |
| HealthKit | Blocked on native-app decision |
| Backend | Required for factory; not required for stats |
