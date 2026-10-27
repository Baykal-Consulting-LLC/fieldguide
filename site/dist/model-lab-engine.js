import {experimentSnapshot} from './developer-experiment.js';
import {makeJourneyPlan,professionSuggestions} from './profile-journey.js';
import {studentReviewPlan,studentReviewInputs} from './developer-review-data.js';
import {studyCostReference,careerScenario} from './financial-scenario-ui.js';
import {fundingScenario} from './financial-math.js';
export function modelLabPlan(state,id){const draft=structuredClone(state);if(!makeJourneyPlan(draft,id))return null;return {id,plan:studentReviewPlan(draft),budget:studyCostReference(id),funding:fundingScenario(careerScenario(draft,id))};}
export function modelLabCase(c){
 const state=structuredClone(c.experimentState);const savedPlan=c.results.plan;state.guide.primaryCareer='';state.guide.salaryPicked=false;state.actions=state.actions.filter(a=>a.done||a.notice||!/^guide-.*-(try|prepare|talk)$/.test(a.id));
 const current=experimentSnapshot(state,{plan:null,planReason:'Choose a career below to compare its plan. No career has been chosen for this fictional student.'});
 const rows=professionSuggestions(state),ids=[...new Set([...rows.top,...rows.rows.filter(r=>r.comparisonOnly)].map(r=>r.o.id))];
 const plans=ids.map(id=>modelLabPlan(state,id)).filter(Boolean);
 return {...c,phase:c.phase||'private',name:c.biography.name,current,plans,previousPlan:savedPlan,experimentState:state,authoredInputs:studentReviewInputs(c.experimentState)};
}
export function labSummary(c){const r=c.current;return {id:c.id,name:c.name,phase:c.phase,scores:r.rawScores,pathways:r.pathways,workPathways:r.workPathways,field:r.family,careers:r.professions,planChoices:c.plans.map(p=>p.id)};}
