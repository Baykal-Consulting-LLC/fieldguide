import {orderedProfileQuestions,profileNavigationQuestions,questionAnswered} from './profile-journey.js?v=0.31.0';

const parts=[['interest','Interests'],['pathway','Everyday work'],['skill','Experience'],['values','Priorities'],['context','Work style']];
const message=(id,title,copy,icon='interests',tone='warm')=>({id,title,copy,icon,tone});

// Presentation only: no response values, match scores, inferred traits, or time estimates.
export function profileMomentum(s){
 const required=profileNavigationQuestions(s),activeParts=parts.filter(([kind])=>required.some(q=>q.kind===kind));
 const q=orderedProfileQuestions(s)[s.profileJourney.index],part=Math.max(0,activeParts.findIndex(([kind])=>kind===q?.kind));
 const complete=required.every(x=>questionAnswered(s,x));
 const questions=required.filter(x=>x.kind===activeParts[part][0]),done=questions.filter(x=>questionAnswered(s,x)).length,total=questions.length;
 let boost=null;
 if(!complete){
  if(q.kind==='interest'){
   if(done>=6&&done<9)boost=message('first-steps','You’ve made a start.','Take it one activity at a time.');
   if(done>=15&&done<18)boost=message('interest-quarter','A quarter of this part is done.','You’re building a fuller picture of what you enjoy.');
   if(done>=30&&done<33)boost=message('interest-half','Halfway through your interests.','Keep going at your own pace.','explore','blue');
   if(done>=45&&done<48)boost=message('interest-last-stretch','Your interests: the last stretch.','You’ve completed three quarters of this part.','explore','blue');
  }
  if(q.kind==='pathway'){
   const interests=orderedProfileQuestions(s).filter(x=>x.kind==='interest');
   if(done<3&&!s.profileJourney.followupIntroSeen&&interests.every(x=>questionAnswered(s,x)))boost=message('interest-complete','Your interest section is complete.','Now picture the day-to-day work.','interests','blue');
   const halfway=Math.ceil(total/2);
   if(done>=halfway&&done<halfway+3&&done<total)boost=message('work-tip','Different interests can belong together.','Choose what appeals to you. You can explore more than one field.','explore');
  }
  if(q.kind==='skill'&&done<3&&!s.profileJourney.sectionIntrosSeen?.includes('skill'))boost=message('experience-start','A new angle: your experience.','Think about what you’ve tried so far.','education','blue');
  if(q.kind==='skill'&&done>=6&&done<9)boost=message('experience-tip','Skills can grow with practice.','Choose what fits you today.','interests');
  if(q.kind==='values'||q.kind==='context'&&done<2)boost=message('final-stretch','Nearly there.','Your pathway suggestions come next.','plan','blue');
 }
 if(boost)boost.badge=({'first-steps':'Nice start!','interest-quarter':'¼ complete','interest-half':'Halfway!','interest-last-stretch':'¾ complete','interest-complete':'New part','work-tip':'Keep going','experience-start':'New part','experience-tip':'Keep growing','final-stretch':'Final stretch'})[boost.id];
 return {complete,part:part+1,parts:activeParts.length,label:q.kind==='context'&&s.profileJourney.questionMode!=='all'&&!s.profileJourney.reviewSection?'Learning routes':activeParts[part][1],kind:activeParts[part][0],done,total,percent:total?done/total*100:0,boost};
}

// Once per milestone per active draft. Back, edits and selection rerenders do not replay it.
export function createMomentumMotion(){
 let draft=null,seen=new Set(),previous=null;
 return (state,model)=>{
  if(draft!==state){draft=state;seen=new Set();previous=null;}
  const animateBoost=!!model.boost&&!seen.has(model.boost.id);
  if(model.boost)seen.add(model.boost.id);
  const from=previous?.kind===model.kind?previous.percent:model.percent;
  previous={kind:model.kind,percent:model.percent};
  return {animateBoost,animateProgress:from<model.percent,from};
 };
}
