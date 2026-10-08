# VM / dispatcher scan report

Scanned **35** files; **35** contain a switch.

| tier | count |
|---|---|
| minor_switch | 14 |
| large_switch | 6 |
| dispatch_loop | 6 |
| text_parser | 6 |
| vm_interpreter | 3 |

## Candidate functions

| function | tier | score | cases | cyclo | loops/nest | IP | fetch | suspect | family |
|---|---|---|---|---|---|---|---|---|---|
| `sub_224746C` | vm_interpreter | 25.25 | 45 | 110 | 5/4 | a1+0x28 | sub_22487F8, sub_2248848 |  | F01 |
| `sub_2F838CC` | vm_interpreter | 25.25 | 45 | 108 | 4/4 | v36+0x28 | sub_2F843F8 |  | F01 |
| `sub_209DEAA` | vm_interpreter | 24.5 | 42 | 111 | 4/4 | v15+0x28 | sub_2148078 | ⚠ | F01 |
| `sub_2147EC0` | minor_switch | 7.25 | 5 | 7 | 0/0 | a1+0x28 | sub_2148078 |  | F02 |
| `sub_2248640` | minor_switch | 7.25 | 5 | 7 | 0/0 | a1+0x28 | sub_22487F8 |  | F02 |
| `sub_2F84240` | minor_switch | 7.25 | 5 | 7 | 0/0 | a1+0x28 | sub_2F843F8 |  | F02 |
| `sub_221D464` | minor_switch | 6.25 | 5 | 15 | 1/1 |  |  |  | F03 |
| `sub_2F59064` | minor_switch | 6.25 | 5 | 15 | 1/1 |  |  |  | F03 |
| `sub_215EB20` | dispatch_loop | 6.0 | 8 | 31 | 2/2 |  |  |  | F04 |
| `sub_2240AE8` | dispatch_loop | 6.0 | 8 | 31 | 2/2 |  |  |  | F04 |
| `sub_2F7C6E8` | dispatch_loop | 6.0 | 8 | 31 | 2/2 |  |  |  | F04 |
| `sub_21670AC` | dispatch_loop | 5.75 | 7 | 33 | 1/1 |  |  |  | F05 |
| `sub_226292C` | dispatch_loop | 5.75 | 7 | 32 | 1/1 |  |  |  | F05 |
| `sub_2F9E52C` | dispatch_loop | 5.75 | 7 | 32 | 1/1 |  |  |  | F05 |
| `sub_2166D60` | large_switch | 3.75 | 15 | 37 | 0/0 |  |  |  | F06 |
| `sub_22625E0` | large_switch | 3.75 | 15 | 37 | 0/0 |  |  |  | F06 |
| `sub_2F9E1E0` | large_switch | 3.75 | 15 | 37 | 0/0 |  |  |  | F06 |
| `sub_21489FC` | large_switch | 1.75 | 7 | 17 | 4/1 |  |  |  | F07 |
| `sub_224917C` | large_switch | 1.75 | 7 | 17 | 4/1 |  |  |  | F07 |
| `sub_2F84D7C` | large_switch | 1.75 | 7 | 17 | 4/1 |  |  |  | F07 |
| `sub_2160A9C` | minor_switch | 1.25 | 5 | 16 | 1/1 |  |  |  | F08 |
| `sub_21611A0` | minor_switch | 1.25 | 5 | 14 | 0/0 |  |  |  | F09 |
| `sub_225C864` | minor_switch | 1.25 | 5 | 16 | 1/1 |  |  |  | F08 |
| `sub_225CF68` | minor_switch | 1.25 | 5 | 14 | 0/0 |  |  |  | F09 |
| `sub_2F98464` | minor_switch | 1.25 | 5 | 16 | 1/1 |  |  |  | F08 |
| `sub_2F98B68` | minor_switch | 1.25 | 5 | 14 | 0/0 |  |  |  | F09 |
| `sub_215DE64` | minor_switch | 0.75 | 3 | 18 | 1/1 |  |  |  | F10 |
| `sub_223FBE4` | minor_switch | 0.75 | 3 | 18 | 1/1 |  |  |  | F11 |
| `sub_2F7B7E4` | minor_switch | 0.75 | 3 | 18 | 1/1 |  |  |  | F11 |

## Family F01 — representative `sub_224746C`

Members: `sub_224746C`, `sub_2F838CC`, `sub_209DEAA`

Opcodes (50): 0x80 0x81 0x93 0x94 0x95 0xa0 0xa1 0xa2 0xb0 0xb1 0xb2 0xb3 0xb4 0xb5 0xb6 0xb8 0xb9 0xba 0xbb 0xbc 0xbd 0xc0 0xc1 0xc2 0xc3 0xc4 0xc5 0xc6 0xc7 0xc8 0xc9 0xca 0xcb 0xcc 0xcd 0xce 0xcf 0xd0 0xd1 0xd2 0xd3 0xd4 0xd5 0xd6 0xe0 0xe1 0xe3 0xfc 0xfd 0xff

- IP: `a1+0x28` (u32), fetch: sub_22487F8, sub_2248848
- operand readers: sub_2248640
- opcodes tested inline (prefixes / if-chains): 0x80 0x81 0xa0 0xa1 0xa2
- masked range dispatch groups: 0x80 0x90 0xb0 0xc0 0xd0 0xe0

