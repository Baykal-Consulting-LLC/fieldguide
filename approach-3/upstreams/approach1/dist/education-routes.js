export const educationRouteGroups=[
 {id:'work',title:'No college or special program',copy:'Learn at work. Practice and experience still matter.'},
 {id:'apprenticeship',title:'Apprenticeship',copy:'Supervised work and classes. Training pay comes before qualified pay.'},
 {id:'program',title:'Community college or specialist training',copy:'An associate degree, certificate, approved course or specialist training.'},
 {id:'college',title:'College degree',copy:'A bachelor’s degree can open more related roles and further study.'},
 {id:'graduate',title:'Graduate or professional degree',copy:'Further study, often with supervised practice, exams or licensing.'}
];
const apprentices=new Set(['electrician','plumbing','carpentry']);
const regulated=new Set(['tattoo','hairdresser','real-estate-agent','insurance-sales-agent','security-guard','pharmacy-technician','dental-assisting','police','firefighter','emt','nursing-assistant','vocational-nurse','medical-assistant','psychiatric-technician']);
export const experienceBeforeRole=new Set(['marketing-manager','general-operations-manager','medical-services-manager','construction-management','management-analyst','information-security','chef','restaurant-manager']);
export function educationRoutesFor(o){if(!o)return [];if(o.expandedDegree)return [{key:o.educationGroup,label:o.educationGroup==='graduate'?'Graduate / professional degree':'College · bachelor’s degree',detail:o.preparation.typicalEducation[0],primary:true}];const id=o.id,level=o.finance?.credentialLevel,typ=o.finance?.requirements?.typicalEntry||o.preparation?.typicalEducation?.[0]||'';const route=(key,label,detail='',primary=true)=>({key,label,detail,primary});
 if(id==='nursing')return [route('program','Community college · RN degree','Approved nursing program and RN license.'),route('college','College · BSN','Same RN wage reference; no assumed BSN pay premium. Additional study can open further nursing roles. The default RN budget is an ADN reference; a BSN needs its own program budget.',false)];
 if(id==='architecture')return [route('college','College · professional BArch','A five-year professional degree, then required experience and licensing.'),route('graduate','Graduate · professional architecture','An eligible prior degree, then a professional architecture program and licensing.',false)];
 if(id==='clinical-psychologist')return [route('graduate','Doctoral degree + license')];
 if(level==='graduate')return [route('graduate','Graduate/professional degree')];
 if(level==='bachelor')return [route('college','College · bachelor’s degree',experienceBeforeRole.has(id)?'Related work experience usually comes before this role.':'Typical entry route; some employers accept other preparation.')];
 if(level==='associate')return [route('program','Community college · associate degree','Some certificate routes need prior college preparation.')];
 if(apprentices.has(id))return [route('apprenticeship','Apprenticeship',id==='carpentry'?'An apprenticeship is one route; employer training is another.':'Supervised hours, classes and required licensing.'),...(id==='carpentry'?[route('work','Workplace training','Skills and experience are required.',false)]:[])];
 if(id==='chef'||id==='restaurant-manager')return [route('work','Work experience · no degree required','Kitchen or service experience comes before managing or leading a kitchen.')];
 if(id==='psychiatric-aide')return [route('work','Workplace training')];
 if(regulated.has(id))return [route('program',id==='tattoo'?'Specialist studio training':id==='police'||id==='firefighter'?'Approved academy + credentials':'Specialist training / certificate',id==='tattoo'?'Supervised studio preparation; this is not a college degree or a universal artist certificate.':'Required training, exams, registration or licensing depend on the job.')];
 if(/Some college|certificate|nondegree|technical|Technical/i.test(typ)||['hvac','automotive','computer-support','bookkeeping-clerk','welder','industrial-machinery-mechanic','truck-driver'].includes(id))return [route('program','Technical training / college courses','Certificate or employer-based preparation; see the exact job requirements.')];
 return [route('work','No college · learn at work','High school, job learning, practice or a portfolio may still be needed.')];
}
