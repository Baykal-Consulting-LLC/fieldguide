// A read-only view of the current open-explorer replay. Never rerank after filtering.
import{educationMatches,inSystemCohort}from'./system-match-metrics.js';
export const cohortLabels={development:'Original development',supplement:'Supplement',legacy:'Legacy',holdout:'Original holdout',development049:'New development',holdout049:'Fresh holdout',diagnostic049:'Diagnostic variants',development056:'Additional development',holdout056:'New holdout · evaluation only',private:'Owner-only'};
export function currentOffers(row,{education='all',field='all'}={},catalog=new Map()){
 const pick=ps=>(ps||[]).filter(p=>(field==='all'||p.fields.includes(field))&&educationMatches(catalog.get(p.id),education));
 const topIds=new Set(row.top.map(p=>p.id));
 return {supported:pick(row.supported),top:pick(row.top),other:pick(row.first12.filter(p=>!topIds.has(p.id))),sustaining:pick(row.first12.filter(p=>p.supported&&p.budget?.covers===true))};
}
export function currentOutcome(offers){
 if(offers.top.some(p=>p.budget?.covers===true))return'top-covers';
 if(offers.sustaining.length)return'other-covers';
 const supported=[...offers.top,...offers.other].filter(p=>p.supported);
 return supported.some(p=>p.budget?.covers!==null&&p.budget?.covers!==undefined)?'none-cover':'not-assessed';
}
export function filterCurrentRows(rows,filters={},catalog=new Map(),reviews=new Map()){
 const {cohort='all',query='',education='all',field='all',outcome='all',review='all'}=filters,q=query.trim().toLowerCase();
 return rows.flatMap(row=>{
  if(!inSystemCohort(row,cohort))return[];
  const offers=currentOffers(row,{education,field},catalog);offers.exploration=(row.exploration061||[]).filter(id=>educationMatches(catalog.get(id),education)&&(field==='all'||catalog.get(id)?.fields?.includes(field)));offers.followups=(row.followup062||[]).filter(f=>educationMatches(catalog.get(f.id),education)&&(field==='all'||catalog.get(f.id)?.fields?.includes(field)));const all=[...offers.supported,...offers.top,...offers.other];
  if((education!=='all'||field!=='all')&&!all.length&&!offers.exploration.length&&!offers.followups.length)return[];
  if(q&&![row.id,row.name,...all.map(p=>p.title),...offers.exploration.map(id=>catalog.get(id)?.title),...offers.followups.map(f=>catalog.get(f.id)?.title)].join(' ').toLowerCase().includes(q))return[];
  if(outcome!=='all'&&currentOutcome(offers)!==outcome)return[];
  const flagged=new Set((reviews.get(row.id)?.top||[]).filter(p=>p.verdict==='needs-clarification').map(p=>p.id));
  if(review==='held'&&!row.heldClaims?.length||review==='unreviewed'&&!offers.top.some(p=>!reviews.get(row.id)?.top.some(a=>a.id===p.id)))return[];
  if(review==='followup'&&!offers.followups.length)return[];
  if(review==='top'&&!offers.top.length||review==='no-top'&&offers.top.length||review==='pending'&&!offers.other.some(p=>!p.supported)&&!offers.exploration.length||review==='clarification'&&!offers.top.some(p=>flagged.has(p.id)))return[];
  return [{...row,offers}];
 });
}
export function currentCSV(rows,reviews=new Map(),catalog=new Map()){
 const cell=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"',names=ps=>ps.map(p=>p.title).join(' | ');
 return '\uFEFF'+[['Model ID','Name','Cohort','Current Top matches','Other current options','Supported matches sustaining lifestyle','Top claims flagged for clarification','Has bachelor / graduate Top','Unconfirmed exploration candidates','Further specifically supported matches','Partial-specific follow-up candidates'],...rows.map(r=>[r.id,r.name,cohortLabels[r.phase]||r.phase,names(r.offers.top),names(r.offers.other),names(r.offers.sustaining),names(r.offers.top.filter(p=>reviews.get(r.id)?.top.some(a=>a.id===p.id&&a.verdict==='needs-clarification'))),r.offers.top.some(p=>educationMatches(catalog.get(p.id),'degree')),(r.offers.exploration||[]).map(id=>catalog.get(id)?.title||id).join(' | '),names((r.offers.supported||[]).filter(p=>!r.offers.top.some(t=>t.id===p.id))),(r.offers.followups||[]).map(f=>catalog.get(f.id)?.title||f.id).join(' | ')])].map(row=>row.map(cell).join(',')).join('\r\n');
}
