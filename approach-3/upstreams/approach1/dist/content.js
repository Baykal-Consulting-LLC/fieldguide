import {commonDirections} from './common-fields.js?v=0.31.0';
import {extraDirections} from './catalog-extra.js?v=0.31.0';
export const modules = [
  { id:'curiosity', title:'What draws you in', type:'Interest reflection', time:'4–6 min', color:'peach', icon:'spark', description:'Explore the activities you would happily get lost in.' },
  { id:'priorities', title:'What matters to you', type:'Values & priorities', time:'3–4 min', color:'lilac', icon:'heart', description:'Make room for the things you want your future to hold.' },
  { id:'confidence', title:'What you’ve tried', type:'Confidence & experience', time:'3–4 min', color:'sage', icon:'seed', description:'Separate what feels familiar from what feels possible.' },
  { id:'evidence', title:'Your experience counts', type:'Projects & ability evidence', time:'4–5 min', color:'blue', icon:'folder', description:'Bring a project, a proud moment, or an existing assessment.' },
  { id:'reflection', title:'Connect the dots', type:'Personal reflection', time:'3–5 min', color:'pink', icon:'pen', description:'Put your own words around the story that is taking shape.' },
];

export const curiosity = [
  'Build a small prototype that makes an everyday task easier.',
  'Look for an explanation when the results of an experiment surprise you.',
  'Create a visual story about something your community cares about.',
  'Help a classmate understand something they have been struggling with.',
  'Bring people together to turn a new idea into a school event.',
  'Organize a complicated project so everyone knows what happens next.',
  'Take apart a broken object to investigate how its pieces work.',
  'Use a small dataset to explore a question you are curious about.',
  'Invent a character, scene, or design that expresses an original idea.',
  'Listen carefully to different perspectives on a difficult issue.',
  'Explain an idea to a group and invite them to get involved.',
  'Create a clear system for tracking the details of a shared project.',
  'Repair a small machine and make sure it works safely.',
  'Find out how the human body works and why people get sick.',
  'Take photos or make a short video that tells a story.',
  'Help someone feel comfortable during a difficult day.',
  'Help a customer choose something that meets their needs.',
  'Keep records accurate so bills, orders, or appointments run smoothly.',
  'Grow plants or care for animals through hands-on work.',
  'Investigate what is causing a problem in a natural environment.',
  'Make a meal, outfit, or room feel creative and personal.',
  'Show a child or group how to learn a new skill.',
  'Negotiate a fair agreement between people with different goals.',
  'Follow a checklist to make sure a delivery or process is correct.',
  'Operate equipment carefully to build, move, or produce something.',
  'Compare different explanations and find evidence that supports one.',
  'Create a performance, piece of music, or original illustration.',
  'Help someone work through a problem and decide on their next step.',
  'Lead a team through a busy day and help it reach a goal.',
  'Plan a schedule and keep supplies or information organized.',
].map((text,i)=>({id:`curiosity-${i+1}`,text,theme:['R','I','A','S','E','C'][i%6]}));

export const QUESTIONNAIRE_VERSION='2.0.0';
// Original conversation prompts inspired by the six RIASEC interest areas.
// This is not the O*NET Interest Profiler; no psychometric validity is claimed.


export const preferenceOptions = [
  {value:1,label:'Really not for me'}, {value:2,label:'Not very interested'},
  {value:3,label:'Somewhere in the middle'}, {value:4,label:'Sounds interesting'},
  {value:5,label:'I’d love this'}, {value:'untried',label:'I haven’t tried enough to say'},
];

export const priorities = [
  {id:'curiosity',title:'Keep learning',description:'Follow questions and keep discovering new things.',icon:'spark'},
  {id:'creativity',title:'Make something original',description:'Have room to imagine, create, and experiment.',icon:'pen'},
  {id:'impact',title:'Make a difference',description:'Contribute to people or problems I care about.',icon:'heart'},
  {id:'independence',title:'Find my own way',description:'Have autonomy over how I approach my work.',icon:'compass'},
  {id:'community',title:'Feel connected',description:'Work with people who support and inspire me.',icon:'people'},
  {id:'stability',title:'Build a steady foundation',description:'Have predictability and a sense of security.',icon:'home'},
  {id:'variety',title:'Welcome variety',description:'Try different activities and new environments.',icon:'shapes'},
  {id:'mastery',title:'Go deep',description:'Develop expertise in something that matters to me.',icon:'seed'},
];

