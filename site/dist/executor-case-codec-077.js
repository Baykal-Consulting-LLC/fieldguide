// Lossless transport for detailed synthetic research cases. No scoring logic.
const categories=['top','other','supported','sustaining','candidates','followups'];
export function packCaseRows077(rows,catalog){
 for(const row of rows)for(const arm of['simulator','grok']){const obj=row[arm],pool=[],indices=new Map();
  for(const category of categories){if(!Array.isArray(obj[category]))continue;obj[category]=obj[category].map(p=>{const{title,fields,routes,...rest}=p,stable={title,fields,routes};if(catalog[p.id]&&JSON.stringify(catalog[p.id])!==JSON.stringify(stable))throw Error('Career descriptors vary across cases: '+p.id);catalog[p.id]=stable;const key=JSON.stringify(rest);if(!indices.has(key)){indices.set(key,pool.length);pool.push(rest);}return indices.get(key);});}
  obj.offerPool077=pool;
 }
 return rows;
}
export function unpackCaseRows077(rows,catalog){
 for(const row of rows)for(const arm of['simulator','grok']){const obj=row[arm],pool=obj.offerPool077;if(!pool)throw Error('Missing research case offer pool');
  for(const category of categories){if(!Array.isArray(obj[category]))continue;obj[category]=obj[category].map(i=>{if(!Number.isInteger(i)||!pool[i]||!catalog[pool[i].id])throw Error('Invalid research case offer reference');return{...pool[i],...catalog[pool[i].id]};});}
  delete obj.offerPool077;
 }
 return rows;
}
