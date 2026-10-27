import{topics,methods,responsibilities}from'./spec.mjs';
const regex=d=>new RegExp('\\b(?:'+d.pattern+')','i');
export const strip=s=>String(s).replace(/^Would you like to learn(?: to)?\s*/i,'').replace(/as a regular part of your work\??$/i,'');
export const codes=(text,defs=topics)=>defs.filter(d=>regex(d).test(strip(text))).map(d=>d.id);
export function reflection(profile,prompt,contextTopics=[],{generic=false}={}){
 const tt=codes(prompt),requiredTopics=tt.length?tt:contextTopics,mm=codes(prompt,methods),rr=codes(prompt,responsibilities),topicEvidence=requiredTopics.filter(id=>profile.positiveTopics.includes(id)),methodEvidence=mm.filter(id=>profile.positiveMethods.includes(id));
 const no=requiredTopics.some(id=>profile.negativeTopics.includes(id))||mm.some(id=>profile.negativeMethods.includes(id));
 const known=requiredTopics.length||generic&&mm.length;
 const yes=known&&requiredTopics.every(id=>profile.positiveTopics.includes(id))&&mm.every(id=>profile.positiveMethods.includes(id))&&rr.every(id=>profile.responsibilities.includes(id));
 const quotes=[...topicEvidence.map(id=>topics.find(t=>t.id===id).fact),...methodEvidence.map(id=>methods.find(t=>t.id===id).fact),...rr.filter(id=>profile.responsibilities.includes(id)).map(id=>responsibilities.find(t=>t.id===id).fact)];
 return{response:no?'no':yes?'yes':'unfamiliar',confidence:no||yes?'medium':'low',source:'profile-inferred',evidence:quotes.length?quotes.join(' · '):'This preference is not stated in the frozen synthetic profile.',constructs:{topics:requiredTopics,methods:mm,responsibilities:rr},limitation:yes?'Procedural interpretation of stated simulation preferences, not an observed student answer.':'A related interest alone does not resolve the unspecified preference.'};
}
