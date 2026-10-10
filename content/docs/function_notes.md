# Function notes

Hand-kept meanings of game functions that are not (yet) described in our source comments.
One per line as `sub_XXXXXXX: meaning`; `tools/function_map.py` merges these into
`docs/FUNCTION_MAP.md`.

## Course objects (map objects)

- sub_20D41E0: kart sphere vs every registered object (near list), sums the pushes (min + max per axis)
- sub_20D5180: builds the near-object list (<=128) from the sorted master array (*0x0217B598, 28-byte entries, object at +24)
- sub_20D3E34: rejects object flag +2 bit 0 before any shape test; then class shape (+152 -> +8): 1 sphere, 2 cylinder, 3 tilted cylinder, 4 box, 5 callback; traffic bounce-pending bit therefore disables contact until first rebound
- sub_20EB3F0: sphere push-out
- sub_20EB2A0: upright cylinder push-out (sideways, capped by vertical depth)
- sub_20EAD80: tilted cylinder push-out
- sub_20EAFC4: asymmetric oriented box push-out: strict per-plane radius-expanded bounds, separate positive/negative extents, least penetration with X-before-Z ties, upward response only for positive up projection; horizontal pushes zero world Y; matches 293 original traffic callback results
- sub_20D29CC: object sizes = class sizes x object scale (+88/+92/+96)
- sub_20D6BE0: picks the kart-vs-object hit handler from tables at 0x0216B94C (id/100 group, kart +0x29C mode, id%100)
- sub_20D69E4: object solid for this kart (same table, non-zero)
- sub_20D2C2C: item/other sphere vs objects (same shape test)
- sub_20DE658: pipe (0x12F) collision class factory (copies static class record 0x02158528)
- sub_209BF70: actor-family class allocation (callback, flags; sizes set by the object's init)
- sub_209BEF0: decoration draw descriptor (load / draw / delete callbacks)
- sub_209A110: tree draw: billboard matrix (sub_20E6CBC) + scale, then the model
- sub_209A728: decoration factory (generic, no collision class of its own)
- sub_20E6CBC: object matrix with the global billboard rotation and position / 16
- sub_20E6CF8: object matrix with the second billboard rotation and position / 16
- sub_1FF9048: send geometry commands to the GX FIFO (20 restore, 25 mult 4x3, 26 mult 3x3, 27 scale, 28 translate)
- sub_20A79C4: Pokey (0x1B2) draw: 3 body sprites + head, 10 up then 20 apart
- sub_20A73B0: Pokey update (path walk, segment states)
- sub_20A7FC4: Pokey class callback (hit by a kart: break apart)
- sub_209B344: crab (0x1AC) class callback
- sub_20E4934: Cheep Cheep (0x19B) class callback
- sub_20E5BA0: Piranha Plant (0x1A6) class callback
- sub_209DDEC: 0x1AE class callback
- sub_20D2668: the object's own reaction to a kart touching it

## Kart vs object reactions (handler tables at 0x0217ABF8 / 0x0217AC34)

- sub_206E874: kart vs course objects: handler, wall bump (flag 8), speed scale (2), moving-object shove (1), push out
- sub_2067F78: handler 2, solid object
- sub_2067EC4: handler 3, solid + spin 1 turn above 3 units/tick
- sub_2067E10: handler 4, solid + spin 2 turns above 3 units/tick
- sub_2067D0C: handler 5, spin 2 turns
- sub_2067D88: handler 6, spin 2 turns above 3 units/tick
- sub_2067CB0: handler 7, tumble (sub_206B4D0)
- sub_2067B0C: handler 11, item box
- sub_20680E0: reaction 8, blown away (sub_206ADD0)
- sub_2068094: reaction 9, run over (sub_206B020)
- sub_2067F94: reaction 10, damage state 5 (sub_206A980)
- sub_206F04C: wall reaction (KCL walls with a4 3277, objects with a4 4096)
- sub_206BCB0: spin out for N turns
- sub_2069C38: star on (kart +0x29C = 1, +0x4C bit 0x40)
- sub_2069AA0: mega mushroom on (+0x29C = 2)
- sub_20695C4: shrink on (+0x29C = 3)
- sub_1FFB130: kart update (per tick, ITCM): states, movement, object check, items

## Camera

- sub_2076528: race camera update (per tick)
- sub_20741A0: race camera eye
- sub_20745D4: race camera target
- sub_2075FE0: race camera slope height offset
- sub_20760EC: race camera eye vs course (KCL)
- sub_2073EB8: camera shake
- sub_2063B10: kart forward axis (+0x138)
- sub_2063B30: kart up axis (+0x12C)

## Animation (Codex; evidence in analysis/CODEX_ANIMATION_MAP.md)

- sub_207954C: character renderer setup: loads four joint clips and shared face-pattern wrapper; see analysis/CODEX_ANIMATION_MAP.md (C/resources confirmed)
- sub_207B8F4: character joint-animation filename builder (character and clip index; second argument recovered from ARM, omitted in C)
- sub_207B8DC: joint-clip playback flag lookup, 12-byte records at 0x021551B0: drive=0, spin/win/lose=1
- sub_207B734: driver steering pose update or active non-drive animation tick; drive frame is steering offset plus center, not an ordinary looping timer (C confirmed)
- sub_2087B78: fx12 animation clock tick: stop, loop, counted loops; C omits indirect continuation at 0x02087B9C; ARM recovered, 541 live mode-1 transitions matched
- sub_2087C9C: animation clock initializer: duration, speed=4096, frame/counters=0, boolean loop mode (C and ARM confirmed)
- sub_2087CD0: initializes animation clock with looping mode 1 (C confirmed)
- sub_2087CFC: sets per-clip playback flag and current clock mode (C confirmed)
- sub_2087D0C: selected animation duration converted to fx12 frames (C confirmed)
- sub_2087D44: advances animation crossfade weights without advancing frame (C confirmed)
- sub_2087DE0: advances blend, ticks clock and publishes frame to selected SDK animation (C confirmed)
- sub_2087E90: selects joint clip with crossfade, initializes playback clock (C confirmed)
- sub_2087F84: selects joint clip immediately, clears prior blend and initializes playback clock (C confirmed)
- sub_2015B9C: applies NSBTP texture/palette pattern to material; index 255 preserves palette (C/SDK confirmed)
- sub_2014C5C: NSBCA joint evaluator; Mario drive decoder matched 1687 live node results; other clips not runtime verified

## Driver presentation callers (Codex; C and ARM, 2026-10-08)

- sub_207B6C0: driver clip selector wrapper: crossfade via sub_2087E90 when requested, otherwise immediate selection via sub_2087F84
- sub_207B708: selects face-pattern frame from fx12 table 0x021551A4: normal=0, closed=4096
- sub_2068A64: selects detailed driver clip and face: spin=1 with closed face; result flags force win=2 or lose=3 (closed); handles one-shot return state
- sub_207B054: starts one-shot driver clip, saves return clip at driver +60, disables its looping and marks +56 active
- sub_207B354: victory presentation alternates win/drive after random 150..349 ticks when enabled; kart +124 bit 0x40 forces drive (not yet ported)
- sub_207B44C: chooses finished driver presentation by mode/team/place; normal eight-racer table at 0x021551DC gives win for 1..3, unchanged for 4..6, lose for 7..8
- sub_208823C: allocates 56-byte animation wrapper and per-clip arrays, binds SDK animation; crossfade increment literal at 0x020882F8 is 410 fx12
- sub_2010AB4: attaches SDK animation to render object by category J/M/V and inserts into its animation list
- sub_2015274: NSBCA node-evaluation wrapper: clamps fx12 frame to [0, duration-1] and calls sub_2014C5C

## Drift particles / SPL resources (Codex; analysis/CODEX_PARTICLE_MAP.md)

- sub_20681F0: mini-turbo countersteer charge transitions: stage 2 blue flare 126 and SE 210; stage 3 switches wheel effects and starts red flares 22/23 when drift contact allows
- sub_208C5B8: gets the racer-indexed 136-byte wheel-particle controller
- sub_208C884: starts blue charge flare emitter 126 twice, one per rear wheel, after stopping prior flares
- sub_208CACC: starts red charge flares 22 and 23 at both rear wheels, resets red-flare timer
- sub_208D758: allocates per-racer wheel controllers: detailed smoke/red resources 20/17/18, low-detail CPU resources 21/19, red flares 22/23
- sub_208C520: enables continuous drift wheel effect and resets timer
- sub_208C534: disables drift wheel effect, stops/detaches active wheel emitters and invokes cleanup callback when active
- sub_208D650: stops and detaches the two continuous wheel emitters by setting emitter +36 bit 1
- sub_208B7BC: game particle factory: converts world position to SPL units with arithmetic right shift4, selects resource and spawns emitter; base[84] bit7 selects manager phase0, otherwise bit6 selects phase1, otherwise updates every manager frame (ported wrapper clock)
- sub_208B710: immediately destroys a game particle emitter via sub_20184E4
- sub_2018600: allocates and initializes SPL emitter from free pool, links active list; one-shot resource flag 0x4000 returns null despite successful creation
- sub_20184E4: recycles primary/child particles, unlinks emitter and returns it to free pool
- sub_2018A1C: SPA 1.2 resource loader: 88-byte emitter bases plus flag-selected blocks; TPS texture records traverse by record length at +28
- sub_2018D94: allocates SPL manager and emitter/particle pools (76/156/68-byte structures) and initializes free lists
- sub_2019B28: initializes emitter from resource and supplied position: rate, size, lifetime, frequency, opacity, texture parameters and other state
- sub_2019DF8: converts SPA texture flags to GX texture parameters; palette-zero transparency comes from resource flag bit 16
- sub_201873C: SPL manager activates emitters when age>=base start delay then resets age; simulation-pause bit2 skips updates, selector bits16..18 choose manager phase 0/1; manager advances phase after traversal. Recycles empty emitters only when stop bit0 is set or auto-expiry bit14 has a nonzero lifetime and age strictly exceeds it. Clock/cadence replay matches 1050 controlled original decisions, including 279 birth calls and 4 removals; pre-tick callback state is supplied separately
- sub_20192E0: emitter and particle simulation tick: spawn cadence, animated size/color/alpha/texture, behaviors, integration, death and child emission. Primary non-child tick now ported: life/repeat phase selection, follow-emitter bit15, ordered behaviors, wrapping32 drag multiply, parent translational velocity, polygon-ID allocation and strict age>lifetime expiry match 996 original updates across all eight drift resources; emitter scheduling and child emission remain separate
- sub_201CA6C: allocates primary particles from fractional fx12 emission-rate accumulator; point-emission birth port matches 280 original births and RNG states (details below); other emission shapes and pool exhaustion remain separate

## Fall contact provenance (Codex; C and ARM, 2026-10-08)

- sub_1FFA4B4: movement terrain contact query; passes the same accepted swept sphere flags to sub_206FF50 at 0x01FFA868..0x01FFA894; suppresses type 10 while wall-contact flag is set unless type 11 also hit
- sub_206FF50: handles accepted fall/cannon terrain contact; flags 0xC00 begin fall state, signed type-15 flag routes cannon/off-course handling; caller's second argument omitted by C cast but retained in ARM r1

## Map object framework and behaviours

- sub_20D4C28: object manager: calls the kind's +0x10 callback (draw) for each live instance
- sub_2046BE8: object state machine init (+0x80: table of (enter, update) pairs, count, owner)
- sub_2046BCC: object state machine: request a state (applied next tick)
- sub_2046B40: object state machine tick: runs a pending state's enter, then the update
- sub_20D7E44: builds a path's 84-byte Bezier segment records
- sub_20D80E4: one path segment: control points, curve and straight lengths and inverses
- sub_20D70AC: unit vector and rounded length with the hardware divider and sqrt
- sub_20D90A8: path follower start (point, direction)
- sub_20D8CC8: path follower advance (24-bit progress, carry, loop / turn back)
- sub_20D8A5C: follower position on the straight segment
- sub_20D8620: follower reverse
- sub_20D8CAC: follower fraction through the segment (0..4096)
- sub_20D7D4C: eased follower init (unit speed / 100, object speed)
- sub_20D859C: eased follower start with per-point speeds
- sub_20D84E4: eased follower advance (speed blends between point speeds)
- sub_20D8B88: follower x/z on the Bezier segment
- sub_20D9340: Bezier x/z from a segment and progress
- sub_20D9480: Bezier x/y/z from a segment and progress
- sub_20D9810: cubic Bernstein weights (24-bit)
- sub_20D7D18: single-segment curve build (wander curves)
- sub_20D7C84: single-segment curve advance to new points (carry)
- sub_20D849C: single-segment curve progress step
- sub_20D8474: single-segment curve x/z
- sub_20D22D0: the objects' random context (NitroSDK MATH_Rand32 at *0x0217B49C)
- sub_2061FA4: kart slot whose turn it is this tick (round robin)
- sub_207A974: kart struct by slot (0x5A8 bytes each from *0x0217ACF8)
- sub_206C0E0: kart cannot be targeted (damaged / invisible / respawning)
- sub_206A24C: flatten a kart (Thwomp): 600 ticks, pinned 150, size 0.7
- sub_2069F6C: flattened kart tick: squash, unpin, spring back (25 ticks)
- sub_20DB2B8: Thwomp init
- sub_20DB430: Thwomp start on its path
- sub_20DB760: Thwomp tick (shudder, hop, slam, wait, rise; glide)
- sub_20DB548: Thwomp class callback (star knock, crush handler 11 for karts below)
- sub_20D6DC0: handler table lookup for an explicit id group/index
- sub_20DC11C: path Chain Chomp init (0x1A5)
- sub_20DC1D8: chained Chain Chomp init (0x196)
- sub_20DBF7C: Chain Chomp reset to its stake
- sub_20DD27C: Chain Chomp tick (state machine, hop physics on plane or course)
- sub_20DD0D8: Chain Chomp state 0 enter (wander curve ahead)
- sub_20DCCC8: Chain Chomp state 0 wander (random points, lunge trigger)
- sub_20DCC0C: Chain Chomp state 1 enter (lunge)
- sub_20DC7C0: Chain Chomp state 1 lunge (chase predicted kart, chain limit)
- sub_20DC5DC: Chain Chomp state 3 enter
- sub_20DC474: Chain Chomp state 3 return toward the stake
- sub_20DC428: Chain Chomp state 5 enter (path)
- sub_20DC354: Chain Chomp state 5 path walk
- sub_20DC788: Chain Chomp state 2 enter (hit)
- sub_20DC608: Chain Chomp state 2 (hit jump)
- sub_20DA494: Goomba init
- sub_20DAF20: Goomba tick (step counter, state machine)
- sub_20DADFC: Goomba walking state (stepping gait along its path)
- sub_20DA73C: Goomba kart callback: own response 1 in state 0/1/5 queues state 2 and disables contact; response 0 adds 82*forwardSpeed>>12 spring velocity only from resting squash 4096/velocity 0; two normal contacts and one qualifying hit replayed exactly
- sub_20DAA10: Goomba state 5 spring-back: velocity += (4096-squash)>>3, decay by 3481/4096, add to squash; elapsed >60 queues walking state 0 on next tick; exact 600-update runtime replay
- sub_20DAB9C: Goomba state 3 compression: squash *=3481/4096; below 819 queues flat state 4 on next tick
- sub_20DAC00: Goomba state 2 initial stretch: squash *=4710/4096; above 6144 queues compression state 3 on next tick (earlier squash-only label hid this initial stretch)

## SPL particle channels and wheel attachment (Codex, 2026-10-08)

- sub_201DF30: signed fx12 particle scale envelope (rise/hold/fall); ported, matched original SPL captures
- sub_201DD64: BGR555 particle color envelope: start/base/end, optional per-channel integer interpolation; ported, matched original SPL captures
- sub_201DC88: particle opacity envelope and SPL RNG attenuation; preserves packed base-alpha/upper bits; C first-segment start is misleading, ARM confirms packed low five bits; ported and runtime matched
- sub_201DC24: particle texture sequence by phase/step; returns unchanged past sequence end rather than clamping; ported, matched blue flare 126 runtime captures
- sub_201E540: SPL random direction: three signed high-24-bit RNG draws then SDK vector normalization (C confirmed, not yet ported)
- sub_201E394: SPL constant acceleration behavior: adds three signed shorts to the tick acceleration accumulator
- sub_201E2CC: SPL random acceleration behavior: every configured particle-age interval draws independent signed perturbation per axis
- sub_201E248: SPL attraction acceleration toward target minus local position and velocity, scaled by signed fx12 strength
- sub_201E170: SPL rotates particle local position around selected coordinate axis using angle-indexed SDK rotation matrix
- sub_201E054: SPL horizontal plane behavior: emitter plane override or resource plane, kill or damped bounce on crossing, mode in low two flag bits
- sub_201DFC0: SPL converges particle local position toward target with rounded fx12 strength (direct position update)
- sub_208C6DC: attaches blue-flare pair to rear wheel positions/directions for eight ticks; pauses continuous wheel emitters meanwhile, destroys flares and resumes continuous emitters on tick nine. Timer and 16 emitter attachments match nine natural original callbacks; pause/resume flag actions source-derived, continuous emitter flags not included in this capture
- sub_208C930: attaches both red-flare pairs to rear wheel positions/directions for ten ticks, destroys them on tick eleven. Timer and 40 emitter attachments match eleven natural original callbacks
- sub_208CB8C: continuous red drift-wheel lifecycle now ported: pending switch increments unsigned +98 only while kart+68 bit0x08 (drifting), activates on update11; signed shutdown +48 runs regardless of drift and clears pending switch on update11. Active controller attaches then resumes births on kart bit0x10 (grounded) unless shutting down, otherwise pauses births. All 645 natural and 645 controlled airborne-probe clocks/callback orders/emitter flags match; correction: bit0x08 is drift, not ground
- sub_208C5D0: resets wheel particle controller: detaches continuous effects, destroys red/blue flares, clears timers and callbacks' active state
- sub_208CCF0: clears continuous wheel effect via cleanup callback and resets activation/expiry timers
- sub_208D1EC: clears active continuous wheel effect via cleanup callback and resets timers only when active

## NPC and traffic presentation (Codex; 2026-10-08)

- sub_20DB050: Goomba draw: texture-pattern frame is step counter 0..19; counters >=20 mirror X and subtract 20; squash scales Y and widens X; native gait presentation now uses the simulation counter
- sub_20DA384: Goomba renderer loader: loads three shared resources into object-manager slots +372/+376/+380, after common render setup
- sub_20E20A8: traffic renderer setup: loads body, tire, shadow and pattern resources; binds per-body texture-pattern wrappers and configures material rendering
- sub_20E2A74: traffic draw: publishes body pattern frame from object +304, draws body/shadow and separate tire model twice with mirrored axle offset; tire angle from +268
- sub_20E2630: traffic tick includes orientation easing and tire angle +268 increment of 1536 units each tick; normal driving matches 899 original bus transitions; hit flight/rebound/recovery additionally matches 300 controlled original bus updates
- sub_20E1E98: traffic path/reset setup: initializes travel direction, heading quaternion, transform, timers and surface-effect state
- sub_20E1F54: traffic init: type record at object +340; render width +256, height +260 and axle spacing +264 (translations shifted >>4), tire scale +272; scale-adjusted values +276..288 are collision extents, not tire transforms; setting 1 selects body pattern +304
- sub_2147230: SDK X-axis 4x3 rotation matrix constructor: rows [4096,0,0], [0,cos,sin], [0,-sin,cos], zero translation; traffic overrides X scale and Y/Z translation for the two axle draws
- sub_20E230C: traffic route preprocessing: visits each used route once, converts signed path-point setting +14 into turn/easing parameter +18, clears +14, and assigns each traffic object an index at +212
- sub_20D79B0: combines terrain tilt quaternion's X/Z/W with half-angle XZ heading; traffic heading helper verified as part of all 899 bus orientation transitions
- sub_20D759C: sign-corrected per-component quaternion easing (negates target if dot product is negative), without normalization; traffic helper matches 899 original bus transitions with recorded tilt/yaw/rate inputs
- sub_1FF9490: SDK scale-only texture matrix: S/T diagonal from scale, S offset zero, T offset height*(1-scaleT) in texel space; missing T-origin compensation caused duplicated half-wheel textures in native traffic
- sub_1FF96CC: SDK scale+translation texture matrix: S offset -width*scaleS*translateS, T offset height*(1-scaleT+scaleT*translateT); resource translations are normalized Maya coordinates, not texels
- sub_20D7B88: traffic terrain tilt: denominator FX_Sqrt(2*(normalY+4096)); quaternion [FX_Div(normalZ,denominator),0,FX_Div(-normalX,denominator),denominator/2]; native KCL probe plus tilt/heading/easing/body matrix matches all 899 bus transitions
- sub_2061F90: returns shared update slot at scheduler +12; traffic samples its floor normal only when slot equals instance index +212 modulo eight (collision flight bypasses staggering)
- sub_20D8B18: initializes curved-path position/velocity via sub_20D9270, negates X/Z velocity when following backward; traffic uses this derivative to initialize heading
- sub_20D9270: curved-path initialization: evaluates cubic Bernstein position and derivative weights, multiplies X/Z derivative by follower step in fx24
- sub_20D970C: computes cubic Bernstein position and derivative weights in fx24 for initial curved-path velocity
- sub_1FFCCD0: quaternion-to-3x3 basis with truncated products shifted by 11; preserves unnormalized easing contraction; traffic renderer now applies this affine basis to body/axle globals and collider axes
- sub_2062464: race scheduler update: derives shared eight-slot terrain-probe phase (+12) from race tick counter (+4 & 7), parity at +16 and kart round-robin index at +20; some race states freeze tick advancement

## Traffic hit and recovery (Codex, 2026-10-08)

- sub_20E24D0: traffic own-object hit: project object-minus-hitter onto right/forward basis, choose signed 2:1 lateral/longitudinal tilt and height-dependent up component, SDK-normalize, convert to tilt quaternion; set easing 900, add 28672 upward velocity (retain positive Y only when timer <=15), set bounce bit and timer 20; exact original hit capture replayed
- sub_20E246C: traffic item-hit callback: own-reaction byte 1 invokes sub_20E24D0 with item position +80, returns kart/item response byte; item dispatch is not yet wired natively
- sub_20E2494: traffic kart-hit callback: own-reaction byte 1 invokes sub_20E24D0 with kart position +128, then collision sound helper sub_20D26F8; native Star/shrunk overlaps now invoke the hit physics
- sub_20D6BE0: separate own-object reaction table 0216B9AC and kart response table 0216B94C; traffic own modes [normal,Star,mega,shrunk]=[0,1,0,1]; object flag 0800 suppresses own responses other than 2/4, flag 0080 bypasses dynamic callback; decompiler omits callback args holding response-byte pointers
- sub_20E2630: traffic flight uses timer >15, gravity 1434 and path X/Z; probes every flight tick at Y+61440; first floor landing rebounds by 1843+(height-81920)/512 and reverses/eases impact tilt, second sets timer 15 and Y velocity zero; following 15 updates restore normal easing; all 300 original bus updates reproduced including full basis
- sub_20D2668: object sound-context selection wrapper around sub_2024A28 when class sound entry is enabled; not the own-object reaction dispatcher (earlier project notes attributed reactions here incorrectly)
- sub_20D26F8: traffic crash sound 232 for kart mode 1 or 3; physics kick itself is dispatched separately through sub_20E2494
- sub_20E2400: traffic custom contact callback passes scale-adjusted extents +276/+280/+284 and secondary extents [+276,0,+288] plus object basis to sub_20EAFC4; native traffic now uses this exact contact test; scaled extents and all 293 original bus/car/truck callback results match

## Goomba squash dispatcher (Codex, 2026-10-08)

- sub_2046B40: shared state dispatcher: consume pending transition, reset elapsed ticks, run new entry and update in same call, then increment elapsed; Goomba timing matches all 600 captured updates
- sub_20DAB2C: Goomba flat state 4: respawning objects queue state 5 when elapsed >300 (302 update calls); one-shot objects decrement draw alpha +256 and remove at zero
- sub_20DAAA0: Goomba spring-back state 5 entry: plays recovery sound, clears collision-disabled bit 0, zeroes squash velocity without restoring squash height
- sub_20DAC58: Goomba stretch state 2 entry sets collision-disabled bit 0
- sub_20DAF0C: Goomba walking state 0 entry restores squash 4096 and spring velocity zero
- sub_20DADE8: airborne Goomba state 1 entry restores squash 4096 and spring velocity zero
- sub_20DADFC: Goomba walking update: advances follower only during gait 10..19/30..39, updates curved position, applies 1/8 restoring spring with 3481/4096 damping; snaps to squash 4096/velocity zero inside strict +/-41 windows
- sub_20DA684: Goomba item callback: qualifying own response in state 0/1/5 queues squash, consumes/marks the hitting item via sub_20F8DDC and drops a mushroom using that item velocity; ordinary response initializes spring velocity from a literal only at rest; native item dispatch remains pending
- sub_20DA820: Goomba mushroom pickup drop (corrected from debris): map setting 1 low half zero enables it; projects hitter XZ velocity perpendicular to the path, normalizes, allocates item type 3 with owner 8, offsets spawn by the initial launch velocity, then uses shared item launch sub_20F6630. normal-race native drop implemented; launch plus all 538 original item ticks match for flight/growth/landing/spring

- sub_1FFF95C: generic item tick (actor in r1), clears transient flags, increments airborne counters, runs size growth and callback then collision/postupdate bookkeeping, saves previous position and increments age; export is truncated at ITCM jumpout, ARM continuation required; mushroom replay matches 538 calls
- sub_20F6630: shared item launch removes up component of velocity, appends clamped nonnegative hitter up speed plus 10240 for pickup-flight types or 14336 for vanishing types; chooses flight/wall callbacks by item type registry +128 and battle/actor flags
- sub_20F63CC: launched pickup flight: position += velocity, damp only X/Z by 4076/4096, primary KCL query 0x44, shared floor/side-wall responses, gravity 901 with fall cap -40960, settle on confirmed floor; mushroom static-course trajectory replay matches
- sub_20F6388: launched pickup wall callback reflects velocity and on first wall sets flag 0x1000000 while zeroing orientation/anchor vector +264..272
- sub_20F5040: mushroom item initialization enables draw field +308 = 1
- sub_20F5008: mushroom item draw gated by +308, delegates to shared billboard/model helper sub_20ED5C0
- sub_20ED5C0: shared item draw with alpha +216 and animated scale +104..112; floor normal Y <4014 or actor flag 0x80 selects normal/camera cross-product billboard basis, otherwise shared camera billboard with translated position
- sub_20FA0B8: grows item target size +112 by supplied step, clamps to supplied target and returns whether it changed
- sub_20FA030: copies target size to both visible scale axes, updates course/hit radii from item-type multipliers, marks resized flag 0x40 and updates broadphase radius
- sub_20F9DC8: shared item scale spring: stiffness819, damping3072, strict +/-41 deadzone, squash = 2*target - size, updates collision radii when changing; all mushroom landing spring ticks match original
- sub_20D5BF0: rolling rock / snowball init (speed, bounce, growth, max size, restart delay from settings)
- sub_20D5DD0: rolling rock restart at its path start (hidden for the delay)
- sub_20D5FB4: rolling rock tick (eased path walk, gravity, bounce with sideways kick, growth, burst at the end)
- sub_20D634C: rolling rock burst (effects 84..87) and restart
- sub_20D8654: table of horizontal directions across each path segment
- sub_20D91DC: path position: Bezier x/z, straight y between the segment's ends
- sub_20D8BC0: follower position via sub_20D91DC
- sub_20DFD64: Bowser's Castle sliding block init (top speed setting 0 x 4096 / 100)
- sub_20E01F0: sliding block tick (waits at points, state machine for the speed curve)
- sub_20E012C: sliding block state 0: speed up on a sine over the first 1/16
- sub_20E005C: sliding block state 1: cruise, brake before a stop
- sub_20DFFAC: sliding block state 2: slow down on a sine
- sub_209A7DC: crab tick (pause 30..90 random ticks, walk the path at 0.5, knocked / rising states)
- sub_209AF98: crab init (random first pause)
- sub_20A73B0: Pokey walk (stops at points, turns back at path ends; speed setting 0 x 4096 / 100)
- sub_20D21EC: loads MapObj/<name> from the course archive
- sub_20D2210: loads MapObj/<name> from the course texture archive

## Items: star (Lane C)

Kart +76 (0x4C) bit 0x40 = star, 0x10000000 = Bullet Bill active; mask 0x10000040 refuses hits. Lightning's shrink is +76 bit 0x80. Kart +668 = mode (0 none, 1 star, 2 Boo, 3 Bullet Bill). +124 bit 0x2000 = Boo (ghost) active. Star timer = u16 at kart +0x53E (+0x538+6).

- sub_2069C38: star on (skipped if kart +76 bit 0x10000000, i.e. a kart under Bullet Bill cannot start a star): ends a running Boo (clears +124 bits 0x2000/0xC000, +668, +76 bits 0x08000000/0x20000; SE 249 for the local player or stops mega particles via sub_208C5B8/sub_208C4E8; sub_210FA40(0,..)), sets +76 bit 0x40, +668 = 1, star timer = 0, sub_207B284, sub_2081A40, starts the star jingle (sub_2106E78, local player, once) and sub_2068A64(kart, 2, 1) (driver star pose)
- sub_1FFB130: (kart per-tick, ITCM) while +76 bit 0x40: sub_208181C follows the star sparkle particles, holds driver animation 2, counts the star timer and ends the star when it exceeds 450 (dword_1FFB908), i.e. 451 ticks: clears bit 0x40, sub_207B1A8, +668 = 0, sub_20817B8, sub_2068A64(kart,0,1), stops the jingle (sub_2106DC8, local player)
- sub_208181C: per-tick position/scale update of the 3 star sparkle particle objects around the kart
- sub_206DE18: star touch (a1 = star kart, a2 = victim, a3 = direction): victim is blown away (sub_206ADD0 mode 1, SE 232) unless victim +76 has 0x400000 or mask 0x10000040 (star/bullet); local player victims also need +384 == 0 and +72 & 0x1800 == 0; other karts +384 in 0..2; sets item-HUD bits (+1300 -> +44) per victim index
- sub_206B4D0 / sub_206BCB0 / sub_206BAB8: item-hit entry points (tumble / spin 1-2 / other); all refuse when +76 & 0x10000040 or 0x400000
- sub_206A624: lightning strike on a kart; refused if +76 & 0x10000040 (star or bullet), +124 & 0x402000 or +72 & 0x10040
- sub_206D18C: touching an item object: dispatches on object type (v2[17]): 0,1,7 tumble, 2 spin(1), 3 mushroom (boost 90, shove 0x100000), 4 star on (sub_2069C38), 6 lightning, 5/9 spin(2) or sub_206BAB8; plays SE 233 once per kart when the target is star/bullet (deflected)
- sub_20695C4: Bullet Bill on (kart +668 = 3, sets +76 bit 0x10000000); also ends a star/Boo in progress
- sub_2069AA0: Boo on (+668 = 2, +124 bit 0x2000); ends a star in progress
- sub_2072930: full effect reset (respawn/finish): ends star, Boo and Bullet states
- sub_20E2F0C: Monty Mole init (hole 18 below, bottom 24 below; hide times from setting 0)
- sub_20E3584: Monty Mole state 0 (hidden, first wait)
- sub_20E34F8: Monty Mole state 1 (peek up 1/tick to 17.1)
- sub_20E34D0: Monty Mole state 2 (hold 20 ticks)
- sub_20E3414: Monty Mole state 3 (duck back)
- sub_20E337C: Monty Mole state 4 (jump 18432, gravity 614)
- sub_20E331C: Monty Mole state 5 (hidden, wait)
- sub_20E38A0: Delfino drawbridge (0xCC) init (amp = deg*65536/360/2, step = 65536/ticks/2, waits from settings 1)
- sub_20E3BC0: Delfino drawbridge tick (phase eased angle, wait timer at phase 0x4000 / 0xC000, angle at +0x154)
- sub_20E3A7C: Delfino drawbridge model/resource load
- sub_20E3AF0: object-id test (id == 204, the drawbridge)
- sub_20E3B08: drawbridge deck angle getter (+0x154 >> 12, whole degrees)
- sub_20E3B28: drawbridge object create wrapper
- sub_20E3B4C: drawbridge collision-transform update (copies pos>>4, publishes angle +0x154)
- sub_20E3DEC: drawbridge static allocation/setup


## SPL particle motion (Codex, Lane B, 2026-10-08)
- sub_201E394: SPL constant acceleration: adds three signed-short components directly to tick acceleration; controlled original resource replay matches all captured calls
- sub_201E2CC: SPL periodic random acceleration: only age modulo interval zero draws RNG three times, each impulse is (strength*(state>>23) - (strength<<8))>>8; inactive ticks preserve RNG; runtime replay matches
- sub_201E170: SPL local-position rotation about selected X/Y/Z axis, angle quantized by >>4 SDK sine/cosine table; truncated matrix-vector products; runtime replay matches
- sub_201E248: SPL attraction adds strength*(target-localPosition-velocity)>>12 to acceleration; ARM MUL confirms product wraps to 32 bits before shift (not 64-bit fx12 multiplication); source-derived, no runtime capture yet
- sub_201E054: SPL plane behavior uses emitter +116 override unless INT_MIN, strict crossing against emitter Y plus local Y; mode0 sets age to lifetime, mode1 clamps Y and negates rounded damped Y velocity; source-derived, no runtime capture yet
- sub_201DFC0: SPL rounded convergence changes local position toward target by signed-short strength, with +2048 rounding; leaves velocity and acceleration unchanged; source-derived, no runtime capture yet
- sub_2093CF4: Bullet Bill launcher (0x1A1) tick: state 0 wait (+0xA0, then speed 0x2000), 1 walk the straightened path (sub_20D8CC8, sub_20D879C), 2 wait 45+1, 3 fire a bullet (sub_20937C4) and wait 75; ported in vm_model/src/mapobj/airship.rs
- sub_2093FA4: launcher init: follower start (sub_20D7DA8) and straighten all segments (sub_20D7D80: length/inverse := straight ones)
- sub_20937C4: spawns a Bullet Bill (0x1A2) at the launcher +42 units, velocity = facing (+0x40) x 6, life 600
- sub_2093910: Bullet Bill (0x1A2) tick: life countdown, moves by velocity; knocked down (+0xA4 = 1) it falls (-1024 a tick); deleted when life runs out
- sub_2093B7C: Bullet Bill kart-hit handler: life 120, state 1, velocity / 4, y velocity 0x4000
- sub_2093270: sliding hazard (0x1A4) tick (not growth/shrink only): states 0..3 open/close cycle, state 4 follows its path (sub_20D8CC8, sub_20D8A5C) hanging 80 x scale below it; animation clock +0xA4 mod frame count
- sub_2093484: 0x1A4 init-all: path follower from settings (speed = setting1.hi x 4096 / 100), picks state 4 when settings word 0 and word1.lo are zero
- sub_2095FEC: Rocky Wrench hatch (0x1A7) tick: six-state cycle rise/offset (+0xA0/+0xA4), timer +0xAC, state +0xB0, random waits; ported in airship.rs
- sub_20968F4: 0x1A7 init-all: scale 4096, timer = setting0 +- 30 random, state 0, rise 0x2000


## SPL point particle birth (Codex, Lane B)
- sub_201CA6C: primary SPL birth consumes rate+fraction, retains low12 fraction; point-emitter branch now ported for all eight drift/wheel resources. Speed RNG draws precede random unit-vector generation; randomized size/color/angle/lifetime/texture/repeat phase follow in original order. All 280 captured particles match initialized fields and final RNG; non-point shapes and pool exhaustion remain separate
- sub_201E540: SPL random unit vector: three RNG states cast signed then shifted right8, followed by SDK hardware normalize; confirmed through all 280 point-particle births
- sub_20831BC: kart wheel emitter pre-tick callback: birth pause from sub_20675B4 and kart+676 threshold; optional byte timer stops at10; attaches direction/position from 88-byte wheel record and sets initial particle velocity from kart+944 vector times emitter-specific table factor. Captured callback changes scheduling flags before SPL birth tests; this callback itself is not yet ported
- sub_2081E5C: kart attached transient emitter pre-tick callback: attaches kart+1288 XYZ shifted right4 plus resource offset; byte+154 advances to byte+153 limit, then sets emitter stop bit0. Controlled trace confirms callback can stop emission before the manager's birth test; callback arithmetic not yet replay-ported
- sub_2083680: kart emitter pre-tick callback: stops on sub_2061818 or paused age>5; otherwise pauses when kart+72 lacks bit0x20, attaches to camera-facing offset and negates direction shorts. Retained by resource-selection experiment; full callback not ported
- sub_208C520: marks continuous-wheel switch pending and resets unsigned switch timer +98; existing handles stay alive until eleven drifting controller updates (ported request_switch)
- sub_208C534: stops wheel smoke pair by setting emitter stop bit0 and dropping handles; active continuous controller invokes +120 callback then sets shutdown pending +52, clears switch timer/request. Detailed +120 pauses continuous births for delayed removal; low-detail +120 removes pair and clears clocks immediately before caller sets pending (continuous request ported, smoke handle ownership separate)
- sub_208CCF0: immediate continuous-wheel reset: invokes remove callback if active, clears active/delay/switch fields (ported reset)
- sub_208D3D8 / sub_208D3A8: detailed/low-detail continuous-wheel birth-pause callbacks: set emitter flag bit1 on four/two continuous emitters; detailed flag outputs replay-confirmed in four airborne probe calls
- sub_208D358 / sub_208D328: detailed/low-detail continuous-wheel birth-resume callbacks: clear emitter flag bit1 on four/two continuous emitters; detailed outputs replay-confirmed in natural/probe controller traces
- sub_208D1EC: low-detail stop-request callback: if continuous active, invokes remove callback and clears continuous active/delay/switch clocks; differs from detailed pause-only callback sub_208D234 (source-derived)
- sub_201E448: SPL list pop-head: returns null without changing an empty list, otherwise updates head/previous link and clears tail on last removal, decrements count. Ordering replay-confirmed as part of 1396 original list operations, including 20 empty allocations
- sub_201E494: SPL list push-head: prepends node, sets old-head previous link; empty list sets both head and tail; increments count. New particles update before older particles and recycled slots are allocated first; replay-confirmed in 688 original pushes
- sub_201E3C8: SPL list remove-node: handles head/middle/tail/sole-node removal and decrements count without reordering survivors; all 343 recorded removes match stable slot/list identities and headers
- sub_2018D94: SPL manager constructor: allocates/zeros 76-byte manager, initializes polygon min/max/current/fixed IDs, then zeros 156-byte emitter slots and 68-byte particle slots and head-inserts each in ascending address order. Highest-address slot allocated first; primary pool constructor ported; initial zero-fill/order source-derived
- sub_20184E4: immediate emitter cancellation: repeatedly pops primary then child list heads into shared free-particle head, removes emitter from active list and pushes it onto free-emitter head. Primary cancellation pool ported; reversal and later reuse ordering confirmed through natural list-operation replay; child particle arithmetic remains unsupported
- sub_2019B28: initializes emitter from 88-byte SPA base: position offset, signed-short direction, speed/size/lifetime/rate controls, opacity, zero age/fraction/velocity, INT_MIN plane override and texture repeat; point-birth field subset ported

- sub_201C09C: SPL primary camera-facing billboard draw; native row-vector fx12 matrix port matches captured original drift smoke calls (part of 721 draw replay calls)
- sub_201B560: SPL primary velocity-aligned billboard draw; camera-forward cross product selects screen side, view-aligned speed stretch uses separately rounded dot terms; original drift flare matrix/quad inputs replay-confirmed
- sub_201A364: SPL primary velocity-oriented world quad draw; builds cross-product basis and resource-selected rotation, scales then supplies view LOAD/local MULT; original drift spark local matrices/quad inputs replay-confirmed
- sub_201C690 / sub_201C5D4: SPL XY/XZ quad emitters: signed16 offset corners quantized into VTX10, four tiled UV corners; XY helper arguments replay-confirmed; XZ path and GPU vertex packing source-derived
- sub_201C4E8 / sub_201C528: SPL world-particle Y-axis / diagonal-axis rotation builders; Y-axis matrix order replay-confirmed; diagonal-axis constants1365/2365 source-derived and not exercised by drift resources
- sub_2019DF8: SPL binds particle texture and texture-size scaling matrix (texgen mode1); normalized quad UVs become texel coordinates; source-derived native texture bridge
- sub_201C74C: SPL child birth from a primary particle into an allocated recycled slot: copied relative/emitter positions, rounded64 inherited velocity plus three signed random draws, wrapping32 scaled size, inherited effective opacity, optional child color, rotation modes 0..2 and untouched recycled angles for mode3. Child life comes from optional record; animation steps divide by parent life (SDK numerator fallback at zero). Ported in nitro_particle_child.rs; 40 controlled original births across all four rotation modes match every modeled field and RNG. Pool/cadence, updates, drawing and native integration remain separate.
- sub_2084478: rear-wheel particle contact/direction update: ignores wheel Y, offsets X outward by +6144/-6144, scales X/Z, transforms by kart second matrix then position >>4; spray vectors (+/-1843,3277,-1843). Both contacts/directions match all 645 natural original calls
- sub_208D4C4: wheel smoke attach: initial SPL velocity=kart+944 displacement times2867 truncated fx12; emitter position=wheel minus velocity plus resource offset; grounded bit0x10 clears birth pause, airborne sets pause. Position/velocity match 100 original wheel records; pause flag handling source-derived
- sub_1FF9B70: runs continuous/smoke/red/blue wheel callbacks before refreshing previous SPL velocity at kart+944; refresh copies velocity+164, subtracts vertical speed+608 when grounded and not resting (bit0x1000 clear), then >>4. Native bridge preserves previous-tick attachment input; source-derived call order

- sub_206C5E4: successful grounded drift activation resets continuous-wheel controller via sub_208CCF0 before starting smoke via sub_208D6B0; native DriftStarted now preserves this cleanup order, including a new drift during delayed red-effect shutdown (source-derived wiring)
- sub_206C494: A+B low-speed pivot branch (velocity magnitude below6144) also starts grounded wheel smoke if absent, resetting continuous controller first; direction chooses +/-500 yaw adjustment. Native steering pivot is ported, but pivot-only wheel smoke remains outside the new drift-effects bridge

- sub_1FFC6C0: kart control dispatcher invokes sub_206C494 only when damage state+384 is zero and drift bit0x08 is clear, then steering/sub_206C5E4/acceleration. Native pivot-smoke gate now runs after input but before control and uses the same undamaged/non-drift guards
- sub_206C494: native pivot-smoke wiring now implemented at pre-control velocity magnitude below6144 with both pedals held; creates smoke only when grounded and not already active, preserves handles while airborne in pivot branch, stops births when pivot condition fails. Reset/attachment arithmetic uses already verified wheel modules; lifecycle gate source-derived

- sub_206C494: pivot wheel-smoke start/keep/stop gate and resulting smoke-active handle state replay-confirmed across3993 original calls with A+B pivot followed by acceleration/drift; pre-control native bridge uses this tested predicate. Native renderer currently assumes effects permitted (+76 bit0x8000); visibility-based original suppression remains unported

- sub_206BF88: damage HitReset also stops wheel smoke and requests continuous red cleanup via sub_208C534, after clearing drift state. Native effects now observe new damage states because HitReset clears drift without emitting DriftEnded; prevents red emitters surviving a hit indefinitely (source-derived bridge)

- sub_201C4E8: builds row-vector fx12 Y-axis rotation from sine/cosine into a3; used by the drift world-quads' selector0. Matrix order/output replay-confirmed within721 original draw calls
- sub_201C528: builds row-vector fx12 rotation about diagonal axis(1,1,1), using1365=1/3 and2365=1/sqrt3 approximations; source-derived selector1, not exercised by current drift resources. Corrects earlier generic annotation calling it a texture-center rotation
- sub_201C690: emits an XY QUADS primitive with signed16 offset +/-4096 corners quantized into VTX10 and four tiled UV corners. All721 drift captures verify its arguments; GPU vertex/UV command packing source-derived
- sub_201C5D4: emits an XZ QUADS primitive with signed16 offset +/-4096 corners quantized into VTX10 and four tiled UV corners. Source-derived; current drift capture exercises XY only, not this helper
- sub_208C6DC: blue flare attaches for8 ticks then cancels on9; its pause/resume target is the SMOKE pair at controller+0/+4 when smoke-active+60, not the red continuous list at+16/+24 (active+56). Native bridge passes smoke-active to the transient clock; pause/resume flags source-derived, timers/16 attachments replay-confirmed

- sub_207F6F0: CPU route-following update: on the racer round-robin turn projects target minus kart position onto kart-up plane using rounded SDK dot then truncated scale, takes truncated cross/dot against facing or body-forward, SDK quantized atan2 and rounded fx12 radians-to-degrees constant0x394BB834C8, stores absolute heading error at driver+112. Kart+68 bit0x2000 recenters target via sub_207E7F0 before calculation; separately advances reached route nodes and applies drift hints. Rust floating-point angle replaced with original integer pipeline; numeric replay fixtures cover Figure-8 and Rainbow Road
- sub_207F8F8: main CPU driving-state update: refreshes driver state, selects facing kart+80 when driver drift-state+144 equals2 or body-forward+312 otherwise, obtains tracked kart position, invokes sub_207F6F0, presses accelerator and yaw-steers through sub_1FFD224 when damage-state+384 is clear, then updates drift buttons and item-target selection
- sub_2063B30: copies kart-up vector from kart+300/+304/+308 into caller output; yaw steering sub_1FFD224 uses this same up vector to project its target and choose cross-product turn sign

- sub_207F6F0: heading-error integer pipeline replay-confirmed against3500 original calls (875 Figure-8,2625 Rainbow Road including inverted track with upY=-4093); floating atan2 differed on3499. Capture records target after reset recentering. Native seed1 sweep has five falls before/six after; angle parity does not establish spiral-fall resolution

- sub_207E668: CPU wall-stall recovery timer: kart flags+68 mask0xC0 and speed+676 below12288 refresh signed16 contact latch+172 to10; otherwise decrements latch. Active latch advances unsigned16 counter+120 to limit+122; no active latch resets state+168=0,counter0,limit20. Transitions0->1(limit120),1->2(limit180, previous-node target),2->3(limit180, area-selected recovery target),3->4(kart callback); mode2 skips state2. Timer fields replay-confirmed in7000 calls,6782 natural state0 calls plus218 labeled state0 probes (78 transitions0->1). Later callbacks/mode2 are source-derived, not runtime replay-covered; native wiring pending
- sub_2080AC0: if route-cursor override+20 is null, latches previous-node pointer+4 into override+20 and clears override-progress+24. CPU recovery state2 thereby targets its predecessor; does not reverse or swap the route graph
- sub_208C1F4: recovery callback thunk via runtime slot0x0217B050, pointing to sub_208C050 in the local Figure-8 race-start RAM dump; C omits forwarded argument, caller passes kart+784 controller. Target-selection side effects remain source-derived
- sub_208C050: recovery target controller lazily calls sub_2041588(kart position+128) if target+28 is absent or active+32 is clear; stores returned record pointer at+28 and marks+32=1 only when non-null
- sub_208C1D0: route position/direction thunk through runtime slot0x0217B044, pointing to sub_208C000 in Figure-8 race-start dump; caller arguments are forwarded despite no-argument C cast
- sub_208C000: copies current CPU cursor node position via driver+8/node+24 into first output and segment direction driver+16/+20/+24 into second; these drive steering-recovery state1 calculations
- sub_20D6BE0: kart-object dispatch; own-reaction table 0x0216B9AC (now ported as obj_collision::own_reaction), kart handler table 0x0216B94C; flag 0x800 keeps only own codes 2/4
- sub_20E311C: Monty Mole kart callback: code 1 (star) -> state 6 knocked up 0x4000 rolling, code 2 -> state 7 (unless ghost racer, race config +112 == 2)
- sub_20E32A4: Monty state 6 update: roll +-1024, vy -= 1024, below bottom -> state 5
- sub_20E3238: Monty state 7 update: vy -= 614, below bottom -> state 5, roll +-1024
- sub_20E3300: Monty state 6 enter: no-contact flag
- sub_20E3538: Monty state 1 enter: back to the hole, roll reset
- sub_20E66E4: object draw with a roll about the model's z (MTX_RotZ from the u16 angle)
- sub_20EC854: knock-away init (+0xA0 bottom, +0xA4 gravity, +0xA8 side, +0xAC roll, +0xAE roll speed, +0xB0 rise, +0xB4 speed)
- sub_20EC6E4: knock-away launch: sideways off the kart's facing (+0x50) on the side it passed, plus half the kart velocity, rise up
- sub_20EC7E8: knock-away step: roll, gravity, move; true once below bottom
- sub_20EC884: shared knock state machine init (3 states: stand, knocked sub_20EC504/sub_20EC490, removed sub_20EC484)
- sub_20EC504: knocked state enter: no-contact flag, drop shadow
- sub_20EC490: knocked state update: step, below bottom -> state 2 (removed)
- sub_20EC450: shared knock kart callback: code 1 -> launch + state 1 (Piranha Plant)
- sub_20E5AEC: Piranha Plant init: raise 10*scale, knock (bottom -24, gravity 0x400, roll 0x800, rise 0x4000, speed 0x1800)
- sub_20E4934: Cheep Cheep kart callback: code 1 -> launch + state 1
- sub_20E4AB4: Cheep state 1 enter: no-contact flag
- sub_20E4A68: Cheep state 1 update: knocked flight; below bottom: removed if NKM setting0 lo set, else state 2
- sub_20E4A34: Cheep state 2 enter: hidden, no contact
- sub_20E4A18: Cheep state 2 update: after 300 ticks -> state 3
- sub_20E49C0: Cheep state 3 enter: back to home x/z, rise 0x3199, flags cleared
- sub_20E4990: Cheep state 3 update: rise until above home -> state 0
- sub_20E4DEC: Cheep state 0 enter: roll reset
- sub_20DD230: Chain Chomp kart callback: code 1 -> state 2 unless already in 2 with vy >= 0x4000
- sub_20DC788: Chomp state 2 enter: pitch 0xD000, slerp rate 0x1C2, vy 0x8000
- sub_20DC608: Chomp state 2 update: path Chomp walks, vy -= 614 for 40 ticks then pitch += 512, past 0x10555 -> state 5; chained: pitch += 256 after 120 ticks -> state 3
- sub_20DC428: Chomp state 5 enter: pitch 0x555, slerp rate 0x1C2
- sub_20D5F8C: rock kart callback: code 1 (star) bursts and restarts it (sub_20D634C)
- sub_20D5DD0: rock (re)start: back to path start, hidden for the restart delay, vy 0x8000, size reset
- sub_2093B7C: Bullet Bill kart callback: code 1 (star) -> knocked down: 120 ticks falling, velocity / 4, up 4, no contact
- sub_20A9DE4: iron ball kart callback: code 1 (star) -> vertical speed 40960 (+0xC0), kart reaction 0
- sub_209B344: crab kart callback: code 1 -> sub_209B388 with kart position, travel (+0x68), velocity
- sub_209B388: crab knocked flying: 1.5 units sideways off the kart's travel (side by cross sign), + half kart velocity, up 4, roll 0x71C/-0x71C, 300 ticks, state 2
- sub_209A7DC: crab tick: 0 wait (idle clock), 1 walk, 2 flying (gravity 1024, roll; timeout -> path start, 5 units under spawn y, wobble start), 3 rising 512 a tick to spawn y -> wait (rng) state 0
- sub_20A7FC4: Pokey kart callback: code 1 -> sub_20A8098 + no-contact flags; else the bump sound and 60-tick cooldown
- sub_20A8098: Pokey knocked apart: each segment flies 2 units in a random direction (rng angle), up 4, spin +-0xAAB (rng), 300-tick timer, state 2
- sub_20A73B0: Pokey tick: walk; state 2 segments fly while y > 0 (gravity 1024), spin; unless setting0 hi, after 300 ticks state 3 regrows segments one by one (scale +205) up to 4
- sub_2091828: snowman kart callback: code 1 -> head thrown up (0xF333, 0x8000), body scales 0, no contact, state 1
- sub_20917D0: snowman item callback: same knock as sub_2091828
- sub_20912A0: snowman tick: 0 sway; 1 head flies (gravity 1024, min -24576) to the ground (2*scale), or removed below 0 if setting0 lo > 0; 2 lies 299 ticks; 3 head rises back while body regrows (64 a tick after 10), contact back -> 0
- sub_209151C: snowman init: scales 4096, head rest 0xF333*scale, floor 2*scale
- sub_20915C0: snowman body draw (sman_bottom, billboard, scale +0xB4)
- sub_20916A0: snowman head draw (sman_top, billboard, raised +0xB8, z sway +0xA4)
- sub_20FFB1C: pinball drum (0xD2) init: speeds s0lo*128/100, s2lo*128/100 and their mean, timings s0hi/s1lo/s1hi; 6 states (visual spinner)

- sub_1FFD224: CPU recovery-state1 correction projects segment direction onto kart-up plane (rounded dot/truncated scale), requires body-forward dot above-819, then crosses world-Y-zeroed kart-minus-node with projected direction and turns200 angle units by kart-up dot sign. All863 labeled state1 steering probes match; current recording exercises correction branch only, fallback is source-derived. Native driver now applies this ahead of normal heading steering
- sub_2041588: CPU recovery node selector scans AREA records in order for kind4, tests box or cylinder bounds, and returns runtime CPU route node at40*AREA.s16(+64); requires nonzero recovery-area count+258. Controlled state2 callbacks match218 selections (130 targets/88 misses) using12 original box volumes retyped as kind4 with node indices0..11; not a natural recovery race. Native reads72-byte AREA entries and consumes first matching valid node
- sub_2041A70: inclusive AREA box test: rounded dot against Y-axis must be0..100*scaleY; X/Z rounded projections within +/-50*scaleX/Z. Matches box selection inside218 controlled callback probes. Cylinder branch in sub_2041588 uses50*scaleY upper bound without a lower check and separately rounded squares after >>4; cylinder path source-derived, not captured
- sub_208C050: native recovery callback now selects AREA kind4 CPU node, replacing an inactive predecessor override or preserving an already-active area target; node selection and active latch match218 controlled original callbacks
- sub_2063A68: final CPU recovery callback invokes kart+548; local Figure-8 race-start RAM resolves this pointer to sub_2072EB8 for player and CPU karts. Native requests immediate placement through its existing respawn bridge, without the fall-animation delay; original placement/spread now replay-tested in kart/respawn.rs; fall/carry timing remains unported
- sub_2080AC0: previous-node override now wired into native CPU cursor. sub_207F6F0 applies old-node drift hints then switches to override node and refreshes target without angle/reached checks on that call; passing a node consumes the override. Cursor integration regression covers predecessor override and empty AREA replacement
- sub_2092B5C: bat spawner (NKM 0x1A0, Banshee Boardwalk old_hyudoro_64) tick, state +0xAC: 0 waits for a counted kart within sqrt(5625)*256=1200 units and atan2 minus yaw (+0x7E) in +-8000 (flag 0x800: timed, +0xA4 counts down), or sub_2061818()==2; 1 runs a 50 tick cycle (+0xA0), at tick 20 throws 2 bats (6 RNG draws each: x+-5, y+35+-5, z+-40 units, speed 2..3 units, angle yaw-3000+rnd(6000), vy -0.625..-0.375), +0xA8 burst counter 0..2, after 5 cycles (+0xA4 from 4) back to 0. Ported in vm_model/src/mapobj/bats.rs, replay-tested
- sub_209219C: takes a bat from the 6 bat pool (sub_2100138/sub_209BBFC, none free: nothing, no draws), sets lifetimes +0xB0=rnd(30), +0xB4=15, +0xB8=0x8C+rnd(8), position (+4), velocity (+0xA0), first (+0xBC), kind (+0xC0), state +0xD4=0, hit mask +0xD0=0; the wobble +0xC4.. is not reset
- sub_20924D8: bat tick: wobble +0xC4 += +0xC8 (+60 a tick, turns at 8160); state 0 sleeps +0xB0 ticks, then accelerates 0.1 along facing (+0x40/+0x48) and -0.1 down for +0xB4 ticks; 1 +0.1 up until vy>0 (vy=0); 2 glide +0xB8 ticks; 3 fly away (vy +1 a tick, facing -0.05) and delete (sub_20D2398) at y>=1802240; flap frame +0xAC and sound 357 not ported
- sub_209297C: bat kart callback (handler 12 for mode 0 karts): once per kart (mask +0xD0), sets the object push +0x10 to 1.2 units along the kart-bat vector minus its part along the bat facing (y kept), or along the facing if that is shorter than 4 units
- sub_2092B20: bat delete (sub_20D2398, sub_20D28E0); sub_2092B3C: spawner init (registers tick sub_2092B5C); sub_20924A8: bat factory; sub_2092484/sub_2092928/sub_2092940: bat pool/manager glue (0x19E)
- sub_2148714: FX_Atan2Idx(x, z): 16 bit angle 0 along +z, 0x4000 along +x (table off_21488E4 indexed by ratio>>5)
- sub_20D22D0: returns the objects' RNG state pointer (arg ignored); sub_2091F6C(rng, n) = (hi word after step * n) >> 32; sub_2046524 same truncated to u16
- sub_20E3EF4: turning platform init (gears 0xCB/0xCE, rotary room/bridge): speed s0lo*128/100 (neg if s2lo), ramp s1lo (step 0x1000/ramp), run s0hi, rest s1hi; 4 states
- sub_20E44D8: turning platform state 0 enter: speed factor 0
- sub_20E4474: turning platform state 0: factor += step, yaw += factor*speed; after ramp -> 1
- sub_20E4434: turning platform state 1: yaw += speed; after run ticks (if set) -> 2
- sub_20E4428: turning platform state 2 enter: factor 4096
- sub_20E43A8: turning platform state 2: factor -= step, yaw += factor*speed; after ramp: speed reversed -> 3
- sub_20E4380: turning platform state 3: rest; after rest ticks -> 0

- sub_2072EB8: respawn placement: checkpoint JGPT (battle cycles the respawn index; helper returns the battle route pointer), SDK quantized yaw, per-racer 30-unit side/forward grid offsets except mode1 time trial, pitch (-along*sinX) and roll (side*sinZ) height adjustments, then +40 units. Placement and reset yaw match306 controlled original calls (102 time-trial /204 spread) in vm_model/src/kart/respawn.rs; native bridge wired. Rescue timing/visuals and full reset parity remain open
- sub_2072B94: reset-and-place kart: cleanup2072930, controller2079C0C, invokes kart+528 reset callback, sets position, derives yaw from FX_Atan2(forward.x,forward.z) with truncated constant0x28BE60D >>24, rebuilds basis/facing/travel and position histories, resets CPU cursor to supplied route point or racer route; player camera reset. Captured306 reset-yaw results match Rust; this does not establish all reset fields/camera parity
- sub_20720DC: base kart reset callback (kart+528 resolves here in Figure-8 RAM): clears motion/status masks, velocity, drift, tilt, lean+724, air-pitch+564, target/eased turn+1004/+1008, restores default scale/friction/gravity, respawn-id+964=-1. Native respawn now also clears KartSteering while preserving host CPU classification; full item/controller reset audit remains open
- sub_2072930: respawn/reset cleanup: stops per-kart effect controllers, resets driver controller and audio state, ends status-specific transforms, cleans bullet/shrink state and emits original disappearance effects/sounds where flagged; called before the base kart reset
- sub_2147FD8: SDK vector scale-add: out=base+((scalar*vector)>>12) independently per signed component, truncating rather than adding an FX_Mul rounding bias; used for respawn side/forward offsets

- sub_207A5C4: per-racer checkpoint freeze predicate: reads kart+72 bit0x800 using the requested racer index, not just the player. sub_203DF74 returns before checkpoint lookup when true. Native race tracker now skips falling CPUs as well as the player
- sub_206FF50: fall start stores the checkpoint's respawn id in kart+964 immediately (or the battle cycling index) before the carry/placement phase. Native now caches the race checkpoint id at fall start rather than recomputing it after its placeholder delay; battle selection still needs porting
- sub_20FFDA0: drum state 0: wait (setting 1 hi) ticks -> 2
- sub_20FFD94: drum state 2 enter: speed factor 0
- sub_20FFD40: drum state 2: factor += step, angle += factor*speed; after the ramp -> 3
- sub_20FFD04: drum state 3: angle += speed; after the run (setting 0 hi) -> 4
- sub_20FFCF8: drum state 4 enter: factor 4096
- sub_20FFC98: drum state 4: factor -= step, angle += max(factor*speed, 150); after the ramp -> 5
- sub_20FFC4C: drum state 5 enter: the way to the next of 10 faces (0x1999 each)
- sub_20FFC08: drum state 5: +150 a tick to the face, then idle (state 1)
- sub_20FFDD4: drum manager: when every drum is idle, a random order (off_20FFEB4, 6 permutations) of the fast/middle/slow speeds, all to state 0
- sub_20FFEB8: drum draw: rotation about x by -angle replaces the object's matrix
- sub_2146D28: MTX_RotX33 (rows 1,0,0 / 0,c,s / 0,-s,c)
- sub_209F338: chandelier tick: state 0 waits (+0xA4), state 1 plays chandelier.nsbca once (sounds at frames 70, 175, 250), back to 0 (no wait after the first)
- sub_209F514: chandelier init: wait 60 + rand(60) (race RNG at global + 1176)
- sub_209F5CC: chandelier draw (billboard-free matrix, nsbca frame +0xA0)
- sub_209EC80: painting tick: state 1 waits, state 2 plays picture1/2.nsbca once (sounds at set frames), then a new wait 60 + rand(120)
- sub_209EFB4: painting draw (picture1 or picture2 by +0xA4, frame +0xA0)
- sub_209F124: 0x152 painting ctor: kind 1 (picture2)
- sub_209F130: 0x151 painting ctor: kind 0 (picture1)

- sub_208C23C: CPU supplied-route reset thunk; Figure-8 runtime slot0217B040 resolves to sub_208C0C8. Argument r1 carries the JGPT route pointer despite no arguments shown by the C thunk. Native bridge now passes RespawnPoint.cpu_point to CpuDriver.reset_respawn
- sub_208C0C8: supplied-node CPU reset: sub_207F9A8 resets driving cursor/state, sub_207E1D4 clears transient pacing, sub_207C448 clears CPU item-controller state. Driving geometry/recovery/drift/pace fields match306 controlled original callbacks across all37 Figure-8 route nodes; native supplied-node reset wired. CPU item-controller reset remains separate/unported
- sub_207F9A8: supplied route reset: forwards original r1 through sub_2080CD0(a1+8,node), then sub_207F9CC(a1,1). ARM disassembly confirms r1 is not overwritten before CD0, resolving missing argument in exported C
- sub_2080CD0: cursor initialization to supplied node, first predecessor at node+12, clears override/latch, normalizes target-position minus predecessor-position. Target is the supplied node itself, not its next node. Native respawn previously used nearest point then next; replaced with this branch
- sub_207E1D4: reset transient CPU pace fields +4/+16 to preserved base+0, +8/+12/+24=0, cpu-place+20=-1. Preserve rank/slot/rival and gap fields beyond the reset range. Native supplied-node respawn now performs this instead of preserving stale target/cap/bonus
- sub_208C260: fallback CPU reset thunk; Figure-8 runtime slot0217B03C resolves to sub_208C0F0. Used when respawn point has no route pointer; native still retains nearest-route fallback pending this branch's reset/RNG/skill replay
- sub_20E5FB4: pendulum collision (shape 5): the bob as a disc facing the arm's z axis (+0x40), radius +0x104 (100 x scale x), half thickness +0x108 (50 x scale z); pushed out along the face, or radially (never down) past the rim
- sub_20E5E24: pendulum init: arm 500 x scale y below the pivot, amplitude, step, bob radius/thickness
- sub_2096DF0: Rocky Wrench hatch shape test (0x1A7 shape 5): below the cover height (+0xA0) + r and within radius (+0x58) + r; pushed out radially only while the wrench is up (state 4, or 5 above 30720), else touch only
- sub_209702C: hatch kart callback (own codes 3/4): while up, non-star karts get the knock (table handler 7) and the hatch's velocity 14336 up; otherwise per-kart landing bits, sound, cover bounce
- sub_2094E8C: Boo spawner (NKM 0x13D) tick; +0xA0 15-tick kart check (range = setting0 low16 units, view kart xz), +0xA4 near, +0xA8 delay, +0xAC state 0 start / 1 idle / 2 spawning; mode 0 spawns 4 (max 6 alive), then 1 per 0..19 ticks; kart leaving -> sub_20946B8 and idle. Ported in vm_model/src/mapobj/boo.rs
- sub_20954E4: Boo spawner ctor: sub_20AC588(0x13B, setting0 high16) creates the pool of Boos; sub_2095228 (class init) draws the first +0xA0 = 15*rand>>32; sub_2094E3C factory makes no spawner when *(g+8) is 3 or 5 and sub_2061818()==0
- sub_20952DC: spawn group (max alive, count, radius units, delay range): offset = random radius (sub_2091F6C = rand*n>>32) at random angle (sub_20951B4 = high 16 bits), y = spawner y; then sub_2094000 per Boo; finally +0xA8 = rand*delay>>32
- sub_2094000: takes a free pool Boo (sub_209BBFC) and fills it from 12 draws: speed +0xD4, amp +0xCC, centre +0xC8 (camera heading via sub_2148714(target.z-eye.z, target.x-eye.x) +-60 deg in mode 0), phase +0xBC, bob (+0xE8..+0xF8), radius +0x10C, fade bounds, wait +0xB4 0..74, life +0xB8 300..449; ++live count (*0x217B0B8)
- sub_2094768: Boo tick: fade +0xFC bounces between 2.0 and 14..26, alpha +0xAC = fade>>12; orbit the view kart at +0x10C radius with two damped oscillators; after life ends fades 1.0 a tick then sub_20D2398 and --live
- sub_2094C70: Boo draw: alpha +0xAC, frame +0xAE (slot&1), flip +0xB0 ((slot/2)&1), billboard matrix sub_20E6CF8, scale +0x1C (x2 in mode 2); sub_2094C24 sets frame/flip from the pool index
- Boo RNG: *0x021755FC+0x498 (sub_209520C), a MATH_Rand32 distinct from the objects' one at *0x0217B49C; also drawn by the ambient sound code now and then (resync in tests)
- sub_2095544: bakubaku (0x13C) tick, +0xB0 state: 0 waits for the view kart within 800 units of the trigger point (sub_20957EC: nkm pos + 800*facing), 1 rises from 50 units below at 12 units/tick up and 0.25 gravity, 2 above ground (only drawn then, sound 390 on entry), 3 sinks (sound 391), 4 waits 1800 ticks
- sub_2095848: bakubaku draw: matrix + scale, body model (bakubaku) then baku_shadow tilted by atan2(-vy, 12.0) about x
- sub_2071980: thunk `sub_210B2A8(kart, a2, kart+992, kart+996, kart+1280)`: the kart's rolling/wading sound step (a5 = water depth, see sub_206FE08)
- sub_206FE08: kart water step: v = sub_20D3D48(kart y) (y minus the water surface); when v < 0 (below the surface) and not flag +76 bit 0x4000000: +220 (speed/gravity scale) = max(((+1012 * +196 >> 12) * v >> 12) + 4096, *(+716)+120) and kart+0x500 = -v (depth below the water), then `sub_207A6C0`; a splash effect `sub_208D978` when the previous frame was above -40960 and the vertical speed < -8192; otherwise +0x500 = 0
- sub_20D3D48: height of a point above the water surface: y - (*0x217B4C4 water object)+4 when that object (+368 active), else y - **0x217B4B8, else 9999.0 (no water)
- sub_20D3D10: true when y is more than 50 units (-204800) below the water surface (**0x217B4B8)
- sub_20D3D94: water object (*0x217B4C4) active flag (+368); sub_20D3E18: a course water pointer (0x217B4B8 side) exists
- sub_210B2A8: kart wading/rolling sound: only the local-bit kart (+52 & 1) without Bullet Bill; volume min(127, (+1112 >> 12) >> 2) from the speed word +0x458, SE 116 when depth a5 > 25000 with pitch drop (a5 - 25000) * 0.02 up to 900 above 70000 (+ wobble for the local kart); on land the surface group 0 sound

- sub_1FFDEE4: course KCL swept-sphere query; a6=-2 skips moving-object collision, a6=-1 queries nearby objects otherwise uses cached object index. Bowser terrain hit/no-hit, push and flags replay-exact in 96 controlled probes near 16 native fall positions (2026-10-10).
- sub_20EC918: route run step shared by red and blue shells: while the +532 countdown is >= 0 call sub_20ECE1C (route steering) and decrement (also in the air for ground-hugging shells); at 0 call sub_20ED0F4 (lay the spline) and set -1
- sub_20ECE1C: route steering: move (sub_20F2228), lift a ground-hugging airborne shell to owner y (+0x9C) + 30 units, advance the route cursor (sub_20F3BB4/sub_20F371C), turn the heading toward the next node with sub_20EACC0 (rate 328, 614 if the node is behind, scaled by 4096 - countdown*scale) and set direction/velocity with sub_20F1D70

- sub_20E1D10: moving terrain shape dispatcher used by sub_1FFDEE4 at 0x01FFEF14; object+308 shape 0 calls oriented box sub_20E0BAC, shape 1 calls cylinder sub_20E0764, other values reject. Separate from kart/map-object damage collision.
- sub_20E0BAC: moving-terrain sphere versus oriented box; center object+244, axes +40/+52/+64, x half extent +256, y +260, asymmetric z +264/+268. Classifies inside/outside each slab and face/edge/corner contact; not just a top rectangle test. Bowser block initializes half extents 400/50/175/175 times scale; tick sub_20E01F0 moves center to position minus half-height times local up. Native MovingBox floor currently approximates this.
- sub_20E1A80: moving-terrain box face contact accumulator; a7 permits floor classification when signed face normal y exceeds object+288 threshold, otherwise type8 wall. Surface type0 or type18 selected for floor, per-axis maximum/minimum push, deepest floor/wall normal, lowest contact; floor contact calls sub_20E0680 for platform motion output.
- sub_20E0680: moving-terrain contact motion outputs; uses object velocity +16/+20/+24 and old basis +160/+172/+184 to compute displacement at the contact point, plus direction dotted with object+292 to optional signed 16-bit output.
- sub_20E4320: is a turning platform (ids 203, 206, 208, 209)
- sub_20DFF70: is a lava block (id 202)
- sub_20E3AF0: is id 204
- sub_20FFABC: is id 11
- sub_20D555C: broadphase registration (28-byte records: x range, object, radius, flags, owner); turning platforms, lava blocks, 204 and 11 get flag 0x1000
- sub_20E44E4: turning platform tick: state machine, yaw delta x up axis as angular velocity (+0x124), matrix = RotY(yaw) x NKM matrix, position along -y by +0x104
- sub_20D252C: object broadphase radius: |sizes| for shapes 3..5, else size x