### switch @ line 158 on `v13` — 23 cases (in loop) (goto back into loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0xc0 | 160 | ctx_write | W a1+0x8:u8 | break |
| 0xc1 | 163 | ctx_write | W a1+0x4:u8 | break |
| 0xc2 | 166 | external_write | W a2+0x5:u8 | break |
| 0xc3 | 169 | ctx_write | W a1+0x13:u8 | break |
| 0xc4 | 172 | ctx_write | W a1+0x6:u8 | break |
| 0xc5 | 175 | ctx_write | W a1+0x7:u8 | break |
| 0xc6 | 178 | ctx_write | W a1+0x12:u8 | break |
| 0xc7 | 181 | ctx_write | W a1+0x0:u8; R a1+0x0 | break |
| 0xc8 | 184 | ctx_write, calls_helper | W a1+0x0:u8; R a1+0x0; calls sub_2248418, sub_22483DC | break |
| 0xc9 | 189 | ctx_write | W a1+0x0:u8, a1+0x14:u8; R a1+0x13 | break |
| 0xca | 193 | ctx_write | W a1+0x1a:u8 | break |
| 0xcb | 196 | ctx_write | W a1+0x19:u8 | break |
| 0xcc | 199 | ctx_write | W a1+0x18:u8 | break |
| 0xcd | 202 | ctx_write | W a1+0x1b:u8 | break |
| 0xce | 205 | ctx_write | W a1+0x0:u8; R a1+0x0 | break |
| 0xcf | 208 | ctx_write | W a1+0x15:u8 | break |
| 0xd0 | 211 | ctx_write | W a1+0xe:u8 | break |
| 0xd1 | 214 | ctx_write | W a1+0xf:u8 | break |
| 0xd2 | 217 | ctx_write | W a1+0x10:u8 | break |
| 0xd3 | 220 | ctx_write | W a1+0x11:u8 | break |
| 0xd4 | 223 | ctx_write, conditional | W a1+0x2c[i]:u32, a1+0x38[i]:u8, a1+0x3b:u8; R a1+0x28, a1+0x3b | fallthrough |
| 0xd5 | 231 | ctx_write | W a1+0x5:u8 | break |
| 0xd6 | 234 | calls_helper | R a2+0x1, v30+0x0; calls sub_22473A8, sub_2242A44 | break |
| default | 238 | goto | — | goto LABEL_158 |

### switch @ line 257 on `v13` — 13 cases (in loop) (goto back into loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0xb0 | 259 | external_write | W v35+0x0:u16 | break |
| 0xb1 | 262 | external_write | W v35+0x0:u16 | break |
| 0xb2 | 265 | external_write | W v35+0x0:u16 | break |
| 0xb3 | 268 | external_write | W v35+0x0:u16 | break |
| 0xb4 | 271 | conditional, calls_helper | R v35+0x0; calls sub_224E7F4 | break |
| 0xb5 | 275 | external_write, conditional | W v37+0x0:u16; R v35+0x0 | break |
| 0xb6 | 282 | external_write, conditional, calls_helper | W v37+0x0:u16; calls sub_2245F58 | break |
| 0xb8 | 294 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| 0xb9 | 297 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| 0xba | 300 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| 0xbb | 303 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| 0xbc | 306 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| 0xbd | 309 | ctx_write | W a1+0x0:u8; R a1+0x0, v35+0x0 | break |
| default | 312 | goto | — | goto LABEL_158 |

### switch @ line 321 on `v13` — 3 cases (in loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x93 | 323 | ctx_write, conditional, fetches_operand, calls_helper | W a1+0x28:u32; R a1+0x24, a1+0x28; ip+=1; operands: sub_22487F8(); calls sub_2248748, sub_22482F0, sub_22482D0, sub_2248538 | fallthrough |
| 0x94 | 341 | control_flow, ctx_write, conditional, calls_helper | W a1+0x28:u32; R a1+0x24; calls sub_2248748 | break |
| 0x95 | 346 | control_flow, ctx_write, conditional, calls_helper | W a1+0x28:u32, a1+0x2c[i]:u32, a1+0x3b:u8; R a1+0x24, a1+0x28, a1+0x3b; calls sub_2248748 | fallthrough |

### switch @ line 389 on `v13` — 3 cases (in loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0xe0 | 391 | ctx_write | W a1+0x1c:u16 | break |
| 0xe1 | 394 | external_write | W a2+0x18:u16 | break |
| 0xe3 | 397 | ctx_write | W a1+0x16:u16 | break |

### switch @ line 410 on `v13` — 3 cases (goto back into loop)

Prefetch before dispatch: `_ = sub_2248848(*((_DWORD *)a1 + 10))`

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0xfc | 412 | control_flow, ctx_write, external_write, conditional | W a1+0x28:u32, a1+0x3b:u8, v43+0x38:u8; R a1+-0x1[i], a1+0x28[i], a1+0x3b, v43+0x38 | fallthrough |
| 0xfd | 430 | control_flow, goto, ctx_write, conditional | W a1+0x28:u32, a1+0x3b:u8; R a1+0x2c[i], a1+0x3b | goto LABEL_158 |
| 0xff | 434 |  | — | break |
| default | 437 | goto | — | goto LABEL_158 |

### Context struct (`a1`) as observed

