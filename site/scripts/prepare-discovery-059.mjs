import fs from'node:fs';
import{explorerCatalog}from'../dist/open-explorer.js';
const facts=JSON.parse(fs.readFileSync('data-sources/onet31-occupation-facts.json')).occupations;
const wages=new Map(JSON.parse(fs.readFileSync('data-sources/twc-2025-msa-median.json')).map(r=>[r.soc,r]));
const data=Object.fromEntries(explorerCatalog.map(o=>{const w=wages.get(o.soc.slice(0,7)),area=w?.austin>0?'austin':w?.statewide>0?'statewide':null;return[o.id,{zone:o.jobZone||facts[o.id]?.jobZone||null,median:area?w[area]:null,geography:area==='austin'?'Austin metro':'Texas statewide',period:'2025',broader:!o.soc.endsWith('.00')||o.id==='tattoo',source:'https://texaswages.com/MSAWages/MSASocDetails?soc='+o.soc.slice(0,7)+'&wgeType=median'}];}));
fs.writeFileSync('dist/exploration-059-data.js','// Sourced occupation context; no profile or response inference.\nexport const exploration059Data='+JSON.stringify(data)+';\n');
