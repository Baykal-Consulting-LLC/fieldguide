// Developer-only counterfactual. Never imported by the student matching runtime.
export function benchmarkPearson(a,b){
 if(a?.length!==6||b?.length!==6||!a.every(Number.isFinite)||!b.every(Number.isFinite))return null;
 const am=a.reduce((x,y)=>x+y,0)/6,bm=b.reduce((x,y)=>x+y,0)/6;
 let xy=0,xx=0,yy=0;for(let i=0;i<6;i++){const x=a[i]-am,y=b[i]-bm;xy+=x*y;xx+=x*x;yy+=y*y;}
 return xx&&yy?Math.max(-1,Math.min(1,xy/Math.sqrt(xx*yy))):null;
}
export const benchmarkBand=r=>!Number.isFinite(r)?'Unavailable':r>=.729?'Best':r>=.608?'Great':r>=0?'Good':'Negative';
export function onetLedSelection(rows){
 const chosen=[];
 for(let zone=1;zone<=5;zone++){
  const eligible=rows.filter(r=>r.zone===zone&&Number.isFinite(r.r)&&r.r>=0),strong=eligible.filter(r=>r.r>=.608),ids=new Set(strong.map(r=>r.id));
  const fill=eligible.filter(r=>!ids.has(r.id)).sort((a,b)=>b.r-a.r||a.id.localeCompare(b.id)).slice(0,Math.max(0,10-strong.length));
  chosen.push(...[...strong,...fill].sort((a,b)=>['Best','Great','Good'].indexOf(benchmarkBand(a.r))-['Best','Great','Good'].indexOf(benchmarkBand(b.r))||a.title.localeCompare(b.title)||a.id.localeCompare(b.id)));
 }
 return chosen;
}
export function routeKeys(career){return career.routes.map(r=>r.key);}
export function benchmarkCounts(rows,catalog){
 const byId=new Map(catalog.map(c=>[c.id,c])),degree=id=>byId.get(id)?.routes.some(r=>['college','graduate'].includes(r.key));
 const any=(r,key,test=()=>true)=>r[key].some(id=>test(id,r));
 return{models:rows.length,currentTop:rows.filter(r=>r.top.length).length,currentDegreeTop:rows.filter(r=>any(r,'top',degree)).length,currentAllSupported:rows.filter(r=>r.supported.length).length,currentAllDegreeSupported:rows.filter(r=>any(r,'supported',degree)).length,
  eligible:rows.filter(r=>r.eligible).length,nearFlat:rows.filter(r=>r.nearFlat).length,unscorable:rows.filter(r=>!r.eligible).length,
  best:rows.filter(r=>r.best.length).length,strong:rows.filter(r=>r.strong.length).length,degreeStrong:rows.filter(r=>any(r,'strong',degree)).length,
  noContraryStrong:rows.filter(r=>any(r,'strong',id=>!r.contrary[id]?.length)).length,noContraryDegreeStrong:rows.filter(r=>any(r,'strong',id=>degree(id)&&!r.contrary[id]?.length)).length,
  union:rows.filter(r=>r.top.length||r.strong.length).length,unionDegree:rows.filter(r=>any(r,'top',degree)||any(r,'strong',degree)).length,newlyStrong:rows.filter(r=>!r.top.length&&r.strong.length).length,newlyDegreeStrong:rows.filter(r=>!any(r,'top',degree)&&any(r,'strong',degree)).length,
  currentTopCovers:rows.filter(r=>any(r,'top',id=>r.coverage[id]===true)).length,strongCovers:rows.filter(r=>any(r,'strong',id=>r.coverage[id]===true)).length,
  currentDegreeCovers:rows.filter(r=>any(r,'top',id=>degree(id)&&r.coverage[id]===true)).length,strongDegreeCovers:rows.filter(r=>any(r,'strong',id=>degree(id)&&r.coverage[id]===true)).length,
  strongContraryModels:rows.filter(r=>any(r,'strong',id=>r.contrary[id]?.length)).length,strongOffers:rows.reduce((n,r)=>n+r.strong.length,0),strongContraryOffers:rows.reduce((n,r)=>n+r.strong.filter(id=>r.contrary[id]?.length).length,0),
  currentTopStrongOffers:rows.reduce((n,r)=>n+r.top.filter(id=>r.strong.includes(id)).length,0),currentTopOffers:rows.reduce((n,r)=>n+r.top.length,0),
  manualSensitivityStrong:rows.filter(r=>r.manualStrong.length).length,manualSensitivityDegree:rows.filter(r=>any(r,'manualStrong',degree)).length};
}
