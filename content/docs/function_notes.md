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
- sub_208B7BC: game particle factory: converts world position to SPL units with fx12 right shift 4, selects resource, spawns emitter and applies resource rendering flags
- sub_208B710: immediately destroys a game particle emitter via sub_20184E4
- sub_2018600: allocates and initializes SPL emitter from free pool, links active list; one-shot resource flag 0x4000 returns null despite successful creation
- sub_20184E4: recycles primary/child particles, unlinks emitter and returns it to free pool
- sub_2018A1C: SPA 1.2 resource loader: 88-byte emitter bases plus flag-selected blocks; TPS texture records traverse by record length at +28
- sub_2018D94: allocates SPL manager and emitter/particle pools (76/156/68-byte structures) and initializes free lists
- sub_2019B28: initializes emitter from resource and supplied position: rate, size, lifetime, frequency, opacity, texture parameters and other state
- sub_2019DF8: converts SPA texture flags to GX texture parameters; palette-zero transparency comes from resource flag bit 16
- sub_201873C: ticks active SPL emitters, honors start delay/alternating update flags, recycles expired empty emitters
- sub_20192E0: emitter and particle simulation tick: spawn cadence, animated size/color/alpha/texture, behaviors, integration, death and child emission (not yet ported)
- sub_201CA6C: allocates primary particles from fractional fx12 emission-rate accumulator, initializes positions by emission shape and remaining particle state (not yet ported)

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
- sub_20DA73C: Goomba class callback (run over)
- sub_20DAA10: Goomba state 5 (spring back after squash)
- sub_20DAB9C: Goomba state 3 (shrink)
- sub_20DAC00: Goomba state 2 (squash)

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
- sub_208C6DC: attaches blue-flare pair to rear wheel positions/directions for eight ticks; pauses continuous wheel emitters meanwhile, destroys flares and resumes continuous emitters on tick nine
- sub_208C930: attaches both red-flare pairs to rear wheel positions/directions for ten ticks, destroys them on tick eleven
- sub_208CB8C: continuous drift-wheel effect lifecycle: ten-tick activation delay, callback-selected drawing/update and grounded/airborne handling
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
