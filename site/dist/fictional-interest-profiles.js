// Authored fictional activity responses for development walkthroughs, not student data,
// norms, or independent evidence of predictive validity. Ten answers per theme.
import {onetQuestions,onetInstrument} from './onet-assessment.js?v=0.31.0';
const low=[2,2,2,2,2,2,2,2,2,2],unsure=[3,3,3,3,3,3,3,3,3,3];
const medicine={R:[2,2,2,1,2,2,3,2,2,3],I:[5,4,5,2,5,3,3,5,4,5],A:[2,2,2,3,3,2,3,1,1,3],S:[4,5,4,5,4,3,4,5,4,4],E:[2,2,2,2,2,3,2,2,2,2],C:[4,4,3,3,4,4,3,4,4,3]};
const visual={R:low,I:low,A:[4,3,3,5,5,5,5,2,2,5],S:[3,3,3,3,3,3,3,3,3,3],E:low,C:[4,4,3,3,4,4,3,3,3,3]};
const trades={R:[5,5,5,1,5,3,5,5,5,3],I:[2,2,3,2,3,4,2,2,2,3],A:[1,1,1,2,2,2,1,1,1,2],S:low,E:low,C:[3,4,3,4,4,3,4,3,4,3]};
export const fictionalInterestProfiles={
 medicine,creative:visual,trades,
 'care-and-diagnosis':medicine,
 'precision-and-dental-care':{R:[4,3,5,1,5,2,5,5,5,2],I:[5,4,5,2,5,4,3,5,4,5],A:low,S:[3,4,3,5,3,2,3,3,2,3],E:low,C:[4,4,4,3,4,4,4,4,4,3]},
 'visual-not-performance':visual,
 'story-and-media':{R:low,I:low,A:[5,3,3,4,5,5,5,2,2,5],S:[3,3,3,2,3,2,2,3,2,3],E:low,C:low},
 'hands-on-diagnostics':trades,
 'data-without-sales':{R:[2,1,2,1,3,1,4,2,3,1],I:[4,4,4,4,4,4,5,4,4,4],A:low,S:low,E:[1,1,1,1,1,1,1,1,1,1],C:[5,5,5,4,5,5,5,4,5,5]},
 'records-not-persuasion':{R:low,I:unsure,A:low,S:low,E:low,C:[5,5,4,5,5,5,4,5,5,5]},
 'helping-not-clinical':{R:[1,1,1,1,1,1,1,1,1,1],I:low,A:unsure,S:[5,5,5,3,5,5,5,4,5,5],E:low,C:unsure},
 'environment-and-evidence':{R:[3,3,3,5,3,2,4,3,4,3],I:[4,5,5,5,4,4,5,5,4,4],A:low,S:low,E:low,C:unsure},
 'design-and-technology':{R:low,I:[4,4,4,4,4,4,5,4,4,4],A:[4,3,3,5,5,5,5,2,2,5],S:low,E:low,C:[4,4,5,4,4,4,4,4,4,4]},
 'people-and-business':{R:[1,1,1,1,1,1,1,1,1,1],I:[3,3,3,3,3,3,3,3,3,3],A:unsure,S:[4,4,4,3,4,4,4,4,3,4],E:[5,5,4,5,5,5,5,5,4,5],C:[4,4,4,4,4,4,4,4,4,4]},
 'mostly-unfamiliar':{R:unsure,I:unsure,A:unsure,S:unsure,E:unsure,C:unsure}
};
export function applyFictionalInterestProfile(s,id){const profile=fictionalInterestProfiles[id];if(!profile)throw new Error('Unknown fictional profile: '+id);const offsets={R:0,I:0,A:0,S:0,E:0,C:0};s.profileJourney.officialInterest={instrument:onetInstrument.id,version:onetInstrument.version,answers:Object.fromEntries(onetQuestions.map(q=>[q.id,profile[q.theme][offsets[q.theme]++]]))};return s;}
