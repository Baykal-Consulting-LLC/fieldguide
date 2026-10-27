import {texasRequirements} from './texas-requirements.js?v=0.31.0';
import {commonCareerSpecs} from './common-career-data.js?v=0.31.0';
import {escapeHTML as h} from './html.js?v=0.31.0';

// Presentation only. Source classifications, requirements, matching and pay stay unchanged.
const educationLabels={
 'Postsecondary nondegree award':'Job training after high school (certificate or diploma)',
 'No formal educational credential':'No degree usually needed to start',
 'High school diploma or equivalent':'High school diploma or GED',
 'Some college, no degree':'Some college classes; a degree is not usually required',
 "Associate's degree":'Two-year college degree',"Bachelor's degree":'Four-year college degree',"Master's degree":'Graduate degree after college',
 "associate's degree or other 2-year degree":'two-year college degree',"bachelor's degree":'four-year college degree',"master's degree":'graduate degree after college',
 'certificate after high school':'job-training certificate after high school','certificate after college':'extra training after a college degree',
 "certificate after master's":'extra training after a graduate degree','professional degree':'professional degree, such as medicine or law',
 'doctoral degree':'doctoral degree (PhD or similar)','post-doctoral training':'advanced training after a doctorate',
 'no high school diploma/GED':'no high school diploma usually needed','high school diploma/GED':'high school diploma or GED'
};
export function plainEducation(text=''){let out=String(text);for(const [term,label]of Object.entries(educationLabels))out=out.replaceAll(term,label);return out;}
const routeLabels={
 'nurse-practitioner':'Registered-nurse license, graduate nursing degree, certification, and Texas advanced-practice license',
 'vocational-nurse':'Approved nursing program + Texas LVN license',
 'nursing-assistant':'Nurse-aide training + required tests',
 'medical-assistant':'Medical-assistant training, often a certificate',
 'truck-driver':'Truck-driving training + commercial driver’s license',
 hairdresser:'Approved cosmetology training + Texas license',
 firefighter:'Firefighter training + required certificates',
 tattoo:'Hands-on training in a licensed tattoo studio'
};
export function careerEducationSummary(o){const t=texasRequirements[o.id],summary=t?.summary||'',entry=o.finance?.requirements?.typicalEntry||o.preparation.typicalEducation.join(' or ');return routeLabels[o.id]||plainEducation((/^No (?:general|statewide|universal|Texas|occupation)/i.test(summary)||/^PE license/i.test(summary))?entry:summary||entry);}
export function careerEducationBullets(o){return (texasRequirements[o.id]?.bullets||[]).filter(x=>!x.includes('is the national typical-entry route.')).map(plainEducation);}
const benefits={
 physician:['College and medical school are required','College courses prepare you for medical school. A medical degree, residency, and a Texas license are required to work as a doctor.'],
 dentist:['College and dental school are required','College science courses come before dental school. You then need a dental degree, required exams, and a Texas license.'],
 'vocational-nurse':['A clear path to higher-paid nursing work','A college nursing program can lead to registered-nurse work after licensing. Registered nurses generally earn more than vocational nurses.','nursing'],
 'nursing-assistant':['College opens the path to nursing','An approved college nursing program can lead to RN work after licensing. Nursing-assistant training alone does not qualify you as an RN.','nursing'],
 'personal-care-aide':['College opens more care careers','A nursing or social-work degree can prepare you for different care jobs. Those jobs have their own training and license requirements.'],
 'medical-assistant':['College can widen your healthcare options','An associate degree builds clinical and office skills. Becoming a nurse requires a separate nursing program and license.'],
 'pharmacy-technician':['Becoming a pharmacist takes college','College science courses are part of the route to pharmacy school. A pharmacy doctorate and license are required to become a pharmacist.','pharmacy'],
 'dental-assisting':['College opens the path to dental hygiene','A dental-hygiene degree and license qualify you for a different job with more clinical duties. Assisting experience alone does not.','dental-hygiene'],
 'psychiatric-aide':['College opens more mental-health careers','A nursing or social-work degree can lead to licensed care roles after the required exams and training.'],
 'psychiatric-technician':['College opens more mental-health careers','A nursing or social-work degree can lead to different clinical roles. Each has its own license requirements.'],
 'bookkeeping-clerk':['An accounting degree opens accountant jobs','College accounting study is the usual route to accountant work. Becoming a CPA takes additional coursework and licensing.','accounting'],
 'computer-support':['College can open more technical jobs','An IT or computer-science degree can prepare you for systems, security, and software work. Support experience also matters.'],
 electrician:['Useful for moving into construction management','A construction-management degree can prepare you to manage building projects. You still need supervised work and licensing to become an electrician.','construction-management'],
 plumbing:['Useful for moving into construction management','A construction-management degree can prepare you to manage projects. It does not replace plumbing training or licensing.','construction-management'],
 carpentry:['Useful for moving into construction management','A construction-management degree can prepare you for project-management jobs. Hands-on building experience still matters.','construction-management'],
 'construction-laborer':['College opens more building-career options','Construction classes build technical skills. A construction-management degree is a common route into managing building projects.','construction-management'],
 hvac:['Useful for learning more repair skills','Technical-college classes teach heating, cooling, and electrical systems. Business classes help with pricing and running a repair business.'],
 automotive:['Useful for learning advanced repair skills','A technical-college program teaches vehicle systems and diagnostics. Hands-on experience and job-specific certifications still matter.'],
 welder:['Useful for learning more welding methods','A college welding program gives you practice with different tools and methods. Employers also look at your welding skills and certifications.'],
 'industrial-machinery-mechanic':['Useful for working with modern equipment','College classes in machinery, electronics, and automation build skills used to repair factory equipment.'],
 'general-maintenance':['Useful for more skilled repair work','Technical-college classes teach electrical, plumbing, and equipment repairs. Some work needs a separate trade license.'],
 emt:['College can help you move beyond basic emergency care','Paramedic programs teach more advanced emergency care. Nursing requires a separate approved program and license.'],
 chef:['Useful for kitchen and business skills','Culinary college teaches cooking techniques and food safety. Business classes help with staffing, pricing, and restaurant costs.'],
 'restaurant-cook':['Useful for building cooking skills','Culinary classes teach more cooking methods and food safety. Kitchen experience remains important for becoming a chef.'],
 'food-counter':['Useful for moving toward restaurant management','Hospitality or business classes teach staffing, food costs, and running a restaurant. Work experience is still important.'],
 'restaurant-server':['Useful for moving toward hospitality management','Hospitality study teaches restaurant and hotel operations. It does not automatically raise pay for the same serving job.'],
 'restaurant-manager':['Useful for larger management roles','Hospitality or business college teaches budgeting, staffing, and operations. Restaurant experience remains essential.'],
 tattoo:['Useful for art and running a studio','Art classes build design skills. Business classes teach pricing and bookkeeping. Your portfolio, client base, and studio skills drive your work.'],
 photographer:['Useful for photography and business skills','Photography classes build lighting and editing skills. Business classes help with pricing and finding clients.'],
 hairdresser:['Useful for running a salon','Business classes teach pricing, bookkeeping, and hiring. Cosmetology training and licensing are still required to cut hair.'],
 'childcare-worker':['College opens teaching options','Child-development classes build care skills. A teaching degree and required certification open a separate path to school teaching.','teaching'],
 'retail-sales':['Useful for moving into store management','Business classes teach budgets, inventory, and managing a team. Sales experience remains important.'],
 cashier:['College opens jobs beyond the checkout','Accounting or business study prepares you for different office and finance work. It does not automatically raise cashier pay.'],
 'customer-service':['Useful for business and team-lead roles','Business and communication classes build writing, problem-solving, and team-management skills.'],
 'office-clerk':['Useful for more specialized office work','College classes in accounting, business, or office software build skills for more specialized jobs.'],
 'administrative-assistant':['Useful for more demanding office roles','Business and office-software classes build skills for supporting managers and handling complex schedules. Experience still matters.'],
 receptionist:['Useful for moving into office work','Business and office-software classes build skills for administration and office coordination.'],
 'warehouse-material-mover':['Useful for moving toward logistics work','Supply-chain college classes teach inventory, planning, and how goods move. Warehouse experience remains valuable.','logistics'],
 'stock-order-filler':['Useful for moving toward logistics work','Supply-chain classes teach inventory planning and warehouse operations. These build skills beyond filling orders.','logistics'],
 'truck-driver':['Useful for fleet and logistics work','Logistics or business classes teach scheduling, costs, and managing transport. They do not replace a commercial driver’s license.'],
 'delivery-driver':['Useful for dispatch and logistics work','Logistics classes teach scheduling, inventory, and delivery planning. Driving experience remains useful.'],
 police:['Useful for specialist and leadership roles','College develops writing, analysis, and communication skills. Hiring and promotion rules depend on the department.'],
 firefighter:['Useful for broader emergency-service skills','Fire-science and emergency-care programs build technical skills. Academy training and required certificates still come first.'],
 'security-guard':['Useful for security-management skills','College security or criminal-justice classes teach investigation, reporting, and managing a team.'],
 'landscaping-worker':['Useful for advanced plant care and business skills','Horticulture classes teach plant health and landscape care. Business classes help with pricing and running a crew.'],
 'janitor-cleaner':['Useful for running a cleaning business','Business classes teach pricing, bookkeeping, and managing workers. A degree is not usually needed for cleaning work.'],
 'farmworker-crops':['Useful for farming and management skills','Agriculture classes teach crop science, equipment, and farm operations. Business classes help with budgets and sales.'],
 'real-estate-agent':['Useful for finance and business knowledge','College real-estate and finance classes build knowledge for property deals. They do not replace Texas licensing.'],
 'insurance-sales-agent':['Useful for finance and business knowledge','College finance and business classes help you understand products and clients. Insurance licenses are still required.']
};
export function collegeBenefit(o){const custom=benefits[o.id];if(custom)return {title:custom[0],copy:custom[1],related:custom[2]};
 const degree=o.finance?.credentialLevel,common=commonCareerSpecs.find(c=>c.id===o.id);
 return {title:degree==='graduate'?'College and further study are part of this path':'College is the usual route into this job',copy:common?.educationBenefits||(degree==='graduate'?'This job needs more study after college. The training steps show the full route.':'A related degree builds the knowledge and practical skills employers look for. It also opens related career options.')};}
