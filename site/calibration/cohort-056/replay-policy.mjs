import{topicChosen}from'./constructs.mjs';
// Question kind owns the response shape. Yes/No options may also contain career IDs.
export const isActivityChoice=q=>!['specific','core-work'].includes(q.kind)&&q.options?.some(o=>o.careerIds);
// Uniform question-bank coverage, not a behavioral prediction. No salary, degree,
// support outcome or desired Top count determines which relevant questions run.
export function relevantCareers(rows,profile,bindings){return rows.filter(r=>{const b=bindings.careers[r.id];if(!b)return false;const topics=b.topicAll||[],groups=b.topicAny||[];return !!(topics.length+groups.length)&&topics.every(id=>topicChosen(profile,id))&&groups.every(group=>group.some(id=>topicChosen(profile,id)));});}
