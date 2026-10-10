# Original drift particles and SPA resource layout

## Child birth arithmetic (2026-10-10)

`sub_201C74C` is now ported as `nitro_particle_child::child_birth`, with a
checked decoder for the 20-byte optional child record. ARM disassembly
confirms the signed rounded 64-bit inherited velocity and two wrapping
32-bit size multiplies. Child opacity inherits the parent's effective alpha;
polygon bits survive slot reuse. Rotation mode 3 writes neither angle field.
Animation steps divide by parent lifetime, with SDK numerator fallback at zero.

Isolated BizHawk capture completed 16 calls / 40 successful births, without
hook errors. Existing child-bearing resources were selected at emitter
creation; each birth call temporarily varied child-record rotation, color,
signed randomness, velocity/size ratios, lifetime and count, then restored it.
These are controlled original-function probes, not natural timing captures.
Every modeled particle field and per-child RNG state matches Rust. The numeric
fixture runs without a ROM; synthetic checks cover life 0/1 and size overflow.

Harness and commands: `tools/bizhawk/codex_particle_child/README.md`.
Replay: `vm_model/tests/particle_child.rs`, fixture `data/particle_child.csv`.
This completes birth arithmetic only. Shared pool child allocation, spawn
cadence, child tick/draw and native integration remain open. Existing primary
simulation continues explicitly rejecting resources with child spawning.

Game development build passed. Full core validation found a separate Lane C
blue-shell transition test failure; the remaining suite passed with that test
skipped. Run details and limitations: `docs/CODEX_CHILD_PARTICLE_WORK_LOG.md`.

Recorded 2026-10-08 from local AMCE `export/plan2` C, checked against ARM where
the exports omit arguments. The native drift/pivot subset now uses original
particle arithmetic and textured drawing. The latest section below records
validation and the remaining full-manager/GPU fidelity limits.

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
`sub_208C534` disables and cleans them up. `sub_208D650` sets emitter +36 stop bit0 (mask1)
and detaches the two active continuous emitters.

The native `effects.rs` now draws ROM-textured smoke, transient blue/red flares
and continuous red sparks. Blue resource126 fires at a charge transition and
attaches for eight ticks; it is not a continuous charging effect. The source
timers, wheel callbacks and particle arithmetic drive these effects.

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

## Lane B: original primary particle update

`vm_model/src/nitro_particle_update.rs` ports the primary particle loop of
`sub_20192E0` for resources without child emission. The caller supplies emitter
position, translational velocity, plane override and the manager's polygon word.
This integrates the previously verified birth fields, channels and behaviors;
it does not yet schedule emitter births or render native effects.

Channel phases use the particle's age before incrementing: life-step times age
shifted by eight, or initial phase plus repeat-step times age shifted by eight,
both truncated to a byte. Random birth color/texture suppress their corresponding
per-tick channel. Follow-emitter bit15 refreshes world position before behaviors.
Behaviors execute in archive order, followed by angular motion, drag, acceleration
and local movement including the parent's translational velocity. Drag uses a
wrapping 32-bit multiply by base[70]+384 before the arithmetic shift by nine.
The manager assigns a polygon ID while preserving packed opacity, and increments
age afterward; particles expire strictly when age exceeds lifetime.

`tools/bizhawk/codex_particle_update/run.ps1` selects the eight original drift
resources cyclically in an isolated Figure-8 replay. Entry/exit hooks at
020194C8/020197C0 captured 1,002 original primary updates without hook errors.
`make_fixture.py` retains 996 updates across resources 17,18,19,20,21,22,23,126;
six incidental resource59 updates are excluded because that resource has child
emission. All modeled fields, RNG state, polygon allocator state and expiry
conditions match the Rust replay, including final particle ticks. Pool/list
pointers are excluded from the numerical fixture. The replay loads the SPA from
the user's local ROM and skips when it is absent.

Remaining: emitter birth cadence and wheel transition/attachment timers, then
native textured rendering. Child spawning and other emission geometries are
unsupported; the native drift spark cubes are still the approximation.

Validation: the new replay passes. The shared suite also exposed three orphan
exit rows in the older flipper capture: return-address hooks stayed armed between
calls. Its replay now pairs all 1,476 complete calls by function, checks matching
frames and explicitly checks the three known orphan rows; it passes without
changing flipper physics. The tracer now guards exits with an active return
address. One pre-existing CPU replay remains ignored.

Final validation: 130 core and integration tests passed, zero failed, one ignored;
the Windows game release build passed.

## Lane B: emitter scheduling and wheel transients

`vm_model/src/nitro_particle_emitter.rs` ports manager scheduling from
`sub_201873C` and birth eligibility from `sub_20192E0`. Start delay activates
at age>=base[50..52], sets started bit4 and resets age to zero before phase
selection. Simulation pause bit2 freezes this tick; birth pause bit1 suppresses
new births while existing particles still simulate. Selector bits16..18 choose
one of the manager's alternating phases. The kart factory `sub_208B7BC` sets
these from base[84]: bit7 chooses phase0, otherwise bit6 chooses phase1.

Pre-tick callback(emitter,0) executes after update selection but before the
birth checks. The controlled capture exposed callbacks changing pause/stop
flags at this point, so the Rust API includes that callback stage explicitly.
Resource selection does not remove the original caller-installed callbacks:
348 measured decisions retained `sub_20831BC`, 41 `sub_2083680`, 31
`sub_2081E5C`; 630 had none. The replay supplies their recorded post-callback
clock state, rather than claiming those three callbacks have been ported.
They changed scheduling flags in 25 active-emitter decisions.

