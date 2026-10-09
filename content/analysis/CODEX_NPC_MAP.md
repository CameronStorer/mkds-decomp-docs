# NPC and traffic presentation

2026-10-08. Movement and drawing are separate parts of the original object
logic. Existing movement ports by Claude remain the source of simulation state;
presentation should consume that state rather than run an unrelated animation.

## Goomba walking: integrated

`sub_20DB050` reads object +240, the same step counter used by walking logic:
counter 0..19 selects that pattern frame; counter 20..39 selects counter minus
20 and negates X scale. `kuribo.nsbtp` contains the original 20-frame pattern.
The draw routine also scales Y by squash factor +196, widens X by half the
lost height, and leaves Z unchanged.

`vm_model::mapobj::presentation::goomba_draw` reproduces frame/scale selection.
`game/src/object_animation.rs` reads `Behaviour::Goomba.counter` after the
object tick, chooses original textures/palettes, and mirrors its mesh child.
Each object gets an independent material; texture images remain shared.
`objects.rs` and Claude's movement implementation were not modified.

Release build passes. Engine captures on Mario Circuit at render frames 150,
210 and 260 show the Goomba and different gait frames. These are native visual
checks, not an emulator draw-output comparison. The original-pattern test
exercises both counter halves and the squash formula. The current game uses
squash factor 4096 because the Goomba simulation does not yet expose squash/
recovery states. Hit reactions and that presentation remain pending.
The current complete core suite passes 104 tests, with one existing ignored test.

For a close-up engine capture, set `MKDS_SHOT_GOOMBA=1` alongside the existing
`MKDS_SHOT` / `MKDS_SHOT_FRAMES` hooks. Use at least 150 render frames to allow
startup to settle. This inspection camera is opt-in; ordinary play is unchanged.

## Traffic tires: integrated; clock and parameters verified

`sub_20E2630` increments object +268 by 1536 angle units every tick, independently
of translation speed. `traffic_tire_tick` matches all 899 transitions in the
existing original bus trace (`tests/data/bus_drive.csv`).

`sub_20E2A74` reads that angle, draws body/shadow, and draws the separate tire
resource twice using opposite axle offsets. It also sets the body's texture
pattern frame from object +304. That frame is not established as a freely
looping clock; do not simply cycle every vehicle pattern.

`sub_20E20A8` loads body/tire/shadow/pattern resources. Resolving the literal
pool in the Thumb initialization routine `sub_20E1F54` separates the render
parameters from collision geometry. The type record pointer is at object +340,
not +244 (which belongs to the path follower). Record words 4..7 supply render
width +256, height +260, axle spacing +264 and tire Y/Z scale +272. Height and
spacing are shifted right four bits into model units. Words 0..3 instead supply
scale-adjusted collision extents +276..288; those are not tire transforms.

The object table at `0216B268` ties bus `0x195` to record `02158A18`, car `0x19A`
to `021589A8` and truck `0x19C` to `021589E0`. `TrafficTires::for_object` ports
their four render parameters; all 900 bus trace rows agree with those fields.
`TrafficTires::matrices` implements the two original 4x3 matrices, using SDK
quantized sine/cosine and rounded fx12 products. `sub_2147230` builds X-axis
rotation; the draw routine overrides X scale and Y/Z translation, then mirrors
the second axle's Z offset. The original `car_tire.nsbmd` contains both sides
of one axle, so there are two draws, not four independent wheel copies.

`Vehicle::tick` now owns the wrapping tire clock (initialized to zero), and
the existing path replay checks its 899 transitions alongside position.
`game/src/traffic_animation.rs` loads the original tire model from the supplied
ROM and adds both axle meshes under the existing vehicle root. It converts the
DS row-vector matrix to Bevy columns and applies the same 16x model-unit
conversion as the body. No independent renderer timer is used.

The matrix-layout tests check mirrored translation, quarter-turn signs and
four-bit angle quantization; they are source-derived tests, not live matrix
captures.

`traffic_heading` (`sub_20D79B0`) and `traffic_ease` (`sub_20D759C`) reproduce
all 899 recorded bus quaternion transitions using recorded terrain tilt,
heading and rate inputs. Easing negates the target when its dot product with
the previous quaternion is negative and does not normalize the result. These
helpers are now integrated into the normal vehicle tick as described below.

## Traffic terrain alignment: integrated normal branch

