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
| Chomp hit state 2, rock break, Piranha Plant knock | next |
| pinball flippers, iron balls, drums | agent stopped (rate limit); to redo |
| decoration model confirmation (16 fallback models) | agent stopped (rate limit); to redo |
| Pokey/crab/snowman star reactions, bats, Boos/chandeliers/paintings/fish, gear pauses | left |

## Lane B: characters, effects, Rainbow Road (Codex)
- Driver joint animations and face-pattern decoders are integrated; detailed drivers render with original clips. Details: `docs/CODEX_*` handoffs.
- Original ROM particle textures/simulation now replace cube drift sparks: smoke, blue flares, red sparks and A+B pivot smoke. Draw math matches721 captured calls; rear contacts645; smoke attachment100; pivot gate3993. Native charge rendering and active-effects race restart checked.
- CPU heading now matches3500 original calls (Figure-8 and Rainbow Road, including inverted track), replacing floating atan2 with the SDK integer pipeline. Native seed1 Rainbow Road sweep: five falls before/six after; spiral falls remain unresolved.
- CPU wall-stall recovery timer model matches7000 calls (6782 natural state0 calls plus218 labeled probes, including78 starts). Later stages/mode2 are source-tested only; full callback/native wiring pending. Other kart effects/child particles and full GPU parity also remain.
- Latest complete core check:158 passed,0 failed,1 existing CPU replay ignored; Windows release built and ran. Detailed evidence/limitations: `analysis/CODEX_PARTICLE_MAP.md`, `docs/NEXT_GOALS.md`.

## Lane C: items and sound
See `docs/NEXT_GOALS.md` item 4 onward.

## Checks
- `cargo test` in `vm_model` (object tests: `cargo test --lib mapobj`), `cargo build` in `game`.
- Falls sweep (autopilot): Airship 0-1 falls per race (from Bullet Bill blows), Delfino 0.
