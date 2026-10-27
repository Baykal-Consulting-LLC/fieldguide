import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {filterPathways,discoveryPage,programChoices,careerPossibilities,connectionNote} from '../dist/discovery-ui.js';
import {careerExamples,stageFor,cleanDraft,freshDraft} from '../dist/engine.js';
const read=p=>JSON.parse(fs.readFileSync(p)),data=read('dist/data/pathways.json'),occupations=read('dist/data/occupations.json'),coverage=read('dist/data/coverage.json'),sources=read('dist/data/sources.json');
// Independent source join: do not derive the expected scope from generated coverage.
const links=JSON.parse(execFileSync('python3',['-c',`
import json,zipfile,xml.etree.ElementTree as E
z=zipfile.ZipFile('.cache/Education_CIP_to_ONET_SOC.xlsx'); ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss=[''.join(t.itertext()) for t in E.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',ns)]; links=[]
for row in E.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//m:sheetData/m:row',ns):
 c={x.attrib['r'].rstrip('0123456789'):(ss[int(x.find('m:v',ns).text)] if x.attrib.get('t')=='s' else x.findtext('m:v',default='',namespaces=ns)) for x in row}
 a,b=c.get('A',''),c.get('C','')
 if len(a)==7 and a[2]=='.': links.append([a,b])
print(json.dumps(links))
`],{encoding:'utf8'}));
const linked=new Set(links.map(x=>x[1]).filter(c=>occupations[c]));
const prep=new Map(read('shared-data/education/bls-preparation-2025.json').records.filter(r=>r.occupationType==='Line item').map(r=>[r.soc,r]));
const levels=new Set(['Some college, no degree','Postsecondary nondegree award',"Associate's degree","Bachelor's degree","Master's degree",'Doctoral or professional degree']);
const relevant=new Set([...linked,...Object.keys(occupations).filter(c=>levels.has(prep.get(c.slice(0,7))?.education))]);

test('every occupation meeting the source-based college policy is grouped; exclusions remain explicit',()=>{
 assert.equal(relevant.size,829);assert.equal(linked.size,825);
 assert.deepEqual(new Set(data.pathways.flatMap(p=>p.occupations)),relevant);
 for(const [code,o] of Object.entries(coverage.occupations)){
  assert.equal(o.included,relevant.has(code),code);
  assert.deepEqual(o.pathways,data.pathways.filter(p=>p.occupations.includes(code)).map(p=>p.id));
  assert.equal(!!o.exclusionReason,!o.included);
 }
 assert.equal(coverage.counts.unmappedRelevant,0);assert.equal(Object.keys(occupations).length,1016);
});
test('all official crosswalk rows survive grouping without invented program links',()=>{
 const actual=new Set(data.pathways.flatMap(p=>p.programs.flatMap(x=>x.occupations.map(c=>x.cip+':'+c))));
 const expected=new Set(links.filter(([,c])=>occupations[c]).map(([cip,c])=>cip+':'+c));
 assert.deepEqual(actual,expected);assert.equal(expected.size,8501);
});
test('four missing CIP connections stay editorial and never enter a program-filtered result',()=>{
 const editorial=Object.entries(occupations).filter(([,o])=>o.connectionBasis==='editorial-bls').map(([c])=>c);
 assert.deepEqual(editorial.sort(),['25-3031.00','25-3041.00','29-2099.08','41-9031.00']);
 for(const p of data.pathways)for(const c of editorial.filter(c=>p.occupations.includes(c))){
  assert.match(connectionNote(occupations[c]),/no direct CIP/);
  for(const program of p.programs)assert.ok(!careerExamples(p,occupations,program.cip).some(o=>o.soc===c));
 }
});
test('first exploration screen shows six areas, optional full inventory and only four scored starting points',()=>{
 const args={data,occupations,sources,profile:{complete:false},areaFilter:'all',query:'',browseAll:false,card:p=>'<article data-path="'+p.id+'"></article>',lifestyle:'',profileStrip:'',earningsIntro:''};
 const empty=discoveryPage(args);assert.equal((empty.match(/class="area-card /g)||[]).length,6);assert.doesNotMatch(empty,/data-path=/);
 const scored=discoveryPage({...args,profile:{complete:true,raw:[29,36,23,17,16,27]}});assert.equal((scored.match(/data-path=/g)||[]).length,4);
 const all=discoveryPage({...args,browseAll:true});assert.equal((all.match(/data-path=/g)||[]).length,36);
 assert.ok(filterPathways(data.pathways,occupations,{query:'Sales Engineers'}).some(p=>p.id==='engineering'));
});
test('residencies are separate later training and large career inventories start with four',()=>{
 const p=data.pathways.find(p=>p.id==='health-professional'),html=programChoices(p);
 assert.ok(p.programs.some(x=>x.stage==='post-professional'));assert.match(html,/not first college majors/);
 const card=o=>'<article data-career="'+o.soc+'"></article>';
 const initial=careerPossibilities(p,occupations,{occupationCard:card});assert.equal((initial.match(/data-career=/g)||[]).length,4);assert.match(initial,/Show 20 more/);
 const later=careerPossibilities(p,occupations,{stageFilter:'further-study',limit:24,occupationCard:card});assert.ok((later.match(/data-career=/g)||[]).length<=24);
 for(const c of p.occupations.filter(c=>occupations[c].stage==='further-study'))assert.match(stageFor(occupations[c]),/Additional/);
});
test('new pathways preserve old draft IDs and unknown preparation stays unknown',()=>{
 const d=freshDraft();d.saved=['software','electrical','design'];d.notes.software='Existing private draft';
 assert.deepEqual(cleanDraft(d,data.pathways.map(p=>p.id)),d);
 for(const o of Object.values(occupations))if(!prep.has(o.soc.slice(0,7)))assert.equal(o.stage,'unknown');
 assert.equal(sources.collegeRelevant,coverage.counts.collegeRelevant);
});
