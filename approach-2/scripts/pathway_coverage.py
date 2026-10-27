"""App-owned, auditable college exploration policy; never an official O*NET taxonomy."""
import hashlib
import json

ADDITIONAL_IDS = frozenset({'engineering','applied-technology','construction','transport','public-service','legal','health-professional','human-services','faith','interdisciplinary'})

POSTSECONDARY = {
    'Some college, no degree', 'Postsecondary nondegree award', "Associate's degree",
    "Bachelor's degree", "Master's degree", 'Doctoral or professional degree',
}

# Existing IDs stay stable so saved shortlists and student notes survive expansion.
EXTRA_SPECS = [
    ('engineering', 'Engineering across science & systems', 'technology', ['14.'], [4,5,2,1,1,3],
     'Explore engineering foundations before choosing a physical, chemical or biological specialty.',
     ['Calculus & physics', 'Engineering design', 'Materials or chemistry', 'Systems modeling'],
     'Compare an introductory project from two different engineering departments.',
     'Compare aerospace, chemical, biomedical and other engineering degree plans.',
     'Usually a bachelor’s; research and professional roles can need more preparation',
     'These are distinct engineering degrees. Accreditation, prerequisites and professional licensing must be checked for the chosen specialty.'),
    ('applied-technology', 'Engineering technology, manufacturing & repair', 'technology', ['15.','41.','47.','48.'], [5,3,2,1,1,4],
     'Learn through equipment, practical problem-solving and making systems work.',
     ['Applied mathematics', 'Technical drawings', 'Equipment & measurement', 'Safety & hands-on labs'],
     'Visit a technical college lab and try a supervised introductory project.',
     'Compare engineering technology, manufacturing and equipment-service programs.',
     'College certificate, associate or bachelor’s options; apprenticeships also exist',
     'Engineering technology, engineering degrees and individual repair trades are separate routes. A broad grouping does not make their credentials interchangeable.'),
    ('construction', 'Construction & building systems', 'technology', ['46.'], [5,3,2,1,2,3],
     'Explore how buildings are built, installed, maintained and coordinated.',
     ['Construction methods', 'Plans & measurement', 'Building systems', 'Safety & project coordination'],
     'Tour a college building-trades lab or compare two supervised introductory workshops.',
     'Compare construction management, building-trades certificates and apprenticeships.',
     'Certificates, associate degrees and some bachelor’s routes; trade rules vary',
     'Many trades also have noncollege apprenticeships. Electrical, plumbing and other regulated work have separate training, experience and licensing requirements.'),
    ('transport', 'Aviation, transportation & mobility', 'technology', ['49.'], [5,3,1,2,2,4],
     'Explore the systems and practical skills that move people and goods.',
     ['Transport systems', 'Navigation or logistics', 'Safety & regulation', 'Applied technical practice'],
     'Visit an aviation or transportation program and ask about supervised practice.',
     'Compare aviation, maritime and other transportation programs by credential and total cost.',
     'Certificates and degrees vary; specific licenses and experience may be required',
     'Pilot, maritime and ground-transport routes are different qualifications. Flight hours, medical requirements and specialist training can add substantial preparation.'),
    ('public-service', 'Public safety, security & service', 'people', ['28.','29.','43.'], [4,3,1,4,3,4],
     'Explore protecting communities, responding to problems and serving the public.',
     ['Public institutions', 'Emergency planning', 'Ethics & communication', 'Applied safety or security'],
     'Ask a college public-service program how classroom study connects to supervised practice.',
     'Compare emergency management, criminal justice, security and service-related study.',
     'Certificates through graduate degrees; agency and military routes differ',
     'A degree alone does not qualify someone for a sworn, military or emergency-response role. Agencies can require selection, academies, service experience and other credentials.'),
    ('legal', 'Law, legal support & justice', 'business', ['22.'], [1,4,3,3,4,4],
     'Explore how rules, evidence and advocacy help people navigate institutions.',
     ['Legal research', 'Writing & argument', 'Public institutions', 'Ethics & case analysis'],
     'Read a short public case summary and compare the arguments on each side.',
     'Compare legal-support programs and bachelor’s routes that build a foundation for later law study.',
     'Legal-support certificates or degrees; legal practice generally needs professional study',
     'Paralegal preparation and qualification as a lawyer are different routes. Law school, admission and professional licensing need separate review.'),
    ('health-professional', 'Health science, services & professional care', 'health', ['51.','60.','61.'], [2,5,1,5,2,3],
     'Explore health foundations, support services and possible later clinical study.',
     ['Human biology', 'Chemistry & health science', 'Communication & ethics', 'Evidence & care systems'],
     'Compare an introductory health-science class with a health-services program open day.',
     'Compare health-service credentials and the undergraduate prerequisites for specific professional programs.',
     'Certificates through professional degrees; residencies are later training',
     'Medicine, dentistry, pharmacy and other clinical professions require specific professional routes. Residency and fellowship programs are after professional qualification, not first college majors.'),
    ('human-services', 'Human sciences & personal services', 'people', ['12.03','12.04','19.'], [3,2,3,5,2,3],
     'Explore practical services, family needs and the details that shape everyday life.',
     ['Human needs & development', 'Service practice', 'Communication', 'Safety or consumer studies'],
     'Compare two college service programs and ask students what their practical classes involve.',
     'Compare family and consumer sciences, personal-care and funeral-service program requirements.',
     'College certificates, associate and bachelor’s routes vary by service',
     'Personal care, funeral service and human-science programs prepare for different work. Regulated services have their own approved programs and licensing requirements.'),
    ('faith', 'Religion, ministry & community leadership', 'people', ['39.'], [1,3,3,5,3,2],
     'Explore religious study, community care and service within a tradition.',
     ['Religious texts & history', 'Ethics', 'Community care', 'Communication & leadership'],
     'Compare an academic religious-studies course with a ministry-oriented program.',
     'Ask how a program’s tradition, award and placements connect to the work you want to explore.',
     'Undergraduate and graduate routes; traditions set additional expectations',
     'Academic religious studies and preparation for religious leadership are distinct. Ordination and other recognition depend on the relevant religious organization.'),
    ('interdisciplinary', 'Interdisciplinary studies & discovery', 'science', ['30.'], [2,4,3,3,2,3],
     'Connect subjects and learn how different ways of thinking can address one question.',
     ['Research methods', 'Two connected subjects', 'Evidence & communication', 'Integrative projects'],
     'Choose a question that needs two subjects and compare how each would approach it.',
     'Compare the actual subject combination, depth and graduate-study prerequisites in each program.',
     'Often a bachelor’s foundation; specialist destinations can need graduate study',
     'Interdisciplinary programs contain very different combinations. A shared label is not a common qualifying degree; inspect the actual curriculum and destination requirements.'),
]

