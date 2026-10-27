import {commonCareerSpecs,commonWages} from './common-career-data.js?v=0.31.0';
import {commonCareerPaths} from './common-fields.js?v=0.31.0';
import {professionalSpecs,professionalWages} from './professional-data.js?v=0.31.0';
import {texasRequirements} from './texas-requirements.js?v=0.31.0';
import {austinWages} from './austin-wages.js?v=0.31.0';
import {extraDirections,extraCareerSpecs} from './catalog-extra.js?v=0.31.0';
import {catalogWages} from './catalog-wages.js?v=0.31.0';
// Reviewed public snapshot. Never use these facts to score or rank a student's interests.
export const FINANCE_RELEASE='2026-10-16';
export const wageScope={publisher:'U.S. Bureau of Labor Statistics, via O*NET OnLine',dataset:'OEWS May 2025',referencePeriod:'May 2025',checkedAt:FINANCE_RELEASE,geography:'United States',currency:'USD',dollarYear:2025,units:'gross annual employee wage',population:'Wage and salary workers; self-employed workers excluded',annualization:'Annual wages generally use 2,080 hours; teacher wages are reported on their annual schedule.',methodURL:'https://www.bls.gov/oes/oes_ques.htm'};
const ooh=path=>`https://www.bls.gov/ooh/${path}.htm`;
const career=(id,title,soc,route,education,training,benefit,pay,source,license='')=>({id,title,soc,taxonomy:'2018 SOC / O*NET-SOC 2019',educationRoutes:{status:'sourced',routes:route,sourceURL:source,checkedAt:FINANCE_RELEASE},requirements:{status:'sourced',typicalEntry:education,training,legalMinimum:'No universal minimum is asserted. Confirm the employer, role, and intended jurisdiction.',legalStatus:'needs_verification',license,sourceURL:source,checkedAt:FINANCE_RELEASE},educationBenefits:benefit,educationCosts:{status:'needs_verification',reason:'Choose a specific college, program, year, residency, and living arrangement.'},earnings:{...wageScope,status:'sourced',soc,p25:pay[0],median:pay[1],p75:pay[2],sourceURL:`https://www.onetonline.org/link/localwages/${soc}`,mapping:'exact_occupation'},graduateOutcomes:{status:'not_available',reason:'No institution, program, and matched graduate cohort selected. Wage percentiles are not experience bands.'},sourceURL:source});
export const careers=[
 career('industrial-design','Commercial & industrial designers','27-1021.00',['Industrial design','Product design','Architecture or engineering routes, depending on program'],"Bachelor’s degree is typical; a portfolio is important.",'Develop design skills and a portfolio; inspect each program’s studio and entry requirements.','College can offer studio critique, materials knowledge, research practice, and portfolio development.',[66450,83910,109050],ooh('arts-and-design/industrial-designers')),
 career('software','Software developers','15-1252.00',['Computer science','Software engineering','Related computing or engineering fields'],"Bachelor’s degree in computing or a related field is typical.",'Projects and internships can help demonstrate software development skills.','College can develop algorithms, systems thinking, teamwork, and access to internships.',[105210,135980,171980],ooh('computer-and-information-technology/software-developers')),
 career('social-research','Social science research assistants','19-4061.00',['Psychology','Sociology','Other social sciences with research methods'],"Bachelor’s degree is the BLS typical entry assignment.",'BLS lists no related work-experience or on-the-job-training requirement in its occupational assignment; actual employers may differ.','College can develop research design, statistics, scientific writing, and supervised project experience.',[48620,61990,77760],'https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm'),
 career('environmental-science','Environmental scientists & specialists','19-2041.00',['Environmental science','Biology','Natural or physical sciences'],"Bachelor’s degree in a natural science or related field is typical.",'Compare field, laboratory, and quantitative coursework; some specialized roles need additional study.','College can provide laboratories, field methods, scientific foundations, and undergraduate research.',[64490,82220,107970],ooh('life-physical-and-social-science/environmental-scientists-and-specialists')),
 career('market-research','Market research analysts','13-1161.00',['Marketing or market research','Business','Statistics, communication, or social sciences'],"Bachelor’s degree is typical; some employers prefer graduate study.",'Research methods, statistics, and communication are useful preparation.','College can connect analytical skills with consumer research, communication, and applied projects.',[58350,78760,108310],ooh('business-and-financial/market-research-analysts')),
 career('writing','Writers & authors','27-3043.00',['English or literature','Journalism or communication','Creative writing'],"Bachelor’s degree is typical for many salaried writing positions; portfolio and experience matter.",'Build writing samples and experience; freelance work has different entry routes.','College can provide writing practice, editorial feedback, subject knowledge, and opportunities beyond one creative role.',[58230,76910,101950],ooh('media-and-communication/writers-and-authors')),
 career('mechanical-engineering','Mechanical engineers','17-2141.00',['Mechanical engineering','Mechanical engineering technology'],"Bachelor’s degree is typical; inspect program accreditation and professional pathways.",'Public-facing professional engineering work can require licensure and further examination and experience.','College provides mathematical and scientific foundations, laboratories, design projects, and routes to regulated engineering practice.',[84130,104110,132590],ooh('architecture-and-engineering/mechanical-engineers'),'Professional engineering licensure depends on jurisdiction and the services performed.'),
 career('teaching','Middle school teachers','25-2022.00',['Approved teacher preparation','Subject study combined with an appropriate teacher-licensure route'],"Bachelor’s degree is typical; public school teachers also need state certification or licensure.",'Teacher preparation and supervised teaching are part of many routes; verify the relevant endorsement.','College can combine subject expertise, teaching methods, supervised practice, and an approved credential route.',[58530,64370,80490],ooh('education-training-and-library/middle-school-teachers'),'Public school licensure is state-specific; private-school requirements may differ.'),
];
careers.push({id:'tattoo',title:'Tattoo artists',soc:'27-1019.00',taxonomy:'Illustrative title within 2018 SOC 27-1019; broader artistic occupation',sourceURL:'https://www.bls.gov/soc/2018/soc_2018_manual.pdf',educationRoutes:{status:'needs_verification',routes:['Studio art or illustration alongside occupational training','Design study with portfolio practice','Business coursework alongside supervised tattoo training'],sourceURL:ooh('arts-and-design/craft-and-fine-artists'),checkedAt:FINANCE_RELEASE},requirements:{status:'needs_verification',typicalEntry:'No tattoo-specific national degree requirement is established by this source.',training:'Check supervised training, infection-control instruction, studio rules, and local requirements before practicing.',legalMinimum:'Select a jurisdiction and verify both individual-artist and establishment requirements.',legalStatus:'needs_verification',license:'College study does not replace legally required occupational training.',sourceURL:'https://dph.illinois.gov/topics-services/environmental-health-protection/body-art-establishments',checkedAt:FINANCE_RELEASE},educationBenefits:'An affordable college route could strengthen drawing, critique, business skills, communication, and access to other creative roles. These are educational possibilities, not a promise of higher tattoo income.',educationCosts:{status:'needs_verification',reason:'Compare named art/design programs and separately verified occupational-training costs.'},earnings:{...wageScope,status:'not_available',soc:'27-1019',median:null,p25:null,p75:null,mapping:'broader_category_only',reason:'The official occupation includes other artists, and employee wage data exclude self-employment. A tattoo-only income estimate is not available in this reviewed source.',sourceURL:'https://www.bls.gov/soc/2018/soc_2018_manual.pdf'},graduateOutcomes:{status:'not_available',reason:'No verified tattoo-specific experience-year income series. A business scenario is separate from observed earnings.'}});

