// Blind holdout adapter. Structured item IDs only; no profile-text or demographic inference.
import {careerFamilies} from '../../dist/guide-state.js';
import {freshState} from '../../dist/model.js';
import {onetQuestions} from '../../dist/onet-assessment.js';
import {saveProfileAnswer} from '../../dist/profile-journey.js';
import {saveExplorerAnswer} from '../../dist/explorer-053-state.js';
import {explorerQuestions} from '../../dist/explorer-053-questions.js';
import {explorerFieldQuestions,explorerCareerQuestions} from '../../dist/open-explorer.js';
import {explorerResults} from '../../dist/open-explorer-056.js';
import {buildLifestyleInputs} from '../../dist/lifestyle-builder.js';
import {topics,methods} from '../../calibration/cohort-056/spec.mjs';
import {reflection} from '../../calibration/cohort-056/response-policy.mjs';
import {relevantCareers,isActivityChoice} from '../../calibration/cohort-056/replay-policy.mjs';
import {optionCorrections075} from '../../prototypes/evidence-075/engine.mjs';
const at='2026-10-21T10:00:00.000Z';
export function grokState075(p,bindings){
 const s=freshState();s.profile.nickname=p.name;s.profileJourney.started=true;s.profileJourney.introSeen=true;s.guide.primaryCareer='';s.actions=[];
 for(const[i,q]of onetQuestions.entries())saveProfileAnswer(s,{...q,kind:'interest'},p.official[i]);
 s.explorer053={version:1,facetAnswers:{},fieldAnswers:{},professionAnswers:{},history:[]};
 const save=(kind,scope,q,payload)=>saveExplorerAnswer(s,{kind,scope,questionId:q.id,payload,at});
 for(const t of topics)save('facet','all',{id:'topic056-'+t.id},{value:p.positiveTopics.includes(t.id)?5:p.negativeTopics.includes(t.id)?1:'unfamiliar',source:'profile-inferred',confidence:'medium',evidence:p.positiveTopics.includes(t.id)?t.fact:p.negativeTopics.includes(t.id)?'Explicit disinterest in: '+t.fact:'Unknown preference'});
 const facets={systems:'investigation',testing:'testing',quantitative:'quantitative',design:'design',spatial:'making',expression:'expression',support:'listening',learning:'explaining',initiative:'coordination',organization:'organization',living:'fieldwork',society:'investigation'};
 for(const q of explorerQuestions){const m=facets[q.facet];save('facet','all',q,{value:p.positiveMethods.includes(m)?4:p.negativeMethods.includes(m)?2:'unfamiliar',source:'profile-inferred',confidence:'medium',evidence:methods.find(x=>x.id===m)?.fact||'Unknown'});}
 s.guide.lifestyleBuilder={...s.guide.lifestyleBuilder,homeMode:'rent',choices:{...p.lifestyleChoices},complete:true};s.finance.lifestyle=buildLifestyleInputs(s.guide.lifestyleBuilder,s.finance.lifestyle);s.guide.lifestylePreset='custom';
 // Qualitative strengths/context are retained for inspection, never parsed into scores.
 s.profileJourney.skills={};s.profileJourney.families=[];s.profileJourney.family='';
 const correction=new Map(optionCorrections075.map(x=>[x.optionId,x]));
 function optionBinding(id){const b=structuredClone(bindings.options[id]);if(!b)return b;const c=correction.get(id);if(c)for(const[field,prefix]of[['topicAll','t:'],['methodAll','m:'],['responsibilityAll','r:']])b[field]=(b[field]||[]).filter(k=>!c.remove.includes(prefix+k));return b;}
 function task(field,q){if(s.explorer053.fieldAnswers[field]?.[q.id])return;const selected=q.options.filter(o=>reflection(p,optionBinding(o.id)).response==='yes').map(o=>o.id);save('field',field,q,{selected,source:'profile-inferred',confidence:selected.length?'medium':'low',feedback:selected.length?null:'unfamiliar',evidence:selected.length?'Exact structured activity statements supplied by independent Grok profile.':'The required structured preference is unknown.'});}
 // Comprehensive subject-aligned replay, not a prediction of real survey completion.
 for(const field of careerFamilies.map(f=>f.id))for(const q of explorerFieldQuestions(field))task(field,q);
 const first=explorerResults(s),invited=relevantCareers(first.rows,p,bindings);
 for(const r of invited)for(const q of explorerCareerQuestions(r.id)){if(isActivityChoice(q)){task(q.field||r.fields[0],q);continue;}save('profession',r.id,q,reflection(p,bindings.questions[q.id]));}
 return s;
}
