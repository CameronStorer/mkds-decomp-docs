# Rainbow Road movement fidelity, 2026-10-10

Regular spiral falls were traced to an incorrect ramp-facing calculation. The
native integrator chose the pitch sign that increased world Y. The original
`sub_1FFB130` always uses sin 582 / cos 4054 around the kart's right axis,
concatenates ramp matrix * drift matrix, and transforms heading once. This
presses the facing vector toward the local track surface, including upside down.

The corrected `ground_facing` is used by the native integrator. No course name,
position threshold or collision override is involved.

## Original evidence

- `codex_ramp_facing` completed 2000 frames / 14731 calls without hook errors.
  All outputs replay exactly, including 2004 ramp calls and 854 inverted ramps.
  The former world-Y branch disagrees with 1129 original outputs.
- `codex_rainbow_motion` completed 2000 frames / 14000 ordinary steering calls.
  All outputs replay exactly, including 231 node changes and 875 inverted calls.
  Using the old target gives the wrong turn in 65 calls.
- `sub_207F8F8` updates heading/reach/target (`sub_207F6F0`) before steering
  (`sub_1FFD224`). Rust now follows that order, retaining the cached error and
  the forward-vector choice made before drift-state transitions.
- Earlier 89 native fall-contact queries replay exactly against original KCL.
  Their correctness did not imply that the queries' trajectories were correct.

The first native falling CPU in the target-order-only build was airborne for
171 ticks before hitting the fall surface. After the local-pitch correction,
all 642 sampled upper-loop states were grounded; 344 were inverted.
These are spatial-region diagnostics, not synchronized original/native races.

## Native checks

All use the same private release and validate process success plus capture marker;
falls after the capture marker are excluded.

| Course | Seed | Capture tick | Render frame | Falls |
| --- | --- | --- | --- | --- |
| Rainbow Road | 1 | 6000 | 1452 | 0 |
| Rainbow Road | 2 | 6001 | 1606 | 0 |
| Bowser's Castle | 1 | 6003 | 1510 | 0 |
| Airship Fortress | 1 | 6003 | 1506 | 0 |

Every Rainbow racer reached lap two on both seeds. All four screenshots were
reviewed. Earlier target-order-only Rainbow build completed 6000 ticks with
23 falls; retain that failed-fidelity milestone rather than calling it a fix.
Concurrent shared-source changes prevent attributing every sweep difference to
one edit; the controlled original replays independently verify both corrections.

Numeric native summaries: `scratchpad/codex_local_pitch_results.json`.
Optional per-tick native diagnostics: `MKDS_CPU_TRACE`, implemented in
`game/src/cpu_trace.rs`; stages 0/1 bracket CPU heading/route/steering update.
The native probe helper now accepts `-Seed` (default remains 1).

## Validation limits and next work

The ordinary steering recording excludes hop, damage, recovery correction,
Bullet Bill and Blooper branches. Grounded facing replay verifies facing
construction, not the entire movement function. Earlier probe mistakes (pointer
instead of turn-scale value; auxiliary velocity instead of +164 world velocity)
are retained and labeled in the harness README; final evidence corrects both.

Remaining work includes full three-lap / 32-course regressions, matched race
configuration and RNG trajectory comparisons, fall/carry timing and complete
CPU visual steering/animation parity. No full-game decompilation claim follows
from these local kernel replays. Do not publish ROM, assets, states or raw dumps.
