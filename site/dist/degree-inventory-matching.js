import {profileCorrelation,interestFit} from './onet-assessment.js';
// This retrieves interest connections. It never claims aptitude or adds a Top offer.
export function degreeInventoryMatches(input,inventory,{search='',family='',education='',topic='',onlyNew=false,includeExperienced=false,strongOnly=true,strengthOnly=false}={}){
 const usable=!!input?.complete&&!input.flat&&!input.nearFlat&&Array.isArray(input.scores)&&input.scores.length===6&&input.scores.every(Number.isFinite),q=search.trim().toLowerCase();
 const rows=inventory.map(o=>{
  const r=usable&&o.vector?profileCorrelation(input.scores,o.vector):null,fit=interestFit(r),names=new Set([...(o.skills||[]),...(o.abilities||[])].map(x=>x.name));
  const strengths=(input?.strengths||[]).filter(s=>s.names.some(n=>names.has(n)));
  return {...o,r,fit,strengths,comparable:usable&&!!o.vector};
 }).filter(o=>(!q||[o.title,o.soc,...o.aliases,o.summary,o.soc.startsWith('29-12')?'doctor physician medical':''].join(' ').toLowerCase().includes(q))&&(!family||o.families.some(f=>f.id===family))&&(!education||o.educationGroup===education)&&(!topic||o.specificInterests.some(x=>x.name===topic))&&(!onlyNew||!o.guidedId)&&(includeExperienced||!o.requiresExperience)&&(!strengthOnly||o.strengths.length)&&(!strongOnly||!usable||o.fit.tier>=2));
 // Interest comparison leads; salary, prestige, degree length and prior exposure do not enter rank.
 rows.sort((a,b)=>(b.r??-2)-(a.r??-2)||a.title.localeCompare(b.title)||a.soc.localeCompare(b.soc));
 return {usable,reason:!input?.complete?'incomplete':input.flat||input.nearFlat?'open-profile':'ready',rows};
}