EXTENSIONS = {
    'nursing': ['51.38','51.39'], 'media': ['10.'], 'society': ['05.'],
    'humanities': ['25.'], 'hospitality': ['12.05'], 'movement': ['19.05'],
    'design': ['19.06','19.09'],
}
FAMILY_REMAINDERS = {'11':'it','12':'hospitality','31':'movement','44':'society','50':'arts','52':'management'}
FALLBACKS = {
    '25-3031.00': ('education', 'BLS classifies short-term substitute teaching as typically bachelor’s-level; check school-system rules.'),
    '25-3041.00': ('education', 'BLS lists some college, no degree; tutoring has varied subjects and settings.'),
    '29-2099.08': ('health-professional', 'Broader BLS SOC 29-2099 lists a postsecondary nondegree award; verify patient-representative requirements specifically.'),
    '41-9031.00': ('engineering', 'BLS lists a bachelor’s degree for sales engineers; engineering foundations are an editorial exploration connection, not an official program link.'),
}


def expand_specs(specs):
    """Add broad study families; remaining program codes are assigned only once."""
    result = []
    for spec in specs:
        values = list(spec)
        values[3] = list(values[3]) + EXTENSIONS.get(values[0], [])
        if values[0] == 'hospitality':
            values[1] = 'Hospitality, culinary arts & events'
            values[10] += ' Culinary programs and hospitality management have different practical and academic requirements.'
        result.append(tuple(values))
    return result + EXTRA_SPECS


def group_programs(specs, links):
    # Existing specific groups retain their links; broad additions collect remaining
    # codes only, so e.g. electrical engineering does not become a second generic major.
    claimed = set()
    grouped = {}
    for spec in specs:
        id, _, _, prefixes, *_ = spec
        selected = [l for l in links if any(l['cip'].startswith(p) for p in prefixes)
                    and (id not in ADDITIONAL_IDS or l['cip'] not in claimed)]
        grouped[id] = selected
        claimed.update(l['cip'] for l in selected)
    for link in links:
        if link['cip'] not in claimed:
            target = FAMILY_REMAINDERS.get(link['cip'][:2])
            assert target, ('Unassigned CIP program', link['cip'], link['program'])
            grouped[target].append(link)
    return grouped


