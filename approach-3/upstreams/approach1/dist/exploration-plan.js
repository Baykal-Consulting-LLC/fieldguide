import {curiosity} from './content.js?v=0.31.0';
import {interestPicture} from './matching.js?v=0.31.0';

export function explorationSnapshot(state){
 const p=interestPicture(state),ratings=curiosity.map(q=>state.curiosity?.[q.id]).filter(Number.isInteger),likes=curiosity.filter(q=>Number.isInteger(state.curiosity?.[q.id])&&state.curiosity[q.id]>=4),high=ratings.length?Math.max(...ratings):null,lowConfidence=Object.values(state.confidence||{}).filter(x=>Number.isInteger(x.confidence)),gentle=lowConfidence.length>=2&&lowConfidence.reduce((n,x)=>n+x.confidence,0)/lowConfidence.length<=2;
 let kind,title,copy;
 if(!p.enough){kind='uncertain';title=ratings.length?'A few clues. Room to discover.':'It’s okay not to know yet.';copy='There isn’t enough of a pattern to suggest a field yet. Try a few different activities first.';}
 else if(high<=2){kind='unconnected';title='You haven’t found your thing yet.';copy='Nothing here has drawn you in. Start with a different experience, without choosing a career.';}
 else if(p.flat){kind='broad';title=ratings.every(v=>v>=4)?'Lots of things interest you.':'Nothing stands out yet.';copy='There’s no single direction to put first. Compare a couple of experiences and see what you want more of.';}
 else if(p.positive.length>1){kind='mixed';title='More than one interest belongs here.';copy='You can keep several directions open. Try them side by side before choosing a career.';}
 else if(!p.positive.length){kind='open';title='Your interests are still taking shape.';copy='You don’t need to name a career today. A small experience can give you a useful next clue.';}
 else {kind='focused';title='Follow a clue. Keep your options open.';copy='Explore a field now, or start with a few practical experiences. A career choice can wait.';}
 return {kind,title,copy,lowConfidence:gentle,likes:likes.map(q=>({id:q.id,text:q.text})),answered:ratings.length,unknown:p.unknown,unanswered:30-ratings.length-p.unknown};
}
const samplers={
 creative:['Make a small visual project','Spend 20 minutes making a poster, illustration, or simple screen. Ask for one helpful suggestion and try a revision.'],
 health:['Explore a health question','Use two reliable public sources to explain a general health question. Notice whether you enjoy the science, the explanation, or helping someone understand.'],
 science:['Investigate a small question','Choose a question about plants, materials, or the environment. Compare two explanations and describe what evidence would help.'],
 technology:['Try a small digital project','Follow a free beginner lesson to make a simple page, chart, or program. Notice whether building it or solving the problems holds your interest.'],
 trades:['Try practical problem-solving safely','Use a classroom model, drawing, or approved beginner project. Practice measuring and spotting how parts work together. Use supervision for tools; leave live wiring alone.'],
 building:['Sketch and test an idea','Sketch a useful object or structure. Make a paper model and change one thing after testing it.'],
 education:['Help someone learn one thing','Explain a familiar topic to a willing classmate or family member. Try a different explanation and ask what helped.'],
 business:['Plan a small project','Sketch a plan for a school event or imaginary service. Think about the people, details, and decisions involved.'],
 services:['Design a welcoming experience','Plan a simple meal, event, or helpful service. Notice whether you enjoy creating it, organizing it, or helping people.'],
 'public-safety':['Explore a safety scenario','Use a public, age-appropriate safety lesson to think through a scenario. Notice whether careful procedures and helping under pressure appeal to you.'],
 'transportation-production':['Map how something gets made or delivered','Draw the steps from an everyday item’s starting point to its user. Spot one way to make the process clearer or more reliable.'],
 'sales-office':['Organize and explain a choice','Make a clear comparison of two everyday products or organize a club checklist. Notice whether details or helping someone choose interests you.']
};
export function explorationSteps(state,families=[]){
 // Only the student's explicit field choices determine samplers. Recommendations never become a commitment.
 const chosen=state.guide?.familyIds?.length?state.guide.familyIds:state.guide?.family?[state.guide.family]:[],focus=chosen.filter(id=>samplers[id]).slice(0,2),beginner=explorationSnapshot(state).lowConfidence?' Start with a free, beginner-friendly version. Ask a teacher or trusted adult to help you get started.':'';
 const snapshot=explorationSnapshot(state),trials=focus.length?focus.map(id=>({id:'explore-try-'+id,title:samplers[id][0],detail:samplers[id][1]+beginner})):[{id:'explore-sample',title:snapshot.kind==='unconnected'?'Try something different from these prompts':'Try two different activities',detail:snapshot.kind==='unconnected'?'Ask a trusted adult to suggest two activities that feel different from this questionnaire. Choose short, low-pressure versions. Notice what you would change or try again.': 'This week, spend 15–20 minutes on two different things: make a visual idea, solve a practical puzzle, or help someone learn. Pick what is easy to access. Notice what you want to try again.'+beginner}];
 const compare={id:'explore-notice',title:'Keep a few notes on what you notice',detail:'After each activity, write one thing you enjoyed, one thing that felt difficult, and whether you would try it again. Being new is not the same as being unable.'};
 const talk={id:'explore-next',title:'Talk it through and choose a next step',detail:trials.length===1?'Share your notes with a counselor, teacher, or trusted adult. Pick one class, club, or supervised activity to try next. Revisit your answers after that experience.':'After each try, note what you enjoyed, what was hard, and whether you would repeat it. Share this with a counselor, teacher, or trusted adult. Pick one class, club, or supervised activity; revisit your answers afterward.'};
 return [...trials,...(trials.length===1?[compare]:[]),talk];
}
