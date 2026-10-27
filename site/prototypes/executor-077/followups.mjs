// Paired targeted-round executor study. Frozen 0.76 rules and saved answers
// remain untouched. This consumer uses explicit new answers, never profile text.
const links={
 'followup076-child-routines':['childcare-worker-interest-044-1'],
 'followup076-math-written-argument':['degree-15202100-047-responsibility'],
 'followup076-education-coaching':['degree-25903100-047-responsibility','evidence071-educator-coaching'],
 'followup076-film-timing':['film-editing-interest-044-2'],
 'followup076-plant-recommendations':['degree-19101300-047-responsibility'],
 'followup076-practical-safety':['carpentry-interest-044-1','carpentry-interest-044-2'],
 'followup076-software-reliability':['degree-15125100-047-responsibility'],
 'followup076-electronics-reliability':['degree-17207200-047-responsibility'],
 'followup076-qualitative-report':['degree-19309400-047-responsibility'],
 'followup076-cultural-report':['degree-19309100-047-responsibility'],
 'followup076-petroleum-purpose076':['degree-17217100-047-domain'],
 'followup076-mining-purpose076':['degree-17215100-047-domain'],
 'followup076-boundary-purpose076':['degree-17102200-047-domain']
};
export function consumeTargeted077(model,answers,records={}){
 const rs=structuredClone([...model.afterSupported,...model.candidates]),by=new Map(rs.map(r=>[r.id,r])),audit=[];
 for(const q of model.followups){const r=by.get(q.careerId),value=answers[q.questionId];if(!r||value!==1)continue;
 const ids=links[q.questionId]||[q.questionId];for(const id of ids){const record=records[id];if(record?.reviewHold||['no','unsure'].includes(record?.response)){audit.push({questionId:q.questionId,targetQuestionId:id,status:'Saved No/Unsure/hold retained'});continue;}if(!r.missing.includes(id))continue;
 // The practical-safety question supplies safety alone. Its non-safety
 // prerequisites must already be confirmed by the saved practical activity.
 if(q.questionId==='followup076-practical-safety'&&r.taskDomains.length<2)continue;
 r.missing=r.missing.filter(x=>x!==id);const domain=id.includes('-047-')?id.split('-047-')[1]:id.startsWith('research076-')?id.split('-').at(-1):id;if(id!=='evidence071-educator-coaching'&&!r.specificDomains.includes(domain))r.specificDomains.push(domain);audit.push({questionId:q.questionId,targetQuestionId:id,careerId:r.id,status:'Independent narrow answer connected',source:'blind-grok-targeted-answer'});
 }
 const expanded=r.id.startsWith('degree-')||r.id.startsWith('research076-');r.supported=!r.contrary.length&&!r.missing.length&&(expanded?r.specificDomains.length===3:r.specificDomains.length===2&&r.taskDomains.length>=2);
 }
 const oldIds=new Set(model.afterSupported.map(r=>r.id)),inventoryOrder=new Map(['animal-caretaker','vet-assistant','conservation-technician','environmental-technician','teaching-assistant','human-service-assistant','cabinetmaker'].map((x,i)=>['research076-'+x,i]));
 const supported=rs.filter(r=>r.supported).sort((a,b)=>{const ai=inventoryOrder.has(a.id),bi=inventoryOrder.has(b.id);return Number(ai)-Number(bi)||(ai?inventoryOrder.get(a.id)-inventoryOrder.get(b.id):(b.r??-2)-(a.r??-2)||b.specificDomains.length-a.specificDomains.length||b.taskDomains.length-a.taskDomains.length||a.id.localeCompare(b.id));});
 return{top:supported.slice(0,3),supported,candidates:rs.filter(r=>!r.supported),added:supported.filter(r=>!oldIds.has(r.id)),audit};
}
