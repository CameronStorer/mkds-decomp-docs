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

Validation after integration: release game build passes; core library and
integration suites total 89 passed, zero failed, one existing ignored test.