export function collegeBenefitPanel(o){const v=collegeBenefit(o),sources=o.id==='vocational-nurse'||o.id==='nursing-assistant'?['https://www.bls.gov/ooh/healthcare/licensed-practical-and-licensed-vocational-nurses.htm','https://www.bls.gov/ooh/healthcare/registered-nurses.htm']:['electrician','plumbing','carpentry','construction-laborer'].includes(o.id)?['https://www.bls.gov/ooh/management/construction-managers.htm']:(texasRequirements[o.id]?.sourceURLs||[o.url]).slice(0,2);return `<aside class="college-benefit"><h3>${h(v.title)}</h3><p>${h(v.copy)}</p>${v.related?'<a href="#/learn/career/'+h(v.related)+'">Compare '+h(({nursing:'registered nursing',pharmacy:'pharmacist work','dental-hygiene':'dental hygiene',accounting:'accounting','construction-management':'construction management',teaching:'teaching',logistics:'logistics'})[v.related]||'this career')+' →</a>':''}<details class="more-info"><summary>More info · college benefits</summary><p>Extra study may prepare you for different work. It is not a guaranteed raise in the same job.</p>${sources.map(u=>'<a href="'+h(u)+'" target="_blank" rel="noopener">Education source ↗</a>').join(' · ')}</details></aside>`;}

