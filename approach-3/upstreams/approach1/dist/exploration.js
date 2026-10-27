import {analyze} from './analysis.js?v=0.31.0';
import {getCareerFacts,occupations} from './occupation-data.js?v=0.31.0';

const occupationIds=new Set(occupations.map(x=>x.id));
const promptIds=new Set(['task-preference','routine-accuracy','listening-support','everyday-support','explain-teach','use-evidence','privacy-records','team-boundaries','setting-schedule','learning-route']);
const isoDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const cleanText=(v,max=2000)=>typeof v==='string'?v.slice(0,max):'';
const cleanIds=(v,set,max=1000)=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&set.has(x)))].slice(0,max):[];
const safeMapKey=k=>typeof k==='string'&&!['__proto__','constructor','prototype'].includes(k)&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(k);
const mapEntries=(v,fn,max=1000)=>{const out={};if(!v||typeof v!=='object'||Array.isArray(v))return out;for(const [k,x] of Object.entries(v)){if(Object.hasOwn(out,k)||!safeMapKey(k))continue;const y=fn(x,k);if(y!==null&&y!==undefined)out[k]=y;if(Object.keys(out).length>=max)break;}return out;};

export function freshExploration(){return {journey:'',savedCareers:[],compareCareers:[],careerChoices:{},careerOrder:[],followUps:{},careerNotes:{},careerQuestions:{},context:{language:'',educationLocation:'',routes:[],costConcerns:'',supportNeeds:'',nomination:''},lastRoute:''};}

/** Private, browser-local exploration fields. Unknown occupation/prompt identifiers are discarded. */
export function cleanExploration(raw){
  const x=freshExploration();if(!raw||typeof raw!=='object'||Array.isArray(raw))return x;
  if(['quick','full'].includes(raw.journey))x.journey=raw.journey;
  x.savedCareers=cleanIds(raw.savedCareers,occupationIds);
  x.compareCareers=cleanIds(raw.compareCareers,occupationIds,3);
  x.careerChoices=mapEntries(raw.careerChoices,v=>['explore','questions','later'].includes(v)?v:null);
  for(const k of Object.keys(x.careerChoices))if(!occupationIds.has(k))delete x.careerChoices[k];
  x.careerOrder=cleanIds(raw.careerOrder,occupationIds);
  x.followUps=mapEntries(raw.followUps,v=>{
    if(!v||typeof v!=='object'||Array.isArray(v))return null;
    const allowed=Object.fromEntries(Object.entries(v).filter(([promptId])=>promptIds.has(promptId)));
    return mapEntries(allowed,p=>{
      if(!p||typeof p!=='object'||Array.isArray(p))return null;
      const answer={response:cleanText(p.response,2000),status:['answered','not-tried','unsure','skipped'].includes(p.status)?p.status:'',exposure:['new','some','often'].includes(p.exposure)?p.exposure:'',confidence:[1,2,3,4,5].includes(p.confidence)?p.confidence:null,evidence:cleanText(p.evidence,1000),date:isoDate(p.date)?p.date:''};
      if(!answer.status&&!answer.response&&!answer.evidence&&!answer.exposure&&answer.confidence===null&&!answer.date)return null;
      return answer;
    },10);
  });
  for(const careerId of Object.keys(x.followUps)){if(!occupationIds.has(careerId)){delete x.followUps[careerId];continue;}for(const promptId of Object.keys(x.followUps[careerId]))if(!promptIds.has(promptId))delete x.followUps[careerId][promptId];}
  x.careerNotes=mapEntries(raw.careerNotes,v=>cleanText(v,2000));for(const k of Object.keys(x.careerNotes))if(!occupationIds.has(k))delete x.careerNotes[k];
  x.careerQuestions=mapEntries(raw.careerQuestions,v=>cleanText(v,2000));for(const k of Object.keys(x.careerQuestions))if(!occupationIds.has(k))delete x.careerQuestions[k];
  const c=raw.context&&typeof raw.context==='object'?raw.context:{};
  x.context={language:cleanText(c.language,80),educationLocation:cleanText(c.educationLocation,120),routes:cleanIds(c.routes,new Set(['college','apprenticeship','certificate','work','military','not-sure']),6),costConcerns:cleanText(c.costConcerns,1000),supportNeeds:cleanText(c.supportNeeds,1000),nomination:cleanText(c.nomination,200)};
  if(typeof raw.lastRoute==='string'&&/^(journey|discover|catalog|results|plan|report|compare-careers|career-reflection\/[a-z0-9-]{1,80}|career\/[a-z0-9-]{1,80})$/.test(raw.lastRoute))x.lastRoute=raw.lastRoute;
  return x;
}

