import {lifestyleSnapshot} from './lifestyle-state.js';
import {employeeTaxes} from './shared-lifestyle/lifestyle.js';

export const stages=[
 {id:'qualifying-route',title:'After a qualifying college or training route',short:'Qualifying-route examples',copy:'These examples do not list prior related work experience in BLS typical entry requirements. Each needs its own named program, training and any licensing. They are not all outcomes of the same degree.'},
 {id:'further-study',title:'Further study or professional preparation',short:'Further-study examples',copy:'These destinations typically need graduate or professional education. Keep their additional time, cost and entry requirements separate from undergraduate possibilities.'},
 {id:'experience',title:'Destinations requiring related experience',short:'Experienced destinations',copy:'These examples typically need related work experience. Their wages are excluded from the qualifying-route summary. They do not describe immediate graduate opportunities.'}
];
export function payScenario(gross,goal){
 if(!Number.isFinite(gross)||gross<=0)return{status:'missing'};
 if(goal?.status!=='ready'||!goal.confirmed)return{status:'no-goal'};
 const requested=Number(goal.inputs.retirement),rate=Math.min(requested,Math.floor(24500/gross*100*1e8)/1e8);
 const taxes=employeeTaxes(gross,rate),takeHome=taxes.monthly-Number(goal.inputs.health),remaining=takeHome-goal.result.spending;
 return{status:remaining+1e-7>=takeHome*.2?'breathing-room':remaining+1e-7>=0?'covers':'shortfall',gross,takeHome,remaining,retirementCapped:rate<requested};
}
export function wageRange(rows,key){const values=rows.map(r=>r[key]).filter(v=>Number.isFinite(v)&&v>0);return values.length?{low:Math.min(...values),high:Math.max(...values),count:values.length}:null;}
export function summarizeEarnings(rows,draft,stage='qualifying-route'){
 const goal=lifestyleSnapshot(draft),selected=rows.filter(r=>r.stage===stage),out={goal,selected,total:selected.length};
 for(const key of ['entry','median']){const available=selected.filter(r=>Number.isFinite(r[key])&&r[key]>0),scenarios=available.map(r=>payScenario(r[key],goal));out[key]={range:wageRange(available,key),missing:selected.length-available.length,scenarios,covers:scenarios.filter(r=>['covers','breathing-room'].includes(r.status)).length,breathingRoom:scenarios.filter(r=>r.status==='breathing-room').length};}
 return out;
}
