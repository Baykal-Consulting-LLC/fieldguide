// Prototype presentation only. Does not score interests or change supported matches.
export const payAt=(o,stage='entry')=>stage==='year5'?o.year5:o.entry;
export const comfortableTarget=(lifestyle,target)=>Math.max(target,target*(lifestyle.comfortable/lifestyle.target));
export function payStatus(o,stage,lifestyle,target){const n=payAt(o,stage);if(!Number.isFinite(n))return{key:'unknown',text:'Pay still needs a look'};if(o.requiresExperience)return{key:'unknown',text:'Prior work experience comes first'};return n>=comfortableTarget(lifestyle,target)?{key:'good',text:'Room beyond your target'}:n>=target?{key:'tight',text:'Meets your lifestyle target'}:{key:'gap',text:'Below your lifestyle target'};}
export function collegeLane(o){return o.routes.some(r=>['college','graduate'].includes(r.key)||r.label.toLowerCase().includes('associate degree'));}
export function comparisonPair(offers){if(!offers.length)return[];return[offers.find(collegeLane)?.id??null,offers.find(o=>!collegeLane(o))?.id??null];}