| off | width | idx | handler R/W | touched by |
|---|---|---|---|---|
| -0x1 | u8 | y | 1/0 | 0xfc |
| 0x0 | u8 |  | 9/10 | 0xb8 0xb9 0xba 0xbb 0xbc 0xbd 0xc7 0xc8 0xc9 0xce |
| 0x2 | u16 |  | 0/0 |  |
| 0x4 | u8 |  | 0/1 | 0xc1 |
| 0x5 | u8 |  | 0/1 | 0xd5 |
| 0x6 | u8 |  | 0/1 | 0xc4 |
| 0x7 | u8 |  | 0/1 | 0xc5 |
| 0x8 | u8 |  | 0/1 | 0xc0 |
| 0xe | u8 |  | 0/1 | 0xd0 |
| 0xf | u8 |  | 0/1 | 0xd1 |
| 0x10 | u8 |  | 0/1 | 0xd2 |
| 0x11 | u8 |  | 0/1 | 0xd3 |
| 0x12 | u8 |  | 0/1 | 0xc6 |
| 0x13 | u8 |  | 1/1 | 0xc3 0xc9 |
| 0x14 | u8 |  | 0/1 | 0xc9 |
| 0x15 | u8 |  | 0/1 | 0xcf |
| 0x16 | u16 |  | 0/1 | 0xe3 |
| 0x18 | u8 |  | 0/1 | 0xcc |
| 0x19 | u8 |  | 0/1 | 0xcb |
| 0x1a | u8 |  | 0/1 | 0xca |
| 0x1b | u8 |  | 0/1 | 0xcd |
| 0x1c | u16 |  | 0/1 | 0xe0 |
| 0x20 | u32 |  | 0/0 |  |
| 0x24 | u32 |  | 3/0 | 0x93 0x94 0x95 |
| 0x28 | u32/u8 | y | 4/5 | 0x93 0x94 0x95 0xd4 0xfc 0xfd |
| 0x2c | u32/u8 | y | 1/2 | 0x95 0xd4 0xfd |
| 0x38 | u8 | y | 0/1 | 0xd4 |
| 0x3b | u8 |  | 6/4 | 0x95 0xd4 0xfc 0xfd |
| 0x3c | u32 |  | 0/0 |  |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_22487F8` | fetch | 7 | 2 |  |  |
| `sub_2F843F8` | fetch | 7 | 2 |  |  |
| `sub_2148078` | fetch | 7 | 2 |  |  |
| `sub_2248640` | operand_reader | 5 | 1 | 38 | y |
| `sub_2F84240` | operand_reader | 5 | 1 | 38 | y |
| `sub_2147EC0` | operand_reader | 5 | 1 | 38 | y |
| `sub_2248748` | helper | 3 | 1 |  |  |
| `sub_2F84348` | helper | 3 | 1 |  |  |
| `sub_2147FC8` | helper | 3 | 1 |  |  |
| `sub_22473A8` | helper | 2 | 2 |  |  |
| `v59` | helper | 2 | 1 |  |  |
| `sub_2F82FA8` | helper | 2 | 2 |  |  |
| `sub_2146C4C` | helper | 2 | 2 |  |  |
| `sub_2248848` | fetch | 1 | 1 |  |  |
| `sub_2247E44` | helper | 1 | 1 |  |  |
| `sub_2248418` | helper | 1 | 1 |  |  |
| `sub_22483DC` | helper | 1 | 1 |  |  |
| `sub_2242A44` | helper | 1 | 1 |  |  |
| `sub_224E7F4` | helper | 1 | 1 |  |  |
| `sub_2245F58` | helper | 1 | 2 |  |  |
| `sub_22482F0` | helper | 1 | 1 |  |  |
| `sub_22482D0` | helper | 1 | 1 |  |  |
| `sub_2248538` | helper | 1 | 1 |  |  |
| `sub_2F83A44` | helper | 1 | 1 |  |  |
| `sub_2F84018` | helper | 1 | 1 |  |  |
| `sub_2F83FDC` | helper | 1 | 1 |  |  |
| `sub_2F7E644` | helper | 1 | 1 |  |  |
| `sub_2F8A3F4` | helper | 1 | 1 |  |  |
| `sub_2F81B58` | helper | 1 | 2 |  |  |
| `sub_2F83EF0` | helper | 1 | 1 |  |  |
| `sub_2F83ED0` | helper | 1 | 1 |  |  |
| `sub_2F84138` | helper | 1 | 1 |  |  |
| `sub_209E04C` | helper | 1 | 1 |  |  |
| `sub_21476C4` | helper | 1 | 1 |  |  |
| `sub_2147C98` | helper | 1 | 1 |  |  |
| `sub_2147C5C` | helper | 1 | 1 |  |  |
| `sub_21503B8` | helper | 1 | 1 |  |  |
| `sub_21457FC` | helper | 1 | 2 |  |  |
| `sub_2147B70` | helper | 1 | 1 |  |  |
| `sub_2147B50` | helper | 1 | 1 |  |  |
| `sub_2147DB8` | helper | 1 | 1 |  |  |

## Family F02 — representative `sub_2147EC0`

Members: `sub_2147EC0`, `sub_2248640`, `sub_2F84240`

Opcodes (5): 0x0 0x1 0x2 0x3 0x4

- IP: `a1+0x28` (u32), fetch: sub_2148078

### switch @ line 9 on `a3` — 5 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x0 | 11 | ctx_write, fetches_operand | W a1+0x28:u32; R a1+0x28; ip+=1; operands: sub_2148078() | break |
| 0x1 | 15 | calls_helper | calls sub_2148028 | break |
| 0x2 | 18 | calls_helper | calls sub_2147F88 | break |
| 0x3 | 21 | calls_helper | calls sub_2148028, sub_21457FC | break |
| 0x4 | 26 | ctx_write, conditional, fetches_operand, calls_helper | W a1+0x28:u32; R a1+0x28, v7+0x0; ip+=1; operands: sub_2148078(); calls sub_2146C4C | break |
| default | 33 | halt_or_return | — | return v3 |

### Context struct (`a1`) as observed

| off | width | idx | handler R/W | touched by |
|---|---|---|---|---|
| 0x28 | u32 |  | 2/2 | 0x0 0x4 |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_2148028` | helper | 3 | 1 |  |  |
| `sub_22487A8` | helper | 3 | 1 |  |  |
| `sub_2F843A8` | helper | 3 | 1 |  |  |
| `sub_2148078` | fetch | 2 | 2 |  |  |
| `sub_22487F8` | fetch | 2 | 2 |  |  |
| `sub_2F843F8` | fetch | 2 | 2 |  |  |
| `sub_2147F88` | helper | 1 | 1 |  |  |
| `sub_21457FC` | helper | 1 | 2 |  |  |
| `sub_2146C4C` | helper | 1 | 2 |  |  |
| `sub_2248708` | helper | 1 | 1 |  |  |
| `sub_2245F58` | helper | 1 | 2 |  |  |
| `sub_22473A8` | helper | 1 | 2 |  |  |
| `sub_2F84308` | helper | 1 | 1 |  |  |
| `sub_2F81B58` | helper | 1 | 2 |  |  |
| `sub_2F82FA8` | helper | 1 | 2 |  |  |

