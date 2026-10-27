import unittest,tempfile,subprocess,sys,json,shutil,os
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
class Updates(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.w=Path(self.tmp.name);f=self.w/'shared-foundation';(f/'source/assessment').mkdir(parents=True);(f/'source/wages').mkdir();(f/'tools').mkdir();(f/'releases').mkdir();shutil.copyfile(BASE/'tools/manage.py',f/'tools/manage.py')
  for a in ['onet-assessment.js','questions.json']:shutil.copyfile(BASE/'source/assessment'/a,f/'source/assessment'/a)
  (f/'COORDINATION.md').write_text('Coordination fixture')
  (f/'source/contracts').mkdir();(f/'source/contracts/rules.md').write_text('common rules')
  (f/'source/SOURCES.json').write_text('{"scope":"public fixture"}');(f/'source/wages/example.json').write_text('{"value":1}')
  reg={}
  for name,folder in [('approach1','site'),('approach2','approach-2')]:
   app=self.w/folder;app.mkdir();(app/'AGENTS.md').write_text('Own app instructions\n<!-- COMMON -->\ncommon rules\n<!-- END COMMON -->\n');(app/'.openai').mkdir(parents=True);(app/'dist').mkdir();(app/'package.json').write_text('{"type":"module"}');(app/'.openai/hosting.json').write_text(json.dumps({'project_id':name}))
   reg[name]={'root':folder,'contractVersion':1,'siteId':name,'mapping':{'contracts/coordination.md':'SHARED-FOUNDATION.md','assessment/onet-assessment.js':'dist/onet-assessment.js','assessment/questions.json':'data/questions.json','wages/example.json':'data/example.json'},'compatibilityCommands':[],'fragments':{'contracts/rules.md':{'path':'AGENTS.md','start':'<!-- COMMON -->','end':'<!-- END COMMON -->'}}}
  (f/'consumers.json').write_text(json.dumps(reg));self.call('release','--version','1.0.0');self.call('adopt','--app','both','--version','1.0.0')
 def tearDown(self):self.tmp.cleanup()
 def call(self,*args,ok=True,tool=None):
  r=subprocess.run([sys.executable,str(tool or self.w/'shared-foundation/tools/manage.py'),*args,'--workspace',str(self.w)],capture_output=True,text=True)
  if ok:self.assertEqual(r.returncode,0,r.stdout+r.stderr)
  else:self.assertNotEqual(r.returncode,0)
  return r
 def new(self):
  (self.w/'shared-foundation/source/wages/example.json').write_text('{"value":2}');self.call('release','--version','1.0.1')
 def test_standalone_consumer_and_immutable_release(self):
  self.call('release','--version','1.0.0',ok=False);f=self.w/'shared-foundation';f.rename(self.w/'offline-source');self.call('check',tool=self.w/'site/scripts/shared-foundation.py')
 def test_pin_drift_blocks_both_before_writes(self):
  self.new();lock=(self.w/'site/shared-foundation.lock.json').read_bytes();(self.w/'approach-2/data/example.json').write_text('local edit');self.call('adopt','--app','both','--version','1.0.1',ok=False);self.assertEqual((self.w/'site/shared-foundation.lock.json').read_bytes(),lock);self.assertEqual((self.w/'site/data/example.json').read_text(),'{"value":1}')
 def test_late_failure_rolls_back_both(self):
  self.new();p=self.w/'shared-foundation/consumers.json';r=json.loads(p.read_text());r['approach2']['compatibilityCommands']=[[sys.executable,'-c','raise SystemExit(7)']];p.write_text(json.dumps(r));locks=[(self.w/a/'shared-foundation.lock.json').read_bytes() for a in ['site','approach-2']];self.call('adopt','--app','both','--version','1.0.1',ok=False)
  for a,l in zip(['site','approach-2'],locks):self.assertEqual((self.w/a/'shared-foundation.lock.json').read_bytes(),l);self.assertEqual((self.w/a/'data/example.json').read_text(),'{"value":1}');self.assertFalse((self.w/a/'shared-foundation/releases/1.0.1.tar.gz').exists())
 def test_active_build_blocks_update(self):
  self.new();p=self.w/'site/.shared-foundation-use.lock';p.mkdir();self.call('adopt','--app','both','--version','1.0.1',ok=False);self.assertFalse((self.w/'shared-foundation/.update-lock').exists())
 def test_build_wrapper_holds_and_releases_lease(self):
  app=self.w/'site';r=subprocess.run([sys.executable,str(app/'scripts/shared-foundation.py'),'run','--',sys.executable,'-c',"from pathlib import Path; assert Path('.shared-foundation-use.lock/token').exists();raise SystemExit(3)"],capture_output=True,text=True);self.assertEqual(r.returncode,3,r.stderr);self.assertFalse((app/'.shared-foundation-use.lock').exists())
 def test_nested_build_commands_share_only_the_same_app_lease(self):
  app=self.w/'site';tool=str(app/'scripts/shared-foundation.py');r=subprocess.run([sys.executable,tool,'run','--',sys.executable,tool,'run','--',sys.executable,'-c','print("nested build")'],capture_output=True,text=True);self.assertEqual(r.returncode,0,r.stdout+r.stderr);self.assertFalse((app/'.shared-foundation-use.lock').exists())
 def test_corrupt_package_and_runtime_sibling_import_rejected(self):
  p=self.w/'site/shared-foundation/releases/1.0.0.tar.gz';b=p.read_bytes();p.write_bytes(b+b'corrupt');self.call('check',tool=self.w/'site/scripts/shared-foundation.py',ok=False);p.write_bytes(b);(self.w/'site/dist/unsafe.js').write_text("import '../../approach-2/dist/onet-assessment.js';");self.call('check',tool=self.w/'site/scripts/shared-foundation.py',ok=False)
 def test_incompatible_contract_and_private_source_rejected(self):
  self.new();p=self.w/'shared-foundation/consumers.json';r=json.loads(p.read_text());r['approach2']['contractVersion']=2;p.write_text(json.dumps(r));self.call('adopt','--app','both','--version','1.0.1',ok=False);private=self.w/'shared-foundation/source/accounts';private.mkdir();(private/'fixture.json').write_text('{}');self.call('release','--version','1.0.2',ok=False)
 def test_shared_instructions_are_guarded_but_app_instructions_can_evolve(self):
  p=self.w/'site/AGENTS.md';p.write_text('New app-specific rule\n'+p.read_text());self.call('check',tool=self.w/'site/scripts/shared-foundation.py');p.write_text(p.read_text().replace('common rules','tampered rules'));self.call('check',tool=self.w/'site/scripts/shared-foundation.py',ok=False)
 def test_questionnaire_change_requires_new_reviewed_contract(self):
  p=self.w/'shared-foundation/source/assessment/questions.json';p.write_text('{}');self.call('release','--version','1.0.1',ok=False)
if __name__=='__main__':unittest.main()
