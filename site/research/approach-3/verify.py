import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parent
manifest=json.loads((root/'manifest.json').read_text())
for row in manifest['files']:
 p=root/row['path']
 assert p.is_file() and not p.is_symlink(),row['path']
 assert p.stat().st_size==row['bytes'],row['path']
 assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],row['path']
print(f"Verified {len(manifest['files'])} unchanged archived research files.")
