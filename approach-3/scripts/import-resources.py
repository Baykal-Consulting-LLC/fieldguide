#!/usr/bin/env python3
"""Explicit, read-only upstream snapshot. Never run as part of an app build."""
import hashlib, json, re, subprocess, tarfile
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parent
sha = lambda b: hashlib.sha256(b).hexdigest()
lock = json.loads((APP / 'shared-foundation.lock.json').read_text())
archive = ROOT / lock['archive']
assert sha(archive.read_bytes()) == lock['archiveSHA256']
with tarfile.open(archive) as t:
    canonical = {n.removeprefix('payload/'): t.extractfile(n).read() for n in t.getnames() if n.startswith('payload/') and t.getmember(n).isfile()}
managed = {}
for name in ('approach1','approach2'):
    folder = ROOT / ('site' if name == 'approach1' else 'approach-2')
    pin = json.loads((folder / 'shared-foundation.lock.json').read_text())
    managed[name] = {v:k for k,v in pin['mapping'].items() if k != '@tool'}

records = []
seen = set()
imports = re.compile(r'''(?:from\s*|import\s*\(|import\s*)["'](\.[^"']+)["']''')
def copy_module(name, relative):
    relative = relative.split('?')[0]
    folder = ROOT / ('site' if name == 'approach1' else 'approach-2')
    src = (folder / relative).resolve()
    assert src.is_relative_to(folder.resolve()), src
    rel = src.relative_to(folder).as_posix()
    key = name + '/' + rel
    if key in seen: return
    seen.add(key)
    raw = src.read_bytes()
    common_key = managed[name].get(rel)
    if common_key:
        assert common_key in canonical, common_key
        assert raw == canonical[common_key], f'Common data mismatch: {key}'
        raw = canonical[common_key]
    dest = APP / 'upstreams' / key
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(raw)
    records.append({'path':dest.relative_to(APP).as_posix(),'source':src.relative_to(ROOT).as_posix(),'sha256':sha(raw),'bytes':len(raw),'origin':f'foundation:{lock["version"]}:{common_key}' if common_key else name})
    if src.suffix in ('.js','.mjs'):
        for dep in imports.findall(raw.decode()):
            copy_module(name, (src.parent / dep.split('?')[0]).relative_to(folder).as_posix())

for entry in ('career-source.mjs','pathway-source.mjs'):
    for path in imports.findall((APP/'src'/entry).read_text()):
        bits = path.removeprefix('../upstreams/').split('/',1)
        copy_module(*bits)
for item in ('pathways','occupations','coverage','pathway-earnings','sources'):
    src = ROOT / 'approach-2/dist/data' / (item+'.json')
    dest = APP / 'resources/upstream-data' / src.name
    dest.parent.mkdir(parents=True,exist_ok=True)
    raw=src.read_bytes();dest.write_bytes(raw)
    records.append({'path':dest.relative_to(APP).as_posix(),'source':src.relative_to(ROOT).as_posix(),'sha256':sha(raw),'bytes':len(raw),'origin':'approach2-public-projection'})
commits = {n:subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT/f,text=True).strip() for n,f in [('approach1','site'),('approach2','approach-2')]}
manifest={'schemaVersion':1,'snapshot':'2026-10-25','sharedPin':lock['version'],'commits':commits,'files':records,'refresh':'Explicitly run scripts/import-resources.py after coordinating; never edit generated upstreams.'}
(APP/'resources/snapshot.json').write_text(json.dumps(manifest,indent=2)+'\n')

handoff=json.loads((ROOT/'outputs/approach-2-resource-handoff-2026-10-25/resource-index-v1.json').read_text())
reconciled=[]
for r in handoff['resources']:
    src=Path(r['path']); src=src if src.is_absolute() else ROOT/src
    actual=sha(src.read_bytes()) if src.is_file() else None
    intentional=r['path'] in ['shared-foundation/consumers.json','shared-foundation/COORDINATION.md']
    status='exact' if actual==r['sha256'] else 'intentional-registration-change' if intentional and actual else 'missing' if actual is None else 'changed'
    reconciled.append({**r,'actualSHA256':actual,'reconciliation':status,'use':'reference-only; excluded from student runtime' if not r['sharedReleaseEligibleNow'] else 'canonical immutable public foundation'})
assert not [r for r in reconciled if r['reconciliation'] in ('missing','changed')], 'Unexpected handoff mismatch'
(APP/'research/handoff-reconciliation.json').write_text(json.dumps({'sourceSnapshot':handoff['snapshotId'],'resources':reconciled,'note':'A3 pins tooling/contract release 1.3.0. Public assessment and data payloads are byte-identical to 1.2.0; original consumers remain pinned.'},indent=2)+'\n')

# Inventory the complete tracked resources without copying identities, accounts,
# original publication settings, real records, frozen histories or databases.
catalog=[]
for name,folder in [('approach1','site'),('approach2','approach-2')]:
    base=ROOT/folder
    for rel in subprocess.check_output(['git','ls-files','-z'],cwd=base).decode().split('\0'):
        if not rel or not (base/rel).is_file(): continue
        is_runtime=any(r['source']==folder+'/'+rel for r in records)
        boundary='runtime snapshot' if is_runtime else 'reference only; not student runtime'
        if any(s in rel.lower() for s in ['.env','.openai/','.firebase','account','owner-only','.sqlite','credential','recording']): boundary='restricted; not copied'
        catalog.append({'approach':name,'path':rel,'bytes':(base/rel).stat().st_size,'use':boundary})
(APP/'research/resource-catalog.json').write_text(json.dumps({'commits':commits,'resources':catalog},indent=2)+'\n')
print(json.dumps({'copiedRuntimeFiles':len(records),'bytes':sum(x['bytes'] for x in records),'inventoryFiles':len(catalog),'handoffExact':sum(x['reconciliation']=='exact' for x in reconciled),'intentionalChanges':sum(x['reconciliation']=='intentional-registration-change' for x in reconciled),'commits':commits}))
