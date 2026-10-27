import {coverage050Baseline} from './coverage-050-baseline.js';
import {coverageExplorationRecord} from './coverage-050-replay.js';
import {expandedOccupationById} from './expanded-occupation-data.js';
import {expandedPayOpportunity} from './expanded-pay.js';
export const isDegreeOffer=p=>(p.routes||[]).some(r=>['college','graduate'].includes(r.key));
export function attachCoverageReview(row,state){
 const before=coverage050Baseline[row.id];if(!before)return row;
 const payOnlyTop=before.top.map(p=>{const o=expandedOccupationById(p.id);if(!o)return p;const op=expandedPayOpportunity(state,o);return {...p,firstPay:op.firstPay,sustains:op.meetsAtStart===null?null:!!op.meetsAtStart&&!op.requiresExperience,monthlyRemaining:op.start?.remaining??null,payEvidence:op.payEvidence};});
 const oldIds=new Set(before.top.map(p=>p.id)),newIds=new Set(row.top.map(p=>p.id));
 return {...row,coverageReview:{version:'0.50.0',before,payOnlyTop,exploration:coverageExplorationRecord(row.id),added:row.top.filter(p=>!oldIds.has(p.id)).map(p=>({id:p.id,title:p.title,routes:p.routes})),removed:before.top.filter(p=>!newIds.has(p.id)),changed:JSON.stringify(before.top.map(p=>p.id))!==JSON.stringify(row.top.map(p=>p.id)),reason:row.top.some(p=>isDegreeOffer(p))&&!before.top.some(isDegreeOffer)?'A confirmed college/graduate option now joins the Top list.':'Interest fit, pay evidence and ranking are reported separately.'}};
}
