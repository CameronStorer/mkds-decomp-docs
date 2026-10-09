# Original drift particles and SPA resource layout

Recorded 2026-10-08 from local AMCE `export/plan2` C, checked against ARM where
the exports omit arguments. This is a resource decoder and function map;
the full original SPL particle simulation is not yet running in the port.

## Charge and wheel effects

`sub_20681F0` advances mini-turbo countersteer stages. Stage 2 calls
`sub_208C884` and plays sound 210. Stage 3, while drift-contact flags allow,
stops the old emitters, enables wheel effects and calls `sub_208CACC`.

| Original resource | Purpose established by caller | Lifetime / frequency |
|---|---|---|
| 126 | Blue charge flare, twice at rear wheels | 7 / 1 |
| 22, 23 | Red charge flares, both at each rear wheel | 1 / 1; 6 / 2 |
| 20 | Detailed driver's wheel smoke | 8 / 4 |
| 21 | Low-detail CPU wheel smoke | 6 / 6 |
| 17, 18 | Detailed red wheel effect pair | 1 / 1; 6 / 6 |
| 19 | Low-detail red wheel effect | 1 / 1 |

Values are resource ticks, not seconds. `sub_208D758` allocates 136-byte
wheel controllers and selects these detailed/low-detail families.
`sub_208C5B8` indexes that array. `sub_208C520` enables continuous effects;
`sub_208C534` disables and cleans them up. `sub_208D650` sets emitter +36 bit 1
and detaches the two active continuous emitters.

The existing native `effects.rs` still draws approximate cubes. Replacing them
with continuous blue particles would also be wrong: original blue resource 126
is triggered at a charge transition. Timers, wheel callbacks and simulation
must be ported as well as selecting the right texture.

## Checked resource decoder

`vm_model/src/nitro_spa.rs` implements the layout from `sub_2018A1C`:

- Header ` APS12_1`, emitter count at +8, texture count at +10, texture offset +24.
- Emitters start at +32, with 88-byte base records.
- Optional blocks in flag order: 0x100=12, 0x200=12, 0x400=8, 0x800=12,
  0x10000=20 bytes; behavior flags 24..29 have sizes 8,8,16,4,8,16.
- Texture records start ` TPS`; texel length +8, palette offset +12,
  palette length +16, complete record length +28, texels +32.
- `sub_2019DF8` confirms palette-zero transparency is SPA flag bit 16.
  Existing DS texture decoding is reused, with checked palette indices.

`MainEffect/RaceEffect.spa` decodes completely: 156 emitters and 47 textures
in 62,504 bytes. All textures use supported indexed/alpha formats; no 4x4
compressed texture is present. The separate fog-off archive also decodes.
Tests exercise both archives, truncations, invalid offsets, palette indices,
transparent color zero and A5I3 alpha. `particle_info` inspects resources.

`sub_208B7BC` divides game-world fx12 position by 16 before spawning; native
rendering must account for this unit conversion. `sub_2018600` creates and
links emitters, and `sub_20184E4` recycles emitters and their particles.
`sub_201873C` schedules active emitters. `sub_20192E0` performs spawn cadence,
animated channels, behaviors, integration/death and child emission;
`sub_201CA6C` creates primary particles from an fx12 emission accumulator.
Those simulation routines are mapped but remain unported.

## Channel evaluators now ported and verified

`vm_model/src/nitro_particle.rs` implements original signed scale, BGR555 color,
packed opacity and texture-sequence evaluation. An isolated, read-only BizHawk
capture recorded 956 calls while driving and countersteering from the existing
Figure-8 start state. Matching resource bases against the local archive produced
885 unique regression cases, with no unmatched or ambiguous records.

| Evaluator | Unique calls | Resources | Distinct phase bytes |
|---|---:|---|---:|
| `sub_201DF30` scale | 599 | 18,20,23,32,47,59,126 | 43 |
| `sub_201DC88` opacity | 248 | 20,23,47,59,126 | 35 |
| `sub_201DD64` color | 22 | 59,126 | 12 |
| `sub_201DC24` texture | 16 | 126 | 8 |