export const confidence = [
  {id:'data',prompt:'Make sense of information by looking at data or evidence and explaining what it might mean.',title:'Making sense of information',description:'Look at data or evidence and explain what it might mean.'},
  {id:'making',prompt:'Create a first version of something. Try it out and make changes.',title:'Making and improving something',description:'Create a first version, try it out, and make changes.'},
  {id:'communication',prompt:'Help someone understand a complex idea through writing, speaking, or visuals.',title:'Sharing a complex idea',description:'Help someone understand an idea through writing, speaking, or visuals.'},
  {id:'investigation',prompt:'Explore an unfamiliar problem by working out what to ask and where to look.',title:'Exploring an unfamiliar problem',description:'Work out what to ask and where to look when the answer is unclear.'},
];

export const challenges = [
  {id:'quantitative',label:'Numerical reasoning',title:'Two ways to make it happen',prompt:'Your club is printing notebooks. Printer A charges a $30 setup fee plus $4 per notebook. Printer B charges a $10 setup fee plus $6 per notebook. At what order size do the two prices become equal?',options:['5 notebooks','10 notebooks','15 notebooks','20 notebooks'],answer:1,rationale:'At 10 notebooks, both printers charge $70: $30 + (10 × $4) and $10 + (10 × $6).'},
  {id:'verbal',label:'Reading & evidence',title:'What can we conclude?',passage:'A school extended its library opening hours for one month. In a voluntary survey afterward, most respondents said they liked the longer hours. The school did not collect responses from everyone who used the library or measure whether students’ grades changed.',prompt:'Which conclusion is best supported by the passage?',options:['Longer opening hours improved students’ grades.','Every library user prefers longer hours.','Most survey respondents liked the longer hours.','Students who did not reply disliked the change.'],answer:2,rationale:'The survey tells us what its respondents reported. It does not establish what everyone thought or whether grades changed.'},
  {id:'logical',label:'Logical reasoning',title:'A place for every presentation',prompt:'Three presentations—art, biology, and coding—must each have a different slot. Biology must come before coding. Art cannot be first. Which presentation must be first?',options:['Art','Biology','Coding','There is not enough information'],answer:1,rationale:'Art cannot be first, and coding cannot come before biology. Biology must therefore take the first slot. Art and coding can occupy either remaining order.'},
  {id:'spatial',label:'Spatial exploration',title:'A change in perspective',prompt:'Imagine turning this shape a quarter turn (90°) clockwise, without flipping it. Which option shows the result?',options:['Option A','Option B','Option C','Option D'],answer:1,rationale:'A clockwise quarter turn takes the long vertical segment to the top, with the shorter segment extending downward from its left end.'},
];

export const reflectionPrompts = [
  {id:'energy',title:'When do you lose track of time?',placeholder:'Think of a project, conversation, subject, or activity that pulls you in…'},
  {id:'meaning',title:'What would you like to understand or change?',placeholder:'It could be something in your community, a scientific question, or a way to make things better…'},
  {id:'question',title:'What are you still wondering about your next chapter?',placeholder:'There is room for uncertainty here. What would you like to explore with your counselor?'}
];

