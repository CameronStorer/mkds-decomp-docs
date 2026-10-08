# User-supplied ROM build workflow

The intended release contains our Rust implementation and tools. Users supply
their own ROM locally. This describes engineering boundaries, not legal clearance.

## Existing foundation

`vm_model/src/assets.rs` already reads the NDS filesystem, LZ10-compressed CARC
archives and NARC entries directly. `game/src/main.rs` accepts `--rom PATH` or
`MKDS_ROM`; extracted assets do not need to be distributed for that path.

`tools/nds_extract.py ROM --out DIRECTORY` produces decompressed code sections,
overlay manifests and IDA load plans. It requires ndspy. `asset_organizer.py`
organizes an existing dump; it does not itself perform ROM extraction.

Example development run, from the repository root:

```powershell
cargo run --release --manifest-path game/Cargo.toml -- --rom "C:\path\owned-copy.nds"
```

This is a native Rust executable reading original data. It does not currently
automatically recompile all decompiled C. Generating C with IDA is a research
workflow, not a necessary runtime prerequisite or a portable end-user build step.

## Proposed reproducible release path

1. Accept a ROM path and compute game code, revision, size and SHA-256 locally.
   Report explicitly whether that revision is supported; do not silently apply
   AMCE address maps to another revision.
2. Read assets directly, or extract to a user-owned cache keyed by ROM hash.
   Include cache format/version and source provenance in a generated manifest.
3. Read tables from supported binary locations where practical, rather than
   relying on committed generated asset dumps. Document each table's source and
   how it is interpreted. Review hard-coded ROM-derived tables separately.
4. Build our implementation using the checked-in Cargo lockfile, or distribute
   a reviewed native binary with a ROM picker. End users should not need IDA,
   BizHawk or a C decompiler merely to play the port.
5. Verify the result from an empty cache and an explicit ROM path. Ensure no
   developer-local asset directories, save states or absolute paths are required.

Before publishing, audit the package for ROMs, extracted assets/code binaries,
exported Nintendo C/assembly, IDA databases, emulator save states, audio exports
and generated build artifacts containing game data. A ROM requirement alone
does not determine the copyright status of other included material. Obtain
appropriate legal review for the actual package and intended distribution.

## Documentation target

For each original routine retain segment + address, meaningful name, callers,
inputs/outputs and structure fields, state transitions, arithmetic details,
confidence, Rust counterpart and verification evidence. Unknown routines remain
explicitly unknown. Separate game logic from SDK, hardware, networking and debug
code so that documenting everything does not imply porting every routine.

Claude's current semantic catalog is `docs/FUNCTION_MAP.md`; the animation
supplement is `analysis/CODEX_ANIMATION_MAP.md`. The former is generated from
source comments and `docs/function_notes.md` and currently targets plan0. A
future catalog migration should reconcile segment identities against plan2.