## Family F03 — representative `sub_221D464`

Members: `sub_221D464`, `sub_2F59064`

Opcodes (5): 0x1 0x2 0x3 0x4 0x5


### switch @ line 84 on `*a2` — 5 cases (goto back into loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x1 0x2 0x3 0x4 0x5 | 86 | ctx_write | W a2+0x2:u16, a2+0x4:u16, a2+0x6:u16, a2+0x8:u16, a2+0xa:u16…; R v5+0x0, v5+0x2, v5+0x4, v5+0x6… | break |
| default | 102 | goto | — | goto LABEL_16 |

### Context struct (`a2`) as observed

| off | width | idx | handler R/W | touched by |
|---|---|---|---|---|
| 0x0 | u16/u8 |  | 0/0 |  |
| 0x2 | u16 |  | 0/1 | 0x1 0x2 0x3 0x4 0x5 |
| 0x4 | u16 |  | 0/1 | 0x1 0x2 0x3 0x4 0x5 |
| 0x6 | u16 |  | 0/1 | 0x1 0x2 0x3 0x4 0x5 |
| 0x8 | u16 |  | 0/1 | 0x1 0x2 0x3 0x4 0x5 |
| 0xa | u16 |  | 0/1 | 0x1 0x2 0x3 0x4 0x5 |

## Family F04 — representative `sub_215EB20`

Members: `sub_215EB20`, `sub_2240AE8`, `sub_2F7C6E8`

Opcodes (8): 0x0 0x1 0x5 0x8 0xc 0xd 0xe 0xf


