import {calculateLifestyle,employeeTaxes,independentTaxes} from './lifestyle.js?v=0.31.0';
import {salaryProgression,salaryPreviewStages} from './salary-progression.js?v=0.31.0';
import {salaryPreviewInputs} from './guide-state.js?v=0.31.0';

export function lifestyleRoom(p){const r=calculateLifestyle(p);if(r.status!=='illustration')return {key:'unknown',title:'Let’s fill in your picture.',copy:'A few budget choices still need a look.',result:r};
 const ratio=r.takeHome>0?r.remaining/r.takeHome:-1;
 if(r.remaining<0)return {key:'tradeoffs',title:'This pay does not cover your lifestyle.',copy:'Your costs and savings are higher than your take-home pay.',result:r};
 if(ratio<.1)return {key:'tight',title:'This pay just covers your lifestyle.',copy:'Your costs and savings fit, but little is left for unexpected bills.',result:r};
 return {key:'room',title:'This pay covers your lifestyle.',copy:'Your costs and savings fit, with money left over.',result:r};}
export function lifestyleStory(p){const room=lifestyleRoom(p);if(room.key==='unknown')return {...room,tiles:[]};const r=room.result,meals=Number(p.quickCount)+Number(p.casualCount)+Number(p.specialCount),travel=Number(p.travel),fun=Number(p.recreation),clothing=Number(p.clothing);
 return {...room,tiles:[
 {symbol:'⌂',label:'Home',title:p.housingMode==='own'?'Working toward owning':Number(p.rent)<=1000?'A shared place':Number(p.rent)>1800?'More room at home':'A place of your own',copy:p.housingMode==='own'?'Monthly costs are part of this picture. Buying also takes upfront savings.':Number(p.rent)<=1000?'Sharing rent leaves more room for other parts of life.':'Your own space, with everyday home costs included.'},
 {symbol:'↗',label:'Getting around',title:({transit:'Transit and occasional rides',paid:'A car you already own',used:'A practical used car',new:'A newer car'})[p.carMode]||'Your way around',copy:p.carMode==='transit'?'A lighter transport budget, where routes and work hours allow.':'Fuel, insurance, and upkeep are part of the picture.'},
 {symbol:'☕',label:'Dinners out',title:meals===0?'Mostly dinners at home':meals*12/52<.75?'Less than 1 dinner a week':meals*12/52<1.5?'About 1 dinner a week':meals*12/52<3.5?'About 2–3 dinners a week':meals*12/52<5.5?'About 4–5 dinners a week':'About 6–7 dinners a week',copy:Number(p.specialCount)>0?'Some room is set aside for a special meal, too.':'Think everyday cafés, takeout, and relaxed places to meet friends.'},
 {symbol:'✈',label:'Travel',title:travel===0?'Travel for another season':r.trips===null?'A travel fund to shape':r.trips<1?'Save toward a getaway':r.trips<2?'An occasional getaway':'More room to travel',copy:travel===0?'You can add a travel goal when it matters to you.':'Trip length and destination change how far the fund goes.'},
 {symbol:'✳',label:'Entertainment & recreation',title:fun===0?'Free and low-cost weekends':fun<=100?'Simple outings and hobbies':fun<=200?'Regular hobbies and outings':'More room for experiences',copy:'Mix time outdoors with the activities you enjoy.'},
 {symbol:'◇',label:'Personal style',title:clothing===0?'Make the most of what you own':clothing<=60?'Thrift finds and everyday basics':clothing<=130?'Everyday brands and a few treats':'Room for occasional quality pieces',copy:'Buy fewer special pieces or spread the budget across everyday clothes.'}
 ]};}
export function careerLifestyleFit(state,id){if(!state.guide?.lifestylePreset)return null;const pay=salaryProgression(id);if(!pay)return null;
 const stages=salaryPreviewStages(id).map(s=>{const inputs=salaryPreviewInputs(state,id,s.key),room=inputs?lifestyleRoom(inputs):{key:'unknown'};return {key:s.key,years:s.years,label:s.label,room:room.key,result:room.result};});
 if(stages.some(s=>s.room==='unknown'))return {key:'unknown',title:'Shape your lifestyle picture first.',copy:'An unfinished budget needs a few choices.',stage:'entry',stages};
 const training=!!pay.paidTraining,first=stages.find(s=>['room','tight'].includes(s.room)),entry=stages[0];
 if(entry.room==='room')return {key:'early',title:training?'Training pay covers your lifestyle.':'Starting pay covers your lifestyle.',copy:state.finance.lifestyle.housingMode==='own'?'Monthly costs fit. Buying still needs a down payment and other upfront savings.':'Your costs and savings fit the pay estimate shown.',stage:entry?.key||'entry',stages};
 if(entry.room==='tight')return {key:'tight',title:training?'Training pay barely covers your lifestyle.':'Starting pay barely covers your lifestyle.',copy:'Your costs fit, but little is left for unexpected bills.',stage:entry?.key||'entry',stages};
 if(first)return {key:'later',title:training?'Training pay is too low for your lifestyle.':'Starting pay is too low for your lifestyle.',copy:`The ${first.key==='entry'?'qualified starting-pay':first.years?first.years+'-year pay':first.label.toLowerCase()+' pay'} estimate covers your choices. You would need lower costs until then.`,stage:first.key,stages};
 return {key:'tradeoffs',title:'This job’s estimated pay is too low for your lifestyle.',copy:'Every pay estimate shown falls short. You would need lower costs or higher pay.',stage:entry?.key||'entry',stages};}

// A budget target band, not a statistical confidence interval or upper income limit.
export function lifestyleIncomeRange(p){const r=calculateLifestyle({...p,netMode:'manual',manualNet:'0'});if(r.status!=='illustration')return null;const spending=r.spending,health=Number(p.health)||0,rate=Number(p.retirement)||0;
 const solve=buffer=>{if(spending===0&&health===0)return 0;let lo=0,hi=2000000;for(let i=0;i<60;i++){const gross=(lo+hi)/2,percent=Math.min(rate,100,Math.floor(24500/gross*100*1e8)/1e8);const net=(p.workMode==='independent'?independentTaxes(gross,percent):employeeTaxes(gross,percent)).monthly-health;if(net*(1-buffer)<spending)lo=gross;else hi=gross;}return hi;};
 const roundUp=n=>Math.ceil(n/(n<50000?1000:n<100000?5000:10000))*(n<50000?1000:n<100000?5000:10000);
 const minimum=solve(0),breathingRoom=solve(.2);return {minimum,breathingRoom,low:roundUp(minimum),high:roundUp(breathingRoom),buffer:.2,spending};}
