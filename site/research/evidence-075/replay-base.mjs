import assert from 'node:assert/strict';
import {explorerResults,explorerCareerQuestions,explorerAnswer} from '../../dist/open-explorer-056.js';
import {saveExplorerAnswer} from '../../dist/explorer-053-state.js';
import {rules as oldRules,connect,structuredLedger} from '../../prototypes/targeted-067/engine.mjs';
import {authoredEvidence} from '../targeted-067/review.mjs';
import {evidenceRules069,decide,ledgerFor} from '../../prototypes/evidence-069/rules.mjs';
import {mappingRules071,researchRows071,supportedOrder071,simulate071,specialtyGuards071,ledger071,selectFollowups071} from '../../prototypes/evidence-071/engine.mjs';
import {ledger073,bindingRules073,applyBridge073,selectQuestions073} from '../../prototypes/evidence-073/engine.mjs';
import * as spec from '../../calibration/cohort-056/spec.mjs';
export function replay073(c,state,p,bindings,registry,pool,old071=null,old069=null,old073=null){
 const s=structuredClone(state),typed=p?structuredLedger(p,spec):{yes:authoredEvidence[c.id]||{},no:{}};
 function apply(rule,d,label,protectUnsure=false){const q=explorerCareerQuestions(rule.careerId).find(q=>q.id===rule.questionId),before=explorerAnswer(s,'profession',rule.careerId,q);if(!before?.reviewHold&&!['yes','no',...(protectUnsure?['unsure']:[])].includes(before?.response)&&d.response==='yes')saveExplorerAnswer(s,{kind:'profession',scope:rule.careerId,questionId:q.id,payload:{response:'yes',source:'profile-inferred',confidence:'medium',evidence:label+d.evidence.map(e=>e.feature+': '+e.quote).join(' · ')},at:'2026-10-21T08:00:00.000Z'});}
 for(const id of Object.keys(oldRules))for(const q of explorerCareerQuestions(id).filter(q=>q.kind==='specific'))apply({careerId:id,questionId:q.id},connect(typed,id,q.domain),'Research contextual evidence: ');
 const l069=old069?.ledger||ledgerFor(p,s,bindings,spec);
 for(const r of evidenceRules069)apply(r,decide(l069,r),'Research contextual evidence: ');
 const l071=old071?.ledger||ledger071(l069,p,s,bindings,spec,[],typed.yes);
 for(const r of mappingRules071)apply(r,decide(l071,r),'Research 0.71 mapping evidence: ');
 const mapped071=explorerResults(s),reused=old071?Object.fromEntries(old071.followups.map(a=>[a.questionId,a])):Object.fromEntries(selectFollowups071(mapped071.rows,l071).map(q=>[q.id,simulate071(q,l071)]));
 const direct=Object.fromEntries(Object.keys(specialtyGuards071).map(id=>[id,explorerAnswer(s,'profession',id,explorerCareerQuestions(id).find(q=>q.domain==='domain'))]));
 const priorRows=researchRows071(mapped071.rows,reused,l071,direct),prior=supportedOrder071(priorRows);
 if(old071)assert.deepEqual(prior.map(r=>r.id),old071.afterSupported.map(p=>p.id),'0.71 reconstruction '+c.id);
 const l073=ledger073(l071,bindings);for(const r of bindingRules073)apply(r,decide(l073,r),'Research 0.73 mapping evidence: ',true);
 const mapped=explorerResults(s),records={specialties:direct,byQuestion:Object.fromEntries(mapped.rows.flatMap(r=>explorerCareerQuestions(r.id).filter(q=>q.kind==='specific').map(q=>[q.id,explorerAnswer(s,'profession',r.id,q)])))},priorIds=new Set(prior.map(r=>r.id));
 let answers;if(old073)answers=Object.fromEntries([...old073.reusedFollowups,...old073.followups].map(a=>[a.questionId,a]));else{const wired=applyBridge073(mapped.rows,reused,l073,records,registry,pool,priorIds),plans=selectQuestions073(wired.rows,registry,pool,reused,records.byQuestion);answers={...reused,...Object.fromEntries(plans.map(x=>[x.q.id,simulate071(x.q,l073)]))};}
 const final=applyBridge073(mapped.rows,answers,l073,records,registry,pool,priorIds);
 if(old073)assert.deepEqual(supportedOrder071(final.rows).map(r=>r.id),old073.afterSupported.map(p=>p.id),'0.73 reconstruction '+c.id);
 return{state:s,rows:final.rows,ledger:final.ledger,records,answers,mappedRows:mapped.rows,priorIds};
}