Birth is eligible only before the nonzero emitter lifetime limit, at an age
divisible by frequency, with started set and stop/birth-pause clear. Age advances
after particle simulation. Manager recycling requires no remaining primary or
child particles and either stop bit0, or auto-expiry flag0x4000 with nonzero
lifetime and age strictly greater than it. This preserves the distinction
between stopping births and removing an emitter once its particles finish.

`tools/bizhawk/codex_particle_emitter/run.ps1` recorded 1,057 manager iterations
in the controlled Figure-8 drive/countersteer replay. The fixture retains 1,050
decisions for all eight target resources, excluding seven incidental resource59
iterations. Rust matches every update decision, 279 birth calls, four removals,
and resulting flags/age. Additional source-boundary tests cover delay, pause,
alternate phases, strict expiry, live child counts, and factory phase precedence.
The manager does not model pool ownership or callback arithmetic; zero birth
frequency is rejected instead of emulating SDK divide-by-zero behavior.

`vm_model/src/nitro_particle_wheel.rs` ports the blue/red transient timers from
`sub_208C6DC` and `sub_208C930`, plus wheel attachment arithmetic. A separate
natural race capture, with no resource substitution or state modification,
recorded nine blue callbacks and eleven red callbacks. Blue attaches on updates
1..8 and stops on9; red attaches on1..10 and stops on11. All 56 emitter
attachments match original XYZ positions and signed direction shorts. Positions
already use SPL units; each callback adds the resource XYZ offset. Its fixture
contains numerical fields and excludes handles/pool pointers and resource headers.
Blue pause/resume actions on continuous emitters are source-derived; those
continuous flags were not recorded in this transient attachment fixture.

Remaining for game integration: continuous-wheel switching and grounded/delay
gate (`sub_208CB8C`), kart emitter callbacks, particle pool ordering, and the
original draw routine's textured billboard geometry. The old native spark cubes
have not yet been replaced.

Validation after scheduling/transient ports: 133 core and integration tests
passed, zero failed, one existing ignored CPU replay. Windows release build and
site explorer sort/filter/200-row scrolling checks passed.

## Lane B: continuous-wheel gate

`ContinuousWheelClock` in `vm_model/src/nitro_particle_wheel.rs` now ports
`sub_208CB8C`. Correction to earlier interpretation: kart+68 bit0x08 means
drifting, and bit0x10 means grounded (`KartDrift::active` / `KartMotion::grounded`).
The pending switch increments its unsigned +98 counter only during drifting;
it replaces the continuous emitters on the eleventh such update. The signed
shutdown counter +48 advances whenever shutdown is pending, independently of
drift, and clears both active and pending switch state on update11. This happens
before switch processing, so an expiring shutdown cancels a pending switch.

After lifecycle processing, active emitters attach to the wheels. Grounded
controllers resume births unless shutdown is pending; airborne controllers
pause births. Pausing emission preserves particle simulation, consistent with
the SPL scheduling port. Detailed callbacks affect four emitters; low-detail
callbacks affect two. Actions are emitted in original callback order and leave
pool/handle operations to the caller.

`tools/bizhawk/codex_particle_gate/run.ps1` records controller clocks, kart flags,
named callback entry events and continuous-emitter flags. The unmodified natural
drive/countersteer trace has 645 updates: 527 inactive, 106 attach/resume, ten
attach-only during shutdown, one start/attach/resume, one stop. Every resulting
clock, action sequence and emitter flag matches Rust.

The separate `-AirProbe` experiment clears only the grounded bit inside four
active controller calls at input steps330..333, then restores the original kart
flags at each return. It does not alter the collision/physics state. The resulting
645-update fixture includes four attach/pause decisions, with exact emitter flags
and subsequent ground resume matching Rust. `particle_gate.csv` and
`particle_gate_air.csv` retain numerical state and callback names, with no handles
or original code/assets. Captures run in their own emulator process.

Source-derived request methods cover `sub_208C520` pending-switch reset,
`sub_208C534` continuous stop request and `sub_208CCF0` immediate reset. A detailed
stop request pauses births and preserves an already-running stop timer. Its
low-detail callback `sub_208D1EC` removes handles and clears clocks immediately,
then the caller still sets shutdown pending. These request methods have boundary
regressions but their entry/exit arithmetic has not been separately captured.
Smoke-pair stopping in `sub_208C534` remains outside this continuous-clock API.

Remaining for native integration: smoke lifecycle and handle/pool ordering,
kart emitter callbacks, and original textured billboard drawing. Existing native
spark cubes remain unchanged.

Validation after the continuous-wheel gate: 137 shared core/integration tests
passed, zero failed, one existing CPU replay ignored; Windows release build passed.

## Lane B: pool ordering and composed simulation

`vm_model/src/nitro_particle_pool.rs` adds stable slot IDs, head-first lists and
the primary particle pool. `sub_201E448` pops the head; `sub_201E494` pushes the
head; `sub_201E3C8` removes a specific node while preserving survivor order.
Particles born during an emitter update become its newest head and update before
older particles. Expired particles return to the shared free head immediately.
`sub_20184E4` cancellation repeatedly pops active heads and pushes free heads,
reversing the cancelled order. Cached packed alpha, including polygon bits,
survives recycling and is supplied to the next birth.

