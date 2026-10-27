import{noncollege087}from'./noncollege-087-data.js';
const knownCareer087=id=>occupationById(id)||noncollege087.find(o=>o.id===id);
import{cleanAutomaticRound083}from'./automatic-round-state-083.js';
import {freshExplorer053,cleanExplorer053} from './explorer-053-state.js';
import {freshProfileJourney,cleanProfileJourney} from './profile-journey.js?v=0.31.0';
import {occupationById} from './occupation-data.js?v=0.31.0';
import {freshGuide,cleanGuide,rememberExploration} from './guide-state.js?v=0.31.0';
import { modules, QUESTIONNAIRE_VERSION, curiosity, priorities, confidence, challenges, directions, reflectionPrompts } from './content.js?v=0.31.0';
import {freshResults,cleanResults} from './analysis.js?v=0.31.0';
import {freshFinance,cleanFinance} from './finance.js?v=0.31.0';
import {freshExploration,cleanExploration} from './exploration.js?v=0.31.0';

export const STORAGE_KEY = 'fieldguide-exploration-v1';
export function freshState() {
  return {version:1,explorer053:freshExplorer053(),profileJourney:freshProfileJourney(),careerLibrary:{saved:[],notes:{}},questionnaireVersion:QUESTIONNAIRE_VERSION,skippedModules:[],profile:{nickname:'',grade:'',year:'',system:''},curiosity:{},priorities:[],confidence:{},challenges:{},evidence:{project:'',subject:'',reflection:'',externalName:'',externalDate:'',externalResult:'',externalNorms:''},reflection:{energy:'',meaning:'',question:''},savedDirections:[],activityReflections:[],actions:[],results:freshResults(),finance:freshFinance(),exploration:freshExploration(),guide:freshGuide()};
}
const str=(v,max=6000)=>typeof v==='string'?v.slice(0,max):'';
const known=(list,id)=>list.some(x=>x.id===id);
export function sanitizeState(raw) {
  const s=freshState();
  if(!raw||typeof raw!=='object'||raw.version!==1)return s;
  s.questionnaireVersion=typeof raw.questionnaireVersion==='string'?raw.questionnaireVersion:'1.0.0';
  s.skippedModules=Array.isArray(raw.skippedModules)?[...new Set(raw.skippedModules.filter(id=>known(modules,id)))]:[];
  s.profileJourney=cleanProfileJourney(raw.profileJourney);
  s.explorer053=cleanExplorer053(raw.explorer053);const round083=cleanAutomaticRound083(raw.explorer053?.followupRound083);if(round083)s.explorer053.followupRound083=round083;
  s.careerLibrary.saved=Array.isArray(raw.careerLibrary?.saved)?[...new Set(raw.careerLibrary.saved.filter(id=>knownCareer087(id)))].slice(0,1000):[];
  if(raw.careerLibrary?.notes&&typeof raw.careerLibrary.notes==='object')for(const [id,note]of Object.entries(raw.careerLibrary.notes))if(knownCareer087(id))s.careerLibrary.notes[id]=str(note,6000);
  s.results=cleanResults(raw.results);
  s.finance=cleanFinance(raw.finance);
  s.exploration=cleanExploration(raw.exploration);
  s.guide=cleanGuide(raw.guide);
  for(const key of Object.keys(s.profile))s.profile[key]=str(raw.profile?.[key],80);
  for(const q of curiosity){const v=raw.curiosity?.[q.id];if([1,2,3,4,5,'untried'].includes(v))s.curiosity[q.id]=v;}
  if(Array.isArray(raw.priorities))s.priorities=[...new Set(raw.priorities.filter(id=>known(priorities,id)))].slice(0,3);
  for(const q of confidence){
    const v=raw.confidence?.[q.id];if(!v||typeof v!=='object')continue;
    s.confidence[q.id]={};
    if(['new','some','often'].includes(v.exposure))s.confidence[q.id].exposure=v.exposure;
    if([1,2,3,4,5].includes(v.confidence))s.confidence[q.id].confidence=v.confidence;
  }
  for(const q of challenges){const v=raw.challenges?.[q.id];if(Number.isInteger(v)&&v>=0&&v<q.options.length)s.challenges[q.id]=v;}
  for(const key of Object.keys(s.evidence))s.evidence[key]=str(raw.evidence?.[key]);
  for(const q of reflectionPrompts)s.reflection[q.id]=str(raw.reflection?.[q.id]);
  if(Array.isArray(raw.savedDirections))s.savedDirections=[...new Set(raw.savedDirections.filter(id=>known(directions,id)))];
  if(Array.isArray(raw.actions))s.actions=raw.actions.filter(a=>a&&typeof a.id==='string'&&typeof a.title==='string'&&a.title.trim()).slice(0,80).map(a=>({id:str(a.id,100),title:str(a.title,300),detail:str(a.detail,2000),done:a.done===true,...(['dueDate','support','notice','learned','enjoyed','difficult','surprising','continueDecision','interestFeedback','careerId'].reduce((out,k)=>{if(k==='careerId'){if(typeof a[k]==='string'&&/^[a-z0-9-]{1,80}$/.test(a[k]))out[k]=a[k];}else if(typeof a[k]==='string')out[k]=str(a[k],k==='dueDate'?10:2000);return out;},{}))}));
  s.activityReflections=(Array.isArray(raw.activityReflections)?raw.activityReflections:[]).filter(e=>e&&['more','less','curious'].includes(e.response)&&typeof e.actionId==='string'&&typeof e.at==='string'&&Number.isFinite(Date.parse(e.at))).slice(-500).map(e=>({actionId:str(e.actionId,100),careerId:typeof e.careerId==='string'&&occupationById(e.careerId)?e.careerId:'',response:e.response,at:e.at}));
  if(s.guide.planMode==='exploration'&&!s.guide.explorationTrail)rememberExploration(s);
  return s;
}
export function moduleStatus(s,id){
  if(s.skippedModules?.includes(id))return {done:0,total:0,skipped:true};
  switch(id){
    case'curiosity':return {done:curiosity.filter(q=>Object.hasOwn(s.curiosity,q.id)).length,total:curiosity.length};
    case'priorities':return {done:s.priorities.length,total:Math.max(1,s.priorities.length)};
    case'confidence':return {done:confidence.filter(q=>s.confidence[q.id]?.exposure&&s.confidence[q.id]?.confidence).length,total:confidence.length};
    case'challenges':return {done:challenges.filter(q=>Number.isInteger(s.challenges[q.id])).length,total:challenges.length};
    case'evidence':return {done:s.evidence.project.trim().length>=5?1:0,total:1};
    case'reflection':return {done:reflectionPrompts.some(q=>s.reflection[q.id].trim().length>=5)?1:0,total:1};
    default:return {done:0,total:1};
  }
}
export const isComplete=(s,id)=>{const x=moduleStatus(s,id);return x.done===x.total;};
export const completedCount=s=>modules.filter(m=>isComplete(s,m.id)).length;
export const nextModule=s=>modules.find(m=>!isComplete(s,m.id))||null;
export const likedActivities=s=>curiosity.filter(q=>[4,5].includes(s.curiosity[q.id]));
export const unknownActivities=s=>curiosity.filter(q=>s.curiosity[q.id]==='untried');
export function movePriority(s,id,delta){const i=s.priorities.indexOf(id),j=i+delta;if(i<0||j<0||j>=s.priorities.length)return;s.priorities.splice(i,1);s.priorities.splice(j,0,id);}
export function toggleDirection(s,id){if(!known(directions,id))return;const i=s.savedDirections.indexOf(id);if(i<0)s.savedDirections.push(id);else s.savedDirections.splice(i,1);}
export function addDirectionAction(s,id){const d=directions.find(d=>d.id===id);if(!d)return false;const actionId=`direction-${id}`;if(s.actions.some(a=>a.id===actionId))return false;s.actions.push({id:actionId,title:d.activity,detail:d.detail,done:false});return true;}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
