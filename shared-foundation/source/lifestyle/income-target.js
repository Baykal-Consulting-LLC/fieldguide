// Extracted unchanged from Approach 1; no career or pathway dependencies.
import {calculateLifestyle,employeeTaxes,independentTaxes} from './lifestyle.js?v=0.31.0';
export function lifestyleIncomeRange(p){const r=calculateLifestyle({...p,netMode:'manual',manualNet:'0'});if(r.status!=='illustration')return null;const spending=r.spending,health=Number(p.health)||0,rate=Number(p.retirement)||0;
 const solve=buffer=>{if(spending===0&&health===0)return 0;let lo=0,hi=2000000;for(let i=0;i<60;i++){const gross=(lo+hi)/2,percent=Math.min(rate,100,Math.floor(24500/gross*100*1e8)/1e8);const net=(p.workMode==='independent'?independentTaxes(gross,percent):employeeTaxes(gross,percent)).monthly-health;if(net*(1-buffer)<spending)lo=gross;else hi=gross;}return hi;};
 const roundUp=n=>Math.ceil(n/(n<50000?1000:n<100000?5000:10000))*(n<50000?1000:n<100000?5000:10000);
 const minimum=solve(0),breathingRoom=solve(.2);return {minimum,breathingRoom,low:roundUp(minimum),high:roundUp(breathingRoom),buffer:.2,spending};}
