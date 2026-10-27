"""Reproducible app-owned projection from immutable public references. No student data."""
import hashlib, json, os, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
if not os.environ.get('FIELDGUIDE_SHARED_LEASE'):
    sys.exit(subprocess.run([sys.executable,str(ROOT/'scripts/shared-foundation.py'),'run','--',sys.executable,str(Path(__file__).resolve())],cwd=ROOT).returncode)
def read(p): return json.loads((ROOT/p).read_text())
inputs=['dist/data/pathways.json','dist/data/occupations.json','shared-data/wages/entry.json','shared-data/wages/median.json','shared-data/education/bls-preparation-2025.json','scripts/pathway-earning-examples.json','shared-data/education/catalog-education.json']
paths=read(inputs[0])['pathways']; occupations=read(inputs[1]); entry=read(inputs[2]); median=read(inputs[3]); prep=read(inputs[4]); selected=read(inputs[5]);reviewed={r['soc']:r for r in read(inputs[6])}
def index(rows,key):
    out={r[key]:r for r in rows}
    assert len(out)==len(rows), 'Duplicate reference keys'
    return out
entry=index(entry,'soc');median=index(median,'soc');education=index(prep['records'],'soc')
def positive(value): return value if isinstance(value,(int,float)) and value>0 else None
result={};issues=[]
for p in paths:
    records=[];seen=set()
    for code in selected['examples'][p['id']]:
        assert code in p['occupations'] and code in occupations, (p['id'],code,'not an exact program link')
        soc=code[:7];assert soc not in seen,(p['id'],soc,'duplicate wage group');seen.add(soc)
        e=education.get(soc);assert e and e['occupationType']=='Line item',(soc,'not detailed BLS preparation')
        # National typical preparation controls staging; it is not a licensing audit.
        note=reviewed.get(code,{})
        advanced=note.get('level')=='graduate' or e['education'] in ["Master's degree",'Doctoral or professional degree']
        experienced=e['experience'] not in ['None','—']
        stage='further-study' if advanced else 'experience' if experienced else 'qualifying-route'
        records.append({'onet':code,'soc':soc,'title':e['title'],'stage':stage,'education':e['education'],'routeNote':note.get('entry'),'routeCaution':note.get('training'),'routeNoteURL':note.get('sourceURL'),'experience':e['experience'],'training':e['training'],'preparationURL':e['ooh'] or prep['source'],'entry':positive(entry.get(soc,{}).get('austin')),'median':positive(median.get(soc,{}).get('austin')),'wageTitle':median.get(soc,entry.get(soc,{})).get('socTitle'),'wageURL':'https://texaswages.com/MSAWages/MSASocDetails?soc='+soc+'&wgeType=median','programs':[x['cip'] for x in p['programs'] if code in x['occupations']]})
    result[p['id']]=records
    for r in records:
        if r['entry'] is None or r['median'] is None: issues.append({'pathway':p['id'],'soc':r['soc'],'entryMissing':r['entry'] is None,'medianMissing':r['median'] is None})
meta={'schemaVersion':1,'geography':'Austin–Round Rock–San Marcos metro','geographyKey':'austin','wagePeriod':'2025','taxPeriod':'2026','snapshotDate':'2026-10-16','preparationRetrieved':prep['retrieved'],'sharedRelease':read('shared-foundation.lock.json')['version'],'selectionPolicy':selected['policy'],'entryDefinition':'Mean wage of the lowest-paid third of workers in each occupation and location. An entry-pay proxy, not an observed graduate starting salary.','medianDefinition':'50th percentile across workers in each occupation and location. Not a future salary or a promised progression.','wageDefinitionsURL':'https://texaswages.com/Home/About','preparationURL':prep['source'],'inputs':[{'file':p,'sha256':hashlib.sha256((ROOT/p).read_bytes()).hexdigest()} for p in inputs],'pathways':result}
(ROOT/'dist/data/pathway-earnings.json').write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':'))+'\n')
receipt={'date':'2026-10-23','scope':'Bounded companion audit of A2 pathway earning illustrations','sourceGrain':'one wage record per six-digit SOC and location, not per O*NET specialty','preparationRows':len(education),'preparationDetailed':sum(e['occupationType']=='Line item' for e in education.values()),'pathways':len(result),'selectedPathwayExamples':sum(map(len,result.values())),'uniqueWageGroups':len({r['soc'] for rows in result.values() for r in rows}),'missingWageExamples':issues,'joinChecks':'Exact base O*NET code must exist in the pathway CIP links; detailed BLS SOC must exist; unique wage SOC within each pathway; no national/state fallback','staging':'Graduate education or a reviewed graduate credential requirement before related-experience stage, otherwise qualifying-route. Qualifications, licensing and training remain explicit; national typical preparation is not a guarantee.','rangeMeaning':'Min/max of selected examples only. No weighting, earnings probability, degree estimate or time progression. Missing/zero/suppressed wages are unknown, never zero.','inputs':meta['inputs'],'adoptionException':'User requests A1 unchanged. Additive public preparation release 1.2.0 adopted only by A2; A1 remains on 1.0.4. No A1 files, builds or deployment touched.'}
(ROOT/'artifacts').mkdir(exist_ok=True)
(ROOT/'artifacts/earnings-data-audit.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({k:v for k,v in receipt.items() if k not in ['inputs','missingWageExamples']}));print(json.dumps(issues))