### switch @ line 48 on `v6 & 0xF` — 8 cases (in loop) (goto back into loop)

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x0 | 50 | conditional | R v5+0x14 | break |
| 0x1 | 54 | conditional, calls_helper | R v5+0x14; calls sub_21685B8 | break |
| 0x5 | 58 | conditional, calls_helper | R v5+0x14; calls sub_2159F38, sub_2159984 | fallthrough |
| 0x8 | 67 | conditional, calls_helper | R v5+0x14; calls sub_2159F38, sub_2159984 | fallthrough |
| 0xc | 75 | conditional, calls_helper, absolute_memory | W loc_380FFF4+0x5ac:u32; R loc_380FFF4+0x354, v5+0x14; calls sub_2168F5C | fallthrough |
| 0xd | 84 | conditional, calls_helper | W loc_380FFF4+0x5b0:u32; R v5+0x14; calls sub_2168C80 | fallthrough |
| 0xe 0xf | 91 | conditional, calls_helper | R v5+0x14; calls sub_2168D64 | break |
| default | 96 | nop | — | break |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_2159F38` | helper | 3 | 1 |  |  |
| `sub_2159984` | helper | 3 | 5 |  |  |
| `sub_223E900` | helper | 3 | 1 |  |  |
| `sub_223E4BC` | helper | 3 | 2 |  |  |
| `sub_2F7A500` | helper | 3 | 1 |  |  |
| `sub_2F7A0BC` | helper | 3 | 2 |  |  |
| `sub_215D478` | helper | 2 | 1 |  |  |
| `sub_215A258` | helper | 2 | 1 |  |  |
| `sub_2240818` | helper | 2 | 1 |  |  |
| `sub_2F7C418` | helper | 2 | 1 |  |  |
| `sub_215E8FC` | helper | 1 | 1 |  |  |
| `sub_21685B8` | helper | 1 | 2 |  |  |
| `sub_2168F5C` | helper | 1 | 1 |  |  |
| `sub_2168C80` | helper | 1 | 1 |  |  |
| `sub_2168D64` | helper | 1 | 1 |  |  |
| `sub_2159FAC` | helper | 1 | 2 |  |  |
| `sub_224105C` | helper | 1 | 1 |  |  |
| `sub_223E87C` | helper | 1 | 1 |  |  |
| `sub_2F7CC5C` | helper | 1 | 1 |  |  |
| `sub_2F7A47C` | helper | 1 | 1 |  |  |

## Family F05 — representative `sub_21670AC`

Members: `sub_21670AC`, `sub_226292C`, `sub_2F9E52C`

Opcodes (7): 0x0 0x1 0x2 0x3 0x4 0x5 0x6


### switch @ line 29 on `(unsigned int)v5` — 7 cases (in loop)

Prefetch before dispatch: `v5 = sub_215A5BC(v2)`, `v8 = sub_215A5BC(v6)`

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x0 | 31 | ctx_write, external_write, conditional, calls_helper | W a1+0xa:u16, a1+0x1c:u32, v4+0x0:u16; R a1+0xc; calls sub_215B4AC | fallthrough |
| 0x1 | 48 | ctx_write, external_write, conditional, calls_helper | W a1+0xa:u16, v4+0x0:u16; R a1+0x14, a1+0x16, loc_380FFF4+0x3a4, loc_380FFF4+0x3a6; calls sub_215B394 | fallthrough |
| 0x2 0x6 | 66 | nop | — | break |
| 0x3 | 69 | ctx_write, external_write, conditional, calls_helper | W a1+0xa:u16, a1+0x12:u16, v4+0x0:u16; R a1+0xa, a1+0x12, loc_380FFF4+0x41c; calls sub_215A5BC | fallthrough |
| 0x4 | 81 | ctx_write, conditional | W a1+0xc:u16, a1+0x20:u32 | fallthrough |
| 0x5 | 88 | ctx_write, conditional | W a1+0xc:u16, a1+0x24:u32 | fallthrough |
| default | 95 | ctx_write, conditional, calls_helper | W a1+0xc:u16, a1+0x18:u16, a1+0x1a:u16, a1+0x28:u32; calls sub_215A5BC | fallthrough |

### Context struct (`a1`) as observed

| off | width | idx | handler R/W | touched by |
|---|---|---|---|---|
| 0x4 | u16 |  | 0/0 |  |
| 0x6 | u16 |  | 0/0 |  |
| 0x8 | u16 |  | 0/0 |  |
| 0xa | u16 |  | 2/6 | 0x0 0x1 0x3 |
| 0xc | u16 |  | 1/3 | 0x0 0x4 0x5 default |
| 0x12 | u16 |  | 1/1 | 0x3 |
| 0x14 | u16 |  | 1/0 | 0x1 |
| 0x16 | u16 |  | 1/0 | 0x1 |
| 0x18 | u16 |  | 0/2 | default |
| 0x1a | u16 |  | 0/2 | default |
| 0x1c | u32 |  | 0/1 | 0x0 |
| 0x20 | u32 |  | 0/1 | 0x4 |
| 0x24 | u32 |  | 0/1 | 0x5 |
| 0x28 | u32 |  | 0/1 | default |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_215A5BC` | helper | 7 | 3 |  |  |
| `sub_2258A6C` | helper | 7 | 3 |  |  |
| `sub_2F9466C` | helper | 7 | 3 |  |  |
| `sub_215B4AC` | helper | 1 | 1 |  |  |
| `sub_215B394` | helper | 1 | 1 |  |  |
| `sub_22593C8` | helper | 1 | 1 |  |  |
| `sub_22592B0` | helper | 1 | 1 |  |  |
| `sub_2262C5C` | helper | 1 | 1 |  |  |
| `sub_2262C48` | helper | 1 | 1 |  |  |
| `sub_2F94FC8` | helper | 1 | 1 |  |  |
| `sub_2F94EB0` | helper | 1 | 1 |  |  |
| `sub_2F9E85C` | helper | 1 | 1 |  |  |
| `sub_2F9E848` | helper | 1 | 1 |  |  |

## Family F06 — representative `sub_2166D60`

Members: `sub_2166D60`, `sub_22625E0`, `sub_2F9E1E0`

Opcodes (12): 0x0 0x1 0x2 0x3 0x4 0x5 0x8 0xa 0xb 0xc 0xe 0xf

- opcodes tested inline (prefixes / if-chains): 0x4 0xa 0xb 0xe 0xf

### switch @ line 87 on `v7` — 8 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x0 | 89 | goto | — | goto LABEL_13 |
| 0x2 | 91 | calls_helper | calls sub_2168034 | break |
| 0x4 | 94 | goto | — | goto LABEL_12 |
| 0x5 | 96 | calls_helper | calls sub_2167A44 | break |
| 0x8 | 100 | calls_helper | calls sub_21685B8 | break |
| 0xa | 104 | calls_helper | calls sub_21684C8 | break |
| 0xb | 108 | goto | — | goto LABEL_11 |
| 0xc | 110 | calls_helper | calls sub_2167458 | break |
| default | 114 | goto | — | goto LABEL_40 |

