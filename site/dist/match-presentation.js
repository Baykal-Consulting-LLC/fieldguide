import {expandedMatchCandidates} from './expanded-interest.js';
import {careerComparisonOptions} from './career-comparisons.js';
export function matchPresentation(s){
 const {rows,reviewed}=careerComparisonOptions(s),first=rows.length>0&&!reviewed.some(r=>r.complete)&&!expandedMatchCandidates(s).some(r=>r.confirmation.confirmed);
 return {kind:first?'first':'top',label:first?'First matches':'Top matches',explanation:first?'These matches use the work you have explored so far. Compare another profession above before settling on a direction.':'These matches use your current interest profile and work answers. You can still explore other professions.'};
}