`Vehicle::tick_on_course` ports the normal-driving orientation branch of
`sub_20E2630`. It advances the verified path, probes KCL at the resulting
position with radius 61440 (15 units), flags 8 and no previous-position input,
then updates terrain tilt only when the hit flags overlap floor mask `001E34EF`.
The probe occurs when shared slot (`sub_2061F90`) equals instance index +212
modulo eight; held tilt persists on the other seven ticks or a missed probe.
`sub_2062464` derives that slot from the race tick counter modulo eight.

`traffic_tilt` follows `sub_20D7B88`: denominator is the SDK square root of
`2*(normalY+4096)`, X is normalZ divided by it, Z is -normalX divided by it,
Y is zero and W is half the denominator. SDK fixed-point divider rounding is
preserved. Heading uses SDK atan2 and the original rounded binary-angle
conversion; the general radians conversion helper did not reproduce this
call site's final rounding and is not used for traffic.

Normal easing rate is initialized by `sub_20E1F54` to
`250 * signed speed setting / 100`. Initial heading follows the Bezier
derivative from `sub_20D8B18` / `sub_20D9270` / `sub_20D970C`, including the
reverse-direction sign. The stationary branch eases directly toward held tilt
rather than recombining the last heading; tires still advance by 1536.

The bus replay now generates tilt and heading from its own KCL and velocity.
All 899 transitions match original position, tire clock, held tilt, heading,
eased quaternion and all nine body-matrix words. The test seeds the first
recorded pose/follower state and starts with phase 2, inferred from the trace's
normal changes at row indices 6 modulo eight. It does not validate the full
original race startup sequence or collision/bounce states. The test also
checks that instance index 8 shares index 0's probe slot and another slot
holds the old tilt. A stationary-state test protects the unusual heading
branch and the continuing tire clock.

The native object loop uses its shared tick and traffic spawn index for the
probe schedule. Exact cross-engine startup phase and the ordering of all
traffic instances have not been independently captured. Collision axes use
the fixed-point body basis. The render plugin applies that affine basis to
the root and direct body/axle mesh globals after Bevy transform propagation,
preserving the slight contraction from unnormalized quaternion easing. It
replaces the interim path-gradient pitch; normal driving no longer uses it.

All 104 core tests pass (one existing ignored). Windows release build passes
and the standard `game/target/release/mkds_game.exe` includes these changes.
Initial validation used a separate executable while the active game held the
standard executable open; the standard build was completed after that game
exited, without stopping it.

Native frame-300 captures on Shroom Ridge and Mushroom Bridge show the bus
following road tilt and the car/tire assemblies intact. Captures live in
`%TEMP%/codex-traffic-terrain/{ridge_course,old_kinoko_gc}.png`. These are engine
visual checks, not emulator frame comparisons; numeric replay coverage is
the recorded Shroom Ridge bus only.

Native inspection exposed a second, general material-parser issue: traffic's
quarter-wheel texture rendered as two half-wheels. The decompiled scale-only
texture matrix (`sub_1FF9490`) supplies a T translation of
`height * (1 - scaleT)` despite a zero resource translation. The parser had
omitted this origin correction. The scale+translation case (`sub_1FF96CC`)
also establishes that resource translations are normalized coordinates:
S offset `-width * scaleS * translateS`, T offset
`height * (1 - scaleT + scaleT * translateT)`.

`nitro.rs` now applies these offsets to materials with identity texture rotation.
The original tire UVs become S `0..2`, T `-1..1`; mirror wrapping assembles one
complete wheel from the quarter texture. This changes other materials using
these same non-rotated texture matrices. Rotated matrices and texture-matrix
animation remain unsupported.

Final Windows release build passes. Native Shroom Ridge inspection at render
frame 240 shows the upright body and complete wheels at both axles. A Mario
Circuit frame-240 capture checks the driver/kart still render after the shared
texture fix. Captures are in `%TEMP%/codex-traffic-shots/corrected.png` and
`driver-regression.png`. These are visual checks, not original-console frame
comparisons; car/truck placement is source-derived and has not been separately
captured against the emulator.

For close-up native inspection, use `MKDS_SHOT_TRAFFIC=1` with the screenshot
hooks on `ridge_course` or `old_kinoko_gc` (at least 150 render frames).
Add `MKDS_SHOT_TRAFFIC_LIFT=1` to raise only the inspected render root 120 units
for an unobstructed model view. Simulation/collision position remains unchanged.

