import{openExplorerPage as retiredExplorerPage087}from'./open-explorer-ui.js';
import{resultsBoardPage,boardRoutes,isResultsBoardRoute}from'./results-board-bridge.js';
import {openExplorerPage} from './open-explorer-ui-087.js';
import {degreeInventoryPage} from './degree-inventory-ui.js';
import {educationFundingPage} from './results-plan-ui.js';
import {occupationById} from './occupation-data.js';
import {makeJourneyPlan} from './profile-journey.js';
import {profileJourneyPage,journeyPlanContext} from './profile-journey-ui.js';
import {personalPlanPage,simpleCareerPage,salaryPreviewPage,guidePage} from './guide-ui.js';
import {careerLibraryPage} from './career-library-087.js';
export function studentModelState(c,careerId=''){
 const state=structuredClone(c.experimentState);
 state.guide.primaryCareer='';state.guide.salaryPicked=false;
 state.profile.nickname=c.biography.name;
 state.actions=state.actions.filter(a=>a.done||a.notice||!/^guide-.*-(try|prepare|talk)$/.test(a.id));
 if(careerId&&occupationById(careerId))makeJourneyPlan(state,careerId);
 return state;
}
export function studentModelScreen(state,route='plan',degreeView={}){
 if(isResultsBoardRoute(route))return resultsBoardPage(state,{preview:true});
 if(route==='retired-v1/plan')return retiredExplorerPage087('plan',state)||personalPlanPage(state);
 if(route==='retired-v1/results')return retiredExplorerPage087('journey/explore',state);
 const open=openExplorerPage(route,state);if(open!==null)return open;
 const [path,query='']=route.split('?'),parts=path.split('/');
 if(path==='degree-careers')return degreeInventoryPage(state,degreeView);
 if(path==='plan'&&state.guide.primaryCareer)return personalPlanPage(state);
 if(parts[0]==='education-funding')return educationFundingPage(state,parts[1]);
 if(parts[0]==='salary')return salaryPreviewPage(parts[1],parts[2]||'entry',state,new URLSearchParams(query).get('from')||'career');
 if(path.startsWith('guide/'))return guidePage(path,state);
 if(['journey/pathways','journey/lifestyle-summary','journey/research'].includes(path))return profileJourneyPage(path,state);
 if(path.startsWith('journey/discover'))return profileJourneyPage(path,state);
 if(path==='journey/expanded-matches')return profileJourneyPage(path,state);
 if(path.startsWith('journey/degree-check/'))return profileJourneyPage(path,state);
 if(path.startsWith('journey/check-career/'))return profileJourneyPage(path,state);
 if(path.startsWith('learn/'))return careerLibraryPage(path,state);
 if(path.startsWith('journey/profession/')||parts[0]==='career')return simpleCareerPage(parts.at(-1),state,true,{journey:true});
 return profileJourneyPage('journey/professions',state);
}
