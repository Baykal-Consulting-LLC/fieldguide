// Read-only diagnostic of the frozen Grok holdout. Does not change responses or rules.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync,gzipSync} from 'node:zlib';
import {grokState075} from '../research/evidence-075/grok-adapter.mjs';
import {replay073} from '../research/evidence-075/replay-base.mjs';
import {explorerCareerQuestions} from '../dist/open-explorer-056.js';
import {bridgeRegistry073,questionPool073,applyBridge073,bindingRules073} from '../prototypes/evidence-073/engine.mjs';
import {supportedOrder071,mappingRules071,simulate071} from '../prototypes/evidence-071/engine.mjs';
import {cleanLedger075,filterReusedAnswers075,revalidate075,targetedRound075,targetedQuestions075} from '../prototypes/evidence-075/engine.mjs';
import {evidenceRules069,decide} from '../prototypes/evidence-069/rules.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source='dist/developer/evidence-benchmark-075.json.gz',profilesFile='calibration/grok-075/profiles.json';
const sourceData=read(source),profiles=read(profilesFile),byProfile=new Map(profiles.map(p=>[p.id,p]));
const originalHashes={...read('research/evidence-075/freeze-001.json').files,[source]:sha(source),[profilesFile]:sha(profilesFile)};
const bindings=read('calibration/cohort-056/question-bindings.json'),registry=bridgeRegistry073(bindings,explorerCareerQuestions),pool=questionPool073(registry);
const selected=sourceData.rows.filter(r=>r.cohort==='grok075'&&!r.afterTop.length&&r.candidates.length);
assert.equal(selected.length,241);assert.equal(selected.reduce((n,r)=>n+r.candidates.length,0),989);
const group=(list,prefix)=>list.map(x=>prefix+x),groups=(v,prefix)=>!v?.length?[]:(Array.isArray(v[0])?v:[v]).map(xs=>group(xs,prefix));
function bindingRule(b){return{all:[...group(b.topicAll||[],'t:'),...group(b.methodAll||[],'m:'),...group(b.responsibilityAll||[],'r:'),...group(b.specificAll||[],'s:')],any:[...groups(b.topicAny,'t:'),...groups(b.methodAny,'m:')],block:[],reason:'Frozen initial question binding'};}
const questionById=new Map([...Object.values(bindings.questions).map(q=>[q.questionId,q]),...pool.map(q=>[q.id,q]),...targetedQuestions075.map(q=>[q.id,q])]);
const out=[];
for(const [index,frozen]of selected.entries()){
 const p=byProfile.get(frozen.id),s=grokState075(p,bindings),c={id:p.id,name:p.name,phase:'grok075'};
 const base=replay073(c,s,p,bindings,registry,pool),clean=cleanLedger075(base.ledger,bindings),effective=filterReusedAnswers075(base.answers,clean.ledger);
 const rewired=applyBridge073(base.mappedRows,effective.answers,clean.ledger,base.records,registry,pool,base.priorIds);
 const checked=revalidate075(rewired.rows,base.ledger,rewired.ledger,bindings,base.records.byQuestion);
 const final=targetedRound075(checked.rows,rewired.ledger,p.followups,base.records.byQuestion,4);
 assert.deepEqual(supportedOrder071(final.rows).map(r=>r.id),frozen.afterSupported.map(r=>r.id),p.id+' frozen output changed');
 const candidates=frozen.candidates.map(candidate=>{
  const r=final.rows.find(r=>r.id===candidate.id);
  const missing=candidate.missing.map(id=>{
   const q=questionById.get(id),b=bindings.questions[id],record=base.records.byQuestion[id];
   const rules=[...(b?[bindingRule(b)]:[]),...[...evidenceRules069,...mappingRules071,...bindingRules073].filter(rule=>rule.questionId===id)].map(rule=>({...rule,decision:decide(rewired.ledger,rule)}));
   const followups=pool.filter(q=>registry.some(link=>link.questionId===q.id&&link.careerId===candidate.id&&link.targetQuestionId===id)||q.id===id).map(q=>({id:q.id,prompt:q.prompt,options:q.options,asked:!!effective.answers[q.id],answer:effective.answers[q.id]||null,canDeriveFromExistingEvidence:simulate071(q,rewired.ledger).selected.length>0}));
   return{id,prompt:q?.prompt||r.specific.missing.find(m=>m.id===id)?.prompt||id,binding:b||null,record:record||null,rules,followups};
  });
  return{...candidate,requirement:r.specific.requirement,evidence:r.specific.evidence,missing};
 });
 out.push({id:p.id,name:p.name,profile:p,candidates,ledger:rewired.ledger,selectedFollowups:{prior:effective.answers,new075:frozen.followups},inputSHA256:frozen.inputSHA256,rawResponsesSHA256:frozen.rawResponsesSHA256});
 if((index+1)%40===0)console.log('Diagnosed '+(index+1)+'/241 frozen holdout profiles');
}
for(const [p,h]of Object.entries(originalHashes))assert.equal(sha(p),h,p+' changed during review');
const result={review:'grok-075-candidate-audit',status:'Post-holdout descriptive diagnostic; no profile, answer, matching-rule or result changes.',sources:originalHashes,models:241,pairs:989,careers:new Set(out.flatMap(r=>r.candidates.map(c=>c.id))).size,rows:out};
fs.mkdirSync('research/grok-075-review',{recursive:true});
fs.writeFileSync('research/grok-075-review/audit.json.gz',gzipSync(JSON.stringify(result),{level:9}));
console.log(JSON.stringify({models:result.models,pairs:result.pairs,careers:result.careers,frozenResultsReproduced:true,sourceHashesUnchanged:true}));
