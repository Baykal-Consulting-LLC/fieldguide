import {occupations} from './occupation-data.js';
import {profileCorrelation,interestFit} from './onet-assessment.js';
import {expandedOccupations} from './expanded-occupation-data.js';
import {expandedQuestionBank} from './expanded-question-bank.js';
import {expandedInterestStatus,updateExpandedInterest} from './expanded-interest.js';
import {coreWorkStatus} from './core-work.js';
import {careerCheckSpec,updateCareerCheck,finishCareerCheckQuestion} from './career-check-questions.js';
import {careerFamilies} from './guide-state.js';
import {journeyInterestPicture,careerInterestMatch} from './profile-journey.js';
import {educationRoutesFor} from './education-routes.js';

// Discovery is deliberately independent of the chosen field, income, education
// preference, demographics, current skill confidence and Top qualification.
// The existing matching engine remains the only authority for Top status.
const catalog=[...occupations.filter(o=>!o.expandedDegree),...expandedOccupations];
export const broadExplorationPolicy=Object.freeze({version:'0.51.0',initialQuestionBudget:12,previewCareers:6,fit:'existing whole-profile eligible threshold',newAnswers:'none inferred by routing',topRules:'unchanged'});
export function explorationQuestionAnswer(s,row,q){
 const j=s.profileJourney||{};
 if(row.expanded)return j.expandedInterests?.[q.id]||null;
 if(q.kind==='core-work')return j.coreWork?.[q.id]||null;
 const a=j.depth?.[row.family]?.[q.id];
 return Array.isArray(a)?{selected:a,feedback:j.careerQuestionFeedback?.[q.id]||null}:null;
}
export function broadExplorationPool(s){
 const picture=journeyInterestPicture(s);
 if(!picture.complete||picture.flat||picture.nearFlat)return {status:!picture.complete?'incomplete':'open-profile',rows:[],catalogSize:catalog.length};
 const rows=[];
 for(const o of catalog){
  const match=o.expandedDegree?(()=>{const r=o.vector?profileCorrelation(picture.raw,o.vector):null,fit=interestFit(r);return {...fit,r,eligible:!!o.vector&&fit.tier>=2};})():careerInterestMatch(s,o,picture);if(!match.eligible)continue;
  const expanded=!!o.expandedDegree,b=expanded?expandedQuestionBank[o.id]:careerCheckSpec(o.id);
  if(!b||(expanded&&!b.topEligible))continue;
  const status=expanded?expandedInterestStatus(s,o.id):coreWorkStatus(s,o.id);
  const family=expanded?(o.fieldIds?.[0]||'other'):b.family;
  const row={id:o.id,o,expanded,family,correlation:match.r,questions:b.questions,confirmation:status,routes:educationRoutesFor(o),declined:status.declined};
  row.unasked=row.questions.filter(q=>!explorationQuestionAnswer(s,row,q));
  row.unresolved=status.questions.filter(q=>!q.answer||q.answer.response!=='yes'||q.answer.reviewHold||q.answer.source==='profile-inferred'&&q.answer.confidence==='low');
  row.confirmed=!!status.confirmed;
  rows.push(row);
 }
 rows.sort((a,b)=>b.correlation-a.correlation||a.id.localeCompare(b.id));
 return {status:'ready',rows,catalogSize:catalog.length};
}
// Spread comparable invitations across contexts/routes. This display cap never
// becomes a candidate cap; the full pool is retained and can be browsed.
export function explorationPreview(rows,limit=broadExplorationPolicy.previewCareers){
 const pending=rows.filter(r=>!r.declined&&(r.unasked.length||!r.confirmed)),picked=[],fields=new Set(),routes=new Set();
 while(pending.length&&picked.length<limit){
  const lead=pending[0],close=pending.filter(r=>r.correlation>=lead.correlation-.1);
  close.sort((a,b)=>Number(!fields.has(b.family))-Number(!fields.has(a.family))||Number(b.routes.some(r=>!routes.has(r.key)))-Number(a.routes.some(r=>!routes.has(r.key)))||b.correlation-a.correlation||a.id.localeCompare(b.id));
  const next=close[0];picked.push(next);fields.add(next.family);next.routes.forEach(r=>routes.add(r.key));pending.splice(pending.indexOf(next),1);
 }
 return picked;
}
export function broadQuestionQueue(s,{limit=12}={}){
 const pool=broadExplorationPool(s),rows=explorationPreview(pool.rows.filter(r=>r.unasked.length),pool.rows.length),out=[],byQuestion=new Map();
 // One question per career per pass. Shared exact IDs are asked only once;
 // similar wording or broad domain labels never copy Yes answers to another ID.
 for(let pass=0;out.length<limit;pass++){
  let added=false;
  for(const row of rows){
   const q=row.unasked[pass];if(!q)continue;
   const previous=byQuestion.get(q.id);if(previous){if(!previous.careerIds.includes(row.id))previous.careerIds.push(row.id);continue;}
   if(out.length===limit)break;
   const entry={questionId:q.id,careerId:row.id,careerIds:[row.id],expanded:row.expanded,family:row.family,q};byQuestion.set(q.id,entry);out.push(entry);added=true;
  }
  if(!added)break;
 }
 return out;
}
export function answerBroadQuestion(s,{careerId,questionId,response,selected=[]}){
 if(!['yes','no','unsure','unfamiliar','selected'].includes(response))return false;
 const row=broadExplorationPool(s).rows.find(r=>r.id===careerId),q=row?.questions.find(q=>q.id===questionId);if(!q)return false;
 const j=s.profileJourney;
 if(row.expanded){if(response==='selected')return false;return updateExpandedInterest(s,careerId,questionId,response);}
 if(q.kind==='core-work'){if(response==='selected')return false;return updateCareerCheck(s,{careerId,questionId,optionId:response==='yes'?'yes':undefined,feedback:response==='yes'?null:response==='no'?'not-interested':response});}
 if(response==='yes'||response==='selected'){
  if(!selected.length||new Set(selected).size!==selected.length||selected.some(id=>!q.options.some(o=>o.id===id)))return false;
  // One committed answer replaces a draft, but other question IDs are untouched.
  j.depth??={};j.depth[row.family]??={};j.depth[row.family][q.id]=[];
  for(const optionId of selected)updateCareerCheck(s,{careerId,questionId,optionId});
 }else updateCareerCheck(s,{careerId,questionId,feedback:response==='no'?'not-interested':response});
 finishCareerCheckQuestion(s,careerId,questionId);return true;
}
export const broadFieldLabel=id=>careerFamilies.find(f=>f.id===id)?.title||id;

// Freeze the short round before the first response so that recalculation does
// not repeatedly ask every question for the leading profession. Future rounds
// can react to new evidence; the candidate universe always remains global.
export function beginBroadRound(s){
 s.profileJourney.broadRound={version:'0.51.0',cursor:0,questions:broadQuestionQueue(s).map(q=>({careerId:q.careerId,questionId:q.questionId}))};
 return s.profileJourney.broadRound;
}
export function broadRoundQuestion(s){
 const round=s.profileJourney?.broadRound;if(!round||round.version!=='0.51.0')return null;
 const pool=broadExplorationPool(s);
 for(let index=round.cursor;index<round.questions.length;index++){
  const ref=round.questions[index],row=pool.rows.find(r=>r.id===ref.careerId);
  if(!row||row.declined)continue;
  const q=row.questions.find(q=>q.id===ref.questionId);if(!q||explorationQuestionAnswer(s,row,q))continue;
  return {index,questionId:q.id,careerId:row.id,expanded:row.expanded,family:row.family,q};
 }
 return null;
}