The source manager constructor `sub_2018D94` zeroes the manager and each slot
array, then head-inserts ascending addresses. Thus the highest-address slot is
allocated first, with initial cached alpha zero. The current original manager
uses 40 emitter slots and 120 particle slots. Rust initializes the primary pool
with the same order; source-derived constructor initialization is distinguished
from the runtime trace, which starts after construction.

`tools/bizhawk/codex_particle_pool/run.ps1` makes no game-state changes. It traces
the original list helpers, replacing pointers with stable numeric identities
and recording initial list order plus before/after head/tail/count and results.
All 1,396 operations across 19 lists and 160 nodes match: 365 pops (including
20 empty allocations), 688 pushes and 343 removes. The removals include head,
tail and middle cases. `make_fixture.py` retains only numeric records. The
head/tail/count replay follows complete operation history, rather than resetting
the expected list at every mutation. Internal stale link bytes on removed nodes
are not modeled; stable ownership and live-list order are.

The pool integrates verified point birth and primary update. Birth consumes the
fractional rate before allocation; exhaustion stops further births without RNG
draws or fraction refund. A two-slot regression checks a fractional multi-birth
request, complete exhaustion, untouched particles/RNG and cancellation order.
The natural list trace verifies actual empty allocations; the arithmetic
multi-birth boundary itself remains source-derived outside recorded birth inputs.

`tools/bizhawk/codex_particle_sim/run.ps1` performs a separate controlled original
resource-selection experiment with the eight drift resources. Each snapshot starts
after the original pre-tick callback and ends after particle processing/age
increment, before the post-tick callback. Its 1,050 complete emitter ticks cover
279 births. Rust restores numerical free-slot/alpha and live-particle snapshots,
runs birth eligibility, allocation, birth, head-first particle updates, expiry and
recycling together. Every particle field, free order and cached alpha, emission
fraction, age, RNG and polygon allocator state matches. Reserved slots owned by
other emitters stay unavailable. Local SPA resource bytes are replaced by archive
IDs in the fixture; replay reloads resources from the user's ROM.

This is a composed **per-emitter tick** replay, not a claim that an entire race's
global effects stream has been reconstructed: original pre-callback outputs and
other emitters' activity are supplied as numerical inputs at each snapshot.
Unsupported child emission and non-point geometries remain explicit limits.
Remaining: original textured draw geometry, smoke/kart callback wiring, global
manager integration and visual comparison. Native spark cubes are unchanged.

Validation after pool/composed simulation: 141 shared core and integration tests
passed, zero failed, one existing CPU replay ignored; Windows release build passed.


## Lane B: original drawing and native drift/pivot effects (2026-10-09)

`nitro_particle_draw.rs` ports smoke's camera billboard (`sub_201C09C`), the
velocity-aligned flare billboard (`sub_201B560`) and world-oriented spark quad
(`sub_201A364`). A controlled resource-selection experiment covers all eight drift
resources and **721 primary draws**. Every captured MTX_MULT matrix and XY quad
helper argument matches Rust. All721 captured quads are XY and all selected world
resources use Y-axis rotation selector0; XZ quads and diagonal-axis rotation are
source-derived implementations, not runtime-verified by this drift capture. Mode3's view LOAD is supplied separately; the
capture verifies its local MULT. Velocity alignment uses the original rounded
cross/normalization/dot operations, and the world path preserves rotation and
matrix-concatenation order. Source-derived packed color/alpha modulation,
signed16/VTX10 corner quantization and texture-size UV scaling complete the native
quad bridge; final packed GPU vertices and DS pixels have not been captured.

`wheel_contacts` ports `sub_2084478`: kart-specific rear offsets, outward X
adjustments (+6144/-6144), ground-level local Y, X/Z scale, the kart's second
matrix, position >>4 and fixed spray vectors (+/-1843,3277,-1843). Both rear
positions/directions match **645 natural original calls**. The capture uses the
position pointer as translation because this function overwrites the matrix's
translation before transforming contacts. `attach_smoke` matches **100 original
wheel records**: initial SPL velocity is previous displacement times2867 truncated
fx12, and emitter position is wheel minus that velocity plus resource offset.
`sub_1FF9B70` runs attachments before updating kart+944: copy velocity, subtract
vertical speed when grounded and **not resting** (bit0x1000 clear), then >>4.
The native bridge retains this preceding-tick input. Bit0x1000 is resting, not hop.

`game/src/effects.rs` replaces cubes with the ROM's SPA textures, shared 120-slot
primary pool, at most40 emitters, fixed60Hz clocks and source controller wiring.
Smoke stops births while existing particles finish; blue/red transients and
continuous cancellation immediately return slots. Original birth/channel/motion/
update/list/draw modules drive simulation. Kart model setup supplies each
vehicle's rear offsets. Dynamic native quads bypass stale mesh-bound culling,
and race exit drops the manager before the next race initializes it.