### switch @ line 128 on `v7` — 7 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x1 | 130 | calls_helper | calls sub_21681D0 | break |
| 0x3 | 133 | calls_helper | calls sub_2167F00 | break |
| 0x5 | 136 | goto | — | goto LABEL_26 |
| 0x8 | 138 | goto | — | goto LABEL_24 |
| 0xa | 140 | goto | — | goto LABEL_27 |
| 0xb | 142 | goto | — | goto LABEL_11 |
| 0xc | 144 | goto | — | goto LABEL_28 |
| default | 146 | goto | — | goto LABEL_40 |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_21524B4` | helper | 1 | 2 |  |  |
| `sub_215FCE0` | helper | 1 | 1 |  |  |
| `sub_2167E44` | helper | 1 | 1 |  |  |
| `sub_2167514` | helper | 1 | 1 |  |  |
| `sub_21682FC` | helper | 1 | 1 |  |  |
| `sub_215F950` | helper | 1 | 1 |  |  |
| `sub_215FA9C` | helper | 1 | 1 |  |  |
| `sub_215F77C` | helper | 1 | 1 |  |  |
| `sub_2159FAC` | helper | 1 | 2 |  |  |
| `sub_2159984` | helper | 1 | 5 |  |  |
| `sub_215F98C` | helper | 1 | 1 |  |  |
| `sub_215FA38` | helper | 1 | 1 |  |  |
| `sub_21673F0` | helper | 1 | 1 |  |  |
| `sub_2168034` | helper | 1 | 1 |  |  |
| `sub_2167A44` | helper | 1 | 1 |  |  |
| `sub_21685B8` | helper | 1 | 2 |  |  |
| `sub_21684C8` | helper | 1 | 1 |  |  |
| `sub_2167458` | helper | 1 | 1 |  |  |
| `nullsub_5` | helper | 1 | 1 |  |  |
| `sub_21681D0` | helper | 1 | 1 |  |  |
| `sub_2167F00` | helper | 1 | 1 |  |  |
| `loc_327825C` | helper | 1 | 2 |  |  |
| `sub_225BE50` | helper | 1 | 1 |  |  |
| `sub_22636C4` | helper | 1 | 1 |  |  |
| `sub_2262D94` | helper | 1 | 1 |  |  |
| `sub_2263B7C` | helper | 1 | 1 |  |  |
| `sub_225BAC0` | helper | 1 | 1 |  |  |
| `sub_225BC0C` | helper | 1 | 1 |  |  |
| `sub_225B8EC` | helper | 1 | 1 |  |  |
| `loc_32682E4` | helper | 1 | 1 |  |  |
| `loc_3267F24` | helper | 1 | 3 |  |  |
| `sub_225BAFC` | helper | 1 | 1 |  |  |
| `sub_225BBA8` | helper | 1 | 1 |  |  |
| `sub_2262C70` | helper | 1 | 1 |  |  |
| `sub_22638B4` | helper | 1 | 1 |  |  |
| `sub_22632C4` | helper | 1 | 1 |  |  |
| `sub_2263E38` | helper | 1 | 1 |  |  |
| `sub_2263D48` | helper | 1 | 1 |  |  |
| `sub_2262CD8` | helper | 1 | 1 |  |  |
| `nullsub_13` | helper | 1 | 1 |  |  |
| `sub_2263A50` | helper | 1 | 1 |  |  |
| `sub_2263780` | helper | 1 | 1 |  |  |
| `unk_3FB3E5C` | helper | 1 | 2 |  |  |
| `sub_2F97A50` | helper | 1 | 1 |  |  |
| `sub_2F9F2C4` | helper | 1 | 1 |  |  |
| `sub_2F9E994` | helper | 1 | 1 |  |  |
| `sub_2F9F77C` | helper | 1 | 1 |  |  |
| `sub_2F976C0` | helper | 1 | 1 |  |  |
| `sub_2F9780C` | helper | 1 | 1 |  |  |
| `sub_2F974EC` | helper | 1 | 1 |  |  |
| `unk_3FA3EE4` | helper | 1 | 1 |  |  |
| `unk_3FA3B24` | helper | 1 | 3 |  |  |
| `sub_2F976FC` | helper | 1 | 1 |  |  |
| `sub_2F977A8` | helper | 1 | 1 |  |  |
| `sub_2F9E870` | helper | 1 | 1 |  |  |
| `sub_2F9F4B4` | helper | 1 | 1 |  |  |
| `sub_2F9EEC4` | helper | 1 | 1 |  |  |
| `sub_2F9FA38` | helper | 1 | 1 |  |  |
| `sub_2F9F948` | helper | 1 | 1 |  |  |
| `sub_2F9E8D8` | helper | 1 | 1 |  |  |
| `nullsub_21` | helper | 1 | 1 |  |  |
| `sub_2F9F650` | helper | 1 | 1 |  |  |
| `sub_2F9F380` | helper | 1 | 1 |  |  |

## Family F07 — representative `sub_21489FC`

Members: `sub_21489FC`, `sub_224917C`, `sub_2F84D7C`

Opcodes (7): 0x1 0x2 0x3 0x4 0x5 0x10 0x11


### switch @ line 32 on `*a4` — 7 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x1 0x2 0x3 0x4 0x5 | 34 | goto | W v10+0x0:u16, v11+0x0:u16 | goto LABEL_20 |
| 0x10 | 50 | goto, ctx_write, conditional | W a4+0x0:u16; R v14+0x0, v14+0x1, v14+0x2[i], v16+0x0 | goto LABEL_20 |
| 0x11 | 67 |  | — | break |
| default | 71 | goto | — | goto LABEL_16 |

### Context struct (`a4`) as observed

| off | width | idx | handler R/W | touched by |
|---|---|---|---|---|
| 0x0 | u16/u8 |  | 0/1 | 0x10 |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `nullsub_2` | helper | 2 | 1 |  |  |
| `nullsub_11` | helper | 2 | 1 |  |  |
| `nullsub_19` | helper | 2 | 1 |  |  |
| `nullsub_3` | helper | 1 | 1 |  |  |
| `nullsub_12` | helper | 1 | 1 |  |  |
| `nullsub_20` | helper | 1 | 1 |  |  |

## Family F08 — representative `sub_2160A9C`

Members: `sub_2160A9C`, `sub_225C864`, `sub_2F98464`

Opcodes (5): 0x80 0x81 0x82 0x83 0x84


### switch @ line 18 on `*(_WORD *)(loc_380FFF4 + 1028)` — 5 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x80 | 20 | goto, external_write, calls_helper | W loc_380FFF4+0x350:u16, loc_380FFF4+0x412:u16, loc_380FFF4+0x414:u16, loc_380FFF4+0x418:u16, loc_380FFF4+0x41a:u16; R loc_380FFF4+0x41c; calls sub_215AD90, sub_215C6A4 | goto LABEL_3 |
| 0x81 | 30 | halt_or_return, external_write, conditional, calls_helper, absolute_memory | W loc_380FFF4+0x408:u32, loc_380FFF4+0x40c:u32, loc_380FFF4+0x410:u16, loc_380FFF4+0x41a:u16, v4+0x0:u16; R loc_380FFF4+0x418, loc_380FFF4+0x41c, v4+0x0; calls sub_215A5BC, sub_21697EC, sub_215BE74, sub_215AE7C, sub_215BCE4, sub_215A7CC, sub_2159984 | return |
| 0x82 | 72 | goto | — | goto LABEL_12 |
| 0x83 | 74 | goto, external_write, conditional, calls_helper | W v4+0x0:u16; R loc_380FFF4+0x408, loc_380FFF4+0x40c, loc_380FFF4+0x418, loc_380FFF4+0x41c…; calls sub_215A5BC, sub_21547BC | goto LABEL_24 |
| 0x84 | 94 | goto, external_write, calls_helper | W loc_380FFF4+0x350:u16, v4+0x0:u16; R loc_380FFF4+0x32e, loc_380FFF4+0x404, loc_380FFF4+0x410, loc_380FFF4+0x412…; calls sub_215ADC4, sub_215AD50, sub_215BCE4, sub_21609F4 | goto LABEL_24 |
| default | 106 | goto | — | goto LABEL_24 |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_215AD90` | helper | 2 | 1 |  |  |
| `sub_215A5BC` | helper | 2 | 3 |  |  |
| `sub_215BE74` | helper | 2 | 2 |  |  |
| `sub_215BCE4` | helper | 2 | 1 |  |  |
| `sub_215AD50` | helper | 2 | 1 |  |  |
| `sub_2259230` | helper | 2 | 1 |  |  |
| `sub_2258A6C` | helper | 2 | 3 |  |  |
| `sub_2259CEC` | helper | 2 | 2 |  |  |
| `sub_22591F0` | helper | 2 | 1 |  |  |
| `sub_2F94E30` | helper | 2 | 1 |  |  |
| `sub_2F9466C` | helper | 2 | 3 |  |  |
| `sub_2F958EC` | helper | 2 | 2 |  |  |
| `sub_2F9575C` | helper | 2 | 1 |  |  |
| `sub_2F94DF0` | helper | 2 | 1 |  |  |
| `sub_215C6A4` | helper | 1 | 1 |  |  |
| `sub_21697EC` | helper | 1 | 2 |  |  |
| `sub_215AE7C` | helper | 1 | 2 |  |  |
| `sub_215A7CC` | helper | 1 | 2 |  |  |
| `sub_2159984` | helper | 1 | 5 |  |  |
| `sub_21547BC` | helper | 1 | 1 |  |  |
| `sub_215ADC4` | helper | 1 | 2 |  |  |
| `sub_21609F4` | helper | 1 | 2 |  |  |
| `sub_225A51C` | helper | 1 | 1 |  |  |
| `sub_2265044` | helper | 1 | 2 |  |  |
| `sub_3268820` | helper | 1 | 2 |  |  |
| `sub_2258C7C` | helper | 1 | 2 |  |  |
| `loc_3267F24` | helper | 1 | 3 |  |  |
| `unk_3278468` | helper | 1 | 1 |  |  |
| `loc_3268CE4` | helper | 1 | 2 |  |  |
| `sub_2259B5C` | helper | 1 | 1 |  |  |
| `sub_225C7BC` | helper | 1 | 2 |  |  |
| `sub_2F9611C` | helper | 1 | 1 |  |  |
| `sub_2FA0C44` | helper | 1 | 2 |  |  |
| `unk_3FA4420` | helper | 1 | 2 |  |  |
| `sub_2F9487C` | helper | 1 | 2 |  |  |
| `unk_3FA3B24` | helper | 1 | 3 |  |  |
| `unk_3FB4068` | helper | 1 | 1 |  |  |
| `unk_3FA48E4` | helper | 1 | 2 |  |  |
| `sub_2F983BC` | helper | 1 | 2 |  |  |

