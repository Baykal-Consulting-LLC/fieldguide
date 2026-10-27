#!/usr/bin/env python3
"""Check this app's immutable snapshots without requiring sibling checkouts."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'resources/snapshot.json').read_text())
for f in manifest['files']:
    p=root/f['path']
    assert p.is_file() and not p.is_symlink(), f['path']
    assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'], f['path']
    if p.suffix in ('.js','.mjs'):
        s=p.read_text()
        assert not any(x in s for x in ['file:///Users/','../../../site/','../../../approach-2/']), f['path']
assert len(set(f['path'] for f in manifest['files']))==len(manifest['files'])
print(f"Verified {len(manifest['files'])} pinned local resources; no sibling checkout needed.")
