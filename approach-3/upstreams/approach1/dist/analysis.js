import {careers} from './finance-data.js?v=0.31.0';
import {directions} from './content.js?v=0.31.0';
import {occupations} from './occupation-data.js?v=0.31.0';

export const ANALYSIS_VERSION='1.4.0';
export const themes=[
  {id:'R',name:'Realistic',verb:'Making & doing',color:'#b8c99c'},
  {id:'I',name:'Investigative',verb:'Asking & discovering',color:'#a5bdc9'},
  {id:'A',name:'Artistic',verb:'Creating & expressing',color:'#d9b9a6'},
  {id:'S',name:'Social',verb:'Helping & teaching',color:'#bfb2d2'},
  {id:'E',name:'Enterprising',verb:'Leading & persuading',color:'#d2bd7d'},
  {id:'C',name:'Conventional',verb:'Organizing & checking',color:'#a6bfba'},
];
// These connections are editorial prompts, not occupational interest profiles or CIP crosswalks.
export const catalog={
  design:{themes:['A','I'],career:'Commercial & industrial designers',soc:'27-1021.00',preparation:'Compare studio practice, research methods, and portfolio expectations.',credential:'Design, psychology, and HCI programs have different entry routes. Inspect each curriculum.'},
  technology:{themes:['I','C'],career:'Software developers',soc:'15-1252.00',preparation:'Try introductory programming and inspect mathematics requirements.',credential:'Computing programs vary in theory, software practice, and specializations.'},
  health:{themes:['I','S'],career:'Social science research assistants',soc:'19-4061.00',preparation:'Explore statistics, research methods, and introductory biology or psychology.',credential:'Clinical practice can require graduate study and licensure; an undergraduate degree alone may not qualify you.'},
  environment:{themes:['I','R'],career:'Environmental scientists & specialists',soc:'19-2041.00',preparation:'Compare laboratory science, fieldwork, and quantitative coursework.',credential:'Check the science preparation and degree expectations of the particular role.'},
  business:{themes:['E','C'],career:'Market research analysts',soc:'13-1161.00',preparation:'Compare economics, statistics, organizational work, and policy writing.',credential:'Business, economics, and policy are distinct study routes, with different methods.'},
  culture:{themes:['A','S'],career:'Writers & authors',soc:'27-3043.00',preparation:'Look at reading, writing, languages, and opportunities for original work.',credential:'Humanities study has many routes beyond this one career example.'},
  engineering:{themes:['R','I'],career:'Mechanical engineers',soc:'17-2141.00',preparation:'Inspect mathematics, physics, laboratory or studio work, and program entry rules.',credential:'Engineering and architecture have distinct accreditation and professional pathways.'},
  learning:{themes:['S','E'],career:'Middle school teachers',soc:'25-2022.00',preparation:'Compare social science, communication, teaching practice, and placements.',credential:'School teaching may require an approved preparation program and local certification.'},
};
for(const d of directions.filter(d=>d.interestThemes)) catalog[d.id]={themes:d.interestThemes,career:careers.find(c=>c.id===d.careers[0]).title,soc:careers.find(c=>c.id===d.careers[0]).soc,preparation:d.learn,credential:d.routeType==='training'?'Compare apprenticeship, certificates, supervised training, and local licenses.': 'Check the exact program and any further professional study or licensure.'};
export const interestForms=[['','Choose the exact form'],['onet-60-online','O*NET Short Form · 60-item online'],['onet-30-online','O*NET Mini-IP · 30-item online'],['onet-60-paper','O*NET Short Form · 60-item paper'],['provider-onet','O*NET inside a provider report · confirm form'],['other','Other / form not confirmed']];
const text=(v,max=2000)=>typeof v==='string'?v.slice(0,max):'';
const numericText=v=>typeof v==='number'&&Number.isFinite(v)?String(v):text(v,30);
const ids=new Set(directions.map(d=>d.id));
const occupationIds=new Set(occupations.map(c=>c.id));
export function freshResults(){return {
  interest:{form:'',version:'',source:'',origin:'',date:'',representation:'unknown',min:'',max:'',verified:false,suitable:false,scores:Object.fromEntries(themes.map(t=>[t.id,''])),rawScores:Object.fromEntries(themes.map(t=>[t.id,''])),displayScores:Object.fromEntries(themes.map(t=>[t.id,'']))},
  providerReturns:{ids:[],slots:['','','','',''],source:'',date:'',verified:false},
  abilities:[],connections:{},nomination:'',nominationReason:'',valuesSource:'',valuesNotes:'',order:[],includeNotes:false,
};}
export function cleanResults(raw){
  const r=freshResults();if(!raw||typeof raw!=='object')return r;
  const a=raw.interest||{};
  for(const k of ['form','version','source','origin','date'])r.interest[k]=text(a[k],300);
  if(!interestForms.some(([id])=>id===r.interest.form))r.interest.form='';
  // Older saved entries did not record whether scores were raw totals or a provider display.
  // Keep their values visible but never infer a representation from the form or numeric range.
  r.interest.representation=['raw','provider-display','unknown'].includes(a.representation)?a.representation:'unknown';
  for(const k of ['min','max'])r.interest[k]=numericText(a[k]);
  for(const t of themes)r.interest.scores[t.id]=numericText(a.scores?.[t.id]);
  for(const t of themes){r.interest.rawScores[t.id]=numericText(a.rawScores?.[t.id]);r.interest.displayScores[t.id]=numericText(a.displayScores?.[t.id]);}
  r.interest.verified=a.verified===true;r.interest.suitable=a.suitable===true;
  const provider=raw.providerReturns&&typeof raw.providerReturns==='object'?raw.providerReturns:{};
  const importedIds=Array.isArray(provider.ids)?[...new Set(provider.ids.filter(id=>typeof id==='string'&&occupationIds.has(id)))].slice(0,5):[];
  const savedSlots=Array.isArray(provider.slots)?Array.from({length:5},(_,n)=>typeof provider.slots[n]==='string'&&occupationIds.has(provider.slots[n])?provider.slots[n]:''):[];
  const slots=savedSlots.some(Boolean)?savedSlots:Array.from({length:5},(_,n)=>importedIds[n]||'');
  r.providerReturns={ids:[...new Set(slots.filter(Boolean))].slice(0,5),slots,source:text(provider.source,300),date:text(provider.date,30),verified:provider.verified===true};
  r.abilities=Array.isArray(raw.abilities)?raw.abilities.filter(x=>x&&typeof x==='object').slice(0,20).map((x,i)=>({id:`ability-${i}`,instrument:text(x.instrument,200),form:text(x.form,200),date:text(x.date,30),source:text(x.source,300),origin:text(x.origin,200),dimension:text(x.dimension,200),value:text(x.value,200),scale:['percentile','standard','raw','band'].includes(x.scale)?x.scale:'band',norms:text(x.norms,600),interval:text(x.interval,300),interpretation:text(x.interpretation),verified:x.verified===true})):[];
  for(const d of directions){const c=raw.connections?.[d.id];if(c&&typeof c==='object')r.connections[d.id]={experience:['enjoyed','new','mixed','disliked'].includes(c.experience)?c.experience:'',notes:text(c.notes),preparation:text(c.preparation),choice:['explore','unsure','later'].includes(c.choice)?c.choice:''};}
  for(const k of ['nomination','nominationReason','valuesSource','valuesNotes'])r[k]=text(raw[k],k==='nomination'?200:2000);
  r.order=Array.isArray(raw.order)?[...new Set(raw.order.filter(id=>ids.has(id)))]:[];
  r.includeNotes=raw.includeNotes===true;return r;
}
export const toNumber=v=>typeof v==='string'&&v.trim()!==''&&Number.isFinite(Number(v))?Number(v):null;
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export function providerReturnsStatus(record){
 const issues=[];
 if(!Array.isArray(record?.ids)||!record.ids.some(id=>occupationIds.has(id)))issues.push('Choose at least one known occupation returned by the assessment provider.');
 if(Array.isArray(record?.ids)&&record.ids.filter(id=>occupationIds.has(id)).length>5)issues.push('Record at most five provider-returned occupations.');
 if(typeof record?.source!=='string'||!record.source.trim())issues.push('Add the result source reference.');
 if(!validDate(record?.date||''))issues.push('Add the date of the provider result.');
 if(record?.verified!==true)issues.push('Check the occupation list against the provider result.');
 return {kind:issues.length?'review':'ready',label:issues.length?'Provider returns · needs review':'Provider-returned occupations recorded',issues};
}
export function interestStatus(i){
  const values=themes.map(t=>toNumber(i.scores[t.id])),min=toNumber(i.min),max=toNumber(i.max);
  if(values.every(v=>v===null))return {kind:'empty',label:'No interest scores yet',issues:['Enter an official result, or explore through your own experiences.'],values,top:[]};
  const issues=[];
  if(i.representation==='provider-display'){
    const displayIssues=['These are provider-derived displayed values, not raw totals. Keep them as shown; rounded displays cannot be converted back to raw scores. Browse or use career suggestions returned by the provider.'];
    if(values.some(v=>v===null))displayIssues.push('Some displayed values are blank or not numeric. Blanks remain unknown.');
    if(!i.form||['other','provider-onet'].includes(i.form))displayIssues.push('Record or confirm the exact assessment form.');
    if(!i.source.trim()||!validDate(i.date))displayIssues.push('Add the source reference and date taken.');
    if(!i.verified)displayIssues.push('Check the six displayed values against the source.');
    if(!i.suitable)displayIssues.push('Review whether the form, language, and administration were appropriate.');
    return {kind:'display-only',label:'Provider display · discussion only',issues:displayIssues,values,top:[]};
  }
  if(i.representation!=='raw')issues.push('Confirm whether the values are raw totals, provider-derived display values, or unknown.');
  if(values.some(v=>v===null))issues.push('All six scores are needed; blanks are not zeros.');
  if(min===null||max===null||max<=min)issues.push('Copy valid lower and upper scale bounds from the report or scoring instructions.');
  else if(values.some(v=>v!==null&&(v<min||v>max)))issues.push('A score is outside the entered scale bounds.');
  if(!i.form||['other','provider-onet'].includes(i.form))issues.push('Confirm the exact O*NET form before using the six scores together.');
  if(i.form==='onet-60-paper'&&(min!==0||max!==10||values.some(v=>v!==null&&!Number.isInteger(v))))issues.push('The official paper form uses whole-number counts from 0 to 10.');
  const formMax={'onet-60-online':40,'onet-30-online':20}[i.form];
  if(formMax&&(min!==0||max!==formMax||values.some(v=>v!==null&&!Number.isInteger(v))))issues.push(`This official online form uses whole-number sums from 0 to ${formMax}.`);
  if(!i.source.trim()||!validDate(i.date))issues.push('Add the source reference and date taken.');
  if(!i.verified)issues.push('Check the six scores and scale against the source.');
  if(!i.suitable)issues.push('Confirm that the form, language, and administration were appropriate.');
  if(issues.length)return {kind:values.some(v=>v===null)?'incomplete':'review',label:values.some(v=>v===null)?'Incomplete profile':'Recorded · needs review',issues,values,top:[]};
  const spread=Math.max(...values)-Math.min(...values);
  if(spread===0)return {kind:'flat',label:'A broad interest picture',issues:['All six scores are equal. Explore broadly; there is no differentiated profile to order.'],values,top:[]};
  if(spread/(max-min)<=.05)return {kind:'broad',label:'Small differences · explore broadly',issues:['The scores differ by at most 5% of the entered scale span. This is an editorial display rule, not a statistical significance test.'],values,top:[]};
  // A zero floor is an unendorsed activity level, not a meaningful runner-up.
  // Retain all ties at the highest level, but only choose levels above the
  // entered scale minimum.
  const levels=[Math.max(...values)];
  return {kind:'ready',label:'Ready for interest exploration',issues:[],values,top:themes.filter((t,n)=>levels.includes(values[n])).map(t=>t.id)};
}
export function abilityStatus(a){
  if(!a.instrument.trim()||!a.dimension.trim()||!a.value.trim())return 'Incomplete · recorded only';
  if(a.scale==='percentile'){const n=toNumber(a.value);if(n===null||n<0||n>100)return 'Check percentile · recorded only';if(!a.norms.trim())return 'Comparison group needed · recorded only';}
  if(['standard','raw'].includes(a.scale)&&toNumber(a.value)===null)return 'Check numeric score · recorded only';
  if(!a.verified||!a.source.trim()||!a.form.trim()||!validDate(a.date))return 'Needs source review · recorded only';
  return 'Source checked · supporting discussion';
}
export function analyze(state){
  const r=cleanResults(state.results),status=interestStatus(r.interest);
  const items=directions.map(d=>{
    const c=r.connections[d.id]||{},matched=catalog[d.id].themes.filter(t=>status.top.includes(t));
    const evidence=[];
    if(matched.length)evidence.push({source:'interest',label:`${matched.map(id=>themes.find(t=>t.id===id).name).join(' and ')} ${matched.length>1?'appear':'appears'} at the highest raw score level above the form minimum. This direction is an editorial connection to those activities.`,reference:`${r.interest.source} · ${r.interest.date}`});
    if(c.experience==='enjoyed')evidence.push({source:'experience',label:'You said you enjoyed a related experience.',reference:c.notes||'Your experience selection'});
    if(c.experience==='mixed')evidence.push({source:'experience',label:'You reported mixed feelings about a related experience.',reference:c.notes||'Your experience selection'});
    if(c.choice==='explore'||state.savedDirections?.includes(d.id))evidence.push({source:'choice',label:'You chose to keep this direction in view.',reference:'Your selection'});
    let lane=c.choice==='later'?'Set aside for now':c.experience==='disliked'?'Your response needs a conversation':c.preparation?.trim()?'Explore with a learning plan':c.choice==='explore'||state.savedDirections?.includes(d.id)?'You chose to explore':matched.length&&c.experience==='enjoyed'?'Start exploring here':matched.length?'Worth trying':c.experience==='enjoyed'?'Follow your experience':'Something new to discover';
    return {...d,...catalog[d.id],evidence,lane,connection:c,interestLinked:matched.length>0};
  });
  // Student ordering precedes an editorial grouping. Catalog order resolves ties; it is not a fit rank.
  const priority=x=>r.order.includes(x.id)?r.order.indexOf(x.id):-1;
  items.sort((a,b)=>{const pa=priority(a),pb=priority(b);if(pa>=0||pb>=0)return (pa<0?100:pa)-(pb<0?100:pb);const weight=x=>(x.connection.choice==='later'?10:0)-(x.connection.choice==='explore'?4:0)-(state.savedDirections?.includes(x.id)?3:0)-(x.interestLinked?2:0)-(x.connection.experience==='enjoyed'?1:0);return weight(a)-weight(b);});
  const active=items.filter(x=>x.connection.choice!=='later'),agenda=active.slice(0,4);
  const origins=r.abilities.map(a=>a.origin.trim()).filter(Boolean),duplicates=[...new Set(origins.filter((v,i)=>origins.indexOf(v)!==i))];
  return {version:ANALYSIS_VERSION,status,items,agenda,remaining:items.filter(x=>!agenda.includes(x)),abilities:r.abilities.map(a=>({...a,status:abilityStatus(a)})),duplicates,nomination:r.nomination,nominationReason:r.nominationReason};
}
export function fictionalState(base){
  const s=structuredClone(base);s.profile.nickname='Example student';s.savedDirections=[];s.actions=[];
  s.results=freshResults();s.results.interest={...s.results.interest,form:'onet-60-paper',version:'Fictional illustration',source:'Invented example · no real assessment',origin:'fictional-interest',date:'2026-10-01',representation:'raw',min:'0',max:'10',verified:true,suitable:true,scores:{R:'5',I:'9',A:'9',S:'7',E:'3',C:'2'}};
  s.results.connections.design={experience:'enjoyed',notes:'I made a museum-exhibit model and enjoyed testing the layout.',preparation:'',choice:'explore'};
  s.results.connections.technology={experience:'new',notes:'I have not tried much programming.',preparation:'Try an introductory lesson before judging whether I enjoy it.',choice:''};
  s.results.nomination='Cognitive science';s.results.nominationReason='I want to understand how people notice and learn things.';
  s.results.valuesSource='Personal reflection';s.results.valuesNotes='Room to create, keep learning, and help people.';
  s.results.abilities=[{id:'example-ability',instrument:'Fictional ability report',form:'Illustrative only',date:'2026-10-01',source:'Invented example',origin:'fictional-ability',dimension:'Spatial reasoning',value:'Relative strength',scale:'band',norms:'No real comparison population',interval:'Not supplied',interpretation:'A prompt to investigate activities involving visual models.',verified:true}];
  s.results.includeNotes=true;return s;
}
