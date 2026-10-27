import {degreeInventory} from './degree-inventory-data.js';
import {degreeMatchInput} from './degree-inventory-state.js';
import {degreeInventoryMatches} from './degree-inventory-matching.js';
export function degreeDiscoverySummary(s){
 const result=degreeInventoryMatches(degreeMatchInput(s),degreeInventory);
 const groups=['college','graduate'].map(key=>{const rows=result.usable?result.rows.filter(o=>o.educationGroup===key):[];return {key,count:rows.length,newCount:rows.filter(o=>!o.guidedId).length,examples:rows.filter(o=>!o.guidedId).slice(0,3).map(o=>({soc:o.soc,title:o.title,r:o.r,strengths:o.strengths.map(x=>x.id)}))};});
 return {status:result.reason,kind:'discovery-interest-connections',confirmedTop:false,lifestyleAssessed:false,includeExperienced:false,groups};
}