// Original, optional, untimed reflections. These are not assessment items or a scored scale.
export const followUpPrompts=[
 {id:'task-preference',title:'Choose a part of the work to notice',text:'Which part sounds most interesting: understanding a problem, making something, explaining it, or organizing the work? What have you tried?',taskIds:[],settingTags:[],condition:'All occupations',responseType:'text'},
 {id:'routine-accuracy',title:'Detailed records and repeated checks',text:'Would you like to investigate work involving detailed records and repeated accuracy checks?',taskIds:['records','check','detail','accuracy'],settingTags:['organizing'],condition:'Tasks involving records, checking, or accuracy',responseType:'text'},
 {id:'listening-support',title:'Listening and responding',text:'When someone is upset or having trouble, what kinds of listening or practical support would you like to practice? Which parts might feel difficult?',taskIds:['support','listen','communicate','help'],settingTags:['helping'],condition:'Work that may involve communication or support',responseType:'text'},
 {id:'everyday-support',title:'Helping with everyday tasks',text:'Would you like to learn how to support someone with ordinary daily activities while following guidance from a trained staff member? What would you want to know first?',taskIds:['care','assist','support','daily'],settingTags:['helping'],condition:'Work that may involve supervised practical support',responseType:'text'},
 {id:'explain-teach',title:'Explaining and teaching',text:'Which sounds more engaging to try: showing someone a new activity, explaining an idea, or helping plan a next step? What makes you curious about it?',taskIds:['teach','explain','demonstrate','present'],settingTags:['helping','persuading'],condition:'Work involving explanation, instruction, or demonstration',responseType:'text'},
 {id:'use-evidence',title:'Using evidence carefully',text:'How interested are you in comparing observations, records, or research before deciding what a problem might mean? What would you need help learning?',taskIds:['research','analyze','evaluate','observe','data'],settingTags:['investigating'],condition:'Work involving observation, evidence, or analysis',responseType:'text'},
 {id:'privacy-records',title:'Privacy and documentation',text:'How would you feel about writing brief, accurate notes that other professionals may use to coordinate support? What questions would you ask about privacy and responsibility?',taskIds:['record','document','report','notes'],settingTags:['organizing','helping'],condition:'Tasks involving documentation or team handoffs',responseType:'text'},
 {id:'team-boundaries',title:'Team roles and boundaries',text:'What would you want to understand about the difference between offering day-to-day support, providing clinical care under a professional’s direction, and assessing or treating a condition as a licensed professional?',taskIds:['team','coordinate','care','assess','treat'],settingTags:['helping'],condition:'When roles involve care, teams, or professional boundaries',responseType:'text'},
 {id:'setting-schedule',title:'Work setting and schedule',text:'Which settings would you like to learn about—school, clinic, hospital, residential program, research office, or community service? Are there schedules or environments you would want to ask about?',taskIds:[],settingTags:[],condition:'Ask only as a question; local work conditions may be unknown',responseType:'text'},
 {id:'learning-route',title:'Learning route and next experiment',text:'What small, age-appropriate step could help you learn more—read an official role description, interview a counselor, take an introductory course, volunteer in an appropriate supervised setting, or compare training programs? What would you notice afterward?',taskIds:[],settingTags:[],condition:'All occupations',responseType:'text'},
];

export function selectedFollowUps(state,careerId){
  const career=getCareerFacts(careerId);if(!career)return [];
  const bag=[career.title,career.summary,...(career.tasks||[]).map(t=>t.text),...(career.activityTags||[]),...(career.settings||[])].join(' ').toLowerCase();
  const tokens=s=>s.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const matches=p=>p.taskIds.some(k=>bag.includes(k))||p.settingTags.some(k=>bag.includes(k));
  // Start with broadly useful reflection, then only prompt for task themes evidenced in this career's descriptors.
  const general=[followUpPrompts[0],followUpPrompts[8],followUpPrompts[9]];
  const roleSpecific=followUpPrompts.slice(1,8).filter(matches).slice(0,3);
  const unique=[...new Map([...general,...roleSpecific].map(p=>[p.id,p])).values()];
  return unique.map(p=>({...p,careerId,condition:p.condition==='All occupations'?p.condition:`${p.condition} · prompted by this role's task wording`,taskIds:[...(career.tasks||[]).filter(t=>p.taskIds.some(k=>t.text.toLowerCase().includes(k))).map(t=>t.id)],settingTags:[...p.settingTags]}));
}

