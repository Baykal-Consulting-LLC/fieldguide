import {experiencedWages,experiencedMetadata} from './earnings-evidence.js?v=0.31.0';
import {electricianTraining} from './planning-guidance.js?v=0.31.0';
import {commonEntryWages,commonCareerSpecs} from './common-career-data.js?v=0.31.0';
import {twcEntryWages,TWC_ENTRY_METADATA} from './twc-entry-wages.js?v=0.31.0';
import {physicianResidency} from './professional-data.js?v=0.31.0';
import {careers} from './finance-data.js?v=0.31.0';

export const SALARY_PROGRESSION_RELEASE='2026-10-18';
export const salaryStageOptions=Object.freeze([
 {key:'entry',years:0,label:'Entry level'},
 {key:'year5',years:5,label:'5 years'},
 {key:'year10',years:10,label:'10 years'},
 {key:'year20',years:20,label:'20 years'}
]);
const blsMethod={publisher:'U.S. Bureau of Labor Statistics',title:'How to use occupational wages',url:'https://www.bls.gov/oes/earnings.htm',role:'Wage variation guidance; does not publish experience-year estimates.'};
const twcMethod={publisher:'Texas Workforce Commission',title:'Entry and experienced wage definitions',url:'https://texaswages.com/Home/About',role:'Entry is the mean of the lowest-paid third; experienced is the mean of the upper-paid two-thirds. These groups are not years of experience.'};
const families={
 professional:{ratios:[.72,.93,1.06,1.16],note:'Assumes growing proficiency in the same professional occupation. No management promotion, equity windfall, or exceptional bonus.'},
 technical:{ratios:[.74,.95,1.08,1.18],note:'Assumes technical skill development in the same occupation. No automatic move into management or executive compensation.'},
 science:{ratios:[.78,.95,1.05,1.12],note:'Assumes continued work in the same scientific occupation. Further degrees, research leadership, and industry changes are separate decisions.'},
 healthcare:{ratios:[.85,.98,1.06,1.10],note:'Starts after the required clinical education and credentials. Later figures exclude advanced-practice qualifications, overtime, and management promotions.'},
 creative:{ratios:[.68,.90,1.04,1.14],note:'Models ordinary employee work in the same creative occupation. Excludes celebrity success, royalties, business revenue, and owner profit.'},
 publicService:{ratios:[.82,.96,1.04,1.10],note:'Assumes growing proficiency in the same public-service role. Does not assume promotion or a different professional license.'},
 support:{ratios:[.82,.96,1.03,1.07],note:'Assumes the same support occupation throughout. Advancement to a different licensed profession requires a separate education route.'},
 trade:{ratios:[.82,.98,1.08,1.15],note:'Starts after required training at the qualified-worker level. Apprenticeship pay is separate. No automatic contractor ownership, foreman promotion, or overtime.'}
};
const assignments={
 professional:['market-research','accounting','financial-analysis','human-resources','logistics','project-management','economics','law','architecture','construction-management'],
 technical:['software','data-science','statistics','information-security','systems-analysis','mechanical-engineering','civil-engineering','electrical-engineering','biomedical-engineering','industrial-engineering'],
 science:['social-research','environmental-science','chemistry','biological-technician','conservation','food-science','epidemiology','geoscience'],
 healthcare:['physician','dentist','nursing','physician-assistant','physical-therapy','occupational-therapy','pharmacy','dental-hygiene','speech-language','sonography','respiratory-therapy','nutrition','school-psychology','veterinary','exercise-physiology','clinical-psychologist'],
 creative:['industrial-design','writing','graphic-design','animation','film-editing','public-relations','interpreting','tattoo'],
 publicService:['social-work','urban-planning','librarian','emt'],
 support:['paralegal','dental-assisting','psychiatric-aide','psychiatric-technician'],
 trade:['electrician','plumbing','hvac','carpentry','automotive','chef']
};
const familyById=Object.fromEntries(Object.entries(assignments).flatMap(([family,ids])=>ids.map(id=>[id,family])));
const additionalWages={
 'psychiatric-aide':{id:'psychiatric-aide',title:'Psychiatric Aides',earnings:{soc:'31-1133.00',median:47780,p25:35870,p75:48090,geography:'Dallas–Fort Worth–Arlington, Texas metro',referencePeriod:'May 2025',dollarYear:2025,sourceURL:'https://www.onetonline.org/link/localwages/31-1133.00?st=TX',status:'sourced',fallback:true}},
 'psychiatric-technician':{id:'psychiatric-technician',title:'Psychiatric Technicians',earnings:{soc:'29-2053.00',median:40610,p25:38830,p75:47170,geography:'Austin–Round Rock–San Marcos, Texas metro',referencePeriod:'May 2025',dollarYear:2025,sourceURL:'https://www.onetonline.org/link/localwages/29-2053.00?st=TX',status:'sourced'}},
 'clinical-psychologist':{id:'clinical-psychologist',title:'Clinical & Counseling Psychologists',earnings:{soc:'19-3033.00',median:87930,p25:77470,p75:109820,geography:'Austin–Round Rock–San Marcos, Texas metro',referencePeriod:'May 2025',dollarYear:2025,sourceURL:'https://www.onetonline.org/link/localwages/19-3033.00?st=TX',status:'sourced'}}
};
const salaryReviewedAt='2026-10-18';
const teacherSource={publisher:'Austin Independent School District',title:'2026–2027 Compensation Manual · New Hire Teacher/Librarian Pay Plan',url:'https://www.austinisd.org/hc/careers/compensation',documentURL:'https://docs.google.com/document/d/1zEQ3aEXDNrm28i8w_Vt-mkq9BEQJIGHVtE_dmi13lDc/edit',checkedAt:salaryReviewedAt,referencePeriod:'2026–2027 academic year',role:'New-hire placement by credited experience, 187-day base salary; the 0–2 certified row is used for entry. Incumbent PPfT/incentives and future raises are separate.'};
const policeSource={publisher:'City of Austin Police Department',title:'Officer base salary schedule · 160th applicants',url:'https://www.austintexas.gov/police-recruiting/pay-benefits',checkedAt:salaryReviewedAt,referencePeriod:'Public recruiting page reviewed October 18, 2026; effective date not stated',role:'Graduation-anniversary steps. Five- and twenty-year planning comparisons carry the published two- and sixteen-year steps; those are not exact-year observations.'};
const fireSource={publisher:'Austin Fire Department',title:'Cadet and post-academy pay',url:'https://www.austintexas.gov/fire/fire-cadet-employment',checkedAt:salaryReviewedAt,referencePeriod:'Public recruiting page reviewed October 18, 2026; salary effective date not stated',role:'Published $67,999 probationary entry after successful academy completion; later amounts are planning scenarios with that entry floor.'};
const roleNotes={
 'information-security':'Many analyst jobs require related IT experience. Entry means the first qualified security analyst job, not necessarily the first job after school.',
 'project-management':'Entry means the first qualified project-management specialist position; related work experience may come first.',
 'construction-management':'Entry means the first qualified construction-management position; field experience may come first.',
 'chef':'Entry means a first qualified chef/head-cook position after kitchen training and experience. A first kitchen job generally pays less.',
 physician:'Practice pay below starts after family medicine residency. The paid residency stage comes first. Other specialties have different routes and earnings.',
 dentist:'General dentistry employee pay. Dental practice revenue and owner profit are excluded; specialty training is separate.',
 'clinical-psychologist':'Years begin after doctoral preparation and the qualifications for independent clinical practice, not at high-school graduation.',
 'tattoo':'Low-confidence scenario based on five Austin salary-bearing postings. Client receipts are not take-home pay; studio rent, supplies, unpaid time, taxes, and insurance can reduce available income.'
};