Drift activation (`sub_206C5E4`) resets the previous continuous controller before
starting smoke, so quickly starting another drift cancels delayed old sparks.
The separate A+B pivot path (`sub_206C494`) runs before control for undamaged,
non-drifting karts (`sub_1FFC6C0`). Both pedals and velocity magnitude below6144
enable its branch: grounded/absent smoke starts it, airborne retains handles,
and leaving the branch stops births. A natural input experiment (A+B+left180
frames, then acceleration/drift) supplies **3,993 calls**; start/keep/stop actions
and resulting handle-active state all match (1 start,179 keep,3813 stop).
Caller guards and the renderer's effect-permitted assumption remain source-derived.

Damage reset (`sub_206BF88`) clears drift and calls `sub_208C534` without the
native `DriftEnded` message. The bridge observes new damage states and unannounced
active-to-inactive drift transitions, stopping smoke and requesting continuous
cleanup. The ordinary end event consumes that transition once. This covers
zero-damage-state resets such as flattening too. Exact frame order against other
native object/item systems has not been replay-validated.

Native validation: Windows release builds pass. The latest shared suite passed
**155 tests**, zero failed, one existing CPU replay ignored. The charge screenshot
(`scratchpad/codex_spa_fixed_500.png`) shows original orange sparks at both rear
wheels; diagnostics reached blue/red charge with four/six emitters and four/eight
visible particles. Pivot smoke also renders at rest
(`scratchpad/codex_spa_pivot_220.png`, two emitters/four particles). A separate
mid-red-effect restart at screenshot frame540 reloaded the course and finished
frame800 without errors or retained visible particles. These are native visual/
reload checks, not DS pixel-equivalence assertions.

Test hooks: `MKDS_DRIFT=1` plus `MKDS_SHOT` supplies fixed race-tick input, avoids
start burnout, hops/countersteers at ticks400..580; screenshot frame500 is useful.
`MKDS_DRIFT=pivot` supplies both pedals+left at ticks180..260; frame220 shows smoke.
Normal controls are unaffected. Capture scripts/fixtures are under
`tools/bizhawk/codex_particle_{draw,contacts,smoke,pivot}` and `vm_model/tests`.

Remaining limits: only these effects consume the independently seeded SPL RNG;
other kart/course emitters and child particles are absent. Native camera values
are converted to fx12, and Bevy blending/filtering/depth differ from the DS GPU.
The native kart basis/body offset substitutes for the second original matrix;
full damage/bounce matrix equivalence remains unverified. Detail selection follows
model detail, and visibility-based effect suppression (+76 bit0x8000) and draw-hide
callbacks are unported. Original replay fixtures and ROM-derived textures remain
local; public documentation publishes findings only.

## CPU heading correction during Rainbow Road investigation (2026-10-09)

The native CPU driver used floating-point `atan2` for heading error. Exported
`sub_207F6F0` instead uses the SDK quantized fx12 angle table
(`sub_2148538`) and a rounded radians-to-degrees multiplication by
`0x394BB834C8`. The Rust driver now uses that original integer pipeline.
Projection retains the rounded SDK dot product followed by truncated
component multiplication; cross and forward dot products truncate.

The isolated BizHawk capture snapshots the target at the angle call, after
any reset-triggered recentering. Capturing only at function entry initially
recorded stale targets when kart+68 bit0x2000 called `sub_207E7F0`; the tracer
was corrected before accepting the replay. Figure-8 and Rainbow Road numeric
fixtures verify the replacement; the Rainbow Road capture was selected via
race-setup course ID29 and checks that selection before recording.
All3,500 calls match:875 Figure-8 plus2,625 Rainbow Road, including inverted
track with kart-up Y down to-4093. The replaced floating-point calculation
differs on3,499 calls. The replay validates given original inputs, not native
target selection or a complete race trajectory.

The current Windows release built successfully and both native Rainbow Road
sweeps exited normally at 6,000 render frames, with logged race tick6,000.
Seed1 produced five falls before and six after the angle correction. The
player advanced from lap1 checkpoint41 to lap2 checkpoint4; other kart paths
and item interactions also diverged. This confirms a steering arithmetic
correction, **not a reduction of spiral falls or a full race-parity claim**.
All eleven falls were accepted type11 contacts (`0x84000800`). Numeric
comparison: `analysis/cpu_heading_fall_comparison.csv`.

The full core suite passes156 tests, with one existing CPU replay ignored.
Remaining work is to isolate CPU route decisions, ground/contact evolution
and missing driver substates against original race traces.

## CPU wall-stall recovery timer (2026-10-09)

`sub_207E668` has now been modeled separately in `cpu_recovery.rs`.
All7,000 recorded timer updates match:6,782 natural state0 calls and218
controlled state0 probes, including78 transitions into state1. Probes cover
unsigned counter wrap, zero limits, the speed boundary12287/12288, wall
flags0/0x40/0x80/0xC0 and signed16 latch boundaries. Probe inputs and state
are restored after each call; later callback stages are never injected.
This is controlled per-call validation, not a natural full-race replay.

Continued slow wall contact refreshes a10-tick latch. Active recovery takes
20 ticks to state1, then120 to state2, then180 to state3 and180 to state4.
Loss of the latch resets progress/state and the20-tick limit. Mode2 skips
state2. Later stages and mode2 have source-based tests; their callback side
effects have not been replayed and the model is not wired into native driving.

