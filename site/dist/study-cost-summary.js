import {studyCostReference} from './financial-scenario-ui.js';
import {collegeExamples} from './finance-data.js';
import {educationCostEvidence as evidence} from './education-cost-evidence.js';
import {educationRouteEvidence as named} from './education-route-evidence.js';
import {occupationById} from './occupation-data.js';
const ut=collegeExamples.find(x=>x.id==='ut-austin-resident'),acc=collegeExamples.find(x=>x.id==='acc-district');
const n=x=>x?.value??x?.min??0;
export function studyCostSummary(id){
 const b=studyCostReference(id);if(!b)return null;const o=occupationById(id),level=o.finance?.credentialLevel,e=evidence[id],r=named[id];let tuition=0,living=0,other=0,combined=false,example=b.parts[0]?.label||'',duration=b.years?b.years+' years of study':'Workplace learning';
 if(id==='hairdresser'){tuition=15700;living=acc.housing+acc.transportation+acc.other;other=b.cost-tuition-living;example='Aveda Arts Austin · 1,000-hour cosmetology program';duration='About 9 months';}
 else if(id==='architecture'){tuition=ut.tuitionMax*5;other=ut.books*5;living=b.cost-tuition-other;example='Five-year BArch · UT Austin resident cost reference';}
 else if(r?.amounts.listedProgramResident){const program=r.amounts.listedProgramResident.value;tuition=id==='nursing'?program-r.amounts.listedProgramTuitionExempt.value:program;living=b.parts.filter(x=>/Living during study/i.test(x.label)).reduce((a,x)=>a+x.amount,0);other=b.cost-tuition-living;example=r.institution+' · '+r.program;}
 else if(level==='bachelor'||level==='graduate'){
  tuition=ut.tuitionMin*4;other=ut.books*4;living=ut.totalMin*4-tuition-other;
  living+=b.parts.filter(x=>/Summer living reserve/.test(x.label)).reduce((a,x)=>a+x.amount,0);
  if(level==='graduate'){
   const professional=b.parts.at(-1).amount,extra=b.years-4,a=e?.amounts||{};let t=0,l=0;
   if(r?.amounts.totalCOAResident)t=n(r.amounts.tuitionFeesResident);
   else if(e?.yearRows?.length&&e.yearRows.every(x=>Number.isFinite(x.tuitionResident)||Number.isFinite(x.tuitionFeesResident))){t=e.yearRows.reduce((a,x)=>a+(x.tuitionResident??x.tuitionFeesResident),0);if(id==='law')t=n(a.tuitionFeesResident)+e.yearRows[0].tuitionFeesResident*2;l=e.yearRows.reduce((a,x)=>a+(x.livingAllowance||x.housingFoodEstimate||0),0);}
   else if(a.programTuitionResident)t=n(a.programTuitionResident);
   else if(id==='pharmacy')t=n(a.fallSpringTuitionResident)*4;
   else if(a.tuitionFeesResident12Credit)t=n(a.tuitionFeesResident12Credit)*8;
   else if(a.tuitionTechnologyResident)t=n(a.tuitionTechnologyResident);
   else if(a.tuitionResident){t=n(a.tuitionResident);if(/semester/i.test(a.tuitionResident.label||''))t*=((e.programCredits||18)/(/12.credit/i.test(a.tuitionResident.label)?12:9));}
   else t=n(evidence.genericGraduate.amounts.tuitionResident)*extra;
   tuition+=Math.min(t,professional);if(l>0){living+=l;other+=professional-t-l;}else{living+=professional-t;combined=true;}
  }
  example='Texas-resident college cost reference'+(level==='graduate'?' + '+(r?.institution||e?.institution||'graduate study'):' · UT Austin');
 }
 else if(level==='associate'){tuition=acc.tuitionMin*2;other=acc.books*2;living=b.cost-tuition-other;example='ACC in-district · two-year attendance reference';}
 else if(id==='administrative-assistant'){b.cost=0;b.years=0;duration='Workplace learning';example='No separately purchased college program required';b.parts=[{label:'Learn at work',amount:0,scope:'Build office and software skills through workplace learning and practice.'}];}
 else if(id==='electrician'){const history=r.alternativePublishedHistoricalBenchmark;tuition=history.tuitionPerApprenticeYear;other=history.applicationFee;b.cost=tuition+other;b.years=1;duration='One apprentice training year';example='Austin Electrical Training Alliance · 2025–26 fee reference';b.parts=[{label:'Classroom tuition for one apprentice year',amount:tuition,scope:'Published 2025–26 classroom-fee reference. Paid supervised work runs alongside classes.'},{label:'Application fee',amount:other,scope:'One application.'}];b.sources=history.sourceURLs;}
 else{tuition=b.cost;duration=b.years===1?'One-year cost reference':b.years?duration:'Course, license or workplace route';}
 tuition=Math.max(0,Math.min(tuition,b.cost));living=Math.max(0,Math.min(living,b.cost-tuition));other=b.cost-tuition-living;
 const rows=[{label:id==='hairdresser'?'Tuition':'Tuition & school costs',amount:tuition},...(living?[{label:combined?'Living & other expenses':'Living expenses',amount:living}]:[]),...(other?[{label:'Other study expenses',amount:other}]:[])];
 return {...b,rows,example,duration,combined,tuition,living,other};
}