export const directions = [
  {id:'design',title:'Design & human experience',eyebrow:'Make things work better for people',color:'peach',icon:'shapes',subjects:['Design','Psychology','Human-computer interaction'],description:'Explore how people experience the things, spaces, and systems around them.',work:'Observe people, develop ideas, build prototypes, and refine them through feedback.',learn:'Look for introductory design, research methods, and interaction courses.',activity:'Redesign one everyday object',detail:'Choose an object that frustrates you. Ask someone how they use it, sketch an improvement, and reflect on which part you enjoyed.',question:'Which programs let me explore both design and research before specializing?'},
  {id:'technology',title:'Technology & systems',eyebrow:'Build tools and untangle complexity',color:'lilac',icon:'code',subjects:['Computer science','Information systems','Applied mathematics'],description:'Investigate how software and logical systems can solve real problems.',work:'Break a problem into parts, build a solution, test it, and improve it.',learn:'Try introductory programming and inspect how different programs balance theory and projects.',activity:'Build a very small useful tool',detail:'Make a simple calculator, checklist, or webpage for a problem you understand. Notice whether you enjoy designing, debugging, or explaining it.',question:'How much room is there for exploration before choosing a computing specialty?'},
  {id:'health',title:'Health & human behavior',eyebrow:'Understand people and their wellbeing',color:'pink',icon:'heart',subjects:['Psychology','Biology','Public health'],description:'Explore questions about how people think, develop, and stay well.',work:'Read evidence, ask careful questions, study patterns, and communicate findings.',learn:'Compare the content of biology, psychology, and public-health introductory courses.',activity:'Explore a health question through evidence',detail:'Choose a non-personal health or behavior question. Compare two reliable educational sources and list what is known and what remains uncertain.',question:'What distinguishes the undergraduate study routes into research, public health, and clinical fields?'},
  {id:'environment',title:'Environment & discovery',eyebrow:'Follow questions about our world',color:'sage',icon:'seed',subjects:['Environmental science','Ecology','Earth science'],description:'Investigate living systems, changing environments, and the evidence behind them.',work:'Observe, measure, compare explanations, and connect evidence to larger systems.',learn:'Look for the balance of laboratory, fieldwork, and quantitative study in a program.',activity:'Keep a tiny field notebook',detail:'Observe one local place over several visits. Record a question, observations, and possible explanations without assuming a cause.',question:'What fieldwork and undergraduate research opportunities are actually available?'},
  {id:'business',title:'Business & social impact',eyebrow:'Turn an idea into something people use',color:'yellow',icon:'chart',subjects:['Business','Economics','Public policy'],description:'Explore how organizations make decisions, use resources, and create change.',work:'Understand needs, compare tradeoffs, organize projects, and communicate a proposal.',learn:'Compare introductory economics, management, and policy courses.',activity:'Plan a small community initiative',detail:'Choose a small need and draft a one-page plan: who it serves, what it requires, and how you would learn whether it helped.',question:'Which programs combine analytical work with opportunities to test ideas in practice?'},
  {id:'culture',title:'Storytelling & culture',eyebrow:'Make meaning and share perspectives',color:'peach',icon:'pen',subjects:['Literature','History','Media studies'],description:'Explore how stories, ideas, and cultural contexts shape our understanding.',work:'Read critically, interpret evidence, create work, and explain your perspective.',learn:'Look at both seminar reading and the opportunities for original creative work.',activity:'Tell one story in two formats',detail:'Choose a local story and present it as both a short written piece and a visual or audio outline. Notice which decisions engage you.',question:'How can I combine humanities study with creative practice or another field?'},
  {id:'engineering',title:'The built world',eyebrow:'Imagine, build, and test a better version',color:'blue',icon:'ruler',subjects:['Engineering','Architecture','Materials science'],description:'Explore how structures, materials, and physical systems take shape.',work:'Model constraints, develop designs, test assumptions, and revise solutions.',learn:'Inspect math and science preparation, studio or lab time, and first-year exploration options.',activity:'Build and improve a paper structure',detail:'Design a paper structure to hold a small object. Change one feature at a time and record what happens. Notice the parts you want to keep investigating.',question:'How does the first year let students compare different engineering or design disciplines?'},
  {id:'learning',title:'Learning & community',eyebrow:'Help people understand and connect',color:'lilac',icon:'people',subjects:['Education','Sociology','Communication'],description:'Explore how people learn together and how communities support growth.',work:'Listen, explain, facilitate, and adapt an approach to different perspectives.',learn:'Compare education, social science, and communication coursework and placements.',activity:'Teach something you know',detail:'Help someone learn a small skill. Ask what helped and what confused them, then change your approach.',question:'What supervised community experiences can undergraduates try early in the program?'},
];

directions.push(...extraDirections,...commonDirections);

export const sources = [
  {title:'How assessment fits into college planning',organization:'American School Counselor Association',description:'Appraisal and advisement connect abilities, interests, and other evidence to a student’s academic and postsecondary plan.',url:'https://www.schoolcounselor.org/Standards-Positions/Position-Statements/ASCA-Position-Statements/The-School-Counselor-and-Individual-Student-Planni'},
  {title:'A documented interest assessment',organization:'O*NET Resource Center',description:'The Interest Profiler measures vocational interests. Its technical manual covers administration, scoring, reliability, and validity.',url:'https://www.onetcenter.org/dl_files/IP_Manual.pdf'},
  {title:'Teenage career preparation',organization:'OECD · 2025',description:'A report on teenage career uncertainty, guidance, and opportunities to explore the working world.',url:'https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_d5f8e3f2-en.html'},
  {title:'A broader picture of college fit',organization:'NACAC',description:'Academic opportunities, support, and personal priorities belong in the college decision alongside potential subjects.',url:'https://www.nacacnet.org/determining-the-right-fit/'},
];