`sub_2080AC0` latches the predecessor as a temporary route override, rather
than reversing the graph. Local race-start RAM resolves the misleading C
no-argument thunks: `sub_208C1D0` dispatches to `sub_208C000` (node position
and segment direction), and `sub_208C1F4` to `sub_208C050` (lazy area-selected
recovery target). The latter calls `sub_2041588`; this selection needs further
area/callback analysis before integration. The missing recovery sequence is
a candidate for native stalls, not a proven cause of the observed falls.

Shared coordination now lives in root `PROGRESS.md`; Codex updates its Lane B
section alongside the detailed maps and goal notes.

Validation after the recovery module:158 core tests passed,0 failed,1
existing CPU replay ignored. Windows release builds with the new module;
its callbacks remain intentionally unwired pending original-game evidence.

## Native CPU recovery integration (2026-10-09)

The recovery timer and route callbacks are now integrated into `CpuDriver`
and `game/src/racers.rs`. Wall/solid-object contact flags0x80/0x40 and
velocity magnitude feed the original gate. State1 turns200 angle units
across the route before normal steering; state2 latches the predecessor as
a temporary target; state3 selects the first matching AREA kind4 node.
An override switch applies old-node drift hints and skips that call's angle
and reached checks; passing a node consumes its override.

Original-function validation adds863 labeled state1 steering probes, all
exercising the correction branch, and218 controlled state2 area callbacks
(130 selected targets,88 misses). Area probes use12 original Figure-8 box
volumes with controlled kind4/node fields and restored scalar inputs.
They validate box geometry, first-match selection and target-active fields,
not a natural recovery race. Opposed-forward fallback and cylinder geometry
remain source-derived. Cylinder height has no lower bound in the C; the
port preserves that behavior rather than adding a presumed correction.

CourseMap now decodes the original72-byte AREA records. Local race-start RAM
resolves kart+548 to `sub_2072EB8`, so the final recovery callback requests
immediate native placement, without waiting for the fall animation. This
uses the existing native checkpoint-respawn implementation: per-racer spread,
precise pose/reset flags and hold timing still differ from the original.
The native callback runs in the existing post-physics placement phase, not
the original in-function placement timing. This is useful recovery behavior,
not full respawn parity.

The optional `MKDS_CPU_STALL` integration probe blocks racer0 during fixed
ticks240..779. All four stages occurred at259/379/559/739 and the kart was
placed immediately; the run exited0 without falls/panics. Repeat with
`tools/native/recovery_probe.ps1`. The flag has no effect in normal play.
A source-backed cursor regression checks predecessor switching and removal
of the override after an empty area selection.

Screenshot-frame budgets can span different fixed-tick durations under
rendering load. `MKDS_SHOT_TICKS` now provides a simulation-tick capture
threshold and logs actual capture tick/frame; the existing frame option
continues to work. Subsequent sweep reports must use the logged simulation
duration before drawing conclusions about fall counts.

Validation after integration:163 core tests passed,0 failed,1 existing
CPU replay ignored. Release compilation and `cargo check --release` pass.
The normal executable was held open by another run during Cargo's final
copy; the active copy was preserved and fresh linked output is also
available as `game/target/release/mkds_game_codex_recovery.exe`. Native
checks use this separate executable; no other run was stopped.

The repeated forced-stall check with fixed-tick capture passed again:
all four stages259/379/559/739, immediate placement, no falls before
capture, native exit0. Screenshot threshold900 was observed at race
tick901/render frame446; its small overshoot is explicitly logged.

The normal seed1 Rainbow Road sweep captured at exactly race tick6000
(render frame2995), exited0 and recorded10 falls before capture. All were
accepted type11 contacts. This does not demonstrate a fall reduction; other
agents also changed the shared project during this work. The corrected
recovery sequence is a source-backed behavior improvement, while full
trajectory/contact comparison remains open. Numeric record:
`analysis/cpu_recovery_sweep.csv`. A scan of local extracted course maps
finds20 recovery AREA kind4 records, all box-shaped; the source-derived
cylinder branch is not used by those local recovery records.


## Respawn placement and reset yaw (2026-10-09)

Ported `sub_2072EB8` into `vm_model/src/kart/respawn.rs` and wired it into
`game/src/respawn.rs`. Racers now use the original 30-unit lateral/longitudinal
spread, except time trial (mode1). Pitch and roll adjust height before the
40-unit lift. The original direction uses the SDK sine table, and
`sub_2072B94` derives reset yaw with SDK atan2 and a truncated conversion;
using the point's unquantized yaw directly misses this second quantization.
The native bridge also clears steering lean, pitch and eased turn on respawn,
matching those fields in the base reset callback `sub_20720DC`.

Evidence: isolated BizHawk `tools/bizhawk/codex_respawn/capture.lua` forces the
final CPU recovery callback every16 driver calls. After the original JGPT lookup,
it varies pitch/yaw/roll and switches only the placement phase between mode1
and mode4, then restores mode before reset. These are **controlled probes**,
not a recording of natural falls or a genuine time-trial race. All306 calls
match final position, input forward vector and post-reset yaw (102 mode1,
204 mode4, all seven CPU racer indices). Racer0's zero spread is source-backed.
Battle uses the same spread branch, but battle point selection was not captured.
Fixtures contain numerical inputs/outputs only, not ROM or extracted assets.

Still open: original fall/carry delays, Lakitu rendering, battle point selection,
complete reset effects/items/camera/controller parity, and native pre/post-physics
callback ordering. This placement port does not fix or explain Rainbow Road's
remaining spiral falls. Previous measured result remains10 falls/6000 ticks.


