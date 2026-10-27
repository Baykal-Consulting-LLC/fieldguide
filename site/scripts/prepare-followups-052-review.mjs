import fs from 'node:fs';import {currentModelStates} from './current-model-states.mjs';import {replayBroadFollowups052} from '../dist/broad-followups-052-replay.js';import {planMatchCandidates} from '../dist/plan-matches.js';
const report=JSON.parse(fs.readFileSync('validation/broad-followups-052.json')),states=new Map(currentModelStates().map(x=>[x.c.id,x])),groups={development:[],holdout:[]};
for(const r of report.rows.filter(r=>!r.diagnostic&&r.added.length)){
 const {c,state}=states.get(r.id),replay=replayBroadFollowups052(state,c.id),plan=planMatchCandidates(replay.state);
 for(const added of r.added){const candidate=plan.top.find(p=>p.id===added.id);groups[['holdout','holdout049'].includes(r.phase)?'holdout':'development'].push({modelId:r.id,biography:c.biography,career:{id:added.id,title:added.title,summary:candidate.o.summary,confirmation:candidate.confirmation,evidence:candidate.evidence,routes:added.routes},newReflections:replay.trace.filter(a=>a.applied&&a.careerId===added.id)});}
}
for(const [key,rows]of Object.entries(groups))fs.writeFileSync('research/broad-followups-052/quality-input-'+key+'.json',JSON.stringify({scope:'Judge whether the specific defining work interests are established by the biography and supplied reflections. A career label is context, not evidence of student interest. Do not tune to counts or desired outcomes. Prior professional experience is not required; transferable skill alone is not sufficient.',rows},null,2)+'\n');
console.log(Object.fromEntries(Object.entries(groups).map(([k,r])=>[k,r.length])));
