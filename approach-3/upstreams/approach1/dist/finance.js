import {cleanCareerScenario} from './financial-math.js?v=0.31.0';
import {texasRequirements} from './texas-requirements.js?v=0.31.0';
import {careers as austinCareers,wageValue,wageOptions} from './finance-data.js?v=0.31.0';
import {AUSTIN_WAGE_RELEASE} from './austin-wages.js?v=0.31.0';
import {freshLifestyle,cleanLifestyle} from './lifestyle.js?v=0.31.0';
import {majors} from './catalog-data.js?v=0.31.0';
import {careers,pathCareers,FINANCE_RELEASE,legalExamples,collegeExamples} from './finance-data.js?v=0.31.0';
import {directions} from './content.js?v=0.31.0';

export const costFields=['tuition','housing','books','transportation','other'];
export const fundingFields=['cash','studentLoan','parentLoan','privateLoan','work'];
export function newCollegePlan(id){return {id,institution:'',program:'',year:'',residency:'',enrollment:'',living:'',period:'academic_year',evidenceType:'user_scenario',source:'',checkedOn:'',entityLinks:[],costMode:'itemized',total:'',tuition:'',housing:'',books:'',transportation:'',other:'',grants:'',pendingAid:'',cash:'',studentLoan:'',parentLoan:'',privateLoan:'',work:'',renewal:'',assumptions:'',reviewed:false};}
export function freshFinance(){return {lifestyle:freshLifestyle(),careerScenarios:{},plans:[],compare:[],jurisdiction:'TX',includeInReport:false,business:{appointments:'',collected:'',weeks:'',share:'',rent:'',supplies:'',annualFixed:'',unpaidHours:'',notes:''}};}
const str=(x,max=1000)=>typeof x==='string'?x.slice(0,max):typeof x==='number'&&Number.isFinite(x)?String(x):'';
const allowedLinks=new Set([...directions.map(d=>d.id),...careers.map(c=>c.id),...majors.map(m=>m.id)]);
export function cleanFinance(raw){
 const f=freshFinance();if(!raw||typeof raw!=='object')return f;
 if(raw.careerScenarios&&typeof raw.careerScenarios==='object')for(const [id,value]of Object.entries(raw.careerScenarios))if(careers.some(c=>c.id===id)||['clinical-psychologist','psychiatric-aide','psychiatric-technician'].includes(id))f.careerScenarios[id]=cleanCareerScenario(value);
 f.lifestyle=cleanLifestyle(raw.lifestyle);if(f.lifestyle.wageRelease!==AUSTIN_WAGE_RELEASE){const c=austinCareers.find(c=>c.id===f.lifestyle.careerId);if(c&&f.lifestyle.band!=='custom'){if(!wageOptions(c).some(([key])=>key===f.lifestyle.band))f.lifestyle.band='median';const income=wageValue(c.earnings,f.lifestyle.band);f.lifestyle.gross=Number.isFinite(income)?String(income):'';}f.lifestyle.wageRelease=AUSTIN_WAGE_RELEASE;}
 const seen=new Set();f.plans=(Array.isArray(raw.plans)?raw.plans:[]).filter(p=>p&&typeof p==='object').slice(0,12).map((p,i)=>{
  let id=str(p.id,100)||`college-${i}`;while(seen.has(id))id=`college-${i}-${id}`;seen.add(id);const a=newCollegePlan(id);
  for(const key of Object.keys(a)){if(['id','entityLinks','reviewed'].includes(key))continue;a[key]=str(p[key],['renewal','assumptions'].includes(key)?2000:500);}
  a.entityLinks=Array.isArray(p.entityLinks)?[...new Set(p.entityLinks.filter(x=>allowedLinks.has(x)))]:[];
  a.evidenceType=['college_calculator','college_offer','published_budget','user_scenario'].includes(a.evidenceType)?a.evidenceType:'user_scenario';
  a.period=['academic_year','term','whole_program'].includes(a.period)?a.period:'academic_year';a.costMode=a.costMode==='total'?'total':'itemized';a.reviewed=p.reviewed===true;return a;
 });
 f.compare=Array.isArray(raw.compare)?[...new Set(raw.compare.filter(id=>f.plans.some(p=>p.id===id)))].slice(0,3):[];
 f.jurisdiction='TX';f.includeInReport=raw.includeInReport===true;
 for(const key of Object.keys(f.business))f.business[key]=str(raw.business?.[key],key==='notes'?2000:40);return f;
}
export function moneyValue(v){if(!['string','number'].includes(typeof v)||String(v).trim()==='')return null;const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=100000000?Math.round(n*100):null;}
export const dollars=cents=>cents===null?null:cents/100;
export function calculateCollege(plan){
 const required=plan.costMode==='total'?['total']:costFields,missing=[],invalid=[];
 for(const key of [...required,'grants',...fundingFields]){if(String(plan[key]??'').trim()==='')missing.push(key);else if(moneyValue(plan[key])===null)invalid.push(key);}
 const valid=keys=>keys.every(k=>moneyValue(plan[k])!==null);
 const total=valid(required)?(plan.costMode==='total'?moneyValue(plan.total):costFields.reduce((n,k)=>n+moneyValue(plan[k]),0)):null;
 const grant=moneyValue(plan.grants),net=total!==null&&grant!==null?total-grant:null;
 const funds=valid(fundingFields)?fundingFields.reduce((n,k)=>n+moneyValue(plan[k]),0):null;
 const gap=net!==null&&funds!==null?net-funds:null;
 const warnings=[];if(net!==null&&net<0)warnings.push('Grants exceed the entered cost. Check periods, eligibility, or award adjustments.');if(gap!==null&&gap<0)warnings.push('Planned funding exceeds net price. Review the possible excess and loan amounts.');
 if(!plan.institution.trim()||!plan.year.trim()||!plan.program.trim()||!plan.residency.trim()||!plan.enrollment.trim()||!plan.living.trim())warnings.push('Add the college, program, year, residency, enrollment, and living assumptions.');
 if(!plan.reviewed)warnings.push('Check the source, period, and assumptions before relying on this plan.');
 if(!plan.source.trim()||!plan.checkedOn)warnings.push('Add a source reference and checked date.');
 return {total:dollars(total),netPrice:dollars(net),funding:dollars(funds),gap:dollars(gap),borrowing:valid(['studentLoan','parentLoan','privateLoan'])?dollars(['studentLoan','parentLoan','privateLoan'].reduce((n,k)=>n+moneyValue(plan[k]),0)):null,missing,invalid,warnings};
}
export function businessScenario(b){
 const keys=['appointments','collected','weeks','share','rent','supplies','annualFixed','unpaidHours'];
 if(keys.some(k=>String(b[k]??'').trim()===''||!Number.isFinite(Number(b[k]))||Number(b[k])<0))return {status:'incomplete',revenue:null,expenses:null,profit:null,issues:['Enter every assumption, using zero where appropriate. This is not observed income.']};
 const n=Object.fromEntries(keys.map(k=>[k,Number(b[k])]));if(n.share>100||n.weeks>52||n.appointments>1000||n.unpaidHours>168)return {status:'review',revenue:null,expenses:null,profit:null,issues:['Check the percentage, weeks, appointments, and hours.']};
 const count=n.appointments*n.weeks,revenue=count*n.collected,expenses=revenue*n.share/100+n.rent*12+count*n.supplies+n.annualFixed;
 if(!Number.isFinite(revenue)||!Number.isFinite(expenses)||revenue>1e9||expenses>1e9)return {status:'review',revenue:null,expenses:null,profit:null,issues:['Check the size of the assumptions.']};
 return {status:'illustration',revenue,expenses,profit:revenue-expenses,issues:n.share>0&&n.rent>0?['Both studio share and rent are entered. Confirm that both apply; avoid double-counting.']:[]};
}
export function coverageMatrix(){return [
 ...directions.map(d=>({type:'path',id:d.id,title:d.title,educationRoutes:'editorial',requirements:'texas_career_links',educationCosts:'needs_verification',earnings:'not_applicable',reason:'Use each linked career and a named college plan.',careers:pathCareers[d.id]||[]})),
 ...majors.map(m=>({type:'major',id:m.id,title:m.title,educationRoutes:'editorial',requirements:'texas_career_links',educationCosts:'needs_verification',earnings:'not_applicable',careers:m.careers})),
 ...careers.map(c=>({type:'occupation',id:c.id,title:c.title,educationRoutes:c.educationRoutes.status,requirements:texasRequirements[c.id].status,legalMinimum:texasRequirements[c.id].legalMinimum,educationCosts:c.educationCosts.status,earnings:c.earnings.status,sourceURL:c.sourceURL,checkedAt:FINANCE_RELEASE})),
 ];}