def apply_coverage(root, occupations, paths, links):
    prep_source = json.loads((root/'shared-data/education/bls-preparation-2025.json').read_text())
    prep = {r['soc']: r for r in prep_source['records'] if r['occupationType'] == 'Line item'}
    reviewed = {r['soc']: r for r in json.loads((root/'shared-data/education/catalog-education.json').read_text())}
    linked = {l['soc'] for l in links}
    college = {c for c in occupations if prep.get(c[:7], {}).get('education') in POSTSECONDARY}
    relevant = linked | college
    by_id = {p['id']: p for p in paths}
    missing = relevant - {c for p in paths for c in p['occupations']}
    assert missing == set(FALLBACKS), ('Review changed unlinked postsecondary occupations', sorted(missing))
    for code in sorted(missing):
        target, note = FALLBACKS[code]
        by_id[target]['occupations'].append(code)
        by_id[target].setdefault('editorialConnections', []).append({'soc': code, 'basis': note, 'source': prep_source['source']})
    for p in paths:
        p['occupations'] = sorted(set(p['occupations']))
        for program in p['programs']:
            program['stage'] = 'post-professional' if program['cip'].startswith(('60.','61.')) or 'residency' in program['title'].lower() or 'fellowship' in program['title'].lower() else 'program'
        p['directOccupations'] = sorted({c for program in p['programs'] for c in program['occupations']})
    records = {}
    for code, occupation in occupations.items():
        e = prep.get(code[:7])
        note = reviewed.get(code, {})
        preparation = None if not e else {k: e[k] for k in ['soc','title','education','experience','training']}
        if preparation:
            preparation.update({'source': e.get('ooh') or prep_source['source'], 'mapping': 'base-SOC typical preparation; specialty requirements can differ'})
            occupation['preparation'] = preparation
        advanced = note.get('level') == 'graduate' or (e and e['education'] in ["Master's degree", 'Doctoral or professional degree'])
        occupation['stage'] = 'further-study' if advanced else 'experience' if e and e['experience'] not in ['None','—'] else 'qualifying-route' if e else 'unknown'
        occupation['connectionBasis'] = 'official-cip' if code in linked else 'editorial-bls' if code in relevant else 'source-only'
        basis = ['official-cip'] if code in linked else []
        if code in college: basis.append('bls-postsecondary')
        memberships = [p['id'] for p in paths if code in p['occupations']]
        records[code] = {'title': occupation['title'], 'included': code in relevant, 'basis': basis,
                         'pathways': memberships, 'typicalEducation': e['education'] if e else None,
                         'exclusionReason': None if code in relevant else 'No direct CIP link or postsecondary typical-entry classification in the pinned sources; retained in the full inventory.'}
    mapped = {c for p in paths for c in p['occupations']}
    assert mapped == relevant and all(records[c]['pathways'] for c in relevant)
    report = {
        'schemaVersion': 1, 'date': '2026-10-23', 'policyVersion': 'college-exploration-1',
        'definition': 'An official CIP-to-O*NET program link OR BLS typical entry education of some college, a postsecondary award, an associate, bachelor’s, master’s or doctoral/professional degree. This is Fieldguide’s inclusive exploration policy, not an official universal definition of college relevance.',
        'counts': {'sourceOccupations': len(occupations), 'officialProgramLinked': len(linked), 'blsPostsecondary': len(college),
                   'collegeRelevant': len(relevant), 'mapped': len(mapped), 'editorialOnly': len(missing),
                   'sourceOnly': len(occupations)-len(relevant), 'pathways': len(paths), 'unmappedRelevant': 0},
        'sources': [{'file': name, 'sha256': hashlib.sha256((root/name).read_bytes()).hexdigest()}
                    for name in ['.cache/Education_CIP_to_ONET_SOC.xlsx','shared-data/education/bls-preparation-2025.json']],
        'links': {'crosswalk': 'https://www.onetcenter.org/crosswalks.html', 'preparation': prep_source['source'],
                  'educationDefinitions': 'https://www.bls.gov/emp/documentation/education/tech.htm'},
        'limitations': ['CIP links can describe certificates, degrees or later professional training, not a shared qualifying credential.',
                       'BLS education is typical entry at the base SOC, not a specialty-specific licensing determination.',
                       'Source-only does not mean college is useless or inaccessible for that occupation.',
                       'Missing descriptors and suppressed values stay unknown. Occupational wage examples are not degree earnings.'],
        'occupations': records,
    }
    return report
