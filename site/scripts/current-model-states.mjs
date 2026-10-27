import fs from 'node:fs';
import {newCohortCases} from './cohort-049-source.mjs';
import {cohort049FinalState} from '../dist/cohort-049-audit.js';
import {professionReplayState} from '../dist/profession-replay.js';
import {professionConfirmationState} from '../dist/profession-confirmation.js';
import {expandedInterestState} from '../dist/expanded-interest.js';
import {applyCoverageExploration} from '../dist/coverage-050-replay.js';
export function currentModelStates(){
 const read=p=>JSON.parse(fs.readFileSync(p)),map=p=>new Map(read(p).rows.map(r=>[r.id,r]));
 const replay=map('research/profession-replay-041/answers.json'),confirmation=map('research/profession-confirmation-042/answers.json'),interest=map('research/profession-interest-044/answers.json'),expanded=map('research/expanded-top-047/answers.json');
 const rows=[];
 for(const phase of ['development','supplement','legacy','holdout'])for(const m of read('validation/blind-2026-10-18/'+phase+'-summary.json').students){
  const c=read('validation/blind-2026-10-18/'+m.id+'.json');
  let s=professionReplayState(c,replay.get(c.id));s=professionConfirmationState(s,confirmation.get(c.id));s=professionConfirmationState(s,interest.get(c.id));s=expandedInterestState(s,expanded.get(c.id));s=applyCoverageExploration(s,c.id);rows.push({c,state:s});
 }
 for(const c of newCohortCases())rows.push({c,state:cohort049FinalState(c)});
 return rows;
}