`sub_20E1E98` initializes heading and reset state. The current vehicle port
already follows the verified original path; pattern selection, horns and lights remain
presentation work. Hit/bounce orientation is now covered below. Normal driving orientation is covered by the replay above.

Other NPCs should be linked to their own state/draw routines in the same way.
No blanket animation loop has been assigned to unmapped actors.

## Traffic own-object hit, rebound and recovery (2026-10-08)

The traffic kart callback `sub_20E2494` checks the separate own-reaction byte,
then calls `sub_20E24D0` with the kart position (+128). The corresponding item
callback `sub_20E246C` uses the item position (+80). These are distinct from
the kart damage handlers. `sub_20D6BE0` reads own responses from 0216B9AC;
for bus/car/truck the four kart-mode entries are [0,1,0,1]. The native game
currently supplies modes 0 (normal), 1 (Star) and 3 (shrunk). Flag 0800
suppresses own response 1; flag 0080 bypasses the dynamic callback in the
original dispatcher. The initialized traffic flags captured here are 0010.

The hit helper chooses the sign of the object's right and forward vectors
from their dot products against object-minus-hitter, combines them 2:1 in
XZ, and adds an upward component `(collisionHeight-81920)/16+8192`.
SDK normalization and `sub_20D7B88` produce impact tilt. It sets easing 900,
bounce-pending bit 0 and timer 20, then adds upward velocity 28672. Positive
Y velocity is retained only when the previous timer is <=15.

Flight is timer >15. X/Z continue along the path while gravity subtracts
1434 from Y velocity every tick. The flight KCL sphere probes at Y+61440
with radius 61440, flags 8, every tick. First floor contact while descending
clears bounce-pending and rebounds by fx12 factor
`1843+((collisionHeight-81920)>>9)`. The impact quaternion's XYZ are negated,
W retained, then eased toward terrain tilt with rate 2253; body rate becomes
800. The next landing sets timer 15, Y velocity zero and rate 600. Subsequent
normal ticks decrement that timer, restoring the configured normal rate at
zero. Descent uses held terrain tilt and a velocity-dependent rate;
ascent/rebound uses impact tilt. The flight branch is decided at tick entry,
including the tick that transitions to recovery.

### Original-runtime evidence

`tools/bizhawk/codex_traffic_hit/run.ps1` launches an isolated emulator, boots
Shroom Ridge and makes one controlled mode-1 kart overlap with the first
bus. Once the original hit callback fires it restores the kart position and
mode. This is a controlled handler experiment, not naturally acquired Star
gameplay. It recorded one original hit call and 300 original tick calls,
without hook errors. Return hooks capture both inputs and outputs.

The replay fixtures `bus_hit.csv` and `bus_hit_ticks.csv` contain signed
object words, not ROM/assets. The tick rows are frame, scheduler slot,
92 before words, 92 after words; hit rows are frame, hitter XYZ, 92 before
words, 92 after words. `Vehicle::hit` and `tick_on_course` replay continuously
from the initial captured state, applying the one hit at its original frame.
All 300 updates match position, velocity, path state, terrain/impact/eased
quaternions, heading, tire clock, timer, pending bit, rate and all nine basis
words. The hit was frame 2460, first rebound 2498, second landing 2518,
normal rate restored 2533. It complements the 899 normal-drive transitions.

### Native integration and limits

`game/src/objects.rs` now configures collision height from type and map Y
scale (bus 55, car 20, truck 40 units at scale one), dispatches qualifying
traffic own reactions before kart damage/push, and uses the resulting pose
for body, tires and collider axes. Standard Windows release build passes;
105 core tests pass, one existing ignored. Controlled native captures show
the body and both axle assemblies tilted in flight and settled afterward:
`%TEMP%/codex-traffic-hit/{airborne,hit}.png`. These are visual smoke checks,
not emulator image comparisons. Optional inspection: `MKDS_SHOT_TRAFFIC=1`
and `MKDS_SHOT_TRAFFIC_HIT=1` inject one hit at traffic tick 60.

The former cylinder contact approximation has now been replaced with the
original asymmetric contact test, verified below. Handler/tick and geometry
replay still do not establish full identical race collision timing.
Items do not yet dispatch the own-object hit callback. Crash/landing sound,
wall impacts, repeated-hit branches, below-zero reset and car/truck rebound
have not been independently captured. The below-zero reset is source-derived.