All outputs and RNG states match exactly. The opacity routine consumes one SPL
RNG draw even when randomness is zero. Its generator at 0x02173254 uses
state * 0x5EEDF715 + 0x1B0CB173 with 32-bit wrapping. ARM at 0x0201DCA4..0x0201DCC0
confirms the first opacity segment starts
at the packed low-five-bit value, contrary to C's misleading temporary name.
Texture evaluation preserves the prior texture when phase lies beyond the
sequence, rather than clamping. These details are retained by the port.

Reproduce with `tools/bizhawk/codex_particles/run.ps1`, then `make_fixture.py`.
The fixture `vm_model/tests/data/particle_channels.csv` contains input/output
numbers and resource indices; complete resource bytes remain in the user's ROM.
The Rust integration test reloads the local SPA and compares every fixture.
This verifies channel functions for the captured inputs, not every phase or
the complete particle simulation. Native effects still use approximate cubes.

## Wheel timers and simulation behavior findings

`sub_208C6DC` updates blue emitter positions and directions from wheel vectors
for eight ticks, pausing existing continuous wheel emitters. Tick nine destroys
the flares and resumes continuous effects. `sub_208C930` similarly attaches
red flare pairs for ten ticks and destroys them on tick eleven.
`sub_208CB8C` delays continuous drift-effect activation by ten ticks and selects
callbacks based on grounded/airborne state. These controller paths remain
to be integrated alongside particle creation and motion.

SPA behavior pointers at ARM9 0x02018D7C..0x02018D90 establish:

| Flag | Routine | Behavior |
|---|---|---|
| 0x01000000 | `sub_201E394` | Constant signed-short acceleration |
| 0x02000000 | `sub_201E2CC` | Periodic random acceleration |
| 0x04000000 | `sub_201E248` | Attraction acceleration using position and velocity |
| 0x08000000 | `sub_201E170` | Rotate local position around selected axis |
| 0x10000000 | `sub_201E054` | Horizontal-plane kill or damped bounce |
| 0x20000000 | `sub_201DFC0` | Rounded position convergence toward target |

The behavior meanings come from each local C routine; the pointer table fixes
their correspondence to archive flags. They are mapped, not yet implemented.

An independent author's [SPA parser](https://github.com/RHY3756547/mkjs/blob/master/code/formats/spa.js)
was used for navigation; record layout and drift resource IDs above come from
the local game's C. No reference implementation was copied into the project.

## Fall-detector correlation found during this work

`sub_1FFA4B4` passes the accepted movement sphere flags to `sub_206FF50` in r1
at 0x01FFA868..0x01FFA894. C's one-argument cast omits that fact. Type 10 is
suppressed during wall contact unless type 11 is also present.

The native respawn code previously repeated the query without previous center,
allowing backfaces and surfaces moving away from the kart. It now consumes
`KartMotion::course_flags` from the actual movement collision and applies that
type-10 guard. A ROM-backed regression finds 186 Rainbow Road fall-prism
backface probes accepted only by the old unswept query. This proves a detector
mismatch; it does not prove that every remaining spiral fall is resolved.

Native comparison, seed 1, Rainbow Road, 6,000 screenshot/render frames with
`MKDS_AUTOPILOT=1`: both pre-correction and corrected executables produced
the same four falls at identical fx12 positions (racer 4 once, racer 2 once,
racer 0 twice). All were accepted type-11 contacts in both builds. Therefore
the observed falls require further CPU path/steering or course-contact analysis;
this correction did not reduce them. The run is a native comparison, not an
emulator comparison. Summary data: `analysis/rainbow_fall_comparison.csv`.

Validation: the driver/fall release build passed; the native game compiles with
the new particle module. Current core library and integration suites total
98 passed, zero failed, one existing ignored test, including Claude's concurrent
object-behavior additions and the new particle-channel tests.


## Lane B: particle behavior port (2026-10-08)

`vm_model/src/nitro_particle_motion.rs` now decodes and evaluates all six
behavior records, in preparation for original particle simulation. These are
particle-local position/velocity operations and acceleration accumulation;
they do not emit particles or drive native wheel effects by themselves.
The original archive order must be retained by the future simulator.

