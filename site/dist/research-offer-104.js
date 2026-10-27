import{boardOffer}from'./results-board-data.js';
// Research presentation adapter: the 0.88 additions carry existing sourced wage
// references on the occupation, outside the original salary registry. Never use
// this adapter to create interest support or change canonical coverage gates.
export function researchOffer104(o,options={}){const offer=boardOffer(o,options),w=o.salary;if(!Number.isFinite(offer.entry)&&Number.isFinite(w?.entry)){offer.entry=w.entry;offer.year5=w.year5;offer.payPlanningOnly=true;offer.entryBasis='Lower-paid-worker wage proxy · after qualification';offer.geography=w.geography;offer.period=w.period;offer.paySources=[{publisher:'Texas Workforce Commission',title:'Existing occupational wage reference',url:w.sourceURL,referencePeriod:w.period}];offer.payNotes=[w.basis,'Required preparation comes before qualified-role pay; this is not a guaranteed offer or observed earnings by experience.'];}return offer;}