Earlier notes attributed own reactions to `sub_20D2668`; that function
selects an object sound context through `sub_2024A28`. The own-reaction
callback dispatch is `sub_20D6BE0`, as the C and controlled capture show.

## Exact asymmetric traffic contact (2026-10-08)

`sub_20E2400` supplies `sub_20EAFC4` with positive extents [X,height,front]
and negative extents [X,0,rear]. These are the type-record first four words,
multiplied by map scale X/Y/Z/Z with truncated fx12 products. At scale one:

| Type | X half-width | Height above base | Front reach | Rear reach |
| --- | ---: | ---: | ---: | ---: |
| Bus 0195 | 21 | 55 | 55 | 55 |
| Car 019A | 12 | 20 | 21 | 19 |
| Truck 019C | 13 | 40 | 33 | 28 |

Source records: bus 02158A18, car 021589A8, truck 021589E0. These contact
extents are distinct from tire render translations and the class broad
radius. The native `Collider` now stores them independently; each vehicle
uses its simulated fixed-point basis and position for this test.

The test projects sphere-minus-object onto each basis row with truncated
dot products and expands each positive/negative plane by sphere radius.
Exact boundary equality rejects. Within the box, it chooses the least
penetration: X wins a horizontal tie with Z. Up can win only for positive
up projection and strictly less penetration than the selected horizontal
axis. X/Z pushes explicitly set world Y to zero even for tilted objects;
up pushes use the full up basis. Original return codes are 0 rejection,
1 up, 3 X, 4 Z. Ordinary box classes use the same helper with symmetric
extents, preserving their previous behavior.

### Geometry capture and regression evidence

`tools/bizhawk/codex_traffic_contact/run.ps1` sweeps a kart through 96
requested object-relative positions for each of the three traffic types in
an isolated Shroom Ridge emulator. Hooks record actual `sub_20E2400`
inputs and output, so points displaced by other race logic are not confused
with the requested positions. The near-list can omit requested positions.
The capture produced 293 complete calls without hook errors:

| Type | Rejected | Up | X | Z | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Bus | 40 | 1 | 36 | 17 | 94 |
| Car | 40 | 3 | 29 | 18 | 90 |
| Truck | 51 | 2 | 38 | 18 | 109 |

`vm_model/tests/data/traffic_contacts.csv` stores frame, ID, sphere/object
positions, nine basis words, four extents, three map scale components,
radius, axis and push. Replay needs no ROM: all 293 calls match computed
scaled extents, exact return code and all three push components. Captured
scales are 1.25 for the bus and 1.5 for car/truck; actual sphere radii are
8 and 18 units. Separate boundary tests cover the asymmetric front/rear,
base-height bottom, strict plane rejection, X/Z ties and the side boundary
that the old cylinder falsely accepted.

### Collision-disabled flight bit

Reading the caller exposed another rule: `sub_20D3E34` immediately rejects
object flag +2 bit 0, before the shape switch. Traffic's hit sets that same
bit as bounce-pending and its first rebound clears it. Thus first flight
is also contact-disabled. The native collider now mirrors this bit from
vehicle state. Dispatching a hit disables the body immediately and also
the current collision-loop snapshot, so later karts in the same update
cannot repeatedly relaunch it. First rebound re-enables contact; second
flight is not disabled by this bit. The boundary regression checks that a
disabled collider returns no contact and is excluded from `touches`.

The remaining limits are the original nearby-object ordering/filter flags,
full kart damage/push sequencing, item own-hit dispatch, crash/landing audio,
repeated-hit and below-zero reset runtime captures. Exact callback geometry
coverage does not prove the entire native race collision pipeline identical.

Standard Windows release build passes after both geometry and disabled-bit
integration. The full core suite passes 107 tests with one existing ignored.
A frame-240 Shroom Ridge run of the standard executable checks Bevy system
initialization and intact vehicle/body/axle rendering; capture is
`%TEMP%/codex-traffic-contact/ridge.png`. No runtime panic occurred. This is
a native smoke check, not a frame-aligned original collision comparison.

## Goomba wobble, squash and recovery (2026-10-08)

The kart callback `sub_20DA73C` separates two responses. Own byte 0 adds
`82*forwardSpeed>>12` to the squash spring only when squash is exactly 4096
and spring velocity is zero. Own byte 1, from current states 0/1/5, queues
state 2 and immediately sets collision-disabled bit 0. The own-response
entries for Goomba are [0,1,0,1], matching traffic. These are separate from
the kart damage response. Native normal contacts now add wobble and
Star/shrunk contacts start the squash sequence before kart damage/push.