const directionForCareer=new Map(occupations.map(c=>[c.id,c]));
function evidenceForEditorial(state,item){
  const i=state.results?.interest||{};
  const fingerprint=JSON.stringify({form:i.form,version:i.version,source:i.source,origin:i.origin,date:i.date,representation:i.representation,min:i.min,max:i.max,scores:i.scores});
  let hash=2166136261;for(let n=0;n<fingerprint.length;n++)hash=Math.imul(hash^fingerprint.charCodeAt(n),16777619);
  const interestId=`interest:${item.id}:${(hash>>>0).toString(36)}`;
  const interest=item.evidence.filter(e=>e.source==='interest').map(e=>({id:interestId,type:'interest',label:e.label,reference:e.reference||'Interest profile'}));
  const experience=item.evidence.filter(e=>e.source==='experience').map(e=>({id:`experience:${item.id}`,type:'experience',label:e.label,reference:e.reference||'Student reflection'}));
  const choice=item.evidence.filter(e=>e.source==='choice').map(e=>({id:`choice:direction:${item.id}`,type:'choice',label:e.label,reference:e.reference||'Student choice'}));
  return [...interest,...experience,...choice];
}
function candidate(id,category,state,evidence=[]){
  const career=getCareerFacts(id);if(!career)return null;
  const item=career.experiment||{};
  return {id,career,category,evidence,unknowns:[...(career.context?.status==='not_available'?['Work setting and schedule details have not been reviewed.']:[]),...(career.preparation?.status&&career.preparation.status!=='sourced'?['Preparation details need source review.']:[])],experiment:{title:item.title||'Learn about this work',detail:item.detail||'Read an official career description and prepare a question for a counselor.',notice:item.notice||'Use an age-appropriate, supervised activity.'},selected:state.exploration?.savedCareers?.includes(id)||['explore','questions'].includes(state.exploration?.careerChoices?.[id])};
}
/** A short browse list with student choices first, followed by clearly editorial evidence links. */
export function careerCandidates(state){
  const x=state.exploration||freshExploration(),items=analyze(state).items,out=[],seen=new Set();
  const add=(id,category,evidence=[])=>{if(!occupationIds.has(id)||seen.has(id)||out.length>=5||x.careerChoices?.[id]==='later')return;const row=candidate(id,category,state,evidence);if(row){out.push(row);seen.add(id);}};
  const ordered=[...x.careerOrder,...occupations.map(o=>o.id)].filter((id,i,a)=>a.indexOf(id)===i);
  const nomination=(x.context?.nomination||'').trim().toLocaleLowerCase();
  const matchNomination=occupations.find(o=>[o.title,...(o.aliases||[])].some(t=>t.toLocaleLowerCase()===nomination));
  if(matchNomination)add(matchNomination.id,'student-choice',[{id:`nomination:${matchNomination.id}`,type:'choice',label:'You nominated this occupation to include.',reference:'Your nomination'}]);
  for(const id of ordered)if(['explore','questions'].includes(x.careerChoices?.[id])||x.savedCareers.includes(id)){const questions=x.careerChoices?.[id]==='questions';add(id,'student-choice',[{id:`choice:career:${id}`,type:'choice',label:questions?'You have questions about this occupation.':'You chose to keep this occupation in view.',reference:'Your selection'}]);}
  const provider=state.results?.providerReturns;
  if(provider?.verified===true&&cleanText(provider.source,300).trim()&&isoDate(provider.date)){
    for(const id of cleanIds(provider.ids,occupationIds,5))add(id,'official-return',[{id:`provider-return:${id}:${provider.date}`,type:'official-return',label:'This occupation was returned by the assessment provider.',reference:`${provider.source} · ${provider.date}`}]);
  }
  for(const item of items){const c=occupations.find(o=>o.soc===item.soc),hasStudentEvidence=item.evidence.some(e=>e.source==='experience'||e.source==='choice');if((item.interestLinked||hasStudentEvidence)&&c)add(c.id,'editorial',evidenceForEditorial(state,item));}
  // Related occupations are a browsing connection from a chosen role, never a progression claim.
  const seed=out[0]?.career||null;
  if(seed)for(const id of seed.relatedIds||[])add(id,'related',[{id:`related:${seed.id}:${id}`,type:'occupation-fact',label:'Related in the occupation browse collection; this is not a guaranteed progression.',reference:seed.title}]);
  for(const c of occupations)add(c.id,'discovery');
  // Preserve the explicit student order across lanes for any candidates already
  // in this bounded pool. The pool still prioritizes student evidence before
  // discovery and excludes set-aside careers above.
  const priority=new Map(x.careerOrder.map((id,index)=>[id,index]));
  return out.sort((a,b)=>(priority.get(a.id)??Number.MAX_SAFE_INTEGER)-(priority.get(b.id)??Number.MAX_SAFE_INTEGER));
}

/** Narrative and planning context stay out of generated reports unless the student explicitly opts in. */
export function privateExplorationForReport(state,includePrivate=false){
  if(includePrivate!==true)return null;
  const x=cleanExploration(state?.exploration);
  return {followUps:x.followUps,careerNotes:x.careerNotes,careerQuestions:x.careerQuestions,context:x.context};
}
