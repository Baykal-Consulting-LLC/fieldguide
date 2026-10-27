import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {currentModelStates} from './current-model-states.mjs';
import {broadExplorationPool,broadQuestionQueue,explorationPreview} from '../dist/broad-exploration.js';
import {careerComparisonOptions} from '../dist/career-comparisons.js';
import {planMatchCandidates} from '../dist/plan-matches.js';
import {careerTitle} from '../dist/career-presentation.js';
import {educationRoutesFor} from '../dist/education-routes.js';
const dir='research/broad-exploration-051',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),protocol=read(dir+'/protocol.json'),baseline=read(dir+'/baseline-050.json'),old=new Map(baseline.rows.map(r=>[r.id,r]));
const amendments=fs.existsSync(dir+'/implementation-amendments.json')?read(dir+'/implementation-amendments.json').changes:[];
for(const[file,hash]of Object.entries(protocol.files)){const a=amendments.find(a=>a.file===file);if(a){assert.equal(a.beforeSHA256,hash);assert.equal(sha(file),a.afterSHA256,'Amended implementation changed: '+file);}else assert.equal(sha(file),hash,'Locked policy changed: '+file);}
for(const r of protocol.inputs)assert.equal(sha(r.file),r.sha256,'Frozen input changed: '+r.file);
assert.equal(sha(dir+'/baseline-050.json'),protocol.baselineSHA256);
const rows=[],degree=p=>p.routes.some(r=>['college','graduate'].includes(r.key));
for(const {c,state:s} of currentModelStates()){
 const before=JSON.stringify(s),base=old.get(c.id);assert.ok(base,'No baseline '+c.id);
 const pool=broadExplorationPool(s),queue=broadQuestionQueue(s),preview=explorationPreview(pool.rows),legacy=careerComparisonOptions(s).rows.slice(0,3),legacyIds=new Set(legacy.map(r=>r.id));
 const direct=planMatchCandidates(s),top=direct.top.map(r=>({id:r.id,title:careerTitle(r.o),routes:educationRoutesFor(r.o),sustains:r.opportunity?.meetsAtStart===null||!r.opportunity?null:!!r.meetsLifestyle}));
 assert.deepEqual(top.map(r=>r.id),base.top.map(r=>r.id),'Same-answer Top drift '+c.id);
 assert.deepEqual(top.map(r=>r.sustains),base.top.map(r=>r.sustains),'Same-answer pay drift '+c.id);
 const signature=rows=>rows.map(r=>r.id).sort().join('|'),t=structuredClone(s);t.profileJourney.family=s.profileJourney.family==='health'?'creative':'health';t.profileJourney.families=[t.profileJourney.family];
 assert.equal(signature(broadExplorationPool(t).rows),signature(pool.rows),'Candidate pool depends on first field '+c.id);
 assert.deepEqual(broadQuestionQueue(t).map(q=>q.questionId),queue.map(q=>q.questionId),'Question queue depends on first field '+c.id);
 assert.equal(JSON.stringify(s),before,'Discovery mutated state '+c.id);
 const eligible=pool.rows.filter(r=>!r.declined),unasked=new Set(eligible.flatMap(r=>r.unasked.map(q=>q.id)));
 const serialize=r=>({id:r.id,title:careerTitle(r.o),field:r.family,expanded:r.expanded,routes:r.routes,correlation:r.correlation,confirmed:r.confirmed,declined:r.declined,unasked:r.unasked.length,unresolved:r.unresolved.length,status:r.declined?'Explicitly declined':r.confirmed?'Defining interests supported; other Top checks still apply':r.unasked.length?'Not fully asked':'Answered; more clarification needed',questions:r.unresolved.map(q=>({id:q.id,prompt:q.prompt,response:q.answer?.response||'unasked',confidence:q.answer?.confidence||null,evidence:q.answer?.evidence||'',reviewHold:q.answer?.reviewHold||null}))});
 rows.push({id:c.id,name:c.biography.name,phase:c.phase,diagnostic:c.phase==='diagnostic049',before:base.top,after:top,topChanged:false,poolStatus:pool.status,catalogSize:pool.catalogSize,allAligned:pool.rows.length,open:eligible.length,declined:pool.rows.filter(r=>r.declined).length,degreeOpen:eligible.filter(degree).length,uniqueUnasked:unasked.size,unaskedByEducation:Object.fromEntries(['all','degree','college','graduate'].map(k=>[k,new Set(eligible.filter(r=>k==='all'||r.routes.some(x=>k==='degree'?['college','graduate'].includes(x.key):x.key===k)).flatMap(r=>r.unasked.map(q=>q.id))).size])),oldGuidedInvitations:legacy.map(r=>({id:r.id,title:r.o.title})),newGuidedInvitations:eligible.filter(r=>!r.expanded&&!legacyIds.has(r.id)&&!r.confirmed).map(serialize),preview:preview.map(serialize),questionPreview:queue.map(q=>({id:q.questionId,careerId:q.careerId,careerIds:q.careerIds,prompt:q.q.prompt,kind:q.expanded?'expanded':q.q.kind==='core-work'?'core':'work',routes:pool.rows.find(r=>r.id===q.careerId).routes,options:q.q.options?.map(o=>({id:o.id,text:o.text})),response:'unasked',inferred:false})),pathInvariant:true,sameAnswers:true});
 if(rows.length%30===0)console.log('Evaluated '+rows.length+' models.');
}
const metrics=rs=>({models:rs.length,anyTop:rs.filter(r=>r.after.length).length,degreeTop:rs.filter(r=>r.after.some(degree)).length,degreeTopOffers:rs.reduce((n,r)=>n+r.after.filter(degree).length,0),sustainingTop:rs.filter(r=>r.after.some(p=>p.sustains===true)).length,firstSustains:rs.filter(r=>r.after[0]?.sustains===true).length,newTop:rs.filter(r=>r.topChanged).length,modelsWithBroaderGuidedInvitations:rs.filter(r=>r.newGuidedInvitations.length).length,newGuidedInvitations:rs.reduce((n,r)=>n+r.newGuidedInvitations.length,0),modelsWithUnasked:rs.filter(r=>r.uniqueUnasked>0).length,uniqueUnaskedModelQuestions:rs.reduce((n,r)=>n+r.uniqueUnasked,0),pathInvariant:rs.filter(r=>r.pathInvariant).length});
const baseRows=rows.filter(r=>!r.diagnostic),result={version:'0.51.0',evaluatedAt:new Date().toISOString(),protocolSHA256:sha(dir+'/protocol.json'),implementationAmendments:amendments,policy:protocol,scope:'Public fictional profiles only; six private profiles excluded. Historical holdouts reported separately; no new answers, learning effect or accuracy claim.',conclusion:'Broader discovery changes invitation access, not confirmed matches with identical evidence. Additional-response outcome effect is unmeasured. A limited live pilot is appropriate before replacing the full journey.',total:metrics(baseRows),cohorts:Object.fromEntries([...new Set(rows.map(r=>r.phase))].map(phase=>[phase,metrics(rows.filter(r=>r.phase===phase))])),rows};
fs.writeFileSync('validation/broad-exploration-051.json',JSON.stringify(result,null,2)+'\n');fs.mkdirSync('dist/developer',{recursive:true});fs.writeFileSync('dist/developer/broad-exploration-051-data.json',JSON.stringify(result));
console.log(JSON.stringify({total:result.total,cohorts:result.cohorts},null,2));
