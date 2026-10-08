# Kart runtime correlations

328 frames, kart size 0x5A8; buttons exercised: A, Right, Left, R; 231 u32 fields never changed.

Per-frame counters (+1 each frame): +0x4D0

| offset | static confidence | what | button | evidence |
|---|---|---|---|---|
| +0x450 | confirmed | value | A | value correlates -1.00 |
| +0x454 | confirmed | value | A | value correlates +1.00 |
| +0x464 | confirmed | value | A | value correlates +1.00 |
| +0x44 | confirmed | bit 10 (0x400) | A | set 0% when held vs 100% |
| +0x44 | confirmed | bit 12 (0x1000) | A | set 0% when held vs 100% |
| +0x48 | confirmed | bit 1 (0x2) | A | set 100% when held vs 0% |
| +0x48 | confirmed | bit 4 (0x10) | Right | set 100% when held vs 0% |
| +0x48 | confirmed | bit 3 (0x8) | Left | set 100% when held vs 0% |
| +0xAC | confirmed | sign | A | negative 100% when held vs 0% |
| +0xB8 | confirmed | sign | A | negative 100% when held vs 0% |
| +0x3B8 | confirmed | sign | A | negative 100% when held vs 0% |
| +0x450 | confirmed | bit 0 (0x1) | A | set 0% when held vs 100% |
| +0x450 | confirmed | bit 2 (0x4) | A | set 100% when held vs 0% |
| +0x450 | confirmed | bit 3 (0x8) | A | set 100% when held vs 0% |
| +0x450 | confirmed | bit 4 (0x10) | A | set 0% when held vs 100% |
| +0x454 | confirmed | bit 0 (0x1) | A | set 100% when held vs 0% |
| +0x454 | confirmed | bit 2 (0x4) | A | set 100% when held vs 0% |
| +0x454 | confirmed | bit 3 (0x8) | A | set 100% when held vs 0% |
| +0x454 | confirmed | bit 6 (0x40) | A | set 100% when held vs 0% |
| +0x464 | confirmed | bit 0 (0x1) | A | set 100% when held vs 0% |
| +0x17C | confirmed | delta | A | per-frame change correlates -1.00 |
| +0x88 | confirmed | delta | A | per-frame change correlates -1.00 |
| +0xA0 | confirmed | delta | A | per-frame change correlates -1.00 |
| +0x1E0 | confirmed | delta | A | per-frame change correlates -1.00 |
| +0x1C0 | confirmed | delta | A | per-frame change correlates -1.00 |
| +0x1F8 | confirmed | delta | A | per-frame change correlates -1.00 |
| +0xC | confirmed | bit 2 (0x4) | A | set 100% when held vs 0% |
| +0xC | confirmed | bit 8 (0x100) | A | set 100% when held vs 0% |
| +0xC | confirmed | bit 9 (0x200) | A | set 0% when held vs 100% |
| +0x10 | confirmed | bit 8 (0x100) | A | set 100% when held vs 0% |
| +0x10 | confirmed | bit 9 (0x200) | A | set 0% when held vs 100% |
| +0xEC | confirmed | bit 11 (0x800) | R | set 100% when held vs 0% |
| +0x2C4 | confirmed | value | R | value correlates -0.99 |
| +0xC | confirmed | value | A | value correlates -0.98 |
| +0x94 | confirmed | delta | A | per-frame change correlates -0.98 |
| +0x1EC | confirmed | delta | A | per-frame change correlates -0.98 |
| +0x1CC | confirmed | delta | A | per-frame change correlates -0.98 |
| +0x2C4 | confirmed | sign | R | negative 98% when held vs 0% |
| +0xA8 | confirmed | bit 7 (0x80) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | bit 9 (0x200) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | sign | A | negative 98% when held vs 0% |
| +0xA8 | confirmed | bit 1 (0x2) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | bit 3 (0x8) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | bit 5 (0x20) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | bit 8 (0x100) | A | set 98% when held vs 0% |
| +0xA8 | confirmed | bit 11 (0x800) | A | set 98% when held vs 0% |
| +0x3B4 | confirmed | sign | A | negative 98% when held vs 0% |
| +0x3B4 | confirmed | bit 4 (0x10) | A | set 98% when held vs 0% |
| +0x3B4 | confirmed | bit 2 (0x4) | A | set 97% when held vs 0% |
| +0xA8 | confirmed | bit 10 (0x400) | A | set 97% when held vs 0% |
| +0x138 | confirmed | delta | R | per-frame change correlates -0.96 |
| +0x168 | confirmed | delta | R | per-frame change correlates -0.96 |
| +0xEC | confirmed | delta | R | per-frame change correlates -0.96 |
| +0x3A8 | confirmed | bit 2 (0x4) | A | set 94% when held vs 0% |
| +0x3A8 | confirmed | bit 5 (0x20) | A | set 94% when held vs 0% |
| +0x278 | confirmed | delta | R | per-frame change correlates -0.94 |
| +0xEC | confirmed | bit 11 (0x800) | Left | set 100% when held vs 6% |
| +0xE4 | confirmed | delta | R | per-frame change correlates -0.93 |
| +0x3A8 | confirmed | bit 6 (0x40) | A | set 93% when held vs 0% |
| +0x3A8 | confirmed | bit 7 (0x80) | A | set 93% when held vs 0% |
| +0x3A8 | confirmed | bit 8 (0x100) | A | set 93% when held vs 0% |
| +0x2C4 | confirmed | sign | Left | negative 97% when held vs 6% |
| +0x3A8 | confirmed | bit 3 (0x8) | A | set 91% when held vs 0% |
| +0x11C | confirmed | bit 11 (0x800) | Right | set 100% when held vs 9% |
| +0xE4 | confirmed | bit 9 (0x200) | R | set 91% when held vs 0% |
| +0x114 | confirmed | delta | R | per-frame change correlates -0.90 |
| +0x4CC | confirmed | value | R | value correlates +0.89 |
| +0x2C4 | confirmed | sign | Right | negative 100% when held vs 11% |
| +0xEC | confirmed | bit 11 (0x800) | Right | set 100% when held vs 12% |
| +0x234 | confirmed | delta | R | per-frame change correlates +0.88 |
| +0x11C | confirmed | delta | R | per-frame change correlates -0.87 |
| +0xB4 | confirmed | bit 11 (0x800) | A | set 87% when held vs 0% |
| +0x11C | confirmed | bit 11 (0x800) | R | set 87% when held vs 0% |
| +0xE4 | confirmed | bit 9 (0x200) | Left | set 91% when held vs 5% |
| +0x3A8 | confirmed | value | A | value correlates +0.84 |
| +0x4CC | confirmed | bit 11 (0x800) | Right | set 89% when held vs 6% |
| +0x128 | confirmed | delta | R | per-frame change correlates +0.82 |
| +0x158 | confirmed | delta | R | per-frame change correlates +0.82 |
| +0x3F0 | confirmed | value | R | value correlates +0.82 |
| +0x2D4 | confirmed | value | Left | value correlates +0.82 |
| +0x114 | confirmed | bit 9 (0x200) | R | set 81% when held vs 0% |
| +0x3EC | confirmed | value | Left | value correlates +0.81 |
| +0x114 | confirmed | bit 9 (0x200) | Right | set 89% when held vs 9% |
| +0xE4 | confirmed | bit 9 (0x200) | Right | set 89% when held vs 10% |
| +0x234 | confirmed | delta | Left | per-frame change correlates +0.79 |
| +0x2FC | confirmed | value | R | value correlates +0.78 |
| +0x2A8 | confirmed | bit 14 (0x4000) | R | set 100% when held vs 22% |
| +0x2D4 | confirmed | value | R | value correlates +0.78 |
| +0xB4 | confirmed | bit 7 (0x80) | A | set 78% when held vs 0% |
| +0x30C | confirmed | delta | R | per-frame change correlates -0.77 |
| +0x2C4 | confirmed | value | Left | value correlates -0.77 |
| +0x3A4 | confirmed | bit 2 (0x4) | A | set 24% when held vs 100% |
| +0x3EC | confirmed | bit 4 (0x10) | Right | set 78% when held vs 2% |
| +0x44 | confirmed | bit 3 (0x8) | Right | set 83% when held vs 8% |
| +0x4C | confirmed | bit 1 (0x2) | Right | set 83% when held vs 8% |
| +0x138 | confirmed | delta | Left | per-frame change correlates -0.75 |
| +0x168 | confirmed | delta | Left | per-frame change correlates -0.75 |
| +0xEC | confirmed | delta | Left | per-frame change correlates -0.75 |
| +0x10 | confirmed | bit 4 (0x10) | Right | set 17% when held vs 92% |
| +0xA8 | confirmed | value | A | value correlates -0.75 |
| +0x300 | confirmed | value | R | value correlates +0.75 |
| +0x3EC | confirmed | value | R | value correlates +0.75 |
| +0x2A4 | confirmed | bit 14 (0x4000) | R | set 98% when held vs 24% |
| +0x128 | confirmed | delta | Left | per-frame change correlates +0.74 |
| +0x158 | confirmed | delta | Left | per-frame change correlates +0.74 |
| +0x44 | confirmed | bit 3 (0x8) | R | set 74% when held vs 0% |
| +0x4C | confirmed | bit 1 (0x2) | R | set 74% when held vs 0% |
| +0x11C | confirmed | bit 11 (0x800) | Left | set 80% when held vs 6% |
| +0xAC | confirmed | bit 14 (0x4000) | R | set 2% when held vs 75% |
| +0x3B8 | confirmed | bit 10 (0x400) | R | set 2% when held vs 75% |
| +0x2A8 | confirmed | bit 14 (0x4000) | Left | set 100% when held vs 27% |
| +0x10 | confirmed | bit 4 (0x10) | R | set 26% when held vs 100% |
| +0x278 | confirmed | delta | Left | per-frame change correlates -0.73 |
| +0x4D0 | confirmed | bit 7 (0x80) | R | set 100% when held vs 27% |
| +0xB4 | confirmed | value | A | value correlates +0.73 |
| +0xB4 | confirmed | bit 3 (0x8) | A | set 72% when held vs 0% |
| +0x2A4 | confirmed | bit 5 (0x20) | A | set 72% when held vs 0% |
| +0x45C | confirmed | bit 22 (0x400000) | R | set 100% when held vs 28% |
| +0xE4 | confirmed | delta | Left | per-frame change correlates -0.72 |
| +0x114 | confirmed | bit 9 (0x200) | Left | set 77% when held vs 5% |
| +0x3F0 | confirmed | value | Left | value correlates +0.71 |
| +0xB4 | confirmed | bit 1 (0x2) | A | set 71% when held vs 0% |
| +0x2A4 | confirmed | bit 2 (0x4) | A | set 70% when held vs 0% |
| +0x45C | confirmed | bit 2 (0x4) | A | set 70% when held vs 0% |
| +0x2A0 | confirmed | value | A | value correlates +0.70 |
| +0xAC | confirmed | bit 10 (0x400) | A | set 70% when held vs 0% |
| +0xAC | confirmed | bit 14 (0x4000) | A | set 70% when held vs 0% |
| +0x3B8 | confirmed | bit 6 (0x40) | A | set 70% when held vs 0% |
| +0x3B8 | confirmed | bit 10 (0x400) | A | set 70% when held vs 0% |
| +0x2A8 | confirmed | bit 7 (0x80) | A | set 69% when held vs 0% |
| +0x2A8 | confirmed | bit 14 (0x4000) | Right | set 100% when held vs 31% |
| +0x2A4 | confirmed | bit 14 (0x4000) | Left | set 97% when held vs 29% |
| +0x458 | confirmed | bit 0 (0x1) | A | set 68% when held vs 0% |
| +0x4D0 | confirmed | bit 7 (0x80) | Left | set 100% when held vs 32% |
| +0x128 | confirmed | sign | A | negative 32% when held vs 100% |
| +0x158 | confirmed | sign | A | negative 32% when held vs 100% |
| +0x234 | confirmed | bit 30 (0x40000000) | A | set 32% when held vs 100% |
| +0xEC | confirmed | sign | A | negative 68% when held vs 0% |
| +0x138 | confirmed | sign | A | negative 68% when held vs 0% |
| +0x168 | confirmed | sign | A | negative 68% when held vs 0% |
| +0x234 | confirmed | bit 31 (0x80000000) | A | set 68% when held vs 0% |
| +0x288 | confirmed | bit 12 (0x1000) | A | set 68% when held vs 0% |
| +0x290 | confirmed | bit 2 (0x4) | A | set 68% when held vs 0% |
| +0x290 | confirmed | bit 3 (0x8) | A | set 68% when held vs 0% |
| +0x298 | confirmed | sign | A | negative 68% when held vs 0% |
| +0x234 | confirmed | bit 29 (0x20000000) | R | set 32% when held vs 100% |
| +0xAC | confirmed | bit 14 (0x4000) | Left | set 3% when held vs 71% |
| +0x3B8 | confirmed | bit 10 (0x400) | Left | set 3% when held vs 71% |
| +0x278 | confirmed | sign | A | negative 68% when held vs 0% |
| +0x2A4 | confirmed | bit 14 (0x4000) | Right | set 100% when held vs 32% |
| +0x45C | confirmed | bit 22 (0x400000) | Left | set 100% when held vs 32% |
| +0xE4 | confirmed | bit 10 (0x400) | A | set 67% when held vs 0% |
| +0xE4 | confirmed | bit 11 (0x800) | A | set 67% when held vs 0% |
| +0xE4 | confirmed | bit 12 (0x1000) | A | set 33% when held vs 100% |
| +0x2A8 | confirmed | bit 3 (0x8) | A | set 67% when held vs 0% |
| +0x2A8 | confirmed | bit 13 (0x2000) | R | set 0% when held vs 67% |
| +0xB8 | confirmed | value | A | value correlates -0.67 |
| +0xAC | confirmed | bit 14 (0x4000) | Right | set 0% when held vs 67% |
| +0x3B8 | confirmed | bit 10 (0x400) | Right | set 0% when held vs 67% |
| +0x234 | confirmed | bit 27 (0x8000000) | Left | set 31% when held vs 98% |
| +0xB4 | confirmed | bit 0 (0x1) | A | set 66% when held vs 0% |
| +0x4F8 | likely | bit 5 (0x20) | Right | set 100% when held vs 34% |
| +0xAC | confirmed | bit 13 (0x2000) | A | set 66% when held vs 0% |
| +0x2A8 | confirmed | bit 1 (0x2) | A | set 66% when held vs 0% |
| +0x3B8 | confirmed | bit 9 (0x200) | A | set 66% when held vs 0% |
| +0x4CC | confirmed | bit 5 (0x20) | R | set 68% when held vs 2% |
| +0x114 | confirmed | delta | Left | per-frame change correlates -0.66 |
| +0x48 | confirmed | bit 3 (0x8) | R | set 66% when held vs 0% |
| +0xB4 | confirmed | bit 10 (0x400) | Right | set 100% when held vs 34% |
| +0xAC | confirmed | bit 11 (0x800) | A | set 66% when held vs 0% |
| +0x114 | confirmed | bit 10 (0x400) | A | set 66% when held vs 0% |
| +0x114 | confirmed | bit 11 (0x800) | A | set 66% when held vs 0% |
| +0x11C | confirmed | sign | A | negative 66% when held vs 0% |
| +0x2A4 | confirmed | bit 1 (0x2) | A | set 66% when held vs 0% |
| +0x3B8 | confirmed | bit 7 (0x80) | A | set 66% when held vs 0% |
| +0x114 | confirmed | bit 12 (0x1000) | A | set 34% when held vs 100% |
| +0x3EC | confirmed | bit 5 (0x20) | Right | set 72% when held vs 6% |
| +0xB8 | confirmed | bit 7 (0x80) | A | set 65% when held vs 0% |
| +0x234 | confirmed | bit 16 (0x10000) | Right | set 72% when held vs 7% |
| +0xAC | confirmed | bit 6 (0x40) | A | set 65% when held vs 0% |
| +0x3B8 | confirmed | bit 2 (0x4) | A | set 65% when held vs 0% |
| +0x458 | confirmed | bit 22 (0x400000) | R | set 100% when held vs 35% |
| +0x2A4 | confirmed | bit 13 (0x2000) | R | set 2% when held vs 67% |
| +0xE4 | confirmed | bit 2 (0x4) | R | set 66% when held vs 1% |
| +0x114 | confirmed | bit 2 (0x4) | R | set 66% when held vs 1% |
| +0x4C | confirmed | value | R | value correlates +0.65 |
| +0x2D4 | confirmed | bit 1 (0x2) | Right | set 72% when held vs 7% |
| +0xB8 | confirmed | bit 2 (0x4) | A | set 65% when held vs 0% |
| +0x4D0 | confirmed | bit 7 (0x80) | Right | set 100% when held vs 35% |
| +0x2D4 | confirmed | bit 2 (0x4) | Right | set 72% when held vs 8% |
| +0x234 | confirmed | bit 29 (0x20000000) | Left | set 31% when held vs 96% |
| +0xA4 | confirmed | bit 5 (0x20) | A | set 64% when held vs 0% |
| +0xB4 | confirmed | bit 6 (0x40) | A | set 64% when held vs 0% |
| +0x1E0 | confirmed | bit 2 (0x4) | A | set 64% when held vs 0% |
| +0x3B0 | confirmed | bit 1 (0x2) | A | set 64% when held vs 0% |
| +0xE4 | confirmed | bit 2 (0x4) | Right | set 72% when held vs 8% |
| +0x114 | confirmed | bit 2 (0x4) | Right | set 72% when held vs 8% |
| +0x88 | confirmed | bit 2 (0x4) | A | set 64% when held vs 0% |
| +0xA0 | confirmed | bit 2 (0x4) | A | set 64% when held vs 0% |
| +0x1EC | confirmed | bit 2 (0x4) | A | set 64% when held vs 0% |
