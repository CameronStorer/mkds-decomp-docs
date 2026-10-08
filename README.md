# MKDS decompilation research

Public documentation of Cameron Storer's Mario Kart DS research and native
Windows Rust port. Includes progress notes, function meanings, runtime
correlations, structure maps, state machines and animation research.

Site: https://cameronstorer.github.io/mkds-decomp-docs/

The interactive function explorer is built from the research inventory. Known,
inferred, SDK and unknown classifications are distinct. Counts describe mapping
coverage, not game completion or universal runtime verification.

## Build locally

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
.venv/Scripts/python.exe build.py
python -m http.server 8000 --directory _site
```

Open http://localhost:8000. The builder outputs static HTML, CSS, JavaScript and
function metadata. GitHub Actions builds and publishes every push to `main`.

## Update from the game research workspace

```powershell
./publish.ps1 -SourceDirectory "C:\path\to\My_NDS_GAME"
```

Regenerate `docs/FUNCTION_MAP.md` and `docs/FUNCTION_TABLE.csv` in that workspace
when meanings change. `sync.py` copies only explicitly listed documentation and
the metadata CSV. Review the diff before adding new paths to the allowlist.
For a separate clone, first install `requirements.txt` locally.

Local workspace changes are not automatically public. They become live after
syncing and pushing this repository. Snapshots retain source-file names and
update dates; references to unpublished local code are shown as local references.

This repository contains research documentation and site tooling. ROMs, game
assets, extracted code binaries, decompiled source exports, save states and IDA
databases are not included. No copyright license for third-party material is
implied. This independent project is not affiliated with Nintendo.