## Family F09 — representative `sub_21611A0`

Members: `sub_21611A0`, `sub_225CF68`, `sub_2F98B68`

Opcodes (5): 0x10 0x11 0x12 0x13 0x15


### switch @ line 18 on `*(_WORD *)(loc_380FFF4 + 1028)` — 5 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x10 | 20 | goto, external_write, conditional, calls_helper | W loc_380FFF4+0x350:u16, loc_380FFF4+0x40a:u16, loc_380FFF4+0x40c:u16, loc_380FFF4+0x410:u16; R loc_380FFF4+0x410, loc_380FFF4+0x41c, loc_380FFF4+0x420, v7+0x38…; calls sub_215B868, sub_21524B4 | goto LABEL_8 |
| 0x11 | 41 | halt_or_return, external_write, conditional, calls_helper | W loc_380FFF4+0x40a:u16, loc_380FFF4+0x40e:u16, v4+0x0:u16; R loc_380FFF4+0x40a, loc_380FFF4+0x410, loc_380FFF4+0x41c, loc_380FFF4+0x420…; calls sub_215A5BC, sub_21697EC, sub_215BE74, sub_215AE7C, loc_216474C, sub_21652A4, sub_215A7CC, sub_2159984 | return |
| 0x12 0x13 | 90 | goto | — | goto LABEL_16 |
| 0x15 | 93 | goto, external_write, calls_helper | W loc_380FFF4+0x350:u16, v4+0x0:u16; R loc_380FFF4+0x32e; calls sub_215ADC4, sub_21609F4 | goto LABEL_22 |
| default | 99 | goto | — | goto LABEL_22 |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_215BE74` | helper | 2 | 2 |  |  |
| `sub_2259CEC` | helper | 2 | 2 |  |  |
| `sub_2F958EC` | helper | 2 | 2 |  |  |
| `sub_215B868` | helper | 1 | 1 |  |  |
| `sub_21524B4` | helper | 1 | 2 |  |  |
| `sub_215A5BC` | helper | 1 | 3 |  |  |
| `sub_21697EC` | helper | 1 | 2 |  |  |
| `sub_215AE7C` | helper | 1 | 2 |  |  |
| `loc_216474C` | helper | 1 | 1 |  |  |
| `sub_21652A4` | helper | 1 | 1 |  |  |
| `sub_215A7CC` | helper | 1 | 2 |  |  |
| `sub_2159984` | helper | 1 | 5 |  |  |
| `sub_215ADC4` | helper | 1 | 2 |  |  |
| `sub_21609F4` | helper | 1 | 2 |  |  |
| `loc_3268D9C` | helper | 1 | 1 |  |  |
| `loc_327825C` | helper | 1 | 2 |  |  |
| `sub_2258A6C` | helper | 1 | 3 |  |  |
| `sub_2265044` | helper | 1 | 2 |  |  |
| `sub_3268820` | helper | 1 | 2 |  |  |
| `sub_2260158` | helper | 1 | 1 |  |  |
| `sub_2260CB0` | helper | 1 | 1 |  |  |
| `sub_2258C7C` | helper | 1 | 2 |  |  |
| `loc_3267F24` | helper | 1 | 3 |  |  |
| `loc_3268CE4` | helper | 1 | 2 |  |  |
| `sub_225C7BC` | helper | 1 | 2 |  |  |
| `unk_3FA499C` | helper | 1 | 1 |  |  |
| `unk_3FB3E5C` | helper | 1 | 2 |  |  |
| `sub_2F9466C` | helper | 1 | 3 |  |  |
| `sub_2FA0C44` | helper | 1 | 2 |  |  |
| `unk_3FA4420` | helper | 1 | 2 |  |  |
| `sub_2F9BD58` | helper | 1 | 1 |  |  |
| `sub_2F9C8B0` | helper | 1 | 1 |  |  |
| `sub_2F9487C` | helper | 1 | 2 |  |  |
| `unk_3FA3B24` | helper | 1 | 3 |  |  |
| `unk_3FA48E4` | helper | 1 | 2 |  |  |
| `sub_2F983BC` | helper | 1 | 2 |  |  |

## Family F10 — representative `sub_215DE64`

Members: `sub_215DE64`

Opcodes (3): 0x300 0x800 0xb00

- opcodes tested inline (prefixes / if-chains): 0x800

### switch @ line 16 on `v0` — 3 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x300 | 18 | conditional, calls_helper | W loc_380FFF4+0x558:u32; R loc_380FFF4+0x4b8; calls sub_215D50C, sub_2159984 | break |
| 0x800 | 24 | conditional, absolute_memory | W loc_380FFF4+0x4d4:u16; R loc_380FFF4+0x470, loc_380FFF4+0x4bc, loc_380FFF4+0x4ca | break |
| 0xb00 | 33 | conditional, absolute_memory | W v3+0x6:u16; R loc_380FFF4+0x33a, loc_380FFF4+0x470, loc_380FFF4+0x4bc, loc_380FFF4+0x4c4… | fallthrough |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_2159984` | helper | 2 | 5 |  |  |
| `sub_2162DA0` | helper | 1 | 1 |  |  |
| `sub_215D50C` | helper | 1 | 1 |  |  |
| `sub_215D910` | helper | 1 | 1 |  |  |

