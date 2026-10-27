import {expandedPayOpportunity} from './expanded-pay.js';
import {expandedMatchCandidates,expandedUnknownOpportunity} from './expanded-interest.js';
import {directMatchCandidates} from './direct-match-candidates.js';
import {journeyInterestPicture} from './profile-journey.js';
import {careerOpportunities} from './career-opportunities.js';
import {occupationById} from './occupation-data.js';
import {selectTopPlanMatches} from './match-selection.js';
export {selectTopPlanMatches} from './match-selection.js';
export function planMatchCandidates(s){
 const p=careerOpportunities(s),byId=new Map(p.rows.map(r=>[r.id,r]));
 const rows=[...directMatchCandidates(s),...expandedMatchCandidates(s)].map(r=>({...r,id:r.o.id,opportunity:byId.get(r.o.id)||(r.expandedDegree?expandedPayOpportunity(s,r.o):undefined),meetsLifestyle:!!(byId.get(r.o.id)||(r.expandedDegree?expandedPayOpportunity(s,r.o):null))?.meetsAtStart&&!(byId.get(r.o.id)?.requiresExperience||r.o.requiresExperience),kind:'direct',rating:r.basis==='tasks'?'Task match':'Direct match'}));
 const eligible=s._historicalMatchRules?rows:rows.filter(r=>r.confirmation.confirmed),needsConfirmation=s._historicalMatchRules?[]:rows.filter(r=>!r.confirmation.confirmed).map(r=>({...r,rating:r.confirmation.declined?'Core interest not supported':'Needs confirmation'}));
 const top=selectTopPlanMatches(eligible,3,{education:s.profileJourney?.answers?.education||[]}),seen=new Set(top.map(r=>r.id));
 const rest=eligible.filter(r=>!seen.has(r.id)).map(r=>({...r,rating:r.basis==='tasks'?'Task match':'Also matches'}));rest.forEach(r=>seen.add(r.id));needsConfirmation.forEach(r=>seen.add(r.id));
 const related=p.rows.filter(r=>!seen.has(r.id)).sort((a,b)=>Number(b.meetsAtStart)-Number(a.meetsAtStart)||b.score-a.score).map(r=>({id:r.id,o:r.o,opportunity:r,kind:'related',rating:r.supported?'Also matches':'Related match',reasons:r.connection?[r.connection]:[],evidence:r.taskLedRelated?r.followupEvidence:[],taskLedRelated:!!r.taskLedRelated,taskTotal:r.taskTotal,score:r.taskLedRelated?r.taskEvidence:0,specificSupport:0,routeSupport:false}));
 related.forEach(r=>seen.add(r.id));const chosen=occupationById(s.guide?.primaryCareer);
 if(chosen&&!seen.has(chosen.id))rest.push({id:chosen.id,o:chosen,kind:'chosen',rating:'Your choice',reasons:[],score:0,specificSupport:0,routeSupport:false});
 return {top,needsConfirmation,other:[...needsConfirmation,...rest,...related],all:[...top,...needsConfirmation,...rest,...related],opportunities:p,profile:journeyInterestPicture(s)};
}
