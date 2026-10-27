// Frequency is a model–profession pair within a named displayed category.
export const frequencyCategories=[{id:'top',title:'Top match'},{id:'other',title:'Other match'},{id:'sustaining',title:'Sustains lifestyle'}];
export function frequencyInput(m){
 const ids=rows=>[...new Set((rows||[]).map(r=>typeof r==='string'?r:r.id))],pending=ids(m.needsConfirmation??m.pending),pendingSet=new Set(pending);
 return {id:m.id,name:m.name,phase:m.phase,top:ids(m.top),other:ids(m.other).filter(id=>!pendingSet.has(id)),sustaining:ids(m.sustaining),pending,invitations:ids(m.explorations??m.invitations),beyondLists:ids(m.additionalEligible??m.beyondLists)};
}
export function frequencyEducation(r,education='all'){return education==='all'||r.routes.some(x=>(education==='degree'?['college','graduate']:[education]).includes(x.key));}
const bucket=()=>({top:[],other:[],sustaining:[],pending:[],invitations:[],beyondLists:[]});
export function matchFrequency(rows,catalog,{cohort='all',education='all',fieldUnit='models'}={}){
 const selected=rows.filter(m=>cohort==='all'||m.phase===cohort),professions=catalog.professions.filter(r=>frequencyEducation(r,education)).map(r=>({...r,...bucket()})),byId=new Map(professions.map(r=>[r.id,r]));
 for(const m of selected)for(const key of Object.keys(bucket()))for(const id of new Set(m[key]||[])){const r=byId.get(id);if(r)r[key].push(m.id);}
 for(const r of professions){r.any=[...new Set(frequencyCategories.flatMap(c=>r[c.id]))];r.displayedExposure=[...new Set([...r.any,...r.pending,...r.invitations])];r.allExposure=[...new Set([...r.displayedExposure,...r.beyondLists])];r.counts=Object.fromEntries([...frequencyCategories.map(c=>c.id),'pending','invitations','beyondLists','any'].map(k=>[k,r[k].length]));r.absence=r.any.length?'listed':!r.allExposure.length?'never-offered':r.pending.length?'confirmation-only':r.invitations.length?'comparison-only':'beyond-displayed-lists';}
 const fields=catalog.fields.map(f=>{const ps=professions.filter(r=>r.fieldIds.includes(f.id)),out={...f,professionIds:ps.map(r=>r.id),...bucket()};for(const key of Object.keys(bucket()))out[key]=[...new Set(ps.flatMap(r=>r[key]))];out.counts=Object.fromEntries(frequencyCategories.map(c=>[c.id,fieldUnit==='offers'?ps.reduce((n,r)=>n+r[c.id].length,0):out[c.id].length]));out.any=[...new Set(frequencyCategories.flatMap(c=>out[c.id]))];return out;});
 const missing=selected.length?professions.filter(r=>!r.any.length):[],never=missing.filter(r=>!r.displayedExposure.length),totals=Object.fromEntries(frequencyCategories.map(c=>[c.id,professions.reduce((n,r)=>n+r[c.id].length,0)]));
 return {models:selected.length,modelIds:selected.map(m=>m.id),fieldUnit,fields,professions,missing,never,totals,listedProfessions:professions.length-missing.length};
}
export function frequencyDrilldown(result,rows,{type,id,category='any'}){
 const entry=(type==='field'?result.fields:result.professions).find(r=>r.id===id);if(!entry)return [];
 const ids=new Set(type==='field'?entry.professionIds:[entry.id]),categories=category==='any'?frequencyCategories.map(c=>c.id):category==='exposure'?[...frequencyCategories.map(c=>c.id),'pending','invitations','beyondLists']:[category],selected=new Set(result.modelIds);
 return rows.filter(m=>selected.has(m.id)).map(m=>({...m,appearances:categories.flatMap(k=>[...new Set(m[k]||[])].filter(id=>ids.has(id)).map(id=>({id,category:k})))})).filter(m=>m.appearances.length);
}
