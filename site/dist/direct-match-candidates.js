import {coreWorkStatus} from './core-work.js';
import {professionQuestions} from './profession-questions.js';
import {professionSuggestions,depthComplete} from './profile-journey.js';
import {careerCheckComplete,careerCheckSpec} from './career-check-questions.js';

// Every fully explored field contributes. Focused checks contribute only the
// profession actually compared, using the same task/profile/clinical gates.
export function directMatchCandidates(s){
 const j=s.profileJourney||{},byId=new Map(),families=[...new Set([j.family,...Object.keys(j.depth||{})].filter(Boolean))],results=new Map();
 const result=f=>{if(!results.has(f))results.set(f,professionSuggestions(s,f));return results.get(f);};
 const add=(r,f,focused=false)=>{
  if(!r?.supported||r.comparisonOnly)return;
  const answered=(professionQuestions[f]||[]).filter(q=>q.kind!=='route'&&Array.isArray(j.depth?.[f]?.[q.id])).length;
  const candidate={...r,id:r.o.id,evidenceFamily:f,focusedComparison:focused,historicalEvidence:!!s._historicalMatchRules,confirmation:coreWorkStatus(s,r.o.id),taskTotal:s._historicalMatchRules&&focused?Math.max(r.score,answered):r.taskTotal,answeredTasks:answered};
  const old=byId.get(r.o.id);if(!old||candidate.score/candidate.taskTotal>old.score/old.taskTotal)byId.set(r.o.id,candidate);
 };
 for(const f of families)if(depthComplete(s,f))for(const r of result(f).rows)add(r,f);
 for(const id of Object.keys(j.careerChecks||{}))if(careerCheckComplete(s,id,{legacy:true})){
  const spec=careerCheckSpec(id);if(depthComplete(s,spec.family))continue;
  add(result(spec.family).rows.find(r=>r.o.id===id),spec.family,true);
  if(!s._historicalMatchRules)for(const r of result(spec.family).rows)if(coreWorkStatus(s,r.o.id).confirmed)add(r,spec.family,true);
 }
 return [...byId.values()];
}
