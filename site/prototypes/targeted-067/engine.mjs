// Career rules consume typed evidence, never a student's/model's name or prose.
// The bridge is a hypothesis about evidence meaning, not learned statistical weights.
export const rules={
 'degree-15202100':{domain:['math.patterns'],method:['math.checks-argument'],responsibility:['math.explains-reasoning']},
 'degree-27204100':{domain:['audio.original-work'],method:['audio.revises-by-listening'],responsibility:['audio.uses-listener-feedback']},
 'degree-27101300':{domain:['visual.original-work'],method:['visual.revises-form'],responsibility:['visual.develops-body-of-work']},
 'degree-19309300':{domain:['history.investigates-past'],method:['history.compares-records'],responsibility:['history.presents-uncertainty']}
};
export function connect(ledger,careerId,domain){const keys=rules[careerId]?.[domain];if(!keys)return{response:'unfamiliar',missing:['No scoped evidence rule']};const blocked=keys.filter(k=>ledger.no?.[k]?.length),missing=keys.filter(k=>!ledger.yes?.[k]?.length);if(blocked.length||missing.length)return{response:'unfamiliar',missing,blocked};const evidence=keys.flatMap(k=>ledger.yes[k].map(s=>({feature:k,...s})));return{response:'yes',confidence:'medium',evidence,missing:[]};}
export function proposeCareers(ledger){return Object.entries(rules).filter(([id])=>connect(ledger,id,'domain').response==='yes').map(([id])=>id);}
export function structuredLedger(p,spec){const ledger={yes:{},no:{}},put=(key,refs)=>ledger.yes[key]=refs,ref=(path,id,quote)=>({source:'frozen-structured-choice',path,id,quote});
 const topic=p.positiveTopics.includes('mathematics'),proof=p.positiveMethods.includes('formalproof'),explain=p.positiveMethods.includes('explaining');
 const t=ref('positiveTopics','mathematics',spec.topics.find(x=>x.id==='mathematics').fact),m=ref('positiveMethods','formalproof',spec.methods.find(x=>x.id==='formalproof').fact),e=ref('positiveMethods','explaining',spec.methods.find(x=>x.id==='explaining').fact);
 if(topic)put('math.patterns',[t]);if(topic&&proof)put('math.checks-argument',[t,m]);if(topic&&proof&&explain)put('math.explains-reasoning',[t,m,e]);
 if(p.negativeTopics.includes('mathematics'))for(const k of ['math.patterns','math.checks-argument','math.explains-reasoning'])ledger.no[k]=[ref('negativeTopics','mathematics','Explicit negative mathematics preference')];
 if(p.negativeMethods.includes('formalproof'))for(const k of ['math.checks-argument','math.explains-reasoning'])ledger.no[k]=[ref('negativeMethods','formalproof','Explicit negative proof preference')];if(p.negativeMethods.includes('explaining'))ledger.no['math.explains-reasoning']=[ref('negativeMethods','explaining','Explicit negative explanation preference')];return ledger;
}
// Proposed multiple-choice capture schema; these questions are not administered
// in this replay. No synthetic response is created merely because an option exists.
export const captureQuestions=[
 {id:'evidence-original-audio',prompt:'Which would you choose to try?',options:[{id:'make-original-track',text:'Make an original tune or audio track',feature:'audio.original-work'},{id:'perform-existing-music',text:'Play music someone else wrote'},{id:'not-yet-audio',text:'Not sure / have not tried'}]},
 {id:'evidence-audio-revision',prompt:'When making something with sound, which part interests you?',options:[{id:'listen-and-revise-layers',text:'Listen, change the layers, and compare how they sound',feature:'audio.revises-by-listening'},{id:'not-yet-revision',text:'Not sure / have not tried'}]},
 {id:'evidence-audio-intention',prompt:'What would you like to do with feedback on your own track?',options:[{id:'revise-own-intention',text:'Compare what listeners hear with what I intended, then make my own revisions',feature:'audio.uses-listener-feedback'},{id:'not-yet-feedback',text:'Not sure / have not tried'}]},
 {id:'evidence-math-pattern',prompt:'Which kind of number puzzle would you choose?',options:[{id:'general-pattern-question',text:'Explore whether a pattern works beyond the examples I have tried',feature:'math.patterns'},{id:'calculate-known-answer',text:'Use a known method to calculate an answer'},{id:'not-yet-pattern',text:'Not sure / have not tried'}]},
 {id:'evidence-math-argument',prompt:'When a rule seems right, what interests you?',options:[{id:'counterexample-and-argument',text:'Try to break the rule with an exception and work out an argument',feature:'math.checks-argument'},{id:'not-yet-argument',text:'Not sure / have not tried'}]},
 {id:'evidence-math-explanation',prompt:'How would you like someone else to check your solution?',options:[{id:'inspect-reasoning',text:'Show my assumptions and steps so they can question the argument',feature:'math.explains-reasoning'},{id:'compare-final-number',text:'Compare only our final answers'},{id:'not-yet-explanation',text:'Not sure / have not tried'}]}
];
export function ledgerFromChoices(answers){const ledger={yes:{},no:{}};for(const q of captureQuestions)for(const id of answers[q.id]||[]){const o=q.options.find(o=>o.id===id);if(o?.feature)(ledger.yes[o.feature]??=[]).push({source:'multiple-choice',questionId:q.id,optionId:o.id,quote:o.text});}return ledger;}
