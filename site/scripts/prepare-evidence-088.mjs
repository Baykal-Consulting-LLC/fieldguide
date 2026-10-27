import fs from'node:fs';import assert from'node:assert/strict';
const facts=JSON.parse(fs.readFileSync('data-sources/evidence-088/interests.json')),entry=JSON.parse(fs.readFileSync('data-sources/twc-2025-msa-entrywg.json')),median=JSON.parse(fs.readFileSync('data-sources/twc-2025-msa-median.json'));
const specs=[
 ['environmental-technician','19-4042.00','Environmental science & protection technicians','science','program','Associate degree',[
 ['Would you enjoy monitoring water, soil or air to check environmental conditions?',[['t:ecology','m:fieldwork']]],
 ['Would you enjoy learning to collect and label environmental samples using a set procedure?',[['t:ecology','m:precision','s:environmental-sampling']]],
 ['Would you enjoy keeping reliable environmental test records and flagging unusual findings?',[['t:ecology','m:precision','m:organization']]]]],
 ['forest-technician','19-4071.00','Forest & conservation technicians','science','program','Associate degree or related technical preparation',[
 ['Would you enjoy monitoring trees, plants and habitat conditions outdoors?',[['t:plants','t:ecology','m:fieldwork']]],
 ['Would you enjoy learning to measure vegetation or map field observations using a consistent procedure?',[['t:plants','t:ecology','m:fieldwork','m:precision']]],
 ['Would you enjoy keeping field records to help a team plan conservation work safely?',[['t:ecology','m:organization','r:safety']]]]],
 ['geological-technician','19-4043.00','Geological technicians','science','program','Associate degree; some employers require a bachelor’s degree',[
 ['Would you enjoy comparing rock samples and terrain observations?',[['t:earth']]],
 ['Would you enjoy learning to measure and record geological samples using consistent procedures?',[['t:earth','m:fieldwork','m:precision']]],
 ['Would you enjoy organizing geological observations and noting results that need checking?',[['t:earth','m:organization','m:precision']]]]],
 ['recreation-worker','39-9032.00','Recreation workers','teaching','work','High school + workplace training; requirements vary',[
 ['Would you enjoy helping people participate in games or recreational activities?',[['t:children','t:movement'],['t:adults','t:movement']]],
 ['Would you enjoy adapting an activity or explanation so participants can join in?',[['t:children','m:explaining'],['t:adults','m:explaining']]],
 ['Would you enjoy organizing activities and watching for participant safety?',[['t:movement','m:coordination','r:safety']]]]]
];
const inventory=specs.map(([id,soc,title,field,route,education,qs])=>{const src=facts.rows[soc];assert.ok(src);const vector=['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'].map(k=>Number(src.find(r=>r[3]===k&&r[4]==='OI')[6]));const e=entry.find(r=>r.soc===soc.slice(0,7)),m=median.find(r=>r.soc===soc.slice(0,7)),geo=e.austin>0&&m.austin>0?'austin':'statewide',pay=e[geo];assert.ok(pay>0&&m[geo]>0);return{id,soc,title,summary:qs[0][0],fields:[field],vector,evidence088:true,noncollege087:true,routes:[{key:route,label:education,detail:education,primary:true}],preparation:{typicalEducation:[education]},sourceURL:'https://www.onetonline.org/link/summary/'+soc,anchors:id==='environmental-technician'?['onet-sf-04']:id==='recreation-worker'?['onet-sf-32']:[],topicIds:[],questions:qs.map(([prompt,any],i)=>({id:id+'-088-'+(i+1),kind:'specific',domain:['domain','method','responsibility'][i],prompt,rule:{id:id+'-088-'+(i+1),any,block:i===1?['m:precision']:[],reason:'Exact question-scoped typed activities only. Unrecorded sampling, responsibility or method stays unknown.'}})),salary:{entry:pay,median:m[geo],year5:pay+.45*Math.max(0,m[geo]-pay),sourceURL:'https://texaswages.com/MSAWages/MSASocDetails?soc='+soc.slice(0,7)+'&wgeType=entrywg',geography:geo==='austin'?'Austin MSA':'Texas',period:'2025',basis:'Lower-paid-worker wage proxy; five-year scenario interpolates 45% toward the median, not observed pay by experience.'}};});
fs.writeFileSync('research/evidence-088/inventory.json',JSON.stringify(inventory,null,2));fs.writeFileSync('dist/evidence-088-data.js','// Research inventory; not live matching.\nexport const inventory088='+JSON.stringify(inventory)+';\n');
