import {explorationExamples} from './exploration-examples.js';
import {expandedOccupations} from './expanded-occupation-data.js';
import {expandedInterestStatus} from './expanded-interest.js';
import {careerInterestMatch,journeyInterestPicture} from './profile-journey.js';
import {planMatchCandidates} from './plan-matches.js';
import {educationRoutesFor} from './education-routes.js';
import {escapeHTML as h} from './html.js';

export function explorationExample(questionId){
 const e=explorationExamples[questionId];if(!e)return '';
 return '<aside class="exploration-example"><h3>A small example to try</h3><p>'+h(e.scene)+'</p><p><strong>Try it:</strong> '+h(e.tryIt)+'</p><p>'+h(e.reflection)+'</p><small>'+h(e.limit)+' You can say no, stay unsure, or ask for another example.</small></aside>';
}
export function earlierCollegeExploration(s){
 const data=planMatchCandidates(s),degree=r=>educationRoutesFor(r.o).some(x=>['college','graduate'].includes(x.key)),needsWider=!data.top.some(degree)||data.top.some(r=>!degree(r)&&!r.meetsLifestyle);
 if(!needsWider)return '';
 const picture=journeyInterestPicture(s),topIds=new Set(data.top.map(r=>r.id));
 const pending=data.needsConfirmation.filter(r=>degree(r)&&!r.confirmation.declined).sort((a,b)=>Number(b.meetsLifestyle)-Number(a.meetsLifestyle)||(b.interestMatch?.r??0)-(a.interestMatch?.r??0));
 const extra=expandedOccupations.filter(o=>!topIds.has(o.id)&&!pending.some(r=>r.id===o.id)&&!expandedInterestStatus(s,o.id).declined&&careerInterestMatch(s,o,picture).eligible).map(o=>({id:o.id,o,interestMatch:careerInterestMatch(s,o,picture)})).sort((a,b)=>b.interestMatch.r-a.interestMatch.r);
 const rows=[...pending,...extra].slice(0,2);
 return '<section class="career-comparisons earlier-college"><h2>Explore a college possibility alongside your current fits</h2><p>Your current interests can connect with more than one education route. A short example can help you discover whether an unfamiliar subject or way of thinking appeals to you. You can keep a hands-on or noncollege fit even when its pay does not cover your preferred lifestyle.</p>'+(rows.length?'<div class="career-comparison-grid">'+rows.map(r=>'<article><h3>'+h(r.o.title)+'</h3><p>'+h(r.o.summary)+'</p><a class="button secondary" href="#/journey/'+(r.o.expandedDegree?'degree-check/'+h(r.id):'check-career/'+h(r.id)+'/0')+'">Try an example and reflect →</a><p>Exploration invitation · interest still to confirm.</p></article>').join('')+'</div>':'<p>Your interests are still broad. Browse subjects and try a few examples before asking for a leading match.</p>')+'<a href="#/degree-careers">Browse college and graduate possibilities →</a></section>';
}
