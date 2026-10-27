import {onetQuestions} from './onet-assessment.js?v=0.31.0';
// Original activities, informed by RIASEC breadth and O*NET basic-interest domains.
// These are not official O*NET items and do not inherit its validation.
import {curiosity} from './content.js?v=0.31.0';
const rows=[
 ['R','Measure and assemble pieces so a structure fits securely.',['building','trades']],
 ['I','Study a health question and compare the evidence behind treatments.',['health','science']],
 ['A','Choose colors and type to make a message feel clear and distinctive.',['creative']],
 ['S','Help a patient understand what will happen during a visit.',['health']],
 ['E','Pitch a useful service and persuade people to give it a try.',['business','sales-office']],
 ['C','Check a set of payments and investigate a missing entry.',['business','sales-office']],
 ['R','Follow a diagram to install and test a working system.',['trades','building']],
 ['I','Work out why a computer system behaves unexpectedly.',['technology']],
 ['A','Shape the sound, pacing, or images of a short scene.',['creative']],
 ['S','Adapt a lesson when someone needs a different way to learn.',['education']],
 ['E','Negotiate with suppliers to keep a small project within budget.',['business']],
 ['C','Keep appointments and records accurate for a busy service.',['sales-office','health']],
 ['R','Maintain plants or habitats and notice changes over time.',['science','services']],
 ['I','Use data to test whether an explanation is convincing.',['science','technology']],
 ['A','Sketch several ways a product or space could look and feel.',['creative','building']],
 ['S','Support someone as they practice an everyday skill after an injury.',['health']],
 ['E','Coordinate a team and make decisions when plans change.',['business']],
 ['C','Check stock, labels, and orders so the right goods reach people.',['transportation-production','sales-office']],
 ['R','Find the worn part that is stopping equipment from working.',['trades','transportation-production']],
 ['I','Investigate how materials react under different conditions.',['science','building']],
 ['A','Write a story or script that gives an audience a new perspective.',['creative']],
 ['S','Help someone navigate a difficult personal or family situation.',['health','education']],
 ['E','Present a case for a community decision and answer objections.',['business','public-safety']],
 ['C','Follow a precise safety procedure and document each check.',['trades','public-safety','health']],
 ['R','Prepare tools and materials for a practical outdoor project.',['building','science','services']],
 ['I','Compare possible causes of an illness using new information.',['health']],
 ['A','Create an original illustration, piece of music, or performance.',['creative']],
 ['S','Coach a group through practice and celebrate their progress.',['education']],
 ['E','Find out what customers want and plan how to reach them.',['business','sales-office']],
 ['C','Test a digital form and catch details that could confuse its users.',['technology','sales-office']]
];
export const additionalInterestQuestions=rows.map(([theme,text,fields],i)=>({id:'profile-interest-'+(i+31),theme,text,fields}));
export const legacyInterestQuestions=[...curiosity,...additionalInterestQuestions];
export const profileInterestQuestions=onetQuestions;
export const profileInterestAnswer=(s,q)=>q.instrument==='onet-short-form-60'?s.profileJourney?.officialInterest?.answers?.[q.id]:q.id.startsWith('curiosity-')?s.curiosity?.[q.id]:s.profileJourney?.interests?.[q.id];
export const profileInterestState=s=>({...s,curiosity:{...s.curiosity,...s.profileJourney?.interests,...s.profileJourney?.officialInterest?.answers}});
