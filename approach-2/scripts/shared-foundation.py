#!/usr/bin/env python3
"""Versioned public assets. Consumer checks use only their own pinned archive."""
import argparse, contextlib, hashlib, io, json, os, re, shutil, subprocess, sys, tarfile, tempfile, secrets
from pathlib import Path
SCRIPT=Path(__file__).resolve()
LOCAL=SCRIPT.parents[1] if SCRIPT.parent.name=='scripts' else None
DEFAULT_WORKSPACE=LOCAL.parent if LOCAL else SCRIPT.parents[2]
sha=lambda b:hashlib.sha256(b).hexdigest()
def fail(s):raise ValueError(s)
def relative(s):
 p=Path(s)
 if p.is_absolute() or '..' in p.parts or not p.parts:fail('Unsafe asset path: '+s)
 return p

def load_release(path,expected=None):
 raw=path.read_bytes()
 if expected and sha(raw)!=expected:fail('Pinned archive checksum mismatch')
 with tarfile.open(fileobj=io.BytesIO(raw),mode='r:gz') as t:
  for m in t.getmembers():
   relative(m.name)
   if not m.isfile():fail('Archive links/directories are forbidden')
  manifest=json.load(t.extractfile('manifest.json'));payload={}
  for key,meta in manifest['files'].items():
   relative(key);b=t.extractfile('payload/'+key).read()
   if sha(b)!=meta['sha256'] or len(b)!=meta['bytes']:fail('Corrupt asset '+key)
   payload[key]=b
  tool=t.extractfile('tools/shared-foundation.py').read()
  if sha(tool)!=manifest['toolSHA256']:fail('Corrupt updater')
 return raw,manifest,payload,tool

def release(workspace,version):
 if not re.fullmatch(r'\d+\.\d+\.\d+',version):fail('Use a numeric semantic version')
 base=workspace/'shared-foundation';target=base/'releases'/(version+'.tar.gz')
 if target.exists():fail('Release is immutable; create a new version instead')
 source=base/'source';files={}
 allowed={'SOURCES.json','assessment','contracts','education','onet31','wages','lifestyle'}
 inputs={p.relative_to(source).as_posix():p for p in source.rglob('*') if p.is_file()}
 inputs['contracts/coordination.md']=base/'COORDINATION.md'
 registry=json.loads((base/'consumers.json').read_text());registered={'SOURCES.json'}
 for c in registry.values():registered.update(c['mapping']);registered.update(c.get('fragments',{}))
 for key,p in sorted(inputs.items()):
  if not p.is_file():continue
  if key not in registered or key.split('/')[0] not in allowed or p.is_symlink():fail('Unapproved source '+key)
  b=p.read_bytes();files[key]={'sha256':sha(b),'bytes':len(b)}
 if not files:fail('Empty release')
 baseline=base/'releases/1.0.0.tar.gz'
 if baseline.exists():
  _,previous,_,_=load_release(baseline)
  if previous['files']['assessment/questions.json']['sha256']!=files['assessment/questions.json']['sha256']:fail('Official questionnaire change needs a reviewed new instrument contract, not a routine data release')
 tool=(base/'tools/manage.py').read_bytes()
 manifest={'schemaVersion':1,'version':version,'contractVersion':1,'files':files,'toolSHA256':sha(tool),'scope':'Public reference data only; no student/account/private records.','provenance':json.loads((source/'SOURCES.json').read_text())}
 target.parent.mkdir(exist_ok=True)
 with tarfile.open(target,'w:gz') as t:
  def add(name,b):
   item=tarfile.TarInfo(name);item.size=len(b);item.mode=0o644;item.mtime=0;t.addfile(item,io.BytesIO(b))
  add('manifest.json',json.dumps(manifest,sort_keys=True).encode());add('tools/shared-foundation.py',tool)
  for key in files:add('payload/'+key,inputs[key].read_bytes())
 load_release(target);print(json.dumps({'release':version,'files':len(files),'archiveSHA256':sha(target.read_bytes())}))

