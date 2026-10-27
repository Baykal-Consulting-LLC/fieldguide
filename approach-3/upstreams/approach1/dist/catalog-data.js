import {extraCareerSpecs} from './catalog-extra.js?v=0.31.0';
import {directions} from './content.js?v=0.31.0';
import {careers,pathCareers} from './finance-data.js?v=0.31.0';
export const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Fields are editorial study possibilities. Not a CIP crosswalk, admissions database, or license-eligibility determination.
export const majors=[...new Set([...directions.filter(d=>d.routeType!=='training').flatMap(d=>d.subjects),...extraCareerSpecs.filter(c=>c.level!=='training').flatMap(c=>c.routes),...careers.filter(c=>c.routeType!=='training').flatMap(c=>c.educationRoutes.routes.filter(r=>r.length<45&&!/ or |Other|Related|alongside|combined|Approved|Subject|depending|routes/.test(r)))])].map(title=>{
 const related=careers.filter(c=>c.educationRoutes.routes.some(r=>r.toLowerCase()===title.toLowerCase())).map(c=>c.id);
 const explicit=directions.filter(d=>d.routeType!=='training'&&d.subjects.includes(title));const paths=explicit.length?explicit:directions.filter(d=>d.routeType!=='training'&&(pathCareers[d.id]||[]).some(id=>related.includes(id)));
 return {id:'major-'+slug(title),slug:slug(title),title,paths:paths.map(d=>d.id),careers:related,question:paths[0].question};
});
export function subjectLink(s){const m=majors.find(m=>m.title===s);const c=careers.find(c=>c.educationRoutes.routes.includes(s));return m?`#/major/${m.slug}`:c?`#/career/${c.id}`:'#/catalog';}
export function entitiesForPlan(){return [{label:'Broad pathways',records:directions},{label:'Fields of study',records:majors},{label:'Specific careers',records:careers}];}
