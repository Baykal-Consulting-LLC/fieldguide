import {careerFamilies} from './guide-state.js?v=0.31.0';
import {fieldGlyph} from './glyphs.js?v=0.31.8';

// Keep a career's symbol stable when it appears in another field or becomes the plan.
const primaryField={emt:'public-safety','industrial-engineering':'building','urban-planning':'building',logistics:'transportation-production'};
export function careerGlyph(o){
 const field=primaryField[o?.id]||careerFamilies.find(f=>f.paths.some(id=>o?.pathIds?.includes(id)))?.id;
 return fieldGlyph(field||'creative').replace('class="field-icon ','class="field-icon career-icon ');
}
