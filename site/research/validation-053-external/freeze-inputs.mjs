// Synthetic public inputs only. Run from site root; no credential or account lookup.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {currentModelStates} from '../../scripts/current-model-states.mjs';
import {onetQuestions,onetInstrument,scoreOnetInterest,profileCorrelation} from '../../dist/onet-assessment.js';
import {occupations} from '../../dist/occupation-data.js';
import {occupationalInterestVector} from '../../dist/profile-journey.js';
import {expandedOccupations} from '../../dist/expanded-occupation-data.js';
const dir='research/validation-053-external',hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const careers=[...occupations.map(o=>({id:o.id,soc:o.soc,title:o.title,vector:occupationalInterestVector(o)})),...expandedOccupations.map(o=>({id:o.id,soc:o.soc,title:o.title,vector:o.vector}))];
const rows=currentModelStates().map(({c,state})=>{const score=scoreOnetInterest(state),answers=onetQuestions.map(q=>state.profileJourney.officialInterest?.answers?.[q.id]??null);return {id:c.id,phase:c.phase,answers,raw:score.raw,complete:score.complete,flat:score.flat,nearFlat:score.nearFlat,correlations:careers.map(o=>score.complete&&!score.flat&&o.vector?profileCorrelation(score.raw,o.vector):null)};});
const phases=[...new Set(rows.map(r=>r.phase))];const liveIds=phases.flatMap(p=>rows.filter(r=>r.phase===p).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,2).map(r=>r.id));
const inputs={createdAt:new Date().toISOString(),scope:'184 frozen public synthetic base and diagnostic model answer histories; zero real user or private owner records',instrument:{id:onetInstrument.id,version:onetInstrument.version,items:onetQuestions.map(q=>({index:q.index,theme:q.theme,text:q.text}))},careerVersion:'O*NET 31.0 local data as imported into Fieldguide 0.52',careers,rows,livePanel:{selection:'First two lexicographic model IDs within each pre-existing cohort, selected before external results. Diagnostics reported separately.',ids:liveIds,edgeCases:['all-dislike','all-unsure','all-love','one-item-change']},sources:Object.fromEntries(['dist/onet-assessment.js','dist/occupation-data.js','dist/occupation-essentials.js','dist/expanded-occupation-data.js','scripts/current-model-states.mjs'].map(p=>[p,hash(fs.readFileSync(p))]))};
const out=dir+'/frozen-inputs.json';if(fs.existsSync(out))throw Error('Freeze exists; do not silently replace');fs.writeFileSync(out,JSON.stringify(inputs)+'\n');console.log(JSON.stringify({models:rows.length,careers:careers.length,cohorts:phases,livePanel:liveIds,sha256:hash(fs.readFileSync(out))}));
