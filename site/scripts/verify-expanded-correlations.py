import json,math
p='dist/expanded-calibration.json';d=json.load(open(p));count=0;errors=[]
for s in d['students']:
 a=s['rawScores']
 for c in s['allCareerComparisons']:
  b=c['vector'];actual=c['r']
  if actual is None:continue
  n=6;num=n*sum(x*y for x,y in zip(a,b))-sum(a)*sum(b);den=math.sqrt((n*sum(x*x for x in a)-sum(a)**2)*(n*sum(y*y for y in b)-sum(b)**2));r=num/den;count+=1
  if abs(r-actual)>1e-10:errors.append([s['id'],c['id'],r,actual])
d['independentCorrelationCheck']={'method':'Python sums/products formula independent from runtime centered-vector implementation','comparisons':count,'errors':errors}
for p in ['dist/expanded-calibration.json','validation/expanded-calibration-2026-10-17.json']:open(p,'w').write(json.dumps(d,indent=2)+'\n')
print(json.dumps({'comparisons':count,'errors':len(errors)}));assert not errors
