import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
a=json.loads((R/'validation/commonness-directory-audit-2026-10-16.json').read_text())
alias={'nursing':'nursing-care','clinical-technology':'allied-health','people-operations':'organizations-operations','practical-care':'practical-service','living-systems':'life-sciences','matter-earth':'physical-sciences'}
rows=[]
for x in a['records']:
 if x['selectedId']:continue
 path=alias.get(x['path'],x['path'])
 if x['soc'].startswith(('29-12','29-10')):path='medicines-nutrition'
 rows.append({'soc':x['soc'],'title':x['title'],'path':path,'family':x['primaryFamily'],'kind':x['decision'],'frequency':x['nationalEmploymentFrequencyTier'],'employmentSOC':x['employmentSOC'],'nationalEmployment':x['employment']['national']['employment'],'countScope':x['employment']['national']['mapping'],'sourceURL':x['sourceURL']})
assert len(rows)==807
summary={**a['summary'],'guidedProfiles':117,'exactProfiles':116,'directoryTitles':923,'priorityAdditions':50,'groupedOnly':len(rows),'method':'Review of all857 previously directory-only titles using BLS2025 employment, local TWC2024 employment where available, preparation/breadth, and editorial grouping. Counts are not salaries or career suitability. Specialty employment shares are not known; shared parent counts are never summed per title.'}
(R/'dist/catalog-grouping-data.js').write_text('export const groupingSummary='+json.dumps(summary,separators=(',',':'))+';\nexport const groupedOccupations='+json.dumps(rows,separators=(',',':'))+';\n')
(R/'dist/catalog-directory-review.json').write_text(json.dumps(a,indent=2)+'\n')
(R/'dist/catalog-gap-index.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Grouped',len(rows),'titles')
