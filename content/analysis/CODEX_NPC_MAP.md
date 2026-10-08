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
The current complete core suite passes 100 tests, with one existing ignored test.

For a close-up engine capture, set `MKDS_SHOT_GOOMBA=1` alongside the existing
`MKDS_SHOT` / `MKDS_SHOT_FRAMES` hooks. Use at least 150 render frames to allow
startup to settle. This inspection camera is opt-in; ordinary play is unchanged.

## Traffic tires: clock verified, drawing pending

`sub_20E2630` increments object +268 by 1536 angle units every tick, independently
of translation speed. `traffic_tire_tick` matches all 899 transitions in the
existing original bus trace (`tests/data/bus_drive.csv`).

`sub_20E2A74` reads that angle, draws body/shadow, and draws the separate tire
resource twice using opposite axle offsets. It also sets the body's texture
pattern frame from object +304. That frame is not established as a freely
looping clock; do not simply cycle every vehicle pattern.

`sub_20E20A8` loads body/tire/shadow/pattern resources. `sub_20E1F54` computes
tire scale and offsets from the type's initialization record and object scale.
`sub_20E1E98` initializes heading and reset state. The current vehicle port
already follows the verified original path; tire geometry, exact body orientation,
pattern selection, collision pose, horns and lights remain presentation work.

Other NPCs should be linked to their own state/draw routines in the same way.
No blanket animation loop has been assigned to unmapped actors.
