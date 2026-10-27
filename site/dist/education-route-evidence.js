// Supplementary named program budgets. These do not replace other schools’ fees.
export const educationRouteEvidence={
"nursing":{
  "institution": "Austin Community College",
  "program": "Traditional Associate Degree Nursing (AAS)",
  "academicYear": "Undated published program-expense sheet, accessed 2026-10-18",
  "status": "published_estimated_program_expenses_plus_separate_living_scenario",
  "duration": {
    "months": 36
  },
  "amounts": {
    "listedProgramResident": {
      "value": 9724,
      "currency": "USD",
      "scope": "Published in-district total including listed supplies, exams and initial credential fees; excludes living, variable health insurance and unlisted immunizations."
    },
    "listedProgramTuitionExempt": {
      "value": 4624,
      "currency": "USD",
      "scope": "Published tuition-exempt local-high-school cohort example. Eligibility and three-year tuition-exemption window apply; not automatically assumed."
    },
    "listedProgramOutOfDistrict": {
      "value": 21784,
      "currency": "USD"
    }
  },
  "sourceURLs": [
    "https://sites.austincc.edu/health/program-costs/",
    "https://drive.google.com/file/d/0B_scpI8I3A-IN3FRQUp2cUF1VDA/view",
    "https://sites.austincc.edu/health/rnsg/apply/traditional/"
  ],
  "checkedAt": "2026-10-18",
  "sourcePDFSHA256": "ce25df0aa6c43603ebe33ac7d4d11552e788d6148950a1da4e40f05d6b4a2ecc",
  "limitations": [
    "Named in-district example, not a guaranteed future bill. The undated sheet lists 2024\u20132028 local high-school tuition-exemption cohorts. Its exam names/fees can differ from current admissions instructions.",
    "Health insurance is marked variable; immunizations may cost extra. The total below adds an explicit planning allowance rather than calling these free.",
    "Three-year scenario allows one year for prerequisites and four nursing semesters; admissions delays may add time. Corequisites may overlap."
  ]
},
"emt":{
  "institution": "Austin Community College",
  "program": "EMT Basic Certificate",
  "academicYear": "Undated published program-expense sheet, accessed 2026-10-18",
  "status": "published_estimated_program_expenses_plus_separate_living_scenario",
  "duration": {
    "months": 4
  },
  "amounts": {
    "listedProgramResident": {
      "value": 1911,
      "currency": "USD",
      "scope": "Published in-district total including listed supplies, exams and initial credential fees; excludes living, variable health insurance and unlisted immunizations."
    },
    "listedProgramTuitionExempt": {
      "value": 1401,
      "currency": "USD",
      "scope": "Published tuition-exempt local-high-school cohort example. Eligibility and three-year tuition-exemption window apply; not automatically assumed."
    },
    "listedProgramOutOfDistrict": {
      "value": 3117,
      "currency": "USD"
    }
  },
  "sourceURLs": [
    "https://sites.austincc.edu/health/program-costs/",
    "https://drive.google.com/file/d/0B_scpI8I3A-IcW0wR3JqRU43VTg/view",
    "https://sites.austincc.edu/health/emsp/faq/"
  ],
  "checkedAt": "2026-10-18",
  "sourcePDFSHA256": "1f9988b39fd7d0aa923732c9ce06315c653ad0bdfb702e54a84a629b2ca9b838",
  "limitations": [
    "Named in-district example, not a guaranteed future bill. The undated sheet lists 2024\u20132028 local high-school tuition-exemption cohorts. Its exam names/fees can differ from current admissions instructions.",
    "Health insurance is marked variable; immunizations may cost extra. The total below adds an explicit planning allowance rather than calling these free.",
    "Four-month fall/spring planning scenario; summer is an 11-week alternative. Age 18 is required by ACC on the first day. Certification and clinical requirements remain."
  ]
},
  "electrician": {
    "institution": "Austin Community College",
    "program": "Construction Management – Electrical Specialization Level 1 Certificate",
    "academicYear": "2026–2027",
    "period": "Listed 25-credit, two-semester award plan",
    "status": "derived_from_current_published_rates_and_award_plan",
    "label": "ACC electrical certificate: about $2,300 in tuition and listed course fees",
    "programCredits": 25,
    "duration": {
      "semesters": 2
    },
    "amounts": {
      "tuitionResident": {
        "value": 1675,
        "currency": "USD",
        "unit": "listed certificate",
        "label": "In-district tuition",
        "scope": "25 × $67"
      },
      "mandatoryCreditFees": {
        "value": 450,
        "currency": "USD",
        "unit": "listed certificate",
        "label": "General, success, and sustainability fees",
        "scope": "25 × ($15 + $2 + $1)"
      },
      "listedCourseFees": {
        "value": 150,
        "currency": "USD",
        "unit": "listed certificate",
        "label": "Three course fees",
        "scope": "CNBT1411, ELPT1345, ELPT1371: $50 each"
      },
      "tuitionAndListedFeesResident": {
        "value": 2275,
        "currency": "USD",
        "unit": "listed certificate",
        "label": "In-district tuition and listed fees",
        "scope": "Listed 25-credit award plan; excludes books, tools, living, license, and any extra prerequisite"
      },
      "apprenticeLicense": {
        "value": 20,
        "currency": "USD",
        "unit": "initial application",
        "label": "Texas electrical apprentice license",
        "scope": "Required before program enrollment; one-year license, renewal separate"
      }
    },
    "sourceURLs": [
      "https://www6.austincc.edu/cms/site/www/awardplans/awardplan.php?apid=10606&group=PCBCT&nid=31282&type=CC&year=2027",
      "https://catalog.austincc.edu/college-entry/paying-for-college/tuition-rates-and-fees/",
      "https://www6.austincc.edu/cms/site/www/catalog/catalog.php?cat=2027&group=PCBCT&nid=31282&type=CC",
      "https://www.tdlr.texas.gov/electricians/apply/individuals/apprentice-electrician.htm",
      "https://www.tdlr.texas.gov/electricians/apply/individuals/journeyman-electrician.htm"
    ],
    "checkedAt": "2026-10-17",
    "note": "Use as a named optional college preparation route alongside paid supervised training. A certificate does not itself grant journeyman licensure.",
    "limitations": [
      "Listed-plan estimate, not a complete electrician licensing route cost. Journeyman supervised work requirements remain separate.",
      "ACC course description lists ELPT1325 as an ELPT1380 co-op prerequisite although it is absent from the 25-credit award plan. Keep $2,275 labeled as the listed-plan tuition/fee calculation, not a guaranteed final bill.",
      "Tools, books, recurring license renewals, and living costs are separate. Do not replace the paid apprenticeship timeline with the certificate duration."
    ],
    "alternativePublishedHistoricalBenchmark": {
      "institution": "Austin Electrical Training Alliance",
      "academicYear": "September 2025–August 2026",
      "tuitionPerApprenticeYear": 825,
      "legacyFifthYearTuition": 250,
      "applicationFee": 35,
      "sourceURLs": [
        "https://austineta.org/tuition-for-september-2025/",
        "https://austineta.org/apprentice-program-2/",
        "https://austineta.org/application-deadline-for-mid-term-january-2026-classes/"
      ],
      "note": "2026–27 tuition not publicly posted on checked pages. $35 is application only; do not headline it as training tuition. Do not label $825 as a verified 2026–27 rate."
    }
  },
  "physical-therapy": {
    "institution": "UT Southwestern Medical Center",
    "program": "Doctor of Physical Therapy",
    "academicYear": "2026–2027 page heading",
    "period": "Three published program-year budgets; 31-month DPT",
    "status": "published_estimated_COA_with_stale_footer_date",
    "label": "Texas public DPT example: about $43K tuition and fees; $157K including living",
    "programCredits": 96,
    "duration": {
      "months": 31
    },
    "amounts": {
      "tuitionFeesResident": {
        "value": 42542,
        "currency": "USD",
        "unit": "DPT only",
        "label": "Texas-resident tuition and fees",
        "scope": "Sum of three published rows"
      },
      "totalCOAResident": {
        "value": 157309,
        "currency": "USD",
        "unit": "DPT only",
        "label": "Texas-resident full attendance budget",
        "scope": "Published rows including living, books, insurance, transport, technology, exam, and loan-fee allowances"
      },
      "tuitionFeesNonresident": {
        "value": 81422,
        "currency": "USD",
        "unit": "DPT only",
        "label": "Nonresident tuition and fees",
        "scope": "Sum of three published rows"
      },
      "totalCOANonresident": {
        "value": 196189,
        "currency": "USD",
        "unit": "DPT only",
        "label": "Nonresident full attendance budget",
        "scope": "Sum of three published rows"
      }
    },
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 18747,
        "tuitionFeesNonresident": 36162,
        "totalCOAResident": 64334,
        "totalCOANonresident": 81749
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 16445,
        "tuitionFeesNonresident": 32240,
        "totalCOAResident": 59382,
        "totalCOANonresident": 75177
      },
      {
        "programYear": 3,
        "tuitionFeesResident": 7350,
        "tuitionFeesNonresident": 13020,
        "totalCOAResident": 33593,
        "totalCOANonresident": 39263
      }
    ],
    "sourceURLs": [
      "https://www.utsouthwestern.edu/education/students/financial-aid/cost-of-attendance/health-professions/",
      "https://shp.utsouthwestern.edu/programs/physical-therapy/curriculum/",
      "https://shp.utsouthwestern.edu/programs/physical-therapy/costs.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "Named Dallas program example. Undergraduate preparation is additional. Program curriculum states graduates qualify to sit the licensing exam.",
    "limitations": [
      "The financial aid page heading says 2026–2027, while its footer dates estimates March 14, 2025. Retain both dates in source metadata.",
      "Undated program marketing page separately estimates $49,500 resident tuition, fees and books. Use the itemized aid-office budget for the model; do not combine both.",
      "Sum holds today's published year-specific budgets constant; it is not a guaranteed future cohort price. Dallas study living costs do not replace Austin career lifestyle costs."
    ]
  },
  "physician": {
    "institution": "University of Texas Rio Grande Valley School of Medicine",
    "program": "Doctor of Medicine",
    "academicYear": "2026–2027",
    "period": "Four published MD program-year budgets",
    "status": "published_estimated_COA_and_derived_route_sum",
    "label": "Texas public MD example: about $90K tuition and fees; $240K including living",
    "duration": {
      "years": 4
    },
    "amounts": {
      "tuitionFeesResident": {
        "value": 88398,
        "currency": "USD",
        "unit": "MD only",
        "label": "Texas-resident tuition and fees",
        "scope": "Sum of MS1–MS4 published 2026–27 rows"
      },
      "totalCOAResident": {
        "value": 240919,
        "currency": "USD",
        "unit": "MD only",
        "label": "Texas-resident off-campus attendance budget",
        "scope": "Sum of MS1–MS4 rows including education and living"
      },
      "tuitionFeesNonresident": {
        "value": 140798,
        "currency": "USD",
        "unit": "MD only",
        "label": "Nonresident tuition and fees",
        "scope": "Sum of MS1–MS4 rows"
      },
      "totalCOANonresident": {
        "value": 293319,
        "currency": "USD",
        "unit": "MD only",
        "label": "Nonresident off-campus attendance budget",
        "scope": "Sum of MS1–MS4 rows"
      },
      "totalCOAResidentLivingWithFamily": {
        "value": 199461,
        "currency": "USD",
        "unit": "MD only",
        "label": "Texas-resident living-with-family budget",
        "scope": "Sum of MS1–MS4 rows"
      }
    },
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 22372,
        "tuitionFeesNonresident": 35472,
        "totalCOAResident": 61617,
        "totalCOANonresident": 74717,
        "totalCOAResidentLivingWithFamily": 50372
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 22372,
        "tuitionFeesNonresident": 35472,
        "totalCOAResident": 53205,
        "totalCOANonresident": 66305,
        "totalCOAResidentLivingWithFamily": 43721
      },
      {
        "programYear": 3,
        "tuitionFeesResident": 21827,
        "tuitionFeesNonresident": 34927,
        "totalCOAResident": 64585,
        "totalCOANonresident": 77685,
        "totalCOAResidentLivingWithFamily": 53340
      },
      {
        "programYear": 4,
        "tuitionFeesResident": 21827,
        "tuitionFeesNonresident": 34927,
        "totalCOAResident": 61512,
        "totalCOANonresident": 74612,
        "totalCOAResidentLivingWithFamily": 52028
      }
    ],
    "sourceURLs": [
      "https://www.utrgv.edu/som/admissions/tuition-and-financial-aid/cost-of-attendance/index.htm",
      "https://www.utrgv.edu/programs/ume-doctor-of-medicine.htm"
    ],
    "checkedAt": "2026-10-17",
    "note": "Named Rio Grande Valley public MD budget. Add undergraduate preparation separately, then paid residency and any fellowship; it is not Dell Medical School's COA.",
    "limitations": [
      "Current-year MS1–MS4 budget sum, not an exact forecast for one future cohort. Future tuition increases and aid are not assumed.",
      "COA is a school planning budget, not the amount borrowed. Subtract grants, contributions, and earnings before calculating borrowing.",
      "Do not add the lifestyle module's full living costs on top of a COA already including living.",
      "MD study location budget and eventual Austin living budget are separate stages."
    ]
  }
};
