import {freshLifestyle,calculateLifestyle} from './lifestyle.js?v=0.31.0';
// All five levels are editable planning baskets, not Austin price percentiles or quotes.
const option=(title,copy,inputs)=>({title,copy,inputs});
export const lifestyleChoices=[
 {id:'home',symbol:'⌂',question:'Where would you feel at home?',options:[
 option('Share a place','A room of your own. Shared living space.',{rent:'818.50',utilities:'90'}),
 option('A small place','A modest apartment with the basics.',{rent:'1150',utilities:'150'}),
 option('My own space','A comfortable one-bedroom apartment.',{rent:'1350',utilities:'180'}),
 option('Room to spread out','A larger apartment or rental home.',{rent:'2500',utilities:'240'}),
 option('A standout home','A high-end home with extra space and comforts.',{rent:'5000',utilities:'350'})],ownOptions:[
 option('A compact condo','A smaller home to make your own.',{homePrice:'200000',hoa:'300',homeInsurance:'150'}),
 option('A starter home','A modest place for the next chapter.',{homePrice:'300000',hoa:'100',homeInsurance:'200'}),
 option('A comfortable home','More room for everyday life.',{homePrice:'421000',hoa:'75',homeInsurance:'250'}),
 option('A spacious home','More space, inside and out.',{homePrice:'750000',hoa:'150',homeInsurance:'400'}),
 option('A luxury home','A large home with premium comforts.',{homePrice:'1500000',hoa:'250',homeInsurance:'700'})]},
 {id:'transport',symbol:'↗',question:'How would you like to get around?',options:[
 option('Keep it light','Walking, cycling, transit, and occasional rides.',{carMode:'transit',transit:'41.25',rides:'60'}),
 option('A car I own','No loan payment. Include upkeep and a replacement fund.',{carMode:'paid',fuel:'100',carInsurance:'140',carMaintenance:'140',carOther:'120'}),
 option('A reliable used car','A compact car for everyday trips.',{carMode:'used',carPrice:'22000',carDown:'4000',carRate:'11.19',carMonths:'60',fuel:'120',carInsurance:'180',carMaintenance:'100',carOther:'20'}),
 option('A newer car','More comfort and newer features.',{carMode:'new',carPrice:'38000',carDown:'6000',carRate:'6.35',carMonths:'60',fuel:'140',carInsurance:'240',carMaintenance:'80',carOther:'50'}),
 option('A premium car','A car that is part of the experience.',{carMode:'new',carPrice:'85000',carDown:'15000',carRate:'6.35',carMonths:'60',fuel:'220',carInsurance:'400',carMaintenance:'180',carOther:'100'})]},
 {id:'groceries',symbol:'♧',question:'What is your food-at-home style?',options:[
 option('Simple and planned','Cook at home and make the most of each shop.',{groceries:'350'}),
 option('Everyday favorites','Mostly groceries, with some small treats.',{groceries:'400'}),
 option('A little more choice','Good variety and some convenience foods.',{groceries:'550'}),
 option('Food I love','Specialty ingredients and more convenience.',{groceries:'800'}),
 option('No skimping','Premium ingredients and a well-stocked kitchen.',{groceries:'1200'})]},
 {id:'dining',symbol:'☕',question:'How many dinners out would you like each week?',options:[
 option('Occasional dinners','Less than 1 dinner out a week.',{quickCount:'0',quickPrice:'15',casualCount:String(.25*52/12),casualPrice:'30',specialCount:'0',specialPrice:'100'}),
 option('1 dinner a week','A casual meal out to look forward to.',{quickCount:'0',quickPrice:'15',casualCount:String(52/12),casualPrice:'35',specialCount:'0',specialPrice:'100'}),
 option('2–3 dinners a week','Regular casual meals, with a special dinner sometimes.',{quickCount:String(52/12),quickPrice:'18',casualCount:String(1.25*52/12),casualPrice:'40',specialCount:String(.25*52/12),specialPrice:'100'}),
 option('4–5 dinners a week','Dinner out is a big part of the week.',{quickCount:String(1.5*52/12),quickPrice:'20',casualCount:String(2.5*52/12),casualPrice:'50',specialCount:String(.5*52/12),specialPrice:'130'}),
 option('6–7 dinners a week','Most evenings out, including memorable dining.',{quickCount:String(2*52/12),quickPrice:'25',casualCount:String(3*52/12),casualPrice:'70',specialCount:String(1.5*52/12),specialPrice:'200'})]},
 {id:'travel',symbol:'✈',question:'What kind of travel would you like?',options:[
 option('Close to home','Local adventures and day trips.',{travel:'25',tripPrice:'300'}),
 option('A simple getaway','Save up for a modest trip.',{travel:'100',tripPrice:'1200'}),
 option('An annual escape','A proper trip, with room to enjoy it.',{travel:'250',tripPrice:'2500'}),
 option('A few adventures','Longer trips and weekend escapes.',{travel:'600',tripPrice:'3500'}),
 option('Travel in style','Several big trips with extra comfort.',{travel:'1600',tripPrice:'6000'})]},
 {id:'entertainment',symbol:'♫',question:'What entertainment would you enjoy?',options:[
 option('Keep it simple','Free events, streaming, and nights with friends.',{recreation:'20'}),
 option('A few nights out','Movies or a small show now and then.',{recreation:'75'}),
 option('Regular plans','Movies, music, and shows through the month.',{recreation:'200'}),
 option('A full calendar','More concerts, tickets, and nights out.',{recreation:'500'}),
 option('Make it special','Premium seats and big entertainment experiences.',{recreation:'1200'})]},
 {id:'recreation',symbol:'✳',question:'How would you spend time on hobbies and recreation?',options:[
 option('Outdoors and free','Parks, walks, and low-cost hobbies.',{recreation:'25'}),
 option('A few favorites','A simple hobby or fitness routine.',{recreation:'100'}),
 option('Time for my interests','Classes, sports, and memberships.',{recreation:'250'}),
 option('Go deeper','More lessons, equipment, and active weekends.',{recreation:'600'}),
 option('Big hobbies','Premium clubs, equipment, and recreation.',{recreation:'1500'})]},
 {id:'clothing',symbol:'◇',question:'What feels like your personal style?',options:[
 option('Thrift and reuse','Find good pieces and make them last.',{clothing:'25',itemPrice:'20'}),
 option('Everyday basics','Affordable favorites and occasional replacements.',{clothing:'60',itemPrice:'35'}),
 option('A few quality pieces','Everyday brands, with a little room for treats.',{clothing:'150',itemPrice:'70'}),
 option('Style is a priority','Better brands and more frequent updates.',{clothing:'400',itemPrice:'150'}),
 option('Designer choices','Premium pieces are part of the picture.',{clothing:'1000',itemPrice:'350'})]},
 {id:'saving',symbol:'◒',question:'How much room would you like for future goals?',scale:['A small start','Bigger goals'],options:[
 option('Start a cushion','Build a small emergency fund.',{saving:'100'}),
 option('Keep it steady','Put something aside each month.',{saving:'300'}),
 option('Build more security','Grow savings for the next chapter.',{saving:'700'}),
 option('Move toward big goals','Save more for a home, change, or opportunity.',{saving:'1500'}),
 option('Make saving a priority','Set aside a substantial part of life’s budget.',{saving:'3000'})]}
];
export function freshLifestyleBuilder(){return {step:0,homeMode:'rent',choices:{},reviewing:false,complete:false};}
export function cleanLifestyleBuilder(raw){const b=freshLifestyleBuilder();if(!raw||typeof raw!=='object')return b;b.step=Number.isInteger(raw.step)?Math.max(0,Math.min(lifestyleChoices.length-1,raw.step)):0;b.homeMode=raw.homeMode==='own'?'own':'rent';for(const c of lifestyleChoices)if(Number.isInteger(raw.choices?.[c.id])&&raw.choices[c.id]>=0&&raw.choices[c.id]<=4)b.choices[c.id]=raw.choices[c.id];b.complete=raw.complete===true&&lifestyleChoices.every(c=>Number.isInteger(b.choices[c.id]));b.reviewing=raw.reviewing===true;return b;}
export const builderReady=b=>lifestyleChoices.every(c=>Number.isInteger(b?.choices?.[c.id]));
export function buildLifestyleInputs(builder,previous={}){if(!builderReady(builder))return null;const p=freshLifestyle();for(const k of ['gross','manualNet','careerId','band','salaryStage','netMode'])if(typeof previous[k]==='string')p[k]=previous[k];for(const k of ['health','retirement','debt','linkedLoanPayment','extraNeeds','cashSaved'])if(String(previous[k]??'').trim()!==''&&Number.isFinite(Number(previous[k]))&&Number(previous[k])>=0)p[k]=previous[k];p.housingMode=builder.homeMode;let recreation=0;for(const c of lifestyleChoices){const options=c.id==='home'&&builder.homeMode==='own'?c.ownOptions:c.options;const inputs=options[builder.choices[c.id]].inputs;if(['entertainment','recreation'].includes(c.id))recreation+=Number(inputs.recreation);Object.assign(p,inputs);}p.recreation=String(recreation);return p;}
export function lifestyleTally(p,builder){const r=calculateLifestyle({...p,netMode:'manual',manualNet:'0'});if(r.status!=='illustration')return null;let budgetRows=r.rows;if(builderReady(builder)){const entertainment=lifestyleChoices.find(c=>c.id==='entertainment').options[builder.choices.entertainment].inputs.recreation,recreation=lifestyleChoices.find(c=>c.id==='recreation').options[builder.choices.recreation].inputs.recreation,total=Number(entertainment)+Number(recreation);budgetRows=r.rows.flatMap(([label,value])=>label==='Recreation'?[['Entertainment',value*Number(entertainment)/total],['Recreation & hobbies',value*Number(recreation)/total]]:[[label,value]]);}const rows=[...budgetRows,['Health budget',Number(p.health)||0]].filter(([,v])=>v>0).map(([label,value])=>({label,value,display:Math.round(value/10)*10}));return {rows,total:rows.reduce((n,r)=>n+r.display,0),rawTotal:r.spending+(Number(p.health)||0),result:r};}
