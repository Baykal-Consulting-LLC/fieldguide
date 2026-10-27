import {freshLifestyleBuilder,cleanLifestyleBuilder,builderReady,buildLifestyleInputs,lifestyleChoices} from './shared-lifestyle/lifestyle-builder.js';
import {calculateLifestyle,employeeTaxes} from './shared-lifestyle/lifestyle.js';
import {lifestyleIncomeRange} from './shared-lifestyle/income-target.js';

// Approach 2 owns this adapter. The pinned questions and pure math stay shared.
export const budgetGroups=[
 {id:'rent',title:'Renting',mode:'rent',fields:[['rent','Monthly rent'],['utilities','Monthly utilities']]},
 {id:'own',title:'Owning a home',mode:'own',fields:[['homePrice','Home price'],['downPercent','Down payment (%)'],['mortgageRate','Mortgage interest (%)'],['mortgageYears','Mortgage term (years)'],['pmiRate','Annual PMI (%)'],['propertyTax','Annual property tax (%)'],['homeInsurance','Monthly home insurance'],['hoa','Monthly HOA'],['maintenance','Annual maintenance (% of home price)'],['utilities','Monthly utilities'],['cashSaved','Cash available for upfront home costs']]},
 {id:'transit',title:'Transit & rides',car:'transit',fields:[['transit','Monthly transit'],['rides','Monthly rides']]},
 {id:'car',title:'Car running costs',car:'car',fields:[['fuel','Monthly fuel'],['carInsurance','Monthly car insurance'],['carMaintenance','Monthly maintenance'],['carOther','Monthly replacement fund / other car costs']]},
 {id:'loan',title:'Car purchase',car:'loan',fields:[['carPrice','Car price'],['carDown','Car down payment'],['carRate','Car interest (%)'],['carMonths','Car loan term (months)']]},
 {id:'essentials',title:'Everyday essentials',fields:[['groceries','Monthly groceries'],['phone','Monthly phone & internet'],['household','Monthly household & personal care'],['health','Monthly health budget'],['debt','Monthly debt payments'],['extraNeeds','Monthly dependents / other essentials']]},
 {id:'dining',title:'Meals out',fields:[['quickCount','Quick meals per month'],['quickPrice','Cost per quick meal'],['casualCount','Casual meals per month'],['casualPrice','Cost per casual meal'],['specialCount','Special meals per month'],['specialPrice','Cost per special meal']]},
 {id:'goals',title:'Enjoyment & future goals',fields:[['travel','Monthly travel fund'],['tripPrice','Illustrative cost per trip'],['recreation','Monthly entertainment & hobbies combined'],['clothing','Monthly clothing'],['saving','Monthly cash savings'],['retirement','Retirement contribution (% of gross pay)']]}
];
const overrideKeys=new Set(budgetGroups.flatMap(g=>g.fields.map(([key])=>key)));
export function freshLifestyleDraft(){return{version:1,builder:freshLifestyleBuilder(),overrides:{}};}
export function cleanLifestyleDraft(raw){const out=freshLifestyleDraft();if(!raw||raw.version!==1)return out;out.builder=cleanLifestyleBuilder(raw.builder);for(const[k,v]of Object.entries(raw.overrides||{}))if(overrideKeys.has(k)&&['string','number'].includes(typeof v))out.overrides[k]=String(v).slice(0,30);return out;}
export function setLifestyleChoice(draft,id,value){const q=lifestyleChoices.find(q=>q.id===id);if(!q||!Number.isInteger(value)||value<0||value>=q.options.length)return false;if(draft.builder.choices[id]!==value){const keys=new Set([...q.options,...q.ownOptions||[]].flatMap(o=>Object.keys(o.inputs)));for(const k of keys)delete draft.overrides[k];}draft.builder.choices[id]=value;draft.builder.complete=false;return true;}
export function setHomeMode(draft,mode){if(!['rent','own'].includes(mode)||draft.builder.homeMode===mode)return false;draft.builder.homeMode=mode;delete draft.builder.choices.home;for(const k of [...lifestyleChoices[0].options,...lifestyleChoices[0].ownOptions].flatMap(o=>Object.keys(o.inputs)))delete draft.overrides[k];draft.builder.complete=false;return true;}
export function updateBudget(draft,key,value){if(!overrideKeys.has(key))return false;draft.overrides[key]=String(value).slice(0,30);draft.builder.complete=false;return true;}
export function lifestyleInputs(draft){if(!builderReady(draft?.builder))return null;const inputs=buildLifestyleInputs(draft.builder);for(const[k,v]of Object.entries(draft.overrides||{}))if(overrideKeys.has(k))inputs[k]=v;return inputs;}
export function visibleBudgetGroups(inputs){return budgetGroups.filter(g=>(!g.mode||g.mode===inputs.housingMode)&&(!g.car||g.car==='transit'&&inputs.carMode==='transit'||g.car==='car'&&inputs.carMode!=='transit'||g.car==='loan'&&['used','new'].includes(inputs.carMode)));}
export function lifestyleSnapshot(draft){const inputs=lifestyleInputs(draft);if(!inputs)return{status:'unanswered',answered:Object.keys(draft?.builder?.choices||{}).length,confirmed:false};const result=calculateLifestyle({...inputs,netMode:'manual',manualNet:'0'});
 // The original goal solver supports only the employee illustration exposed here.
 const rate=Number(inputs.retirement),health=Number(inputs.health),issues=[...(result.issues||[])];
 if(inputs.retirement.trim()===''||!Number.isFinite(rate)||rate<0||rate>100)issues.push('retirement');
 if(inputs.health.trim()===''||!Number.isFinite(health)||health<0||health>10000000)issues.push('health');
 if(result.status!=='illustration'||issues.length)return{status:'invalid',issues:[...new Set(issues)],inputs,confirmed:false};
 const range=lifestyleIncomeRange(inputs);if(!range||!Number.isFinite(range.minimum)||range.breathingRoom>=1999999)return{status:'invalid',issues:['Budget exceeds the supported income illustration; review the amounts.'],inputs,confirmed:false};
 const targetNet=gross=>{const retirement=Math.min(rate,100,Math.floor(24500/Math.max(gross,1)*100*1e8)/1e8);return employeeTaxes(gross,retirement).monthly-health;};
 const rows=[...result.rows,['Health budget',health]].map(([label,value])=>({label,value}));
 const capAtTarget=range.high>0&&range.high*rate/100>24500;
 return{status:'ready',confirmed:draft.builder.complete===true,inputs,result,range,rows,total:result.spending+health,monthlyAfterHealthAtMinimum:targetNet(range.low),monthlyAfterHealthAtRoom:targetNet(range.high),retirementCapped:capAtTarget};
}
export function confirmLifestyle(draft){const snapshot=lifestyleSnapshot(draft);if(snapshot.status!=='ready')return false;draft.builder.complete=true;return true;}
export function nextLifestyleQuestion(draft){const i=lifestyleChoices.findIndex(q=>!Number.isInteger(draft?.builder?.choices?.[q.id]));return i<0?0:i;}
export {lifestyleChoices,builderReady};