Validation after placement integration: complete core suite167 passed,0 failed,
1 existing CPU replay ignored (includes concurrent object additions). Windows
release build passed. `tools/native/recovery_probe.ps1 -Ticks900` using
`game/target/release/mkds_game_codex_respawn.exe` passed all four stages at
259/379/559/739 and immediate placement; capture at tick901/frame444,0 falls
before capture, exit0. Screenshot: `scratchpad/codex_respawn_native.png`.
This native check exercises racer0 recovery, not seven-CPU spread; the spread
and yaw proof is the original-function replay described above.


Follow-up source audit: `sub_203DF74` early-returns through `sub_207A5C4`,
which checks kart+72 bit0x800 for **each racer**. Native previously froze only
the player; `game/src/race.rs` now skips checkpoint updates for falling CPUs
also. `sub_206FF50` stores the checkpoint respawn id immediately when falling
starts. Native now caches that id on `Falling`, instead of looking it up after
the placeholder fall delay. These two corrections are source-backed, not new
original-game timing captures.

Bowser's Castle regression lead from the shared progress file: the placement
build recorded8 falls at6000 ticks/frame2934, seed1, exit0, in
`scratchpad/codex_respawn_bowser.stderr.log`. Falls were concentrated at the
sliding block (around x7.0M/z-2.6M), flags88000800. The earlier report of111
falls has no stated tick duration, so it is not a comparable baseline. This
sweep preceded the checkpoint-freeze/id-cache corrections and does not show
that those corrections fix the sliding-block falls. Keep this issue open.


After the freeze/id-cache follow-up, the Windows release rebuilt successfully.
The native forced-stall check again passed all four stages and placement,
exit0,0 falls, capture tick900/frame446
(`scratchpad/codex_respawn_freeze_native.png`). This checks integration;
it is not an original-function replay for the new host checkpoint gate.


## Supplied-route CPU respawn reset (2026-10-09)

`sub_2072B94` passes the route pointer returned by JGPT lookup into the
`sub_208C23C` thunk. Figure-8 RAM slot0217B040 resolves to `sub_208C0C8`.
That calls `sub_207F9A8`, which forwards r1 into `sub_2080CD0`; the exported
C incorrectly omits that second argument. ARM disassembly confirms the forwarding.
The supplied node becomes the current target, its first predecessor supplies
travel direction, and `sub_207E7F0` computes the lateral offset at that node.
Rust formerly initialized at the nearest node and then advanced to the next.

Added `CpuDriver::reset_respawn`, connected through `Falling.route_node` from
`RespawnPoint.cpu_point`. The supplied-node branch resets recovery and drift,
recomputes target/offset using SDK fixed math, and clears transient pacing per
`sub_207E1D4` while retaining skill and rank/slot configuration.

Controlled original-game proof: `tools/bizhawk/codex_cpu_respawn/capture.lua`
forces final recovery every16 driver calls and substitutes a different valid
runtime node at the supplied-node callback. All306 calls across37 Figure-8
nodes match direction, lateral fraction, offset, target, recovery timer/latch,
drift state, heading error and seven pacing fields;250 exercise lateral clamps.
These are varied-pointer probes, not natural falls. Numeric fixtures in
`vm_model/tests/data/cpu_respawn.csv` contain no ROM or extracted assets.

Still open: absent-route branch `sub_208C0F0` (including skill/RNG reset),
CPU item-controller cleanup `sub_207C448`, battle reset dispatch, full rescue
motion/timing/visuals, native callback ordering and the sliding-block fall cause.
The native autopilot's player reset is a host behavior; the original player
uses a human controller, and these CPU probes do not validate that host behavior.


Native validation: full core suite171 passed,0 failed,1 existing replay ignored
(including concurrent object additions); Windows release built. Forced-stall
probe again passed stages259/379/559/739, immediate placement and supplied
JGPT node29 reset (capture tick900/frame420,0 falls, exit0). Fresh binary:
`game/target/release/mkds_game_codex_cpu_respawn.exe`.

Bowser fixed-tick comparison after freeze/id cache and supplied-route reset:
8 falls before capture at6001 ticks/frame2655, exit0. CPU3 fell twice, CPU4
five times, CPU7 once; player0 had no falls. All8 native respawns logged a
successful supplied-route reset. This differs from the earlier8-fall distribution
(player0:5, CPU4:3), but does not establish a total-fall reduction or isolate a
cause: the earlier binary preceded the checkpoint-freeze fix, and other bots
continue changing the shared game. Sliding-block falls remain unresolved.
Logs: `scratchpad/codex_cpu_respawn_bowser.stderr.log`.


Original Bowser fall tracer being hardened: an initial boot capture saved a
setup-only state (no initialized kart slots, zero CPU driver callbacks). Its
zero-fall output was discarded; it is **not** original-race evidence. The tracer
now validates all eight racer IDs and course32 before saving/recording and
requires CPU driver execution. A valid race capture is required before making
any comparison against native sliding-block falls.


Validated original Bowser diagnostic recording completed: course32, all eight
racer IDs checked before saving,6000 emulator frames,39,844 CPU driver calls,
zero calls to `sub_206FF50` and zero recorded fall starts. Position snapshots
show the seven CPUs moving through the course; player0 holding A stays against
a wall. Files: `tools/bizhawk/codex_bowser_falls/{status.txt,positions.csv,samples.csv}`.
The initial setup-only observation described above remains discarded.

