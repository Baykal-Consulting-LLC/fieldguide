import {coreWorkQuestions} from './core-work.js';
import {professionQuestions,clinicalRoleIds} from './profession-questions.js';
import {careerFamilies} from './guide-state.js';
import {occupationById} from './occupation-data.js';

export const taskEvidenceDomain=q=>q.kind==='role-task'?'responsibility':q.id.includes('-refine-4')?'introduction':q.id.includes('-refine-3')?'process':/people|support|workday|setting|team/.test(q.id)?'context':'tasks';
const specs=new Map();
// Reuse the existing, contrasting work options. A check never invents answers.
export function careerCheckSpec(id,{legacy=false,coreVersion='0.44.0'}={}){
 const key=id+(legacy?'-legacy':coreVersion);
 if(specs.has(key))return specs.get(key);
 const o=occupationById(id);if(!o)return null;
 const fields=careerFamilies.filter(f=>f.paths.some(p=>o.pathIds.includes(p))).map(f=>({family:f.id,questions:(professionQuestions[f.id]||[]).filter(q=>q.options.some(x=>x.careerIds.includes(id)))})).sort((a,b)=>b.questions.filter(q=>q.kind!=='route').length-a.questions.filter(q=>q.kind!=='route').length||a.family.localeCompare(b.family));
 const field=fields[0];if(!field)return null;
 const tasks=field.questions.filter(q=>q.kind!=='route'),chosen=[],domains=new Set();
 const add=q=>{if(q&&!chosen.includes(q)){chosen.push(q);domains.add(taskEvidenceDomain(q));}};
 if(clinicalRoleIds.includes(id))tasks.filter(q=>q.kind==='role-task').slice(0,2).forEach(add);
 const specificity=q=>Math.min(...q.options.filter(x=>x.careerIds.includes(id)).map(x=>x.careerIds.length));
 const ordered=[...tasks].sort((a,b)=>specificity(a)-specificity(b)||a.id.localeCompare(b.id));
 for(const q of ordered)if(chosen.length<4&&!domains.has(taskEvidenceDomain(q)))add(q);
 for(const q of ordered)if(chosen.length<4)add(q);
 for(const q of field.questions.filter(q=>q.kind==='route'))add(q);
 const result=chosen.filter(q=>q.kind!=='route').length>=3?{id,o,family:field.family,questions:legacy?chosen:[...chosen,...coreWorkQuestions(id,{coreVersion})]}:null;specs.set(key,result);return result;
}
export function cleanCareerChecks(raw){
 const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const [id,value]of Object.entries(raw).slice(0,150))if(value===true&&careerCheckSpec(id))out[id]=true;
 return out;
}
export function careerCheckComplete(s,id,{legacy=!!s._historicalMatchRules}={}){const spec=careerCheckSpec(id,{legacy,coreVersion:s._coreWorkVersion});return !!spec&&s.profileJourney?.careerChecks?.[id]===true&&spec.questions.every(q=>q.kind==='core-work'?!!s.profileJourney?.coreWork?.[q.id]:Array.isArray(s.profileJourney?.depth?.[spec.family]?.[q.id]));}
export function updateCareerCheck(s,{careerId,questionId,optionId,skip=false,feedback=null}){
 const spec=careerCheckSpec(careerId,{coreVersion:s._coreWorkVersion}),q=spec?.questions.find(q=>q.id===questionId);if(!q||!s.profileJourney)return false;
 if(feedback&&!['unfamiliar','not-interested','unsure'].includes(feedback))return false;
 if(!skip&&!feedback&&!q.options.some(o=>o.id===optionId))return false;
 const j=s.profileJourney;if(q.kind==='core-work'){j.careerChecks??={};j.careerChecks[careerId]=true;j.coreWork??={};j.coreWork[q.id]={response:feedback==='not-interested'?'no':feedback||(skip?'unsure':optionId),source:'student',confidence:'high',evidence:'Direct response to the profession-specific work question.'};return true;}j.careerChecks??={};j.careerChecks[careerId]=true;j.depth??={};j.depth[spec.family]??={};
 j.careerQuestionFeedback??={};if(skip||feedback)j.careerQuestionFeedback[q.id]=feedback||'unsure';else delete j.careerQuestionFeedback[q.id];
 const previous=j.depth[spec.family][q.id]||[];
 j.depth[spec.family][q.id]=skip||feedback?[]:previous.includes(optionId)?previous.filter(x=>x!==optionId):[...previous,optionId];
 return true;
}
export function finishCareerCheckQuestion(s,careerId,questionId){
 const spec=careerCheckSpec(careerId,{coreVersion:s._coreWorkVersion}),q=spec?.questions.find(q=>q.id===questionId);if(!q||!s.profileJourney)return false;
 const j=s.profileJourney;if(q.kind==='core-work'){j.careerChecks??={};j.careerChecks[careerId]=true;j.coreWork??={};j.coreWork[q.id]??={response:'unsure',source:'student',confidence:'high',evidence:'Direct response to the profession-specific work question.'};return true;}j.careerChecks??={};j.careerChecks[careerId]=true;j.depth??={};j.depth[spec.family]??={};j.depth[spec.family][q.id]??=[];return true;
}

export function cleanCareerQuestionFeedback(raw){
 const known=new Set(Object.values(professionQuestions).flat().map(q=>q.id)),out={};
 if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [id,value] of Object.entries(raw))if(known.has(id)&&['unfamiliar','not-interested','unsure'].includes(value))out[id]=value;
 return out;
}