GOLDEN="""import{pathToFileURL}from'node:url';import assert from'node:assert/strict';const m=await import(pathToFileURL(process.argv[1]));assert.equal(m.onetQuestions.length,60);const fs=await import('node:fs');const q=JSON.parse(fs.readFileSync(process.argv[2])).response;assert.deepEqual(m.onetQuestions.map(x=>x.text),q.question.map(x=>x.text));assert.deepEqual(m.onetResponseOptions.map(x=>x.value),q.answer_option.map(x=>x.value));assert.equal(new Set(m.onetQuestions.map(q=>q.id)).size,60);const run=v=>m.scoreOnetInterest({profileJourney:{officialInterest:{instrument:m.onetInstrument.id,version:m.onetInstrument.version,answers:Object.fromEntries(m.onetQuestions.map(q=>[q.id,v[q.theme]]))}}});assert.deepEqual(run({R:1,I:2,A:3,S:4,E:5,C:3}).raw,[0,10,20,30,40,20]);assert.equal(run({R:3,I:3,A:3,S:3,E:3,C:3}).flat,true);assert.equal(run({R:1,I:1,A:1,S:1,E:1,C:1}).allDislike,true);console.log('Official wording hash, 60 items and scoring contract verified');"""
def boundary(app):
 # No live sibling imports or symlinked managed assets. External hyperlinks are allowed.
 issues=[]
 for p in (app/'dist').rglob('*.js'):
  if p.is_symlink():issues.append(str(p.relative_to(app))+': symlinked runtime source');continue
  for value in re.findall(r'(?:from\s*|import\s*\(?\s*)[\'\"]([^\'\"]+)',p.read_text(errors='replace')):
   if value.startswith('.') and not (p.parent/value.split('?')[0]).resolve().is_relative_to(app.resolve()):issues.append(str(p.relative_to(app))+': cross-repository import '+value)
 if issues:fail('\n'.join(issues))

def fragment_text(path,config):
 text=path.read_text();start=config['start'];end=config['end']
 if text.count(start)!=1 or text.count(end)!=1:fail('Missing/duplicate managed instruction markers: '+str(path))
 a=text.index(start)+len(start);b=text.index(end)
 if a>b:fail('Invalid instruction marker order')
 return text,a,b

def check(app):
 lock=json.loads((app/'shared-foundation.lock.json').read_text());raw,m,payload,tool=load_release(app/relative(lock['archive']),lock['archiveSHA256'])
 if m['version']!=lock['version'] or m['contractVersion']!=lock['contractVersion']:fail('Incompatible lock/release')
 for asset,dest in lock['mapping'].items():
  p=app/relative(dest)
  if p.is_symlink() or not p.resolve().is_relative_to(app.resolve()):fail('Managed asset escapes app')
  expected=tool if asset=='@tool' else payload[asset]
  if not p.exists() or sha(p.read_bytes())!=sha(expected):fail('Shared asset drift: '+dest+'; promote centrally, do not overwrite it locally')
 for asset,config in lock.get('fragments',{}).items():
  p=app/relative(config['path']);text,a,b=fragment_text(p,config)
  if text[a:b]!= '\n'+payload[asset].decode().strip()+'\n':fail('Shared instruction drift: '+config['path'])
 site=app/'.openai/hosting.json'
 if site.exists() and json.loads(site.read_text()).get('project_id')!=lock['siteId']:fail('Site identity changed; explicit coordination required')
 boundary(app)
 subprocess.run(['node','--input-type=module','-e',GOLDEN,str(app/'dist/onet-assessment.js'),str(app/lock['mapping']['assessment/questions.json'])],check=True,stdout=subprocess.DEVNULL)
 print(json.dumps({'app':lock['app'],'release':lock['version'],'managedFiles':len(lock['mapping']),'localPinVerified':True,'crossAppRuntimeImports':False}))
 return lock

@contextlib.contextmanager
def exclusive(base):
 p=base/'.update-lock'
 try:p.mkdir()
 except FileExistsError:fail('Another shared update is active; do not update concurrently')
 try:(p/'owner.json').write_text(json.dumps({'pid':os.getpid()}));yield
 finally:shutil.rmtree(p)

def plans(workspace,apps,version):
 base=workspace/'shared-foundation';registry=json.loads((base/'consumers.json').read_text());raw,m,payload,tool=load_release(base/'releases'/(version+'.tar.gz'));result=[]
 for name in apps:
  c=registry[name];app=(workspace/relative(c['root'])).resolve()
  if (workspace/c['root']/'.shared-foundation-use.lock').exists():fail('Consumer build is active: '+name)
  if c['contractVersion']!=m['contractVersion']:fail('Incompatible answer/data contract for '+name)
  old=check(app) if (app/'shared-foundation.lock.json').exists() else None
  mapping={**c['mapping'],'@tool':'scripts/shared-foundation.py'};writes={};changes=[]
  if json.loads((app/'.openai/hosting.json').read_text())['project_id']!=c['siteId']:fail('Site identity mismatch')
  for asset,dest in mapping.items():
   b=tool if asset=='@tool' else payload[asset];p=app/relative(dest)
   if not p.resolve().is_relative_to(app) or p.is_symlink():fail('Unsafe managed destination')
   if p.exists() and p.read_bytes()==b:continue
   if p.exists() and (not old or dest not in old['mapping'].values()):fail('New managed asset differs from existing unowned file: '+str(p))
   writes[p]=b;changes.append(dest)
  for asset,config in c.get('fragments',{}).items():
   p=app/relative(config['path']);text,a,b=fragment_text(p,config);replacement='\n'+payload[asset].decode().strip()+'\n'
   if text[a:b]!=replacement:writes[p]=(text[:a]+replacement+text[b:]).encode();changes.append(config['path']+' (shared instructions only)')
  archive='shared-foundation/releases/'+version+'.tar.gz';writes[app/archive]=raw
  lock={'schemaVersion':1,'app':name,'version':version,'contractVersion':m['contractVersion'],'archive':archive,'archiveSHA256':sha(raw),'siteId':c['siteId'],'mapping':mapping,'fragments':c.get('fragments',{})}
  writes[app/'shared-foundation.lock.json']=(json.dumps(lock,indent=2)+'\n').encode();result.append((app,writes,changes))
 return result