This recording starts when kart slots initialize and includes the countdown;
the native run starts from its own race tick0. Controller, roster/settings,
RNG and object timing are not synchronized. Zero observed original falls versus
8 native falls is a diagnostic lead, not a matched-input regression proof.
Next comparison should capture CPU pose, target and KCL contact around the
sliding block, where native karts reach the lava rather than keeping the original
trajectory. Do not suppress valid type11 falls to conceal the divergence.


### Bowser terrain isolation (2026-10-10)

Controlled `sub_1FFDEE4` probes at the 16 logged native fall positions, with
three nearby sphere heights and two previous-center choices each, match Rust
exactly on all 96 queries: 51 hits, 45 misses; hit flags and push match.
The original reports the same type11 lava flags at accepted contacts.
a6=-2 excludes map objects; query flags=1, radius=45056, facing=null.
This does not reproduce each native movement query: the sphere offset,
previous center and facing were selected explicitly, not captured from that
racer. No terrain or type11 fall suppression change is justified.

Harness/limitations: `tools/bizhawk/codex_bowser_kcl/README.md`; numeric replay
`vm_model/tests/bowser_kcl.rs`, fixture `data/bowser_kcl.csv`. Replay passed.
Next isolate actual native swept queries, CPU trajectory and moving-block
contact against the original; the controlled emulator trajectory is not an
unmodified race reference.


### Actual native Bowser swept-query replay (2026-10-10)

Opt-in `MKDS_KCL_TRACE` now captures real terrain queries without changing their
decisions. Fresh shared Windows release linked successfully; Cargo final copy
failed because the normal exe was in use, so the fresh deps exe was copied to
`game/target/release/mkds_game_codex_swept.exe`. Native seed1 Bowser run exited0
at race_tick6000/render_frame4431 with two falls: CPU7 western x=-7581022,
z=-8226534 and CPU6 eastern x=7120651,z=2544648. These are not the historical
sliding-block fall region. Other bots' concurrent source changes were included;
two falls versus the earlier eight is not attributable to a specific fix.

Six real terrain queries around the falls were replayed through original
`sub_1FFDEE4`: actual center/previous center, radius32768 and facing. All six
match native hit/no-hit, push and flags exactly (0x88000800, zero push), also
replayed by Rust integration test. This closes the synthetic sphere-offset
limitation for these two observed falls, not for every historical fall.
Moving objects were excluded with a6=-2; original queries are controlled and
are not an unmodified emulated race trajectory. Harness:
`tools/bizhawk/codex_bowser_swept/README.md`; fixture `data/bowser_swept.csv`;
new replay plus existing 96-probe and Rainbow backface regressions all pass.

New source lead: the moving-terrain branch at 0x01FFEF14 calls `sub_20E1D10`,
which dispatches object+308 0 to oriented box `sub_20E0BAC`, 1 to cylinder
`sub_20E0764`. This is separate from the later kart/map-object damage response.
The block's box is centered at object+244, axes+40/+52/+64, half extents
400/50/175/175 times scale at +256/+260/+264/+268. `sub_20E01F0` places the
center at object position minus half-height times up, so the flat top really
is at the object position (native top height is correct). Face/edge/corner
selection and response still differ from the native inside-top-rectangle
helper. `sub_20E1A80` classifies floor/wall by configured face and signed
normal y threshold, accumulates push/normals; `sub_20E0680` supplies contact
motion using velocity and the old basis. Matched moving-box contact probes
are the next necessary validation before changing the floor helper.


### Moving-box contact port and native adapter (2026-10-10)

Captured30 controlled original Bowser queries relative to a real block's center
(+244), dimensions (+256/+260/+264) and tilted axes (+40/+52/+64). Full query
a6=-1 includes moving terrain, flags1, radius32768, previous/facing null. Only
moving-terrain hits (0x40000001 floor/0x40000100 wall) or misses appear.
The natural-race trajectory is not preserved by these controlled probes.
Failed ideal-axis / larger60-query / repeated-state-reload attempts discarded;
only completed30-query capture is fixture evidence.

New isolated kart/moving_terrain.rs reproduces sub_20E0BAC ordinary box contact:
truncated local dot products; inside minimum face with original tie order;
face penetration; edge/corner world separation scaled1024, SDK normalize and
length, then push=normal*radius-separation. Floor eligibility uses configured
faces and signed face normal y>2048; a downward cap is a wall, not a floor.
All30 hit/push/normal/classification results match; the actual WithFloors
adapter also matches their hit, push, floor/wall normals and flags exactly.
The concurrently added MovingSolid box branch now calls this core, retaining
original normals rather than normalizing the rounded push. Moving-terrain
hits carry0x40000000, distinct from terrain KCL's0x80000000. Cylinder code
remains the existing approximation.

NKM confirms all4 Bowser blocks have rotation(4096,0,0), exactly1 degree X.
Original sub_20D6DF0 builds quantized row matrices X*Y*Z with truncated SDK
products. Floating native Euler gave a different sine; source-derived
object_axes now initializes Bowser block solids and matches all recorded
axes (up0,4095,69). Other object axes still use their existing initialization.

