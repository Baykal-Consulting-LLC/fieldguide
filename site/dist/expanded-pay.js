import {expandedPayData} from './expanded-pay-data.js';
import {salaryPreviewInputs} from './guide-state.js';
import {calculateLifestyle} from './lifestyle.js';
import {lifestyleIncomeRange} from './lifestyle-story.js';
import {roundSalary} from './salary-progression.js';

export const expandedPayEvidence=id=>expandedPayData[id]||null;
// Occupational wage proxies are planning assumptions, never measured starting pay.
// A known earlier paid preparation stage or broad SOC mapping cannot establish entry coverage.
export function expandedPayOpportunity(s,o){
 const e=expandedPayEvidence(o.id),hasLifestyle=!!s.guide?.lifestylePreset&&!!s.finance?.lifestyle;
 const budget=amount=>{const input=hasLifestyle&&Number.isFinite(amount)?salaryPreviewInputs(s,o.id,'qualified-wage-proxy',{amount}):null;const b=input?calculateLifestyle(input):null;return b?.status==='illustration'?{remaining:b.remaining,takeHome:b.takeHome,spending:b.spending}:null;};
 const start=e?.entryComparable?budget(e.amount):null,qualified=e?budget(e.amount):null,upper=e?budget(e.p25):null,goal=hasLifestyle?lifestyleIncomeRange(s.finance.lifestyle):null;
 const covers=(b,amount)=>b&&goal?b.remaining>=0&&roundSalary(amount)>=goal.low:null;
 return {id:o.id,o,interest:null,requiresExperience:!!o.requiresExperience,firstPay:e?.entryComparable?e.amount:null,qualifiedPay:e?.amount??null,meetsAtStart:e?.entryComparable?covers(start,e.amount):null,meetsQualified:qualified?covers(qualified,e.amount):null,start,payEvidence:e,qualifiedBudget:qualified,upperBudget:upper,routes:[{key:o.educationGroup,label:o.educationGroup==='graduate'?'Graduate / professional degree':'College · bachelor’s degree'}],connection:'Specific interests support exploring this career. Pay and education funding are separate comparisons.'};
}
