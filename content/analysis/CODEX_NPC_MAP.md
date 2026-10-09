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
already follows the verified original path; collision/bounce orientation,
pattern selection, horns and lights remain
presentation work. Normal driving orientation is covered by the replay above.

Other NPCs should be linked to their own state/draw routines in the same way.
No blanket animation loop has been assigned to unmapped actors.