def adopt(workspace,apps,version,dry=False):
 base=workspace/'shared-foundation'
 with exclusive(base):
  plan=plans(workspace,apps,version)
  if dry:print(json.dumps([{'app':str(app),'changedFiles':changes} for app,writes,changes in plan],indent=2));return
  backup={}
  try:
   for app,writes,changes in plan:
    for p,b in writes.items():
     backup[p]=p.read_bytes() if p.exists() else None;p.parent.mkdir(parents=True,exist_ok=True)
     temp=p.with_name(p.name+'.shared-tmp');temp.write_bytes(b);os.replace(temp,p)
   for app,_,_ in plan:check(app)
   registry=json.loads((base/'consumers.json').read_text())
   for name in apps:
    for cmd in registry[name].get('compatibilityCommands',[]):subprocess.run(cmd,cwd=workspace/registry[name]['root'],check=True)
  except BaseException:
   for p,b in backup.items():
    if b is None:p.unlink(missing_ok=True)
    else:p.write_bytes(b)
   raise
  print(json.dumps({'adopted':version,'apps':apps,'atomicRollbackOnFailure':True,'buildsAndDeployments':'Remain app-owned; not published by this command'}))

def run_consumer(app,command):
 if not command:fail('A build/test command is required after --')
 lease=app/'.shared-foundation-use.lock';update=app.parent/'shared-foundation/.update-lock'
 inherited=os.environ.get('FIELDGUIDE_SHARED_LEASE')
 if lease.exists() and inherited and (lease/'token').read_text()==inherited:
  check(app);return subprocess.run(command,cwd=app).returncode
 if update.exists():fail('Shared update in progress; retry this build after it completes')
 try:lease.mkdir()
 except FileExistsError:fail('Another consumer build is active; do not run overlapping builds')
 token=secrets.token_hex(16)
 try:
  (lease/'token').write_text(token);(lease/'owner.json').write_text(json.dumps({'pid':os.getpid()}))
  if update.exists():fail('Shared update started; retry build after it completes')
  check(app);env={**os.environ,'FIELDGUIDE_SHARED_LEASE':token};return subprocess.run(command,cwd=app,env=env).returncode
 finally:shutil.rmtree(lease)

def main():
 if len(sys.argv)>1 and sys.argv[1]=='run':
  if LOCAL is None:fail('run is a consumer command; use the app-local script')
  command=sys.argv[2:]
  if command and command[0]=='--':command=command[1:]
  sys.exit(run_consumer(LOCAL,command))
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['release','plan','adopt','check','status','boundary']);p.add_argument('--workspace',type=Path,default=DEFAULT_WORKSPACE);p.add_argument('--app',choices=['approach1','approach2','both']);p.add_argument('--version');a=p.parse_args();w=a.workspace.resolve()
 if a.command in ['check','status','boundary']:
  roots=[LOCAL] if LOCAL and not a.app else [(w/('site' if n=='approach1' else 'approach-2')) for n in (['approach1','approach2'] if a.app in (None,'both') else [a.app])]
  for root in roots:
   if a.command=='boundary':boundary(root);print('Runtime boundary verified: '+str(root))
   else:check(root)
 elif a.command=='release':
  if not a.version:fail('--version required')
  with exclusive(w/'shared-foundation'):release(w,a.version)
 else:
  if not a.version or not a.app:fail('--version and --app required')
  adopt(w,['approach1','approach2'] if a.app=='both' else [a.app],a.version,a.command=='plan')
if __name__=='__main__':
 try:main()
 except (ValueError,KeyError,OSError,subprocess.CalledProcessError) as e:print('Shared foundation: '+str(e),file=sys.stderr);sys.exit(1)