export const pathCareers={design:['industrial-design','tattoo'],technology:['software'],health:['social-research'],environment:['environmental-science'],business:['market-research'],culture:['writing','tattoo'],engineering:['mechanical-engineering'],learning:['teaching','social-research']};
for(const spec of extraCareerSpecs){
 const w=catalogWages[spec.soc];
 if(!w)throw new Error('Missing reviewed wages for '+spec.id);
 const benefit=spec.level==='training'?'A supervised training route can build practical skill and work experience. Compare provider quality, completion, placement, tools, safety, and total fees. Optional affordable college study can add business, communication, or technical foundations; it does not replace required occupational training.':'College can build subject knowledge, supervised practice, critical thinking, relationships, and options beyond a single job. Compare the complete credential route and its cost.';
 const c=career(spec.id,w.title,spec.soc,spec.routes,spec.entry,spec.training,benefit,w.pay,spec.sourceURL);
 c.credentialLevel=spec.level;c.skillsURL=`https://www.onetonline.org/link/summary/${spec.soc}#Skills`;c.routeType=spec.level==='training'?'training':'college';
 if(spec.id==='nutrition')c.requirements.credentialSourceURL='https://www.cdrnet.org/graduatedegree';
 if(spec.id==='hvac')c.requirements.credentialSourceURL='https://www.epa.gov/section608/section-608-technician-certification-requirements';
 careers.push(c);
}
for(const spec of commonCareerSpecs){const c=career(spec.id,spec.title,spec.soc,spec.routes,spec.typicalEntry,spec.training,spec.educationBenefits,spec.pay,spec.sourceURL,spec.license);c.credentialLevel=spec.level;c.routeType=spec.level==='training'?'training':'college';c.earnings={...c.earnings,...spec.earnings,mapping:spec.wageMapping};careers.push(c);}
for(const spec of professionalSpecs){const c=career(spec.id,spec.title,spec.soc,spec.routes,spec.entry,spec.training,'College builds the foundation; medical or dental school and the required clinical credentials come next.',spec.pay,spec.sourceURL);c.credentialLevel='graduate';c.routeType='college';careers.push(c);}
for(const c of careers){c.credentialLevel??=c.id==='tattoo'?'training':'bachelor';c.routeType??=c.id==='tattoo'?'training':'college';c.skillsURL??=`https://www.onetonline.org/link/summary/${c.soc}#Skills`;}
for(const d of extraDirections)pathCareers[d.id]=d.careers;
Object.assign(pathCareers,{health:['social-research','epidemiology','nursing','school-psychology'],environment:['environmental-science','conservation','geoscience'],engineering:['mechanical-engineering','electrical-engineering','biomedical-engineering','industrial-engineering','civil-engineering'],business:['market-research','accounting','financial-analysis','logistics'],learning:['teaching','social-research','school-psychology','librarian']});
pathCareers['medicines-nutrition']=['physician','dentist',...pathCareers['medicines-nutrition']];
for(const [path,ids] of Object.entries(commonCareerPaths))pathCareers[path]=[...new Set([...(pathCareers[path]||[]),...ids])];
for(const c of careers){const local=commonWages[c.id]||austinWages[c.id]||professionalWages[c.id];if(!local)throw Error('Missing Austin coverage: '+c.id);c.nationalEarnings=c.earnings;c.earnings={...c.earnings,...local,currency:'USD',dollarYear:local.dollarYear||2025,referencePeriod:local.referencePeriod||'May 2025',mapping:local.mapping||'exact_occupation',population:local.population||'Austin metro employees; self-employed workers excluded',dataset:local.dataset||'OEWS May 2025 · Austin metro'};}
export const legalExamples={
 teaching:{jurisdiction:'Illinois',status:'needs_verification',text:'ISBE publishes teacher-licensure and endorsement routes. Verify the intended grade/subject, approved preparation, and current requirements.',sourceURL:'https://www.isbe.net/Pages/Educator-Licensure-Requirements.aspx'},
 'mechanical-engineering':{jurisdiction:'Illinois',status:'needs_verification',text:'IDFPR regulates professional engineering. Verify the work’s scope, education, examination, and experience requirements for the intended license.',sourceURL:'https://idfpr.illinois.gov/profs/profengineer.html'},
 tattoo:{jurisdiction:'Illinois',status:'needs_verification',text:'IDPH regulates body-art establishments. Establishment registration and an individual artist’s training or local obligations are different questions; verify both.',sourceURL:'https://dph.illinois.gov/topics-services/environmental-health-protection/body-art-establishments'},
};
for(const c of careers){const t=texasRequirements[c.id];c.requirements={...c.requirements,status:t.status,typicalEntry:t.typicalEntry,training:t.training,legalMinimum:t.legalMinimum,license:t.license,legalStatus:t.status,jurisdiction:'Texas',sourceURL:t.sourceURLs[0]};}

