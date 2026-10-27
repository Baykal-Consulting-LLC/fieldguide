import{professionReplayState}from'./profession-replay.js';
import{professionConfirmationState}from'./profession-confirmation.js';
import{expandedInterestState}from'./expanded-interest.js';
import{applyCoverageExploration}from'./coverage-050-replay.js';
import{applyBroadFollowups052}from'./broad-followups-052-replay.js';
import{applyExplorerReviews053}from'./explorer-053-replay.js';
import{explorerResults,applyModelContext056}from'./open-explorer-056.js';
import{explorerBudget}from'./explorer-053-budget.js';
// Only called for cases returned by the existing owner-authorized connection.
export function currentPrivateMatches(c){
 let s=professionReplayState(c);s=professionConfirmationState(s,c.professionConfirmation);s=professionConfirmationState(s,c.professionInterest);s=expandedInterestState(s,c.expandedInterest);s=applyCoverageExploration(s,c.id);s=applyBroadFollowups052(s,c.id);s=applyModelContext056(applyExplorerReviews053(s,c.id),c);
 const compact=x=>({id:x.id,title:x.o.title,fields:x.fields,r:x.r,degree:x.degree,band:x.band,supported:x.specific.supported,inferred:x.specific.inferred,budget:explorerBudget(s,x.o),evidence:x.specific.evidence,contrary:x.specific.contrary}),r=explorerResults(s);
 return{id:c.id,name:c.biography.name,phase:'private',top:r.rows.filter(x=>x.specific.supported).slice(0,3).map(compact),first12:r.rows.slice(0,12).map(compact)};
}