## Family F11 — representative `sub_223FBE4`

Members: `sub_223FBE4`, `sub_2F7B7E4`

Opcodes (3): 0x300 0x800 0xb00

- opcodes tested inline (prefixes / if-chains): 0x800

### switch @ line 12 on `v1` — 3 cases

| opcode | line | tags | effect | end |
|---|---|---|---|---|
| 0x300 | 14 | conditional, calls_helper | W loc_380FFF4+0x558:u32; R loc_380FFF4+0x4b8; calls sub_22406D8, sub_223E4BC | break |
| 0x800 | 20 | conditional, absolute_memory | W loc_380FFF4+0x4d4:u16; R loc_380FFF4+0x470, loc_380FFF4+0x4bc, loc_380FFF4+0x4ca | break |
| 0xb00 | 29 | conditional, absolute_memory | W v4+0x6:u16; R loc_380FFF4+0x33a, loc_380FFF4+0x470, loc_380FFF4+0x4bc, loc_380FFF4+0x4c4… | fallthrough |

### Helpers referenced

| helper | role | calls | fan-in | lines | in corpus |
|---|---|---|---|---|---|
| `sub_223E4BC` | helper | 2 | 2 |  |  |
| `sub_2F7A0BC` | helper | 2 | 2 |  |  |
| `sub_22406D8` | helper | 1 | 1 |  |  |
| `sub_2240298` | helper | 1 | 1 |  |  |
| `sub_2F7C2D8` | helper | 1 | 1 |  |  |
| `sub_2F7BE98` | helper | 1 | 1 |  |  |