The state table at 0216BE48 contains six entry/update pairs. The shared
`sub_2046B40` dispatcher consumes a pending transition on the next update,
resets elapsed to zero, runs entry then update in that same call, then
increments elapsed. Native state and pending state are tracked separately.

| State | Behavior |
| --- | --- |
| 0 walking | Entry resets squash 4096 and velocity zero. Gait-driven path walking continues; wobble adds `(4096-squash)>>3` to spring velocity, damps by 3481/4096, then adds velocity to squash. Strict squash/velocity windows of +/-41 snap to rest. |
| 1 airborne | Entry resets squash/velocity; its falling/KCL behavior remains unported. |
| 2 stretch | Entry disables contact; multiply squash by 4710/4096. Above 6144 queues state 3. |
| 3 compress | Multiply squash by 3481/4096. Below 819 queues state 4. |
| 4 flat wait | Respawning objects queue state 5 when prior elapsed is >300; one-shot objects decrement draw alpha and disappear at zero. |
| 5 spring-back | Entry clears disabled bit and zeros spring velocity, retaining flat squash. Use the damped spring; prior elapsed >60 queues state 0. |

The gait counter advances in every state; path position and follower hold
during states 2..5. The wait therefore consumes 302 update calls and spring
state 62 calls, with transitions taking effect on the following tick. Map
setting 0 high half zero selects the respawn branch. Native one-shot actors
fade using the original alpha counter then hide/deactivate at zero rather
than freeing the entity during its own update.

### Original-runtime evidence

`tools/bizhawk/codex_goomba_hit/run.ps1` boots an isolated Mario Circuit
emulator and performs a controlled ordinary overlap, then a mode-1 overlap
60 ticks later. It restores the kart after each callback. This is a
controlled handler experiment, not naturally acquired item gameplay. It
recorded 600 full update entry/return pairs and three hit callbacks without
hook errors. The actual callback speed was 4182; the attempted pre-update
speed override does not replace that measured input in the replay.

The first normal callback at frame 2460 gives spring velocity 83. The second
at 2461 leaves the already-moving spring unchanged. Qualifying hit 2520
queues state 2 and disables contact. Runtime state entries occur at 2520
(stretch), 2523 (compress), 2536 (flat), 2838 (spring-back), 2900 (walking).
The continuous Rust replay matches all 600 updates and all three callback
outputs for position, follower, gait/phase, current/pending state, elapsed
counter, squash, spring velocity, collision-disabled bit and draw alpha.
It requires the user's ROM for the Mario Circuit path and skips without it.
The existing ordinary-walk replay also continues to pass.

### Native presentation and limits

`game/src/object_animation.rs` now feeds simulation squash into the original
`sub_20DB050` draw formula: scale Y by squash, widen X by half the lost height,
and retain the gait's alternating X mirror and original pattern texture.
Per-instance materials preserve independent texture phases and one-shot
alpha. The object loop mirrors collision-disabled state and hides deleted
actors. A newly qualifying hit also disables the collision snapshot so
subsequent karts in the same update cannot hit it again.

The 600-update capture verifies the respawning path actor and normal wobble.
Airborne state 1, non-respawning fade/deletion runtime comparison, item-hit
dispatch, collision/recovery audio, and the mushroom pickup drop from `sub_20DA820`
remain separate fidelity work. The one-shot branch is source-derived and
not independently recorded. Full kart/object update ordering and naturally
acquired Star/shrink scenarios are not established by this controlled replay.

Native visual inspection can use `MKDS_SHOT_GOOMBA=1` and
`MKDS_SHOT_GOOMBA_HIT=1` on Mario Circuit; the second option injects one
qualifying hit at Goomba tick 60. Regular gameplay uses `collide_objects`.

The full core suite passes 108 tests, with one existing ignored, and the
standard Windows release build includes these changes. Controlled native
Mario Circuit captures at render frames 200 and 600 show flat and recovered
poses with the original pattern textures: `%TEMP%/codex-goomba-hit/flat.png`
and `recovered.png`. Both standard-executable runs exit through the shot
hook without a runtime panic. These are visual smoke checks, not
frame-aligned emulator image comparisons; exact numeric coverage is the
600-update controlled path-actor trace above.

## Goomba mushroom pickup drop (2026-10-08)