const shortTitles={
 physician:'Doctor (family medicine)',dentist:'Dentist (general dentistry)',
 'social-research':'Social research assistant','environmental-science':'Environmental scientist','market-research':'Market researcher',
 'speech-language':'Speech and language therapist',nutrition:'Dietitian','social-work':'Social worker (children and families)',
 'information-security':'Cybersecurity analyst','systems-analysis':'Computer systems analyst',accounting:'Accountant',
 'human-resources':'Human resources specialist',logistics:'Logistics planner','project-management':'Project manager',
 paralegal:'Paralegal','urban-planning':'City planner','biomedical-engineering':'Biomedical engineer',
 animation:'Animator and visual-effects artist',librarian:'Librarian',interpreting:'Interpreter or translator',
 'exercise-physiology':'Exercise physiologist','film-editing':'Film and video editor',
 automotive:'Auto mechanic',emt:'Emergency medical technician (EMT)',chef:'Chef or head cook',
 'psychiatric-aide':'Mental-health care aide','psychiatric-technician':'Mental-health care technician','clinical-psychologist':'Clinical psychologist',
 'retail-sales':'Retail salesperson','food-counter':'Fast-food or counter worker','restaurant-server':'Restaurant server',
 'restaurant-cook':'Restaurant cook','restaurant-manager':'Restaurant manager','customer-service':'Customer service worker',
 'office-clerk':'Office clerk','administrative-assistant':'Administrative assistant','bookkeeping-clerk':'Bookkeeper',
 receptionist:'Receptionist','warehouse-material-mover':'Warehouse worker','stock-order-filler':'Stock and order worker',
 'truck-driver':'Truck driver','delivery-driver':'Delivery driver','vocational-nurse':'Vocational nurse (LVN)',
 'radiologic-technologist':'X-ray technologist','school-counselor':'School and career counselor','elementary-teacher':'Elementary school teacher',
 'high-school-teacher':'High school teacher','computer-support':'Computer support specialist','web-interface-design':'Website and app designer',
 police:'Police officer',welder:'Welder','industrial-machinery-mechanic':'Factory equipment mechanic','general-maintenance':'Maintenance worker',
 'construction-laborer':'Construction worker','landscaping-worker':'Landscaping worker','janitor-cleaner':'Cleaner or janitor',
 hairdresser:'Hairdresser','farmworker-crops':'Farm and greenhouse worker','real-estate-agent':'Real estate agent',
 'general-operations-manager':'Operations manager','medical-services-manager':'Healthcare manager','management-analyst':'Management consultant'
};
export const careerTitle=o=>shortTitles[o.id]||o.finance?.title||o.title;
