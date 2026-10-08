# Original animation routine map

Recorded 2026-10-08 against the local AMCE ROM. Use `export/plan2` for C, and
`tools/arm_disasm.py` when the export is incomplete. Addresses below are ARM9 RAM
addresses, not offsets in the ROM. This is an isolated supplement to Claude's
`docs/FUNCTION_MAP.md` / `docs/function_notes.md`.

## Existing documentation

- `docs/FUNCTION_MAP.md`: generated semantic index; counts are regenerated from
  current source comments and notes, not a claim of full verified coverage.
  Generator: `tools/function_map.py`.
- `docs/function_notes.md`: manually named routines, including object collision
  factories, shape tests, kart hit reactions and object drawing.
- `analysis/race_logic_map.md`: input and race logic, with confidence labels.
- `analysis/kart_struct.md` / `.json`: structural field observations. An observed
  offset does not alone establish a field's meaning.
- `analysis/state_machines.md` / `.json`: recovered state-machine candidates.
- `analysis/xref.json`: call graph and routine metadata; references older plan0.
- `export/plan2/index.json`: newer export inventory. Keep segment identity when
  mapping overlay functions: an address alone may identify multiple overlays.

## Confirmed routine meanings

| Routine | Meaning | Evidence / port |
|---|---|---|
| `sub_207954C` | Initializes character model, four joint clips and shared face pattern wrapper | C setup calls and resources; renderer integration pending |
| `sub_207B8F4` | Constructs character joint-animation path; arguments are character **and clip index** | ARM disassembly recovers second argument omitted by C |
| `sub_207B8DC` | Gets per-clip playback flag from 12-byte records | ARM loads table `0x021551B4` |
| `sub_207B734` | Updates driver's steering pose or active non-drive clip; restores expression on transition completion | C; event meanings still need callers traced |
| `sub_2087B78` | Advances fx12 animation clock | C export omits continuation; ARM `0x02087B9C..0x02087C98` recovered; `nitro_playback.rs` |
| `sub_2087C9C` | Initializes clock; nonzero loop argument becomes mode 1 | C + ARM; `AnimationClock::new` |
| `sub_2087CD0` | Initializes looping clock | C |
| `sub_2087CFC` | Updates clip flag and current clock mode | C |
| `sub_2087D0C` | Returns selected clip duration in fx12 frames | C resource lookup |
| `sub_2087D44` | Advances blend weights without advancing frame | C |
| `sub_2087DE0` | Advances blend, ticks clock, publishes frame to SDK animation object | C |
| `sub_2087E90` | Switches clips using crossfade | C |
| `sub_2087F84` | Switches clips immediately | C |
| `loc_2013B3C` | Selects last pattern key at or before frame (first key before earliest frame) | ARM and original SDK runtime; `nitro_pattern.rs` |
| `sub_2015B9C` | Applies texture/palette pattern selection to material | C and SDK lookup calls; palette index 255 retains existing palette |
| `sub_2014C5C` | Evaluates NSBCA node transform | Original SDK hooks; `nitro_anim.rs` |

Read table at `0x021551B0`, stride 12, directly from decompressed ARM9:

| Clip index | Name | Playback flag | Third word (meaning not established) |
|---|---|---|---|
| 0 | drive | 0 | 1 |
| 1 | spin | 1 | 2 |
| 2 | win | 1 | 3 |
| 3 | lose | 1 | 0x20000 |

`drive` is selected by steering position, rather than simply ticked each frame.
In `sub_207B734`, driver record +36 approaches ±(+44), at steps 4096 or 8192
according to kart flags. When clip index is zero, its frame is +36 plus +44 and
only blend weights advance. Do not treat this clip as an ordinary looping pose.
The shared face clip contains two expression selections; it does not establish a
blink timer. `sub_207B708` reads fx12 frames [0, 4096] at 0x021551A4.
`sub_2068A64` uses the closed selection for spin and lose, normal otherwise.

## Clock layout and boundary behavior

| Offset | Type | Meaning |
|---|---|---|
| +0 | u16 | Mode: 0 stop, 1 loop, 2 counted loops |
| +2 | u16 | Finished flag, cleared at beginning of every tick |
| +4 | i32 | Duration, fx12 frames |
| +8 | i32 | Speed, fx12 frames per tick |
| +12 | i32 | Current frame, fx12 |
| +16 | u16 | Completed wraps |
| +18 | u16 | Wrap limit |

Mode 0 clamps at duration minus 4096 and zeroes speed. Mode 1 subtracts duration
once for forward overflow; at frame <= 0 it adds duration minus 4096 once. Mode
2 counts wraps and stops at the last frame when the limit is reached. If already
at the limit it still adds speed, then returns. Unknown modes only advance.
Arithmetic wraps like ARM 32-bit add/sub. These details are intentionally
preserved in the Rust port.

## Verification and remaining work

- NSBCA: 1,687 captured node results / 16,629 animated components, no mismatches
  for Mario drive; 115 local files sampled without parser errors. Other clips,
  animated scale and reduced-rate/fractional cases lack runtime verification.
- NSBTP: 85 files parsed, 2,575 frame selections sampled; 361 live selections
  matched, but all were the same normal-face key. Closed-face selection is an
  asset test, not a live expression-timing verification.
- Clock: 541 live before/after transitions, 419 unique fixtures, zero mismatches.
  Live capture exercised mode 1; modes 0/2 and reverse/large-step edges are
  instruction-derived unit tests, not live coverage.
- Joint and face decoders are now wired into the visible game through
  `nitro_driver.rs` and `game/src/driver_animation.rs`; animated local TRS is
  applied before SBC hierarchy/skinning. All 48 detailed-driver clips retain
  topology and finite geometry at every integer frame. The earlier pipe test
  failure has since been fixed by Claude; the subsequent core suite passes.
- Figure-8 engine screenshots confirm the centered drive pose brings Mario's
  arms inward. Spin/win/lose, blending and closed-face timing remain
  instruction-derived behavior awaiting live transition captures.

## Additional caller findings and integration limits

`sub_206BF88` immediately selects spin through `sub_2068A64(kart, 1, 0)`.
`sub_207B6C0` chooses immediate or blended switching. `sub_208823C` initializes
the blend increment to 410 (ARM literal 0x020882F8), reaching 4096 in ten ticks.
The SDK blends weighted basis components, then rebuilds orthogonal axes; the
port uses that basis operation, not quaternion interpolation.

`sub_207B44C` reads finish classifications from 0x021551DC with a 16-byte row
stride. For eight racers, the row is [0,0,0,1,1,1,2,2]: 0 selects win, 1 keeps
the prior pose, 2 selects lose. The renderer implements the ordinary race
case; team, time trial and battle cases remain pending. `sub_207B354` alternates
win and drive every random 150..349 ticks; this is mapped but not implemented.
`sub_207B054` handles one-shot clips and a saved return clip; that path and the
mode-6 steering guard remain pending too.

SDK basis reference: [original animation assembly](https://github.com/pret/pokediamond/blob/master/arm9/asm/NNS_G3D_anm.s).
