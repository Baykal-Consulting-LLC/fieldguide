// Scope correction after first-run aggregate diagnostics. Original frozen rules retained.
// No cohort/model IDs or outcome thresholds occur in these two global question rules.
import{questionRules as prior,optionRules,decide078,specialtyLabels078}from'./bindings.mjs';
const questionRules=structuredClone(prior);
for(const [id,reason]of[
 ['degree-19101300-047-method','Seed-growth observations and a revised observation notebook directly supply the observation/experiment branch. A previously absent generic precision label is not an additional prerequisite. Explicitly disliking careful detail checks leaves uncertainty.'],
 ['degree-13102300-047-method','Comparing supplier offers, hidden costs and agreed requirements directly supplies this comparison. A previously absent generic precision label is not an additional prerequisite. Explicitly disliking careful detail checks leaves uncertainty.']
]){questionRules[id].any=questionRules[id].any.map(branch=>branch.filter(k=>k!=='m:precision'));questionRules[id].block=[...new Set([...questionRules[id].block,'m:precision'])];questionRules[id].reason=reason;}
export{questionRules,optionRules,decide078,specialtyLabels078};
