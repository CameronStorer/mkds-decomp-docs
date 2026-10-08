# Kart runtime correlations

2696 frames, kart size 0x5A8; buttons exercised: A, B, Right, Left, R; 230 u32 fields never changed.

Per-frame counters (+1 each frame): +0x4D0

| offset | static confidence | what | button | evidence |
|---|---|---|---|---|
| +0x48 | confirmed | bit 1 (0x2) | A | set 100% when held vs 0% |
| +0x48 | confirmed | bit 2 (0x4) | B | set 100% when held vs 0% |
| +0x48 | confirmed | bit 4 (0x10) | Right | set 100% when held vs 0% |
| +0x48 | confirmed | bit 3 (0x8) | Left | set 100% when held vs 0% |
| +0x464 | confirmed | bit 0 (0x1) | A | set 100% when held vs 0% |
| +0x464 | confirmed | value | A | value correlates +1.00 |
| +0x64 | confirmed | sign | B | negative 0% when held vs 99% |
| +0x2A8 | confirmed | sign | B | negative 100% when held vs 1% |
| +0x44 | confirmed | bit 8 (0x100) | B | set 99% when held vs 1% |
| +0xEC | confirmed | delta | Left | per-frame change correlates -0.97 |
| +0x3EC | confirmed | sign | Right | negative 97% when held vs 0% |
| +0x64 | confirmed | bit 11 (0x800) | B | set 100% when held vs 4% |
| +0x138 | confirmed | delta | Left | per-frame change correlates -0.95 |
| +0x168 | confirmed | delta | Left | per-frame change correlates -0.95 |
| +0x11C | confirmed | delta | Left | per-frame change correlates -0.95 |
| +0x64 | confirmed | bit 10 (0x400) | B | set 100% when held vs 5% |
| +0x3F0 | confirmed | sign | Right | negative 96% when held vs 1% |
| +0x64 | confirmed | bit 9 (0x200) | B | set 100% when held vs 6% |
| +0x278 | confirmed | delta | Left | per-frame change correlates -0.93 |
| +0x128 | confirmed | delta | Right | per-frame change correlates -0.93 |
| +0x158 | confirmed | delta | Right | per-frame change correlates -0.93 |
| +0xAC | confirmed | sign | B | negative 0% when held vs 93% |
| +0xB8 | confirmed | sign | B | negative 0% when held vs 93% |
| +0x3B8 | confirmed | sign | B | negative 0% when held vs 93% |
| +0x50 | confirmed | delta | Left | per-frame change correlates -0.92 |
| +0x5C | confirmed | delta | Left | per-frame change correlates -0.92 |
| +0x234 | confirmed | delta | Right | per-frame change correlates -0.92 |
| +0x2D4 | confirmed | sign | Right | negative 96% when held vs 5% |
| +0x64 | confirmed | bit 8 (0x100) | B | set 100% when held vs 10% |
| +0xC | confirmed | bit 5 (0x20) | B | set 2% when held vs 92% |
| +0x48 | confirmed | bit 1 (0x2) | B | set 0% when held vs 90% |
| +0x464 | confirmed | bit 0 (0x1) | B | set 0% when held vs 90% |
| +0x3EC | confirmed | bit 5 (0x20) | Left | set 89% when held vs 1% |
| +0x48 | confirmed | value | Right | value correlates +0.87 |
| +0x64 | confirmed | bit 7 (0x80) | B | set 100% when held vs 14% |
| +0x3FC | confirmed | bit 1 (0x2) | B | set 100% when held vs 15% |
| +0x454 | confirmed | value | A | value correlates +0.85 |
| +0x3EC | confirmed | bit 4 (0x10) | Right | set 87% when held vs 3% |
| +0x2A8 | confirmed | bit 11 (0x800) | B | set 89% when held vs 7% |
| +0x2A8 | confirmed | bit 12 (0x1000) | B | set 89% when held vs 7% |
| +0x64 | confirmed | value | B | value correlates +0.82 |
| +0x68 | confirmed | delta | Left | per-frame change correlates -0.81 |
| +0x450 | confirmed | value | A | value correlates -0.78 |
| +0x3F0 | confirmed | bit 5 (0x20) | Left | set 82% when held vs 4% |
| +0xA4 | confirmed | delta | Left | per-frame change correlates -0.77 |
| +0x64 | confirmed | bit 4 (0x10) | B | set 100% when held vs 23% |
| +0x3F0 | confirmed | bit 4 (0x10) | Right | set 79% when held vs 3% |
| +0x44 | confirmed | bit 10 (0x400) | A | set 0% when held vs 75% |
| +0x454 | confirmed | bit 0 (0x1) | A | set 100% when held vs 25% |
| +0x454 | confirmed | bit 2 (0x4) | A | set 100% when held vs 25% |
| +0x454 | confirmed | bit 3 (0x8) | A | set 100% when held vs 25% |
| +0x454 | confirmed | bit 6 (0x40) | A | set 100% when held vs 25% |
| +0xAC | confirmed | bit 11 (0x800) | B | set 11% when held vs 86% |
| +0x3B8 | confirmed | bit 7 (0x80) | B | set 11% when held vs 86% |
| +0xAC | confirmed | bit 12 (0x1000) | B | set 11% when held vs 85% |
| +0x3B8 | confirmed | bit 8 (0x100) | B | set 11% when held vs 85% |
| +0x3EC | confirmed | value | Right | value correlates -0.74 |
| +0x3EC | confirmed | value | Left | value correlates +0.74 |
| +0xEC | confirmed | bit 4 (0x10) | B | set 100% when held vs 26% |
| +0x138 | confirmed | bit 5 (0x20) | B | set 100% when held vs 27% |
| +0x168 | confirmed | bit 5 (0x20) | B | set 100% when held vs 27% |
| +0x278 | confirmed | bit 5 (0x20) | B | set 100% when held vs 27% |
| +0x50 | confirmed | bit 5 (0x20) | B | set 100% when held vs 27% |
| +0xB0 | confirmed | delta | Left | per-frame change correlates -0.73 |
| +0x2D4 | confirmed | value | Left | value correlates +0.72 |
| +0x45C | confirmed | bit 20 (0x100000) | A | set 77% when held vs 4% |
| +0x50 | confirmed | bit 1 (0x2) | B | set 100% when held vs 28% |
| +0x3F0 | confirmed | value | Left | value correlates +0.72 |
| +0x138 | confirmed | bit 1 (0x2) | B | set 100% when held vs 28% |
| +0x168 | confirmed | bit 1 (0x2) | B | set 100% when held vs 28% |
| +0x278 | confirmed | bit 1 (0x2) | B | set 100% when held vs 28% |
| +0x11C | confirmed | bit 4 (0x10) | B | set 100% when held vs 28% |
| +0x3F0 | confirmed | value | Right | value correlates -0.72 |
| +0x2D4 | confirmed | value | Right | value correlates -0.71 |
| +0x5C | confirmed | bit 4 (0x10) | B | set 100% when held vs 29% |
| +0x5C | confirmed | sign | B | negative 100% when held vs 29% |
| +0xA4 | confirmed | sign | B | negative 100% when held vs 30% |
| +0xB0 | confirmed | sign | B | negative 100% when held vs 30% |
| +0x3B0 | confirmed | sign | B | negative 100% when held vs 30% |
| +0x64 | confirmed | bit 5 (0x20) | B | set 100% when held vs 30% |
| +0x4D8 | confirmed | bit 16 (0x10000) | B | set 1% when held vs 71% |
| +0x4D8 | confirmed | bit 17 (0x20000) | B | set 1% when held vs 71% |
| +0x2D4 | confirmed | bit 12 (0x1000) | Left | set 91% when held vs 22% |
| +0xAC | confirmed | sign | A | negative 99% when held vs 30% |
| +0xB8 | confirmed | sign | A | negative 99% when held vs 30% |
| +0x3B8 | confirmed | sign | A | negative 99% when held vs 30% |
| +0x10 | confirmed | bit 7 (0x80) | B | set 98% when held vs 29% |
| +0x44 | confirmed | bit 7 (0x80) | B | set 0% when held vs 68% |
| +0x38C | confirmed | bit 12 (0x1000) | B | set 100% when held vs 32% |
| +0x3A4 | confirmed | delta | B | per-frame change correlates -0.67 |
| +0x68 | confirmed | bit 7 (0x80) | B | set 100% when held vs 33% |
| +0x45C | confirmed | bit 16 (0x10000) | A | set 89% when held vs 21% |
| +0x128 | confirmed | bit 7 (0x80) | B | set 0% when held vs 67% |
| +0x158 | confirmed | bit 7 (0x80) | B | set 0% when held vs 67% |
| +0x4CC | confirmed | bit 3 (0x8) | Left | set 73% when held vs 6% |
| +0x4CC | confirmed | bit 6 (0x40) | Left | set 73% when held vs 6% |
| +0x4CC | confirmed | bit 7 (0x80) | Left | set 73% when held vs 6% |
| +0x4CC | confirmed | delta | Right | per-frame change correlates -0.66 |
| +0x3B0 | confirmed | delta | Left | per-frame change correlates -0.66 |
| +0xC | confirmed | bit 3 (0x8) | A | set 66% when held vs 1% |
| +0xC | confirmed | bit 7 (0x80) | A | set 66% when held vs 1% |
| +0x64 | confirmed | bit 6 (0x40) | B | set 100% when held vs 34% |
| +0x458 | confirmed | bit 20 (0x100000) | A | set 76% when held vs 10% |
| +0xB4 | confirmed | bit 3 (0x8) | B | set 90% when held vs 24% |
| +0x5C | confirmed | bit 3 (0x8) | B | set 100% when held vs 35% |
| +0x4CC | confirmed | bit 5 (0x20) | Left | set 72% when held vs 6% |
| +0xB0 | confirmed | bit 6 (0x40) | B | set 90% when held vs 25% |
| +0x45C | confirmed | bit 21 (0x200000) | B | set 82% when held vs 17% |
| +0x4CC | confirmed | bit 10 (0x400) | Left | set 71% when held vs 7% |
| +0x4D0 | confirmed | bit 10 (0x400) | B | set 0% when held vs 64% |
| +0x2A4 | confirmed | bit 13 (0x2000) | B | set 81% when held vs 17% |
| +0xB4 | confirmed | bit 8 (0x100) | B | set 86% when held vs 22% |
| +0x4CC | confirmed | value | Right | value correlates +0.64 |
| +0x45C | confirmed | bit 2 (0x4) | A | set 74% when held vs 10% |
| +0x4CC | confirmed | bit 0 (0x1) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 1 (0x2) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 12 (0x1000) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 13 (0x2000) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 14 (0x4000) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 15 (0x8000) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 9 (0x200) | Right | set 69% when held vs 6% |
| +0x4CC | confirmed | bit 11 (0x800) | Left | set 70% when held vs 7% |
| +0x64 | confirmed | bit 3 (0x8) | B | set 100% when held vs 37% |
| +0x4CC | confirmed | bit 2 (0x4) | Right | set 69% when held vs 6% |
| +0xE4 | confirmed | delta | Left | per-frame change correlates -0.63 |
| +0xC | confirmed | bit 8 (0x100) | A | set 100% when held vs 37% |
| +0xC | confirmed | bit 9 (0x200) | A | set 0% when held vs 63% |
| +0x3A4 | confirmed | bit 3 (0x8) | A | set 65% when held vs 3% |
| +0x4CC | confirmed | bit 4 (0x10) | Right | set 68% when held vs 6% |
| +0x4CC | confirmed | bit 8 (0x100) | Right | set 68% when held vs 6% |
| +0x288 | confirmed | bit 12 (0x1000) | B | set 0% when held vs 62% |
| +0x290 | confirmed | bit 2 (0x4) | B | set 0% when held vs 62% |
| +0x290 | confirmed | bit 6 (0x40) | B | set 0% when held vs 62% |
| +0x298 | confirmed | sign | B | negative 0% when held vs 62% |
| +0x298 | confirmed | bit 3 (0x8) | B | set 0% when held vs 62% |
| +0x120 | confirmed | delta | Right | per-frame change correlates -0.62 |
| +0x150 | confirmed | delta | Right | per-frame change correlates -0.62 |
| +0x10 | confirmed | bit 3 (0x8) | B | set 98% when held vs 36% |
| +0x2A4 | confirmed | bit 9 (0x200) | B | set 83% when held vs 22% |
| +0x3FC | confirmed | bit 0 (0x1) | B | set 0% when held vs 62% |
| +0xB8 | confirmed | bit 8 (0x100) | B | set 11% when held vs 73% |
| +0x2A4 | confirmed | bit 11 (0x800) | B | set 81% when held vs 20% |
| +0x3EC | confirmed | bit 6 (0x40) | Left | set 67% when held vs 6% |
| +0xA4 | confirmed | bit 6 (0x40) | B | set 87% when held vs 25% |
| +0x3B0 | confirmed | bit 2 (0x4) | B | set 87% when held vs 25% |
| +0x1F0 | confirmed | delta | Right | per-frame change correlates -0.61 |
| +0xB4 | confirmed | bit 7 (0x80) | B | set 84% when held vs 24% |
| +0x58 | confirmed | delta | Right | per-frame change correlates -0.60 |
| +0x64 | confirmed | delta | Right | per-frame change correlates -0.60 |
| +0x140 | confirmed | delta | Right | per-frame change correlates -0.60 |
| +0x170 | confirmed | delta | Right | per-frame change correlates -0.60 |
| +0x2A8 | confirmed | bit 2 (0x4) | A | set 78% when held vs 18% |
| +0x114 | confirmed | delta | Left | per-frame change correlates -0.60 |
| +0x280 | confirmed | delta | Right | per-frame change correlates -0.60 |
| +0x70 | confirmed | delta | Right | per-frame change correlates -0.58 |
| +0x3A8 | confirmed | value | A | value correlates +0.56 |
| +0x48 | confirmed | value | R | value correlates +0.53 |