`tools/bizhawk/codex_particle_motion/run.ps1` loads the existing Figure-8
start state in an isolated emulator. With `MKDS_PARTICLE_RESOURCES=1`, the
original emitter allocator selects resource IDs 0,4,20,124 cyclically to
exercise the three behavior families present in this archive. Original
behavior routines and their caller execute normally. This is a controlled
resource-selection experiment, not a natural race-effects trace. Without
the option the normal drive/countersteer sequence is preserved.

The controlled recording contains 9,794 calls with no hook errors:
4,794 acceleration, 4,390 random-impulse and 610 rotation calls. Random
impulses consume RNG in 756 calls; inactive periodic calls preserve it. Every
captured acceleration, random impulse and rotation output matches Rust,
including RNG state on active and inactive random-impulse ticks. The fixture
retains behavior parameters and only the numeric particle fields read or
written by those callbacks; it excludes linked-list pointers and unrelated
channel fields. `make_fixture.py` creates `particle_motion.csv`.

Attraction uses ARM MUL, wrapping the product to 32 bits **before** shifting
by 12. A 64-bit fx12 multiply is incorrect here. Convergence instead uses
64-bit products and +2048 rounding. Plane contact uses strict crossing;
landing exactly on the plane from below does not trigger, while crossing
from the plane toward below does. Killing sets age to lifetime; deletion
occurs later when the caller increments age past lifetime. Those last three
behaviors are source-derived and have boundary/rounding regressions but no
original-runtime capture. Rotation rejects unsupported axis values and
random records reject a zero interval, rather than reproducing undefined
matrix/division cases; the selected original records are valid.

Remaining for actual original drift effects: primary particle creation
`sub_201CA6C`, spawn cadence/integration/death and optional child emission
`sub_20192E0`, wheel transition/attachment timers, then textured native
rendering. The current native spark cubes are still the approximation.

Full shared core suite after this addition: 119 passed, zero failed, one
existing ignored, including concurrent course-object work.


## Lane B: original point particle birth

`vm_model/src/nitro_particle_birth.rs` now ports the point-emission branch of
`sub_201CA6C`. Every drift/wheel resource (17,18,19,20,21,22,23,126) uses
shape0. The emitter field subset is initialized from the SPA, and supports
wheel callback overrides of position, direction, initial velocity and speeds.
Emission consumes rate+fraction, retains the low12 fractional bits, and
reports the integer birth count separately from pool allocation.

The original consumes both speed-randomization draws before generating
its random unit vector: three signed RNG states shifted right8, normalized
through the SDK hardware math. Birth then initializes size, optional random
color, packed alpha preserving recycled polygon-ID bits, angle/angular speed,
lifetime, texture and animation phase in the original draw order. Zero
speed or zero randomness does not remove the corresponding RNG calls.

`tools/bizhawk/codex_particle_birth/run.ps1` uses an isolated Figure-8
start state and selects the eight existing resources cyclically at the
original emitter allocator. It records 280 original births (including one
existing resource59 emitter), with no hook errors. The continuous RNG and
all modeled particle outputs match: local position/velocity, emitter
position, size, scale/color/alpha/texture, angle/angular velocity, lifetime,
age, life/repeat steps and repeat phase. All captured calls birth one
particle; fractional rates, multi-birth calls, and pool exhaustion have not
been independently recorded. The arithmetic accumulator is source-derived
outside those measured inputs. Non-point geometry remains unsupported.

Reproduce with the capture's `run.ps1`, then `make_fixture.py` to generate
`vm_model/tests/data/particle_birth.csv`. The fixture replaces resource
bytes with local archive IDs and excludes particle pool/list pointers.
The replay reloads the SPA from the user's ROM and skips without it.

Particle birth is now verified for the target resources; full particle
update/child emission, controller timers/attachments and native rendering
still need integration. Native drift sparks remain the current approximation.

Validation after the birth port: shared core suite 126 passed, zero failed,
one existing ignored. Site explorer sort/filter/200-row scrolling checks pass.