/** Rounding is presentation only; calculations always use stage.amount. */
export function roundSalary(amount){
 if(typeof amount!=='number'||!Number.isFinite(amount)||amount<0)return null;
 const increment=amount<50000?1000:amount<100000?5000:10000;
 return Math.round(amount/increment)*increment;
}
export function formatSalary(amount){const n=roundSalary(amount);return n===null?'—':`$${n/1000}K`;}
function resolveCareer(careerOrId){
 const id=typeof careerOrId==='string'?careerOrId:careerOrId?.id;
 return (typeof careerOrId==='object'&&careerOrId?.earnings?careerOrId:null)||careers.find(c=>c.id===id)||additionalWages[id]||careerOrId?.finance||null;
}
export function salaryProgression(careerOrId){
 const c=resolveCareer(careerOrId);if(!c)return null;
 const w=c.earnings||{},anchor=w.median??w.average;
 if(!Number.isFinite(anchor)||anchor<=0)return null;
 const major=c.soc?.slice(0,2),commonFamily=major==='29'?'healthcare':['31','35','37','39','41','43','45','53'].includes(major)?'support':['47','49','51'].includes(major)?'trade':major==='33'?'publicService':major==='27'?'creative':major==='15'?'technical':null;
 const family=familyById[c.id]||commonFamily||'professional',curve=families[family];
 const publishedSchedule=['teaching','elementary-teacher','high-school-teacher'].includes(c.id);
 const entryProxy=commonEntryWages[c.id]||twcEntryWages[c.id]||null;
 const publishedExperienced=experiencedWages[c.id]||null,entryAmount=entryProxy?.amount||anchor*.68;
 const police=c.id==='police',fire=c.id==='firefighter';
 const planningEntry=fire?67999:entryAmount;
 const mature=Math.max(planningEntry,Math.min(publishedExperienced?.amount||anchor,Math.max(anchor,w.p75||anchor)));
 const progressionFractions=[0,.45,.75,1];
 const amounts=publishedSchedule?[58069,59772,63944,68844]:police?[78627,106344,121754,139396]:[planningEntry,...progressionFractions.slice(1).map(f=>planningEntry+(mature-planningEntry)*f)];
 const employerSchedule=publishedSchedule||police;
 const stablePay=new Set(amounts.slice(1).map(formatSalary)).size===1;
 const sources=[{publisher:w.publisher||'U.S. Bureau of Labor Statistics, via O*NET OnLine',title:w.dataset||'May 2025 occupational wages',url:w.sourceURL,role:'Local wage anchor; all experience ratios are Fieldguide assumptions.'},blsMethod,twcMethod];
 if(entryProxy&&!publishedSchedule&&!fire)sources.unshift({publisher:TWC_ENTRY_METADATA.publisher,title:TWC_ENTRY_METADATA.title,url:entryProxy.sourceURL,role:TWC_ENTRY_METADATA.entryDefinition});
 if(publishedSchedule)sources.unshift(teacherSource);
 if(publishedExperienced)sources.push({publisher:experiencedMetadata.publisher,title:'Published experienced-wage anchor',url:publishedExperienced.sourceURL,role:'Average of the upper-paid two-thirds; not measured pay at a particular experience year.'});
 if(police)sources.unshift(policeSource);
 if(fire)sources.unshift(fireSource);
 const added=commonCareerSpecs.find(x=>x.id===c.id);
 const notes=[...(added?.limitations||[]),...(added?.relatedExperience&&added.relatedExperience!=='None'?['This occupation typically follows related work experience: '+added.relatedExperience+'. Entry here means first qualified role, not first job after high school.']:[]),...(entryProxy&&!publishedSchedule&&!fire?[TWC_ENTRY_METADATA.entryDefinition]:[]),publishedSchedule?'Austin ISD 2026–2027 new-hire base placement at 0–2 certified, 5, 10, and 20 credited years; 187-day contract. Excludes stipends and incentives. This is a current employer example, not a promise of future raises or an incumbent pay trajectory.':curve.note,
  'Figures hold purchasing power constant. No future inflation is added. Future labor-market conditions and personal outcomes can differ.',
  'Entry means a first full-time qualified job after required preparation. Experience years begin there; education and apprenticeship years are separate.',
  ...(roleNotes[c.id]?[roleNotes[c.id]]:[]),
  ...(w.fallback?['A Texas metro fallback is used where Austin data are unavailable. The location is shown; Austin living costs still apply.']:[])];
 if(police)notes.push('Five-year planning pay carries the published two-year graduation-anniversary step; twenty-year planning pay carries the sixteen-year step. The page lists no five- or twenty-year row. Base pay excludes overtime and incentives; the recruiting page does not state a salary effective date.');
 if(fire)notes.push('Austin Fire entry is the $67,999 amount published when checked October 18, 2026; the page does not state its effective date. Later scenarios combine the 2025 local occupation benchmark with this entry floor. The occupational experienced-wage anchor remains $67,726 and is not an employer service schedule.');
 if(c.id==='electrician')notes.push('Austin ETA publishes a 2026 first-period apprentice example of $21.07/hour ($43,825/year at full-time hours) and a $79,664 qualified-worker example. These are one program’s schedule, not the regional TWC proxy or the generic career-growth illustration.');
 const stages=salaryStageOptions.map((s,i)=>{
  const carried=police&&[1,3].includes(i),sourceYears=police?[0,2,10,16][i]:publishedSchedule?s.years:null;
  return {...s,amount:amounts[i],display:formatSalary(amounts[i]),estimate:carried||!(employerSchedule||fire&&i===0),basis:carried?`Published ${sourceYears}-year step carried into this planning comparison`:employerSchedule?'Published employer schedule example':fire&&i===0?'Published post-academy entry':i===0&&entryProxy?'TWC entry-wage proxy':'Occupation-based planning scenario',evidence:carried?'employer_step_carried':employerSchedule||fire&&i===0?'employer_schedule':i===0&&entryProxy?'official_entry_proxy':'illustration',sourceYears,sourceLabel:carried?`${sourceYears}-year source step`:publishedSchedule&&i===0?'0–2 credited years · certified':null,geography:w.geography,dollarYear:employerSchedule||fire?2026:w.dollarYear||2025,referencePeriod:police?policeSource.referencePeriod:publishedSchedule?teacherSource.referencePeriod:fire?i===0?fireSource.referencePeriod:'2025 local occupation wages with 2026 published employer entry floor':w.referencePeriod,...(employerSchedule||fire&&i===0?{checkedAt:salaryReviewedAt,sourceURL:(police?policeSource:publishedSchedule?teacherSource:fireSource).url}:{})};
 });
 return {
  careerId:c.id,title:c.title,entryContext:added?.relatedExperience&&added.relatedExperience!=='None'?'Entry to this role usually follows related experience ('+added.relatedExperience.toLowerCase()+').':null,sharedWageScope:w.mapping==='broader_combined_occupation'?'Wage source covers a broader occupation group.':w.wageSOC&&w.wageSOC!==c.soc?.slice(0,7)?'Wage source covers a broader occupation group.':null,variableHours:['retail-sales','cashier','food-counter','restaurant-server','restaurant-cook','childcare-worker','personal-care-aide','photographer','hairdresser','farmworker-crops','delivery-driver'].includes(c.id),stablePay,experiencedAnchor:publishedExperienced,stages,
  geography:w.geography,dollarYear:employerSchedule||fire?2026:w.dollarYear||2025,referencePeriod:police?policeSource.referencePeriod:publishedSchedule?teacherSource.referencePeriod:fire?'Austin Fire entry reviewed October 18, 2026; 2025 occupation wages for later scenarios':w.referencePeriod,
  method:employerSchedule?'published_employer_schedule':'modeled_local_wage_scenario',family,confidence:employerSchedule?'published_example':w.status==='posting_estimate'?'low':'modeled',
  label:police?'Austin Police · published steps for planning':publishedSchedule?'Austin ISD example · new-hire placement':fire?'Austin Fire entry · later planning estimates':c.id==='tattoo'?'Small posting sample · low confidence':'Starting pay: TWC proxy · later pay: planning estimates',
  entryProxy:entryProxy&&!publishedSchedule&&!fire?{...entryProxy}:null,...(c.id==='physician'?{paidTraining:{...physicianResidency,checkedAt:salaryReviewedAt,referencePeriod:'2026–2027 academic year',stageKey:'residency',steps:[{label:'Residency year 1',amount:69528},{label:'Residency year 2',amount:71747},{label:'Residency year 3',amount:74652}]}}:c.id==='electrician'?{paidTraining:{...electricianTraining,checkedAt:salaryReviewedAt,referencePeriod:'Effective January 5, 2026 · Inside CBA 2025–2028'}}:police?{paidTraining:{amount:67000,stageKey:'academy',label:'Paid police academy',sourceURL:policeSource.url,checkedAt:salaryReviewedAt,referencePeriod:policeSource.referencePeriod}}:fire?{paidTraining:{amount:46904,stageKey:'academy',label:'Paid fire academy',sourceURL:fireSource.url,checkedAt:salaryReviewedAt,referencePeriod:fireSource.referencePeriod}}:{}),
  assumptions:employerSchedule?{contractDays:publishedSchedule?187:null,includesStipends:false,stepMethod:police?'latest_published_step_at_or_before_year':'exact_published_year'}:{anchor:publishedExperienced?'Occupation-specific TWC entry and experienced-wage anchors':'Sourced entry and local median/posting benchmark',anchorAmount:anchor,matureAmount:mature,progressionFractions,upperBound:'Mature planning anchor capped at the larger of the local median and upper quartile. Exact-year fractions are planning assumptions, not a fitted longitudinal series.',measuredExperienceData:false},
  sources,notes,release:SALARY_PROGRESSION_RELEASE,
  ...(c.id==='electrician'?{trainingSource:{publisher:'Austin Electrical Training Alliance',url:'https://austineta.org/apprentice-program-2/',role:'2026 apprenticeship pay example; separate from regional wage proxy.'}}:{})
 };
}
export function salaryPreviewStages(careerOrId){const p=salaryProgression(careerOrId);return p?[...(p.paidTraining?[{key:p.paidTraining.stageKey,years:null,label:p.paidTraining.stageKey==='apprenticeship'?'First-period apprentice':p.paidTraining.stageKey==='academy'?'Paid academy':'First-year resident',amount:p.paidTraining.amount,estimate:false,evidence:p.paidTraining.stageKey==='apprenticeship'?'employer_apprenticeship':p.paidTraining.stageKey==='academy'?'employer_academy':'employer_residency',basis:p.paidTraining.label||'Dell Med published residency example',sourceURL:p.paidTraining.sourceURL,referencePeriod:p.paidTraining.referencePeriod,checkedAt:p.paidTraining.checkedAt}]:[]),...p.stages]:[];}
export function salaryAtStage(careerOrId,key='entry'){return salaryPreviewStages(careerOrId).find(s=>s.key===key)?.amount??null;}
export const salaryCareerIds=Object.freeze([...careers.map(c=>c.id),...Object.keys(additionalWages)]);
