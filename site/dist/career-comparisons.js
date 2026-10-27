import {occupations} from './occupation-data.js';
import {careerFamilies,salaryPreviewInputs} from './guide-state.js';
import {careerOpportunities} from './career-opportunities.js';
import {journeyInterestPicture,careerInterestMatch,journeyFieldConnection,professionSuggestions} from './profile-journey.js';
import {directMatchCandidates} from './direct-match-candidates.js';
import {careerCheckSpec,careerCheckComplete} from './career-check-questions.js';
import {educationPreferenceScore} from './match-selection.js';
import {educationRoutesFor,experienceBeforeRole} from './education-routes.js';
import {salaryAtStage,salaryProgression,roundSalary} from './salary-progression.js';
import {calculateLifestyle} from './lifestyle.js';
import {lifestyleIncomeRange} from './lifestyle-story.js';
const memo=new WeakMap();
export function careerComparisonOptions(s){
 const signature=JSON.stringify([s.profileJourney,s.guide?.primaryCareer,s.guide?.lifestylePreset,s.finance?.lifestyle,s.finance?.careerScenarios]),old=memo.get(s);if(old?.signature===signature)return old.result;
 const picture=journeyInterestPicture(s),j=s.profileJourney||{},reviewed=Object.keys(j.careerChecks||{}).filter(id=>careerCheckSpec(id,{legacy:!!s._historicalMatchRules,coreVersion:s._coreWorkVersion})).map(id=>({id,complete:careerCheckComplete(s,id)}));
 if(!picture.complete||picture.flat||picture.nearFlat)return {rows:[],reviewed};
 const direct=new Set(directMatchCandidates(s).map(r=>r.id)),opportunities=careerOpportunities(s),byId=new Map(opportunities.rows.map(r=>[r.id,r])),fieldEvidence=new Map(careerFamilies.map(f=>[f.id,journeyFieldConnection(s,f.id,picture)])),degree=j.answers?.education||[],goal=opportunities.goal,rows=[],fieldRows=new Map();
 for(const o of occupations){
  const spec=careerCheckSpec(o.id,{legacy:!!s._historicalMatchRules,coreVersion:s._coreWorkVersion});if(!spec||direct.has(o.id)||careerCheckComplete(s,o.id))continue;
  const match=careerInterestMatch(s,o,picture),connections=careerFamilies.filter(f=>f.paths.some(p=>o.pathIds.includes(p))).map(f=>fieldEvidence.get(f.id)),op=byId.get(o.id);
  if(connections.length&&connections.every(c=>c.conflicting))continue;
  // Broader interest + a positive field clue, or an existing task-related idea,
  // justify asking. These are invitations, never unearned Top matches.
  if(!(match.eligible&&(op||connections.some(c=>c.focused.likes.length>0))||op&&match.r>=.2&&op.taskEvidence>=3))continue;
  if(!fieldRows.has(spec.family))fieldRows.set(spec.family,professionSuggestions(s,spec.family).rows);
  const fieldRow=fieldRows.get(spec.family).find(r=>r.o.id===o.id);
  if(fieldRow?.routeConflict||fieldRow?.roleFocusElsewhere)continue;
  const stage=salaryProgression(o.id)?.paidTraining?.stageKey||'entry',firstPay=salaryAtStage(o.id,stage),input=goal?salaryPreviewInputs(s,o.id,stage):null,budget=input?calculateLifestyle(input):null,requiresExperience=experienceBeforeRole.has(o.id);
  rows.push({id:o.id,o,family:spec.family,questionCount:spec.questions.length,correlation:match.r,firstPay,firstStage:stage,monthlyRemaining:budget?.status==='illustration'?budget.remaining:null,requiresExperience,meetsLifestyle:!requiresExperience&&budget?.status==='illustration'&&budget.remaining>=0&&roundSalary(firstPay)>=goal.low,educationPreference:educationPreferenceScore(o,degree),routes:educationRoutesFor(o),relevance:match.r+(op?.taskEvidence>=3?.1:0),reason:op?.connection||'Your wider interests and work preferences connect with this profession.',started:j.careerChecks?.[o.id]===true});
 }
 const pending=rows.sort((a,b)=>b.relevance-a.relevance||a.id.localeCompare(b.id)),ranked=[];
 while(pending.length){const lead=pending[0],close=pending.filter(r=>r.relevance>=lead.relevance-.1);close.sort((a,b)=>b.educationPreference-a.educationPreference||Number(b.meetsLifestyle)-Number(a.meetsLifestyle)||(b.requiresExperience?0:b.firstPay)-(a.requiresExperience?0:a.firstPay)||b.relevance-a.relevance||a.id.localeCompare(b.id));ranked.push(...close);for(const r of close)pending.splice(pending.indexOf(r),1);}
 // Offer a relevant future-study comparison when that route is still open.
 // This changes exposure to questions, never match eligibility or Top status.
 const wantsDegree=degree.some(k=>['college','graduate','unknown'].includes(k));
 const degreeOption=ranked.find(r=>r.routes.some(x=>['college','graduate'].includes(x.key)));
 if(wantsDegree&&degreeOption&&!ranked.slice(0,3).some(r=>r.routes.some(x=>['college','graduate'].includes(x.key)))){ranked.splice(ranked.indexOf(degreeOption),1);ranked.unshift(degreeOption);}
 const result={rows:ranked,reviewed};memo.set(s,{signature,result});return result;
}