Fixture: vm_model/tests/data/moving_box.csv (numeric only); replay:
vm_model/tests/moving_box.rs; harness tools/bizhawk/codex_bowser_box/README.md.
Full core suite passed (one existing ignored CPU replay), before final SDK
axes-only change; targeted complete box/adapter/axes replay also passes after
that change. Final Windows release built and exited0 at6000 ticks/frame3776
with1 fall (CPU6, positive-z region outside the sliding blocks); first box
build before exact axes also had1 fall/6002 ticks/frame5368. No sliding-block
falls observed in either check. Other bots edited this shared build, so no
clean causal reduction claim versus earlier2/8-fall runs. Fresh final binary:
game/target/release/mkds_game_codex_box_sdk.exe. Remaining: special
flags, asymmetric z/alternate surfaces, multiple-solid max/min accumulation,
lowest point, contact motion outputs, original cylinders, and natural falls.


Moving-box center precision follow-up (2026-10-10): repeated all30 original
queries with object positions and actual box centers captured (fixture now33
columns). `sub_2147FD8` constructs center as position + up.scale(-half_height),
not position - up.scale(half_height): signed truncation differs by one unit
for the tilted Bowser block. Native adapter now uses the original expression.
Replay compares recorded world center and actual world-space queries through
WithFloors, in addition to hit/push/normal/flags; passes. Final release/native
recheck passed: exit0,6000 ticks/frame1224,1 CPU4 fall at (-7562646,1826688,-9591635), outside the block region. No sliding-block falls before capture. Screenshot shows Mario driving normally on lap2. Fresh private executable: game/target/release/mkds_game_codex_box_center.exe. Shared RNG/item/other changes are included, so this is not a controlled causal comparison. The preceding6000-tick check predates this tiny correction.
Cylinder work was subsequently completed by claude-lane-a in moving_cylinder.rs;
remaining motion/lowest/aggregation work is owned by their T022 claim.

## Child simulation continuation (2026-10-10)

`PrimaryParticlePool::tick_with_children` now supports the shared primary/child
pool, birth cadence, preserved recycled fields, child scale/alpha and behavior
flags, follow-position, polygon choice and lifetime. All17 controlled full emitter
snapshots match fields, RNG, polygon state and all list ordering/ownership.
See tools/bizhawk/codex_particle_child_sim/README.md. The older primary-only API
still rejects child resources; native child drawing/integration remains open.


Input ownership follow-up (2026-10-10, in progress): the frozen
mkds_game_codex_box_center.exe repeated with MKDS_KCL_TRACE produced0falls
at6000 ticks/frame5556, versus the earlier1fall/frame1224. RNG counts differ
already at tick300 (304 versus306); fixed-tick screenshots alone do not prove
deterministic simulation. Original Bowser positions.csv has104 sparse
snapshots; nearest horizontal sample to the logged fall is164.6 DS units
away, insufficient to infer an exact original CPU decision there. No causal
trajectory claim is made.

Native read_input and autoshot run in Update, while drive_cpus and
hold_at_start run in FixedUpdate. These player control writers targeted
PlayerKart even when it also carries Cpu (autopilot/finish/Bullet Bill).
Added Without<Cpu> filters to keyboard, screenshot input, fixed screenshot
input and manual countdown control writers; CPU start/burnout remains owned
by drive_cpus. Keyboard ownership regression and private release validation passed; final twin-run result below.
Other system ordering/RNG/archetype iteration may still affect determinism.


CPU call order follow-up: completed read-only original capture364 calls over
52 complete frames308..359, always IDs1..7 ascending. Hook sub_207E668
reads CPU+0 kart and kart+116 racer ID; no memory/register changes.
Native drive_cpus now sorts by Racer.index before shared RNG consumption.
This protects order when Bevy archetypes change on player CPU takeover.
Player0 takeover order has not been separately captured. Discarded120-frame
no-call attempt and600-frame timeout; only completed360-frame capture used.
Harness/data: tools/bizhawk/codex_cpu_order/.

Keyboard ownership regression passed (manual input updates; Cpu-owned controls
remain intact across Update calls). Private playable release built in
scratchpad/codex_bowser_build; twin6000-tick native validation passed.


Final input/order native validation: two independent runs of the same private
release and seed1 exit0 at6000 ticks, render frames5948/5939, zero falls each.
All69 selected debug records match (checkpoint/standings, RNG counts, item
and recovery events); tick6000 RNG draws7698 in both. Screenshot reviewed;
Mario driving normally on lap2. Comparison record:
scratchpad/codex_bowser_order_comparison.json. This is two-run repeatability
for selected logs, not every kart field every tick or original-RNG/trajectory
parity. Other system ordering and starting-state differences remain to audit.


Rainbow Road follow-up (Codex, 2026-10-10): same private input/order release exits0 at6000 ticks/frame5770 with19 falls (CPU7:7; player0,CPU1/2/5/6:2 each; CPU3/4:1 each), all flags0x84000800. One racer reached lap2; others remain lap1. Screenshot reviewed on spiral; spiral falls remain unresolved. Numeric positions: scratchpad/codex_rainbow_order_falls.json. Prior10-fall run used a different shared build; no isolated causal comparison or broad regression verdict.
Next T006 evidence should pair real native swept/CPU inputs at these regions
with original callbacks; do not infer a geometry or steering cause from falls
alone. CPU order/input fixes do not constitute a spiral solution.
