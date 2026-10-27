import {journeyInterestPicture,skillQuestions,skillExperienceFamiliar} from './profile-journey.js';
export function degreeMatchInput(s){const p=journeyInterestPicture(s);return {complete:p.complete,flat:p.flat,nearFlat:p.nearFlat,scores:p.raw,strengths:skillQuestions.filter(q=>skillExperienceFamiliar(s.profileJourney?.skills[q.id])).map(q=>({id:q.id,prompt:q.prompt,names:q.names}))};}
