import fs from'node:fs';import assert from'node:assert/strict';import{gunzipSync}from'node:zlib';
import{explorerCareerQuestions,explorerResults}from'../../dist/open-explorer-090.js';import{explorerResults as priorResults}from'../../dist/open-explorer-087.js';import{saveExplorerAnswer}from'../../dist/explorer-053-state.js';import{decide078}from'../simulator-079/bindings-002.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const old078=read('../outputs/simulator-078-002/results.json.gz'),old079=read('../outputs/simulator-079-002/results.json.gz'),r078=new Map(old078.rows.map(r=>[r.id,r])),r079=new Map(old079.rows.map(r=>[r.id,r])),manifest=read('calibration/executor-077/manifest.json.gz'),defs=new Map(manifest.definitions.map(q=>[q.id,q])),states=read('research/executor-077/states.json.gz'),profiles=new Map([...read('calibration/cohort-056/profiles.json'),...read('calibration/grok-075/profiles.json')].map(p=>[p.id,p]));
const prior089=read('research/evidence-089/results.json.gz'),r089=new Map(prior089.rows.map(r=>[r.id,r]));
const prior088=read('research/evidence-088/results.json.gz'),r088=new Map(prior088.rows.map(r=>[r.id,r]));
const prior087=read('research/noncollege-087/results.json.gz'),r087=new Map(prior087.rows.map(r=>[r.id,r]));

const previous090=new Map(read('research/evidence-090/results.json.gz').rows.map(r=>[r.id,r]));
export{states,profiles,defs,previous090};
export function baseline093(rec){const s=structuredClone(rec.state),previous=r079.get(rec.id),p=profiles.get(rec.id);

 for(const c of r078.get(rec.id).questionChanges){const q=defs.get(c.questionId);const payload=q.type==='specific'?c.audit:{selected:c.audit.selected,feedback:c.after===0?'unfamiliar':c.after===-1?'none':null,source:'profile-inferred',confidence:c.after>0?'medium':'low',evidence:c.audit.optionAudits.filter(a=>a.response==='yes').map(a=>a.evidence||'Preserved exact existing option').join(' · ')||'Missing preferences remain unknown.'};const old=s.explorer053?.professionAnswers?.[q.scope]?.[q.id];saveExplorerAnswer(s,{kind:q.kind,scope:q.scope,questionId:q.id,payload:{...payload,...(old?.reviewHold?{reviewHold:old.reviewHold}:{})},at:'2026-10-22T23:45:00.000Z'});}
 for(const c of previous.questionChanges){const q=defs.get(c.questionId),old=s.explorer053?.professionAnswers?.[q.scope]?.[q.id];saveExplorerAnswer(s,{kind:q.kind,scope:q.scope,questionId:q.id,payload:{...c.audit,...(old?.reviewHold?{reviewHold:old.reviewHold}:{})},at:'2026-10-22T23:45:00.000Z'});}

 const baseline=r087.get(rec.id);for(const a of baseline.answers){const q=priorResults(s).rows.find(r=>r.id===a.careerId).o.questions.find(q=>q.id===a.questionId),audit=p?decide078(p,q.rule):{response:'unfamiliar',confidence:'low',source:'profile-inferred',evidence:'No typed facts.'};assert.equal(audit.response,a.response);saveExplorerAnswer(s,{kind:'profession',scope:a.careerId,questionId:a.questionId,payload:audit});}
 for(const a of r088.get(rec.id).answers.filter(a=>a.stage!=='diagnostic-only'))saveExplorerAnswer(s,{kind:'profession',scope:a.careerId,questionId:a.questionId,payload:a});
 for(const a of r089.get(rec.id).answers)saveExplorerAnswer(s,{kind:'profession',scope:a.careerId,questionId:a.questionId,payload:a});

for(const a of previous090.get(rec.id).answers.filter(a=>a.stage!=='diagnostic-only'))saveExplorerAnswer(s,{kind:'profession',scope:a.careerId,questionId:a.questionId,payload:a});return s;}