### Corrected function meaning

The earlier label "detached debris" for `sub_20DA820` was incorrect. A
controlled allocator/return capture identifies item type 3 (mushroom), owner
8, flight callback `sub_20F63CC`, and wall callback `sub_20F6388`. Map setting
1 low half zero enables this drop. Qualifying Goomba kart contacts now create
this pickup; disabled/repeated contacts cannot create duplicates. A nonzero
map setting suppresses the pickup while retaining the squash reaction.

The helper projects hitter XZ velocity perpendicular to the current path
segment, normalizes it, and multiplies by full hitter speed plus 20480. It
adds 61440 to Y and uses that vector to offset spawn position. Shared launch
`sub_20F6630` then replaces vertical velocity with hitter Y speed clamped to
0..4915 plus 10240. Spawn offset and final flight velocity are different.
The normal-race branch is ported; battle-mode vanishing behavior is separate.

### Movement, growth and original-runtime evidence

`tools/bizhawk/codex_goomba_drop/run.ps1` performs an isolated Mario Circuit
normal contact followed by a qualifying mode-1 contact. At the original drop
helper entry it supplies velocity [12288,4096,8192] to exercise lateral launch.
This is a controlled helper experiment, not natural item acquisition. It
records launch output and all 538 generic item update entry/return pairs,
frames 2520..3057, without hook errors. The item actor is passed in r1 at
`sub_1FFF95C`; 01FFF9F0 is an internal growth block, not its entry point.
The C export ends at JUMPOUT, so the ARM continuation establishes the rest.

The launch position is [11460537,1290237,-1573760] and final velocity
[-3646,14336,35622]. Initial visible scale is 205; growth adds 737 until
4096, then 410 until full size 6963. Course/hit radii multiply scale by
14336/13517. Flight advances position before damping X/Z by 4076/4096;
Y loses 901 per airborne update with a -40960 cap. The primary KCL sphere
uses 0x44, with the shared secondary landing sphere using 0x24.

The pickup lands at frame 2555, its 36th update, with position
[11339588,1253170,-395425]. Shared landing zeros velocity, anchors under
its radius, and initializes the size spring to -1475. Spring stiffness819,
damping3072 and strict +/-41 deadzone preserve the original small residual
squash/size difference at rest. The native core continuously matches all
538 entry/return states for position, velocity, previous position, all
three scale fields, both radii, floor normal/flags, spring, ground anchor,
resting/airborne state, airborne counter, age and owner shield.

`vm_model/tests/mushroom_drop.rs` uses numeric fixtures
`mushroom_launch.csv` and `mushroom_ticks.csv`. Launch verification runs
without a ROM; trajectory replay requires the user's Mario Circuit KCL.
A separate regression checks normal contact, disabled repeated contact and
map-setting suppression. Shared wall reflection is source-derived and is
not exercised by this floor-only capture.

### Native presentation, pickup and remaining limits

`game/src/items.rs` loads `MainRace/Item/it_kinoko.nsbmd` from the user's ROM,
tracks the pickup alongside other live items and invokes existing
`ItemAction::Mushroom` on collection. That handler provides the original
90-tick terrain-independent boost (refused while damaged) and 90-tick shove.
Owner8 is the game's neutral sentinel, so it shields none of the eight karts.
This integration does not establish exact original broadphase or full
kart/object/item ordering. Items colliding with map actors, moving-platform
attachment, battle launch branch and original object/audio dispatch remain
unported. Those limits also apply to the traffic item-hit follow-up.

Rendering uses the captured squash/size and the original mushroom model.
Shared draw `sub_20ED5C0` uses full camera billboarding on level ground;
normalY<4014 uses a floor-normal/camera-Z cross-product basis. The native
renderer follows those branches in floating point; no SDK matrix replay
has been recorded for mushroom drawing.

Standard Windows release build and a native Mario Circuit frame-220 smoke
capture pass without a panic. The screenshot
`%TEMP%/codex-goomba-mushroom/settled.png` shows the textured pickup after
landing. Set `MKDS_SHOT_GOOMBA=1`, `MKDS_SHOT_GOOMBA_HIT=1` and
`MKDS_SHOT_MUSHROOM=1` to reproduce this controlled view. This visual smoke
check is separate from the exact 538-update numeric replay.

Full core suite after integration: 110 passed, one existing ignored. Standard
Windows release build includes the drop and pickup integration.
