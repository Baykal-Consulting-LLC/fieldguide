import {careerTrial} from './career-review-logic.js';
import {careerEducationSummary,careerTitle} from './career-presentation.js?v=0.31.0';
import {occupationEssentials} from './occupation-essentials.js?v=0.31.0';
import {careerLanguage} from './career-language.js?v=0.31.0';
import {planningGuidance} from './planning-guidance.js?v=0.31.0';
import {careerInsights} from './career-insights.js?v=0.31.0';
export function careerPlanSteps(o,s){
 const e=occupationEssentials[o.soc],subject=e?.knowledge?.[0]?.name||o.knowledge?.[0]||'the subject',skill=e?.skills?.[0]?.name||o.skills?.[0]||'a useful skill';const major=o.soc?.slice(0,2),clinical=['29','31'].includes(major),practical=['47','49','51','53','33','45'].includes(major),creative=major==='27';
 const task=careerLanguage[o.id]?.[0]||o.summary;
 const genericFirst=clinical?`Watch a career video or read a made-up classroom case about ${careerTitle(o).toLowerCase()}. List what the care team notices and does. Do not diagnose or treat anyone.`:practical?`Watch a safe demonstration of ${careerTitle(o).toLowerCase()}. Sketch the tools and safety steps. Use paper models only. Leave dangerous work to trained adults.`:creative?`Make a small practice sample based on ${careerTitle(o).toLowerCase()}. Start with this idea: ${task} Spend 20 minutes, then ask someone what they understood.`:`Use a made-up example to try ${careerTitle(o).toLowerCase()}: ${task} Make a one-page outline or simple model. Do not use real client or confidential information.`;
 const first=careerTrial(o.id)||genericFirst;
 const beginner=Object.values(s.profileJourney?.skills||{}).some(a=>['new','supported'].includes(a.level));const insights=careerInsights(s,o);const feedback=insights.feedback;
 const tryText=feedback.less?`Try a different part of ${careerTitle(o).toLowerCase()} before deciding whether to keep this route. `+first:feedback.more?`Try a little more: practise ${skill.toLowerCase()} with a beginner lesson in ${subject.toLowerCase()}. Make another safe sample and compare it with your earlier notes.`:first;
 const rows=[['try',clinical?'Explore a fictional case':practical?'Explore a safe model':creative?'Make a small sample':'Try a small piece of the work',tryText+(beginner?' Ask a teacher or trusted adult to help you get started.':'')],['prepare','Compare training options',`List this route: ${careerEducationSummary(o)} Compare one program’s time, cost, grants, and loans. Include a college option.`],['talk','Ask about a normal workday',`Ask a teacher, program adviser, or professional about the day-to-day work of ${careerTitle(o).toLowerCase()}, training, paid hours, and benefits. ${insights.tradeoffs[0]||insights.next[0]||'Ask what surprised them when they first started.'}`]];
 return rows.map(([key,title,detail])=>{const specific=planningGuidance[o.id]?.[key];return {key,title:specific?.[0]||title,detail:key==='try'&&careerTrial(o.id)?detail:feedback.rows.length?detail:specific?.[1]||detail};});
}
