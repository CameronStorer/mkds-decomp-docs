# Next goals (resume here)

How to run: `game\play.bat` or `game\target\release\mkds_game.exe [course]`. Cargo lives in
`~/.cargo/bin` (not on Git Bash's PATH: `export PATH="$HOME/.cargo/bin:$PATH"`).
Falls/smoke harness: `scratchpad/falls.sh <course> <seeds...>` (MKDS_DEBUG + MKDS_AUTOPILOT).

## Done recently
- Corrected Goomba "debris" mapping: the original helper creates a mushroom pickup.
  Normal-race launch, flight, growth, landing and spring match all 538 original
  item updates; native qualifying kart hits now create the original mushroom
  asset, and collection invokes the existing 90-tick boost/shove handler.
  Map setting 1 low half disables drops when nonzero; repeated disabled contacts
  cannot create duplicate pickups. Moving platforms, item/object dispatch and
  original audio remain pending. Full core suite: 110 passed, one ignored;
  standard release build and mushroom visual smoke check pass. See
  `analysis/CODEX_NPC_MAP.md`.

- Goomba normal-contact wobble and squash states 2..5 now match all 600 original
  update calls and three original callbacks (two normal, one qualifying hit).
  Native Star/shrunk contacts trigger stretch/compression/wait/spring-back and
  collision suppression; sprite X/Y scale follows original draw formula.
  One-shot fade/deactivation is source-derived, not independently captured.
  Mario Circuit flat/recovered visual captures pass; airborne state 1,
  item-hit dispatch and audio remain pending. See `analysis/CODEX_NPC_MAP.md`.

- Original traffic tire model now renders both axle assemblies on buses/cars/trucks;
  rotation comes from the vehicle tick (+1536 angle units), with original type-specific
  scale/spacing. Bus clock and render fields agree with the 900-row original trace.
  Normal terrain probing, heading, tilt, easing and all nine body-matrix words now
  match all 899 bus transitions using native KCL/velocity inputs. Rendering and
  collision axes consume that state. Hit flight/rebound/recovery now additionally
  match 300 original bus updates after one controlled mode-1 overlap; Star/shrunk
  contacts invoke the own-object reaction in the native game. Traffic now uses the
  original asymmetric oriented contact test: all 293 original bus/car/truck calls
  match scaled extents, axis and push. First flight disables contact until rebound,
  including subsequent karts in the same update. Item-hit dispatch and crash/landing
  sounds remain pending.
  Fixed missing SDK T-origin compensation in non-rotated texture matrices, which
  made the quarter-wheel texture appear as two half-wheels.
  Full core suite: 108 passed, one ignored; standard Windows release build and
  Shroom Ridge / Mushroom Bridge visual captures pass. See
  `analysis/CODEX_NPC_MAP.md` for evidence and remaining vehicle presentation work.
- CPU drift fixed (hop-only direction, facing vector while drifting, CPU hop turn x2): no falls.
- Rubber-banding (`cpu::CpuPace`, `Standings`, `CpuParams` from kartAIparam.bin): 4921/4934 exact.
- CPU skill tables per class, instant mini-turbo roll, start boost / burnout decision.
- CPU target offsets (lateral random walk, `sub_207E944`).
- Star speed (1.2 x top, any terrain, 451 ticks); laps from NKM `STAG` (Baby Park 5).
- CPU item use (`cpu::CpuItems`: per-class wait tables, place-based aiming, 20-degree boost
  check, rival shields); trailing-item handlers simplified to a wait.
- Jump pads (type 12): lift and speed target by variant, +1.0/tick in flight, ends on landing;
  CPU pace not applied in flight.
- Time Trial mode with ghosts (`game/src/ghost.rs`, `ghosts/<course>.ghost`); player aims
  throws with up/down (W/S).

- Cannons (KCL type 15 -> `kart::cannon`, NKM `KTPC`): Waluigi Pinball start, Airship, DK Pass.
- Boost ramps (type 19): 8.2 degree pitch while grounded. Delfino drawbridge decks as solid
  floors (`movement::WithFloors`, `objects::solid_tops`; always lowered).
- Kart SEs (`game/src/sfx.rs`).
- Balloon Battle mode (`game/src/battle.rs`; 6 battle stages, MEPO/MEPA roaming CPUs, rules
  from the manual: 1 up + 4 spare, max 3 up, 3-minute limit).

- Battle CPUs: yaw scale 4096 (`cpu::BATTLE_TURN_SCALE`); battle item tables 7/8 by balloons.
- Damage state 4 "blown" (`KartDamage::blow`, `ItemAction::Blow`): star touch, bob-omb blast,
  vehicles. Character voices (SSAR 2: spin, hit, burnout, start boost, fall).
- Path movers (`objects::Mover`): Goombas, Mushroom Bridge bus/truck/car, rolling rocks,
  Bowser's sliding blocks (speeds from their init code). Static still: Chain Chomps, walking
  trees, crabs, iron balls, Thwomps, Piranha plants, pendulums, fire bars.

- Minimap from the course's `Map2D` (NCGR/NCLR/NSCR decoder `nitro::screen_image`), kart dots;
  world-to-map transform fitted (the game's own not found; battle stages: none yet).

- Visual fixes (user reports 2026-10-08): duplicate wheels (kart bodies carry low-detail
  `kart_tire` wheels; detailed karts hide them), texture matrices applied, pivot rotations
  transposed (fixed skinned/rotated models), detailed drivers `KartModelSub/P_*` for the player
  (now animated through NSBCA `P_*_drive` etc.), spinning/steering tire pivots, drift sparks
  (approximate; real ones in `MainEffect/RaceEffect.spa`), wall sounds by material
  (`sub_210BAFC` table), crash SE 232 only for blown karts.

- Object collision is the game's (`vm_model::obj_collision`): collision classes per object id
  read back from the running game on every course (`tools/bizhawk/harvest.lua`: boots, starts
  a GP and swaps the course id at 0x023CDCD8/0x023CDEC0 while it loads, dumps the master
  object array), hit handlers from the game's tables (bump / spin 1-2 / tumble / blow).
  Decorations without a class (most trees, 0x12D palms) are only drawn, as in the game;
  0x12E palms (Cheep Cheep Beach) are r6 x h80 cylinders.
- Race camera ported (`vm_model::camera`, `sub_2076528`): matches BizHawk exactly over a
  recorded turn (`cam_probe.csv`); FOV 60.4 deg vertical, near 0.25, far 1600, eye-vs-KCL test.
  `MKDS_43=1` opens a 4:3 window (1024x768) for side-by-side shots (`tools/bizhawk/shot_probe.lua`).
- Pokeys: 3 body sprites + head stacked (`sub_20A79C4`); flat models drawn as billboards.
- `docs/FUNCTION_MAP.md` (generated by `tools/function_map.py` from source comments +
  `docs/function_notes.md`): what each identified game function does.
- `docs/FUNCTION_TABLE.csv/.md` (`tools/function_table.py`): all 11175 exported functions, status
  known / inferred (area from loaded files + call graph) / sdk / unknown. Goal (user): a 1:1
  meaning for every function. Add meanings to `docs/function_notes.md` (or source comments)
  and regenerate.
- Pivot matrices decoded with the NNS sign layout (no more mirrored models): detailed drivers
  face forward without the 180-degree turn, back faces render right.
- Object lifts (item box 12, pipe 13, wooden box / Piranha Plant 10 x scale) for model and body.

## Codex visual-fidelity progress (2026-10-08)
- Detailed driver joint poses now reach SBC skinning through `nitro::Model::parse_all_with_poses`.
  `nitro_driver` implements steering-controlled drive and original clip clock/blend increment;
  `game/src/driver_animation.rs` selects drive/spin/ordinary win/lose and normal/closed faces.
  Engine screenshot comparison confirms Mario's arms moved inward into the driving pose.
  All 48 detailed-driver clips pass integer-frame skinning/topology checks.
- SPA resource decoder: both race particle archives parse; main archive has 156 emitters,
  47 decoded textures. Original blue flare 126, red flares 22/23 and smoke/red families
  mapped from C. Full particle simulation and replacement of approximate cubes remain pending.
- Original particle scale/color/opacity/texture evaluators now ported in `nitro_particle`:
  885 unique BizHawk calls match exactly, including RNG state; blue/red attachment
  timers and all six SPA behavior callbacks mapped. Native particle creation/motion
  and wheel-controller integration remain pending; see `analysis/CODEX_PARTICLE_MAP.md`.
- Goomba walking presentation now uses `kuribo.nsbtp` and the original step counter:
  20-frame texture selection plus mirrored second step (`sub_20DB050`), independent
  materials per actor. Close-up engine captures show changing gait frames.
  Squash/recovery states remain pending. Traffic tire clock matches 899 original bus
  transitions; separate tire geometry and body presentation remain pending.
  See `analysis/CODEX_NPC_MAP.md`.
- Fall detection now uses accepted movement-contact flags, matching `sub_1FFA4B4`, and
  suppresses type 10 during wall contact as the original does. ROM regression exercises
  186 Rainbow Road backfaces falsely accepted by the former second unswept probe.
  Seed-1 native comparison over 6,000 render frames still produces four identical type-11
  falls before/after; remaining autopilot falls need diagnosis. See `analysis/CODEX_PARTICLE_MAP.md`.

- Object behaviours from the game's code, each replayed exactly against BizHawk traces
  (`tools/bizhawk/obj_trace.lua` + `obj_trace_cfg.lua`; fixtures in `vm_model/tests/data`):
  path follower and segment builder (`vm_model::mapobj::path`), Thwomp (glide / slam,
  flattens karts: `KartShrink::flatten`), path Chain Chomp 0x1A5, chained Chain Chomp 0x196
  (wander exact; its lunge aims through an uninitialised word in the game, approximated),
  Goomba walk. Object RNG `mapobj::ObjRng`, kart turn round-robin (`objects::ObjectWorld`).
- Function table: tools/infer_functions.py guesses (getters, wrappers, hardware, SEs, effects,
  state machines) + address-neighbour areas. 11175 functions: known 372, inferred 5750, sdk
  512, out of scope 2472 (overlay 0 = online play, overlay 3 = Wi-Fi setup utility; the user
  said to ignore them), unknown 2069. Overlay 1 (race: missions, bosses) C is in export/plan1.

## Open user reports
- Driver presentation: victory idle alternation, complete special-mode results and one-shot
  return logic; capture spin/win/lose, face changes and crossfades against the emulator.
- Rainbow Road spiral falls; original drift particle simulation from `RaceEffect.spa`.
- Object reactions: traffic hit/bounce and asymmetric contact geometry ported; item-hit dispatch next.
  Goomba wobble/squash/recovery states now match 600 original updates and three
  callbacks; normal/Star/shrunk contacts drive native squash, disabled contact,
  stretch and spring-back. Other own-object callbacks (crab knock, Chomp) remain
  unported, moving-object shove (handler flag 1), handler 9/10 exact damage (taken as blown).

## Long-term: "bring your own ROM" release (user, 2026-10-08; lower priority than finishing the game)
Like the SM64 PC port: ship only our code; the player supplies their own MKDS `.nds`. The game
already reads everything from the user's ROM at runtime (`NdsRom::open`, `MKDS_ROM`). To finish:
- Move the tables now hard-coded from ARM9 (object classes/handlers in `obj_collision.rs`, item
  tables, camera constants, ...) to reads from the user's ARM9 at startup (addresses + ROM
  checksum check), so no game data lives in our source.
- A first-run tool / screen: pick the `.nds`, verify the SHA-1 (USA `AMCE`), cache extracted
  assets, clear error for wrong dumps/regions.

## Same-seed comparisons with the emulator (user idea)
Read the game's RNG state from a savestate (find the race RNG global with a RAM diff) and start
our race with it, so CPU/item behaviour can be compared frame by frame against BizHawk.

## Course sweep (autopilot, 6000 ticks; falls) - see scratchpad/sweep.sh
OK: Figure-8, Yoshi Falls, Cheep Cheep, Luigi's Mansion, Desert(1), Delfino(0 after bridge),
Pinball(0 after cannon), Shroom Ridge, DK Pass, Mario Circuit, Airship, Wario Stadium, Peach
Gardens, SNES MC1, N64 Moo Moo, GBA Peach. Rainbow Road ~3-11 (cluster at 500,550,400).
Tick-Tock Clock and Bowser's Castle fixed with turning disc platforms (`objects::platforms`,
gears 0xCB, rotating floor 0xD0; pauses in the gears' turning not ported). All 32 race courses
run with 0-1 falls per autopilot race (Rainbow Road a few).

## Next big goal (in order)
1. (optional) exact trailing-item handlers (`0x0215524C` table) and player throw direction
   (hold up/down when releasing).
3. Map objects: remaining behaviours: rocks 0x192/0x1B1, traffic 0x195/0x19A/0x19C,
   Bowser blocks 0xCA (still `objects::Mover` approximations), walking trees 0x1A3, crabs
   0x1AC, Pokeys 0x1B2 walk, iron balls 0x1B0, Piranha plants 0x1A6, Cheep Cheeps 0x19B,
   Monty Moles 0x199, snowmen 0x19D, bats 0x19F, fire bars/flippers/bumpers, pendulum 0xCF,
   clock hand 0xCD, gear pauses 0xCB, drawbridge 0xCC; the objects' own reactions to karts
   (Goomba debris/airborne state, Chomp state 2). Method: obj_trace.lua -> writer pc -> state
   table (def +0x10 manager record +8 / state machine at +0x80) -> port -> replay test.
4. Item fidelity: star invincibility/knock, blue shell, bob-omb, blooper, Boo, bullet bill,
   triple/trailing items (record each in BizHawk, write fixture, port).
5. Sound: kart SEs wired (`game/src/sfx.rs`, SSAR 0 entry = id). Missing: engine sound (not
   started with a constant archive; look at emitter tables / `sub_210D0B4`), item/roulette/
   countdown SEs, character voices (SSAR 2, 14*char+voice), 3D for other karts.
6. Battle fidelity: the game's battle CPU AI (tables set by `sub_2090354`, driver mode for
   cfg+8 == 2) so CPUs hunt; balloon models on karts; balloon stealing; verify the balloon
   rules in BizHawk. Shine Runners. Missions last.