export function linkedPlans(finance,entityId){const major=majors.find(m=>m.id===entityId);const related=[...(pathCareers[entityId]||[]),...Object.entries(pathCareers).filter(([,ids])=>ids.includes(entityId)).map(([id])=>id),...(major?.careers||[]),...majors.filter(m=>m.careers.includes(entityId)||m.paths.includes(entityId)).map(m=>m.id)];return finance.plans.filter(p=>p.entityLinks.includes(entityId)||p.entityLinks.some(id=>related.includes(id)));}
export function requirementContext(c,finance){return texasRequirements[c.id];}
export function financialExport(finance){const f=cleanFinance(finance);return {release:FINANCE_RELEASE,currency:'USD',publishedCollegeExamples:collegeExamples,jurisdiction:f.jurisdiction,collegePlans:f.includeInReport?f.plans.map(p=>({...p,calculation:calculateCollege(p)})):[],personalFinancialDetailsIncluded:f.includeInReport,coverage:coverageMatrix(),careers:careers.map(c=>({id:c.id,title:c.title,educationRoutes:c.educationRoutes,requirements:{...c.requirements,jurisdictionContext:requirementContext(c,f)},educationBenefits:c.educationBenefits,educationCosts:c.educationCosts,earnings:c.earnings,graduateOutcomes:c.graduateOutcomes})),...(f.includeInReport?{businessScenario:{inputs:f.business,result:businessScenario(f.business)}}:{})};}
