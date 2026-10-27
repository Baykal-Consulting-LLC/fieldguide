import paths from '../../dist/data/pathways.json';
import occupations from '../../dist/data/occupations.json';
export const catalog={...paths,occupationTitles:Object.fromEntries(Object.values(occupations).map(o=>[o.soc,o.title]))};