const displayTitles={hvac:'HVAC technicians',architecture:'Architects',geoscience:'Geoscientists',logistics:'Logisticians',librarian:'Librarians & media specialists','industrial-design':'Industrial designers','dental-assisting':'Dental assistants',chef:'Chefs & head cooks',sonography:'Medical sonographers',plumbing:'Plumbers & pipefitters'};
for(const c of careers){c.officialTitle=c.title;c.title=displayTitles[c.id]||c.title;}

export const historicalCollegeExamples=[
 {id:'illinois-resident',institution:'University of Illinois Urbana-Champaign',year:'2026–2027',residency:'Illinois resident',enrollment:'Full time',living:'Published food & housing allowance',tuitionMin:18530,tuitionMax:24018,totalMin:38088,totalMax:43576,housing:15858,books:1200,other:2500,sourceURL:'https://www.admissions.illinois.edu/tuition/',calculatorURL:'https://www.admissions.illinois.edu/cost-and-aid/',checkedAt:FINANCE_RELEASE,note:'Published undergraduate ranges vary by major. Not a program quote, aid estimate, admission recommendation, or assertion that every suggested major is offered.'},
 {id:'illinois-nonresident',institution:'University of Illinois Urbana-Champaign',year:'2026–2027',residency:'US nonresident of Illinois',enrollment:'Full time',living:'Published food & housing allowance',tuitionMin:41206,tuitionMax:49618,totalMin:61104,totalMax:69516,housing:15858,books:1200,other:2840,sourceURL:'https://www.admissions.illinois.edu/tuition/',calculatorURL:'https://www.admissions.illinois.edu/cost-and-aid/',checkedAt:FINANCE_RELEASE,note:'Major-dependent undergraduate range before aid; select the actual program and residency in the college’s calculator.'},
 {id:'oakton',institution:'Oakton College',year:'2026–2027',residency:'In-district',enrollment:'30 credits over fall and spring',living:'Dependent-student published budget',tuitionMin:4267.5,tuitionMax:4267.5,totalMin:20333.5,totalMax:20333.5,housing:5149,books:1410,transportation:2179,other:7328,sourceURL:'https://students.oakton.edu/paying-for-college/tuition-and-fees.php',calculatorURL:'https://students.oakton.edu/paying-for-college/tuition-and-fees.php',checkedAt:FINANCE_RELEASE,note:'Community-college annual budget, not the whole cost of a bachelor’s degree. A transfer route needs both colleges, credit transfer, future aid, and completion time checked.'},
];
export const collegeExamples=[
  {
    "id": "ut-austin-resident",
    "institution": "UT Austin",
    "year": "2026–2027",
    "residency": "Texas resident",
    "enrollment": "12+ credits per semester",
    "living": "Living on or off campus",
    "tuitionMin": 10858,
    "tuitionMax": 13576,
    "totalMin": 32508,
    "totalMax": 35386,
    "housing": 15420,
    "housingMax": 15580,
    "books": 724,
    "transportation": 1840,
    "other": 3666,
    "sourceURL": "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/",
    "calculatorURL": "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/#net-price-calculator",
    "checkedAt": "2026-10-16",
    "note": "Published undergraduate fall/spring budget before aid. Tuition varies by college; housing is a range. Graduate and professional programs cost extra."
  },
  {
    "id": "ut-austin-nonresident",
    "institution": "UT Austin",
    "year": "2026–2027",
    "residency": "Nonresident of Texas",
    "enrollment": "12+ credits per semester",
    "living": "Living on or off campus",
    "tuitionMin": 42554,
    "tuitionMax": 51106,
    "totalMin": 64204,
    "totalMax": 72916,
    "housing": 15420,
    "housingMax": 15580,
    "books": 724,
    "transportation": 1840,
    "other": 3666,
    "sourceURL": "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/",
    "calculatorURL": "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/#net-price-calculator",
    "checkedAt": "2026-10-16",
    "note": "Published undergraduate fall/spring budget before aid. Residency changes the price. This is not a quote for a specific major."
  },
  {
    "id": "acc-district",
    "institution": "Austin Community College",
    "year": "2026–2027",
    "residency": "Texas resident, in district",
    "enrollment": "30 credits: 15 fall + 15 spring",
    "living": "Living away from parents",
    "tuitionMin": 2550,
    "tuitionMax": 2550,
    "totalMin": 27398,
    "totalMax": 27398,
    "housing": 18240,
    "books": 1200,
    "transportation": 1824,
    "other": 3584,
    "sourceURL": "https://students.austincc.edu/financial-aid/explore-your-financial-aid/cost-of-attendance/",
    "calculatorURL": "https://students.austincc.edu/financial-aid/explore-your-financial-aid/cost-of-attendance/",
    "checkedAt": "2026-10-16",
    "note": "Published fall/spring budget before aid. In-district eligibility matters. A transfer route also includes the receiving university."
  },
  {
    "id": "acc-parents",
    "institution": "Austin Community College",
    "year": "2026–2027",
    "residency": "Texas resident, in district",
    "enrollment": "30 credits: 15 fall + 15 spring",
    "living": "Living with parents",
    "tuitionMin": 2550,
    "tuitionMax": 2550,
    "totalMin": 17958,
    "totalMax": 17958,
    "housing": 8800,
    "books": 1200,
    "transportation": 1824,
    "other": 3584,
    "sourceURL": "https://students.austincc.edu/financial-aid/explore-your-financial-aid/cost-of-attendance/",
    "calculatorURL": "https://students.austincc.edu/financial-aid/explore-your-financial-aid/cost-of-attendance/",
    "checkedAt": "2026-10-16",
    "note": "Published fall/spring dependent-student budget before aid. Program and course fees may differ."
  }
];
export const financeSources={aid:'https://studentaid.gov/articles/evaluating-financial-aid-offers/',fafsa:'https://studentaid.gov/articles/fafsa-submission-summary/',compare:'https://www.consumerfinance.gov/paying-for-college/your-financial-path-to-graduation/',license:'https://www.careeronestop.org/Toolkit/Training/find-licenses.aspx',pseo:'https://lehd.ces.census.gov/data/pseo_documentation.html',irs:'https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center'};

export const wageCenter=w=>Number.isFinite(w.median)?w.median:Number.isFinite(w.average)?w.average:null;
export const wageCaption=w=>w.status==='posting_estimate'?'Austin posting average · small sample':'Austin median / year · May 2025';
export function wageValue(w,band){return band==='median'?wageCenter(w):['dallas','houston'].includes(band)?w.regionalComparisons?.find(x=>x.id===band)?.average:w[band];}
export function wageOptions(c){return c?.earnings.status==='posting_estimate'?[['median','Austin posting average'],['dallas','Dallas posting average'],['houston','Houston posting average'],['custom','My own income']]:[['p25','Lower quarter'],['median','Median'],['p75','Upper quarter'],['custom','My own income']];}
