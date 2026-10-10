# Progress (central status file)

One place to see where the port stands. Details: `docs/NEXT_GOALS.md` (full goal list),
`docs/WORK_PLAN.md` (lanes), `docs/function_notes.md` / `docs/FUNCTION_TABLE.csv` (function meanings).

## Lane A: course objects (Claude)
Ported from the game's code, replay-tested against BizHawk where possible (`vm_model/src/mapobj/`,
wired up in `game/src/objects.rs`):

| Object | Status |
| --- | --- |
| Thwomp, Chain Chomp, loose Chomp, Goomba, rocks, traffic, Bowser blocks, crabs, Pokeys | done, replay-exact |
| walking trees, Cheep Cheeps, pendulums, clock hands, Monty Moles, fire rings | done, replay-exact (or within 1 unit) |
| drawbridge (deck is a hinged ramp/wall floor) | done |
| Airship: Bullet Bill launchers + bullets, path sliders, hatches | done, in game (2026-10-09) |
| pinball bumpers | done (bounce 12 units) |
| moving-object shove (handler flag 1) | done |
| objects' own reaction table (`0x0216B9AC`) | done: real table replaces the old guess (2026-10-09) |
| Monty Mole hit states 6/7 (star knock / run into, roll) | done (2026-10-09) |
| Cheep Cheep star knock (shared knock-away routine `knock.rs`), hide, respawn | done (2026-10-09) |
| loose Chomp hit state 2 (pops up, tumbles), rock star burst, Piranha Plant knock-away | done (2026-10-09) |
| pinball iron balls (replay-exact, released by lap) and flippers (swing, kicks from balls, box contact + shove) | done, in game (2026-10-09); drums 0xD2 and decorative balls 0x1B3 left |
| decoration model confirmation (16 fallback models) | agent stopped (rate limit); to redo |
| star reactions: crab knocked flying, Pokey knocked apart + regrow, snowman head knocked off + rebuilt (now drawn as body + head), Bullet Bill knocked down, iron ball bounce | done (2026-10-09) |
| chained Chomp hit state 2 | done (2026-10-09) |
| drums 0xD2 (visual), Boos/chandeliers/paintings, decoration model confirmation (unconfirmed fallbacks) | left |
| Banshee Boardwalk bats (spawner 0x1A0 throws 0x19F bats; replay-tested, in game) | done (2026-10-09) |
| turning platforms (gears, rotary room): speed-up / run / slow / reverse / rest | done (2026-10-09) |

## Lane B: characters, effects, Rainbow Road (Codex)
- Driver joint animations and face-pattern decoders are integrated; detailed drivers render with original clips. Details: `docs/CODEX_*` handoffs.
- Original ROM particle textures/simulation now replace cube drift sparks: smoke, blue flares, red sparks and A+B pivot smoke. Draw math matches721 captured calls; rear contacts645; smoke attachment100; pivot gate3993. Native charge rendering and active-effects race restart checked.
- CPU heading now matches3500 original calls (Figure-8 and Rainbow Road, including inverted track), replacing floating atan2 with the SDK integer pipeline. Native seed1 Rainbow Road sweep: five falls before/six after; spiral falls remain unresolved.
- CPU wall-stall recovery is now wired: timer7000 calls, correction863 state1 probes, area selection218 controlled callbacks. Previous-node/AREA targets feed the route cursor; final callback uses existing native respawn. Forced-stall run passed all four stages at259/379/559/739 with immediate placement. Fixed-tick Rainbow Road sweep exited0 at6000 ticks/2995 render frames with10 falls; falls remain open. Respawn placement/spread and SDK reset yaw now match306 controlled original calls and are wired; steering resets on placement. Source-backed follow-up freezes every falling racer checkpoint and caches the respawn id at fall start. Fall/carry timing, full reset parity, other kart effects/child particles and GPU parity remain.
- Latest complete core check:167 passed,0 failed,1 existing CPU replay ignored; Windows release compiled and ran (fresh copy: `game/target/release/mkds_game_codex_respawn.exe`; respawn/freeze native check passed at tick900/frame446). Detailed evidence/limitations: `analysis/CODEX_PARTICLE_MAP.md`, `docs/NEXT_GOALS.md`.

- Note for Lane B (2026-10-09): Bowser's Castle autopilot now logs ~111 falls (lava, flags 0x800,
  at the sliding block near x 7.1M z -2.7M). Builds before the 21:34 `respawn.rs` / `racers.rs`
  edits had 0; cause unverified. Codex fixed-tick placement build check:8 falls/6000 ticks
  at frame2934, exit0, same sliding-block region. The111 report lacks a tick duration;
  counts are not comparable. Source confirms type11 still falls during wall contact.
  Sliding-block falls remain open; checkpoint freeze/id cache follow-up is separate.

## Lane C: items and sound
See `docs/NEXT_GOALS.md` item 4 onward.

## Checks
- `cargo test` in `vm_model` (object tests: `cargo test --lib mapobj`), `cargo build` in `game`.
- Falls sweep (autopilot): Airship 0-1 falls per race (from Bullet Bill blows), Delfino 0, Pinball 0,
  Cheep Cheep Beach 0, Peach Gardens 0, Mario Circuit 1, DK Pass 1.
