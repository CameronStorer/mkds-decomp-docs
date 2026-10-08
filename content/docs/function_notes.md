# Function notes

Hand-kept meanings of game functions that are not (yet) described in our source comments.
One per line as `sub_XXXXXXX: meaning`; `tools/function_map.py` merges these into
`docs/FUNCTION_MAP.md`.

## Course objects (map objects)

- sub_20D41E0: kart sphere vs every registered object (near list), sums the pushes (min + max per axis)
- sub_20D5180: builds the near-object list (<=128) from the sorted master array (*0x0217B598, 28-byte entries, object at +24)
- sub_20D3E34: object shape test by class shape (+152 -> +8): 1 sphere, 2 cylinder, 3 tilted cylinder, 4 box, 5 callback
- sub_20EB3F0: sphere push-out
- sub_20EB2A0: upright cylinder push-out (sideways, capped by vertical depth)
- sub_20EAD80: tilted cylinder push-out
- sub_20EAFC4: oriented box push-out
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
