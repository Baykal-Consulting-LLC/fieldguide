// Named Texas public program cost evidence, reviewed October16–17,2026. Scope and period stay attached.
export const educationCostEvidence = {
  "physician": {
    "institution": "UT Austin Dell Medical School",
    "program": "Doctor of Medicine (MD)",
    "academicYear": "2026–2027; entering class of 2026",
    "period": "One medical-school academic year",
    "status": "published",
    "label": "Published medical-school tuition & required fees",
    "amounts": {
      "tuitionFeesResident": {
        "value": 22074,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & required fees",
        "scope": "One year, 2026 entering MD class"
      },
      "tuitionFeesNonresident": {
        "value": 37138,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & required fees",
        "scope": "One year, 2026 entering MD class"
      }
    },
    "note": "Medical school follows undergraduate preparation. These amounts exclude living costs and other attendance expenses. Paid residency follows medical school; attending pay is a later stage.",
    "sourceURLs": [
      "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/tuition-rates/",
      "https://catalog.utexas.edu/medical/tuition-fees/"
    ],
    "checkedAt": "2026-10-16",
    "requirementsSourceURLs": [
      "https://www.tmb.texas.gov/file/physician-eligibility-checklist",
      "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm"
    ],
    "limitations": [
      "Not a complete MD cost-of-attendance quote.",
      "Not the price of undergraduate study, residency, or an MD/MBA.",
      "Typical residency length differs from the Texas legal minimum postgraduate training requirement."
    ]
  },
  "dentist": {
    "institution": "UTHealth Houston School of Dentistry",
    "program": "Doctor of Dental Surgery (DDS)",
    "academicYear": "2026–2027",
    "period": "First professional program year; later-year rows separately supplied",
    "status": "published",
    "label": "Published dental-school cost of attendance",
    "amounts": {
      "tuitionResident": {
        "value": 36662,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition only",
        "scope": "One DDS program year; excludes required fees and living expenses"
      },
      "tuitionNonresident": {
        "value": 57804,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition only",
        "scope": "One DDS program year; excludes required fees and living expenses"
      },
      "firstYearTotalResident": {
        "value": 95020,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident first-year total before aid",
        "scope": "Published first-year COA, including living and educational allowances"
      },
      "firstYearTotalNonresident": {
        "value": 116162,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident first-year total before aid",
        "scope": "Published first-year COA, including living and educational allowances"
      },
      "firstYearBooksSupplies": {
        "value": 12506,
        "currency": "USD",
        "unit": "USD",
        "label": "First-year books & supplies",
        "scope": "Included in first-year total"
      },
      "firstYearLiving": {
        "value": 35076,
        "currency": "USD",
        "unit": "USD",
        "label": "First-year living allowance",
        "scope": "Included in first-year total"
      }
    },
    "note": "This is a Houston dental-school example after prerequisite college study. Later years cost different amounts. Do not multiply the first-year budget by four.",
    "sourceURLs": [
      "https://www.uth.edu/sfs/documents/2627_Budgets_UT_Updated%20(002).pdf",
      "https://www.uth.edu/sfs/cost-of-attendance.htm"
    ],
    "checkedAt": "2026-10-16",
    "yearRows": [
      {
        "programYear": 1,
        "tuitionResident": 36662,
        "totalResident": 95020,
        "totalNonresident": 116162,
        "livingAllowance": 35076,
        "unit": "USD per program year",
        "scope": "Published 2026–27 attendance budget before aid; program years have different costs."
      },
      {
        "programYear": 2,
        "tuitionResident": 36662,
        "totalResident": 90696,
        "totalNonresident": 111838,
        "livingAllowance": 35076,
        "unit": "USD per program year",
        "scope": "Published 2026–27 attendance budget before aid; program years have different costs."
      },
      {
        "programYear": 3,
        "tuitionResident": 36662,
        "totalResident": 86928,
        "totalNonresident": 108070,
        "livingAllowance": 35076,
        "unit": "USD per program year",
        "scope": "Published 2026–27 attendance budget before aid; program years have different costs."
      },
      {
        "programYear": 4,
        "tuitionResident": 36662,
        "totalResident": 81379,
        "totalNonresident": 102521,
        "livingAllowance": 29230,
        "unit": "USD per program year",
        "scope": "Published 2026–27 attendance budget before aid; program years have different costs."
      }
    ],
    "requirementsSourceURLs": [
      "https://catalog.uth.edu/dentistry/programs/doctor-dental-surgery/",
      "https://tsbde.texas.gov/licensing/dentists/dentist-license-by-exam/"
    ],
    "limitations": [
      "Houston training example, not an Austin living estimate.",
      "Current-year rows are not a guaranteed price for a future four-year cohort.",
      "Costs exclude undergraduate preparation.",
      "The bursar fee table and financial-aid COA use differing fee/insurance allowance totals; use the published COA total without mixing components from the other table."
    ]
  },
  "law": {
    "institution": "UT Austin School of Law",
    "program": "Juris Doctor (JD)",
    "academicYear": "2026–2027",
    "period": "Nine months, fall and spring; first year",
    "status": "published",
    "label": "Published first-year law-school budget",
    "amounts": {
      "tuitionFeesResident": {
        "value": 38236,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees",
        "scope": "First-year fall and spring"
      },
      "tuitionFeesNonresident": {
        "value": 56822,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees",
        "scope": "First-year fall and spring"
      },
      "totalResident": {
        "value": 63899,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident total before aid",
        "scope": "Nine-month first-year attendance budget"
      },
      "totalNonresident": {
        "value": 82485,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident total before aid",
        "scope": "Nine-month first-year attendance budget"
      }
    },
    "note": "The JD is an additional stage after undergraduate preparation. Summer living and variable bar/licensure costs are outside this nine-month total.",
    "sourceURLs": [
      "https://law.utexas.edu/financial-aid/cost-of-attendance/"
    ],
    "checkedAt": "2026-10-16",
    "yearRows": [
      {
        "stage": "Continuing 2L/3L",
        "tuitionFeesResident": 36598,
        "tuitionFeesNonresident": 54384,
        "totalResident": 62261,
        "totalNonresident": 80047,
        "unit": "USD per nine-month academic year",
        "scope": "Normal 28-credit annual load; published continuing-student budget"
      }
    ],
    "limitations": [
      "Not a whole-JD price.",
      "Summer non-enrollment living, variable licensure costs and insurance adjustments can add costs."
    ]
  },
  "pharmacy": {
    "institution": "UT Austin College of Pharmacy",
    "program": "Doctor of Pharmacy (PharmD)",
    "academicYear": "2026–2027",
    "period": "Fall and spring at 12 or more credits each semester",
    "status": "derived",
    "label": "Derived two-semester professional tuition",
    "amounts": {
      "tuitionResidentPerSemester": {
        "value": 11265,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident semester tuition",
        "scope": "Published 12+ credit professional PharmD rate"
      },
      "tuitionNonresidentPerSemester": {
        "value": 25831,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident semester tuition",
        "scope": "Published 12+ credit professional PharmD rate"
      },
      "fallSpringTuitionResident": {
        "value": 22530,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident fall + spring tuition",
        "scope": "Derived: 2 × $11,265; excludes summer and living"
      },
      "fallSpringTuitionNonresident": {
        "value": 51662,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident fall + spring tuition",
        "scope": "Derived: 2 × $25,831; excludes summer and living"
      }
    },
    "note": "The professional PharmD uses different tuition from a bachelor’s degree. P2 and P3 include required summer study. Living costs, supplies, travel and insurance add costs.",
    "sourceURLs": [
      "https://catalog.utexas.edu/general-information/registration-tuition-and-fees/tuition-and-fees/tables-tuition-for-fall-and-spring/",
      "https://pharmacy.utexas.edu/apply/pharmd/tuition"
    ],
    "checkedAt": "2026-10-16",
    "limitations": [
      "The annual tuition subtotal is arithmetic from two published semester rates, not a published whole-year COA.",
      "Required summer enrollment is excluded.",
      "Not a four-year total or a quote for another pharmacy degree."
    ]
  },
  "physician-assistant": {
    "institution": "University of Texas Medical Branch (UTMB), Galveston",
    "program": "Physician Assistant Studies",
    "academicYear": "Not stated on program-cost page",
    "period": "Program Year 1 and Year 2",
    "status": "undated",
    "label": "Published program estimate · price year not stated",
    "amounts": {
      "year1TuitionFeesResident": {
        "value": 27904,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident year-one tuition & fees",
        "scope": "Program estimate; price year unspecified"
      },
      "year2TuitionFeesResident": {
        "value": 27001,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident year-two tuition & fees",
        "scope": "Program estimate; price year unspecified"
      },
      "year1TuitionFeesNonresident": {
        "value": 52032,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident year-one tuition & fees",
        "scope": "Program estimate; price year unspecified"
      },
      "year2TuitionFeesNonresident": {
        "value": 52058,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident year-two tuition & fees",
        "scope": "Program estimate; price year unspecified"
      }
    },
    "note": "Graduate PA preparation follows prerequisite college study. The program separately lists health insurance, housing, supplies, transport and course expenses. Tuition is not the full cost.",
    "sourceURLs": [
      "https://www.utmb.edu/som/physician-assistant/program-overview/program-costs"
    ],
    "checkedAt": "2026-10-16",
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 27904,
        "tuitionFeesNonresident": 52032,
        "housingFoodEstimate": 22000,
        "healthInsuranceEstimate": 3500,
        "unit": "USD per program year",
        "scope": "Published program estimates; housing and insurance are additional to tuition/fees"
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 27001,
        "tuitionFeesNonresident": 52058,
        "housingFoodEstimate": 23500,
        "healthInsuranceEstimate": 4100,
        "unit": "USD per program year",
        "scope": "Published program estimates; housing and insurance are additional to tuition/fees"
      }
    ],
    "limitations": [
      "No explicit academic price year; do not label 2026–27.",
      "Not a full attendance total.",
      "Galveston program example, not Austin cost of living."
    ]
  },
  "occupational-therapy": {
    "institution": "University of Texas Medical Branch (UTMB), Galveston",
    "program": "Entry-level Doctor of Occupational Therapy (OTD)",
    "academicYear": "2025–2026 rates; page updated February 13, 2026",
    "period": "Three program years, separately listed",
    "status": "old",
    "label": "Published OTD estimate · 2025–26 rates",
    "amounts": {
      "year1TuitionFeesResident": {
        "value": 22968.72,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident year-one tuition & fees",
        "scope": "Source annual row, 2025–26 rate basis"
      },
      "year2TuitionFeesResident": {
        "value": 22128.72,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident year-two tuition & fees",
        "scope": "Source annual row, 2025–26 rate basis"
      },
      "year3TuitionFeesResident": {
        "value": 12048.72,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident year-three tuition & fees",
        "scope": "Source annual row, 2025–26 rate basis"
      }
    },
    "note": "These are older published program estimates, not full attendance budgets. The source total has conflicting course/lab fee inclusion, so only the clearly itemized annual rows are used.",
    "sourceURLs": [
      "https://www.utmb.edu/shp/academics/occt/costs"
    ],
    "checkedAt": "2026-10-16",
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 22968.72,
        "tuitionFeesNonresident": 45199.72,
        "unit": "USD per program year"
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 22128.72,
        "tuitionFeesNonresident": 43413.72,
        "unit": "USD per program year"
      },
      {
        "programYear": 3,
        "tuitionFeesResident": 12048.72,
        "tuitionFeesNonresident": 21981.72,
        "unit": "USD per program year"
      }
    ],
    "limitations": [
      "Not current 2026–27 rates.",
      "Living, books, supplies and insurance excluded.",
      "Source headline total $58,416.16 differs from resident annual-row sum $57,146.16 by $1,270, the separately listed course/lab fee amount; footer also says those fees excluded.",
      "Do not present a reconciled whole-program total as officially verified."
    ]
  },
  "physical-therapy": {
    "institution": "University of Texas Medical Branch (UTMB), Galveston",
    "program": "Doctor of Physical Therapy (DPT)",
    "academicYear": "2026–2027",
    "period": "One 12-credit semester example",
    "status": "published",
    "label": "Published DPT semester fee example",
    "amounts": {
      "tuitionFeesResident12Credit": {
        "value": 6271.74,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident 12-credit semester fees",
        "scope": "Includes listed one-time orientation/ID charges; distance fee varies"
      }
    },
    "note": "This illustrates one DPT semester. A complete DPT budget needs the actual sequence of semester credits, clinical travel, living, insurance and supplies.",
    "sourceURLs": [
      "https://www.utmb.edu/enrollmentservices/resources/studentaccounts/shp-dpt-fee-sheet-details",
      "https://www.utmb.edu/shp/academics/phyt/costs"
    ],
    "checkedAt": "2026-10-16",
    "limitations": [
      "Not an annual or full-program price.",
      "Not all DPT semesters use 12 credits.",
      "One-time fees must not be repeatedly multiplied.",
      "Residential DPT full-program financial fact sheet is linked by the institution but SharePoint denied audit access."
    ]
  },
  "clinical-psychologist": {
    "institution": "UT Austin Department of Psychology",
    "program": "Psychology PhD, including the department’s clinical training area",
    "academicYear": "Current funding page; award year not explicitly stated",
    "period": "Qualifying doctoral support for at least five years",
    "status": "funding",
    "label": "Published doctoral funding example",
    "amounts": {
      "annualStipendMinimum": {
        "value": 30000,
        "currency": "USD",
        "unit": "USD",
        "label": "Minimum annual stipend",
        "scope": "12-month stipend; qualifying departmental TA/GRA or fellowship funding"
      },
      "tuitionAssistancePerSemester": {
        "value": 4464,
        "currency": "USD",
        "unit": "USD",
        "label": "Published tuition assistance per semester",
        "scope": "Department page states full tuition assistance and gives this current amount"
      }
    },
    "note": "Doctoral education can be funded. UT Psychology describes TA/GRA support or fellowships, tuition assistance and eligible health coverage, contingent on satisfactory progress. This is not guaranteed funding at every psychology program.",
    "sourceURLs": [
      "https://cola.utexas.edu/psychology/graduate-program/prospective-graduate-students/funding.html"
    ],
    "checkedAt": "2026-10-16",
    "limitations": [
      "Funding terms depend on admission, satisfactory progress and appointment eligibility.",
      "The page does not identify an academic price year.",
      "Clinical licensing requires additional qualifying supervised training and examinations.",
      "A PhD funding package should not be modeled as an unfunded generic tuition bill multiplied by years."
    ]
  },
  "genericGraduate": {
    "institution": "UT Austin",
    "program": "General graduate reference; not a professional-program quote",
    "academicYear": "2026–2027",
    "period": "Fall and spring; 9 credits per semester; living away from parents",
    "status": "published",
    "label": "Published generic graduate budget",
    "amounts": {
      "tuitionResident": {
        "min": 8684,
        "max": 10554,
        "currency": "USD",
        "unit": "USD per fall/spring academic year",
        "label": "Texas resident tuition range",
        "scope": "Generic graduate reference at nine credits per semester"
      },
      "totalResident": {
        "min": 33252,
        "max": 35493,
        "currency": "USD",
        "unit": "USD per fall/spring academic year",
        "label": "Texas resident total before aid",
        "scope": "Published generic graduate COA with off/on-campus housing"
      }
    },
    "note": "Graduate and professional credentials add a separate education stage. This broad UT graduate reference is not the price of PA, PT, OT, MD, DDS, JD or PharmD programs.",
    "sourceURLs": [
      "https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/"
    ],
    "checkedAt": "2026-10-16",
    "limitations": [
      "Program-specific rates and summer enrollment differ.",
      "Funding/assistantships can change net cost.",
      "Not a whole-degree cost."
    ]
  },
  "veterinary": {
    "institution": "Texas Tech University School of Veterinary Medicine, Amarillo",
    "program": "Doctor of Veterinary Medicine (DVM)",
    "academicYear": "Program-budget price year not stated; current fee schedule covers 2026–2028",
    "period": "One professional program year; later-year budgets shown separately",
    "status": "undated",
    "label": "Published DVM program estimate · price year not stated",
    "amounts": {
      "tuitionFeesResident": {
        "value": 22000,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees estimate",
        "scope": "One DVM program year; published program estimate, not an exact bill"
      },
      "tuitionFeesNonresident": {
        "value": 32800,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees estimate",
        "scope": "One DVM program year; published program estimate, not an exact bill"
      },
      "firstYearTotalResident": {
        "value": 46660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident first-year total before aid",
        "scope": "Includes tuition/fees, books, housing, meals, transport and personal allowances"
      },
      "firstYearTotalNonresident": {
        "value": 57460,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident first-year total before aid",
        "scope": "Includes tuition/fees, books, housing, meals, transport and personal allowances"
      }
    },
    "note": "This is an Amarillo DVM training example after prerequisite college study. The current program page gives yearly estimates without naming their academic price year. Its fourth-year budget is higher, especially for clinical travel.",
    "sourceURLs": [
      "https://www.depts.ttu.edu/vetschool/dvm-admissions/how-to-apply/financial.php",
      "https://www.depts.ttu.edu/financialaid/costToAttend.php",
      "https://www.depts.ttu.edu/studentbusinessservices/feeInfo/documents/tuition-fees/2026-2028_TTU_DVM_Schedule_of_Fees.pdf"
    ],
    "checkedAt": "2026-10-16",
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 22000,
        "tuitionFeesNonresident": 32800,
        "totalResident": 46660,
        "totalNonresident": 57460,
        "unit": "USD per DVM program year",
        "scope": "Published yearly estimate before aid; price year not stated"
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 22000,
        "tuitionFeesNonresident": 32800,
        "totalResident": 45160,
        "totalNonresident": 55960,
        "unit": "USD per DVM program year",
        "scope": "Published yearly estimate before aid; price year not stated"
      },
      {
        "programYear": 3,
        "tuitionFeesResident": 22000,
        "tuitionFeesNonresident": 32800,
        "totalResident": 45160,
        "totalNonresident": 55960,
        "unit": "USD per DVM program year",
        "scope": "Published yearly estimate before aid; price year not stated"
      },
      {
        "programYear": 4,
        "tuitionFeesResident": 22000,
        "tuitionFeesNonresident": 32800,
        "totalResident": 57284,
        "totalNonresident": 68084,
        "unit": "USD per DVM program year",
        "scope": "Published yearly estimate before aid; price year not stated"
      }
    ],
    "limitations": [
      "Program budget page updated April 17, 2026 and linked from the institution’s 2026–27 aid budget, but does not itself state its academic price year.",
      "Current 2026–2028 DVM fee schedule lists tuition and component fees; it does not certify the program page’s full attendance allowances as 2026–27 amounts.",
      "Amarillo training costs are not an Austin lifestyle estimate.",
      "Costs exclude prerequisite undergraduate education.",
      "Do not multiply the first-year total by four or treat annual estimates as a guaranteed cohort price."
    ]
  },
  "speech-language": {
    "institution": "Texas State University",
    "program": "M.S. in Communication Disorders · non-thesis",
    "academicYear": "2026–2027; semester tuition from Fall 2026",
    "period": "One 9-credit fall semester; separate 9-month attendance budget",
    "status": "published-reference",
    "label": "Named Texas State program · published graduate rate",
    "amounts": {
      "tuitionResident": {
        "value": 4511.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate; campus, method and specific program fees may vary"
      },
      "tuitionNonresident": {
        "value": 8364.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate"
      },
      "annualTotalResident": {
        "value": 27660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident attendance budget · fall + spring",
        "scope": "2026–27 general graduate budget at 9 credits per semester, living on/off campus; not whole degree"
      },
      "annualTuitionResident": {
        "value": 9020,
        "currency": "USD",
        "unit": "USD",
        "label": "Published fall + spring tuition allowance",
        "scope": "Annual COA rounded allowance; do not substitute for exact semester bills"
      }
    },
    "sourceURLs": [
      "https://www.health.txst.edu/cdis/graduate-degree-program.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/tuition-rates.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/graduate-coa.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "CAA-accredited speech-language pathology preparation in Round Rock. Bachelor-level prerequisites/leveling come first. Program includes clinical placements; licensure/certification exams and supervised post-degree requirements remain separate.",
    "limitations": [
      "The degree has 63 credits; this semester figure does not price all required credits.",
      "Books, living, clinical placement, licensing and summer charges need their own route rows.",
      "Round Rock-only enrollment may waive some campus fees; annual COA uses a general nine-credit load."
    ],
    "programCredits": 63,
    "duration": {
      "label": "Five-semester clinical sequence; prerequisite background can add time",
      "sourceURL": "https://www.health.txst.edu/cdis/graduate-degree-program.html"
    },
    "qualificationEvidence": "Program explicitly states minimum education and clinical requirements for SLP licensure and ASHA certificate preparation.",
    "additionalSourceURLs": [
      "https://www.gradcollege.txst.edu/programs/cdis.html",
      "https://docs.gato.txst.edu/786571/Grad%20Course%20Sequence%202024_Accessibility.pdf"
    ]
  },
  "school-psychology": {
    "institution": "Texas State University",
    "program": "Specialist in School Psychology (S.S.P.)",
    "academicYear": "2026–2027; semester tuition from Fall 2026",
    "period": "One 9-credit fall semester; separate 9-month attendance budget",
    "status": "published-reference",
    "label": "Named Texas State program · published graduate rate",
    "amounts": {
      "tuitionResident": {
        "value": 4511.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate; campus, method and specific program fees may vary"
      },
      "tuitionNonresident": {
        "value": 8364.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate"
      },
      "annualTotalResident": {
        "value": 27660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident attendance budget · fall + spring",
        "scope": "2026–27 general graduate budget at 9 credits per semester, living on/off campus; not whole degree"
      },
      "annualTuitionResident": {
        "value": 9020,
        "currency": "USD",
        "unit": "USD",
        "label": "Published fall + spring tuition allowance",
        "scope": "Annual COA rounded allowance; do not substitute for exact semester bills"
      }
    },
    "sourceURLs": [
      "https://www.gradcollege.txst.edu/programs/ssp.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/tuition-rates.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/graduate-coa.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "NASP-approved specialist route includes 600 practicum hours and a 1,200-hour professional internship. Graduates may apply for Texas LSSP licensure; this is school psychology preparation, not clinical psychologist doctoral licensure.",
    "limitations": [
      "The degree has 69 credits; this semester figure does not price all required credits.",
      "Books, living, clinical placement, licensing and summer charges need their own route rows.",
      "Round Rock-only enrollment may waive some campus fees; annual COA uses a general nine-credit load."
    ],
    "programCredits": 69,
    "duration": {
      "months": 36,
      "label": "Three-year program",
      "sourceURL": "https://docs.gato.txst.edu/743349/Program%20Handbook_Rev%20Aug_21_2025.pdf"
    },
    "qualificationEvidence": "Program identifies LSSP eligibility and NCSP preparation.",
    "additionalSourceURLs": [
      "https://mycatalog.txstate.edu/graduate/education/counseling-leadership-adult-school-psychology/ssp/"
    ]
  },
  "statistics": {
    "institution": "Texas State University",
    "program": "M.S. Mathematics · Statistics concentration · non-thesis",
    "academicYear": "2026–2027; semester tuition from Fall 2026",
    "period": "One 9-credit fall semester; separate 9-month attendance budget",
    "status": "published-reference",
    "label": "Named Texas State program · published graduate rate",
    "amounts": {
      "tuitionResident": {
        "value": 4511.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate; campus, method and specific program fees may vary"
      },
      "tuitionNonresident": {
        "value": 8364.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate"
      },
      "annualTotalResident": {
        "value": 27660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident attendance budget · fall + spring",
        "scope": "2026–27 general graduate budget at 9 credits per semester, living on/off campus; not whole degree"
      },
      "annualTuitionResident": {
        "value": 9020,
        "currency": "USD",
        "unit": "USD",
        "label": "Published fall + spring tuition allowance",
        "scope": "Annual COA rounded allowance; do not substitute for exact semester bills"
      }
    },
    "sourceURLs": [
      "https://www.gradcollege.txst.edu/programs/math.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/tuition-rates.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/graduate-coa.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "Named statistics concentration for advanced mathematical/statistical study and industry preparation. A 30-credit thesis route also exists. Statistics employment has no single general professional license.",
    "limitations": [
      "The degree has 36 credits; this semester figure does not price all required credits.",
      "Books, living, clinical placement, licensing and summer charges need their own route rows.",
      "Round Rock-only enrollment may waive some campus fees; annual COA uses a general nine-credit load."
    ],
    "programCredits": 36,
    "duration": {
      "label": "36 credits; pace depends on course load",
      "planningMonths": 24,
      "planningDuration": true
    },
    "alternativeCredits": 30,
    "qualificationEvidence": "Department explicitly provides Statistics concentration and preparation in mathematical statistics, regression and biostatistics."
  },
  "mental-health-counselor": {
    "institution": "Texas State University",
    "program": "M.A. Professional Counseling · Clinical Mental Health Counseling",
    "academicYear": "2026–2027; semester tuition from Fall 2026",
    "period": "One 9-credit fall semester; separate 9-month attendance budget",
    "status": "published-reference",
    "label": "Named Texas State program · published graduate rate",
    "amounts": {
      "tuitionResident": {
        "value": 4511.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate; campus, method and specific program fees may vary"
      },
      "tuitionNonresident": {
        "value": 8364.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate"
      },
      "annualTotalResident": {
        "value": 27660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident attendance budget · fall + spring",
        "scope": "2026–27 general graduate budget at 9 credits per semester, living on/off campus; not whole degree"
      },
      "annualTuitionResident": {
        "value": 9020,
        "currency": "USD",
        "unit": "USD",
        "label": "Published fall + spring tuition allowance",
        "scope": "Annual COA rounded allowance; do not substitute for exact semester bills"
      }
    },
    "sourceURLs": [
      "https://www.gradcollege.txst.edu/programs/counseling.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/tuition-rates.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/graduate-coa.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "Clinical mental health concentration prepares for the counseling profession. Practicum/internships are part of the degree; LPC Associate application, exams and post-graduate supervised experience are additional steps.",
    "limitations": [
      "The degree has 60 credits; this semester figure does not price all required credits.",
      "Books, living, clinical placement, licensing and summer charges need their own route rows.",
      "Round Rock-only enrollment may waive some campus fees; annual COA uses a general nine-credit load."
    ],
    "programCredits": 60,
    "duration": {
      "label": "60 credits; clinical sequence spans four consecutive semesters",
      "planningMonths": 36,
      "planningDuration": true,
      "sourceURL": "https://www.txst.edu/clas/coun/faq.html"
    },
    "qualificationEvidence": "The selected concentration is Clinical Mental Health Counseling, not a generic psychology master's.",
    "additionalSourceURLs": [
      "https://www.txst.edu/clas/coun/current-students/anticipated-program-costs.html",
      "https://www.txst.edu/clas/coun/faq.html"
    ]
  },
  "school-counselor": {
    "institution": "Texas State University",
    "program": "M.A. Professional Counseling · School Counseling + professional certification",
    "academicYear": "2026–2027; semester tuition from Fall 2026",
    "period": "One 9-credit fall semester; separate 9-month attendance budget",
    "status": "published-reference",
    "label": "Named Texas State program · published graduate rate",
    "amounts": {
      "tuitionResident": {
        "value": 4511.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate; campus, method and specific program fees may vary"
      },
      "tuitionNonresident": {
        "value": 8364.49,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition & fees · 9-credit semester",
        "scope": "Published Fall 2026 graduate rate"
      },
      "annualTotalResident": {
        "value": 27660,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident attendance budget · fall + spring",
        "scope": "2026–27 general graduate budget at 9 credits per semester, living on/off campus; not whole degree"
      },
      "annualTuitionResident": {
        "value": 9020,
        "currency": "USD",
        "unit": "USD",
        "label": "Published fall + spring tuition allowance",
        "scope": "Annual COA rounded allowance; do not substitute for exact semester bills"
      }
    },
    "sourceURLs": [
      "https://www.gradcollege.txst.edu/programs/counseling.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/tuition-rates.html",
      "https://onestop.txst.edu/cost-payments/cost-attendance/graduate-coa.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "Selected school counseling concentration includes preparation for the Texas school counselor exam; the 60-hour option also supplies academic preparation for LPC licensure. Texas removed its former two-year classroom teaching prerequisite for school counselor certification.",
    "limitations": [
      "The degree has 60 credits; this semester figure does not price all required credits.",
      "Books, living, clinical placement, licensing and summer charges need their own route rows.",
      "Round Rock-only enrollment may waive some campus fees; annual COA uses a general nine-credit load."
    ],
    "programCredits": 60,
    "duration": {
      "label": "60 credits; individual course sequence and placement determine completion",
      "planningMonths": 36,
      "planningDuration": true
    },
    "qualificationEvidence": "University identifies the school counseling certification route and exam eligibility.",
    "additionalSourceURLs": [
      "https://www.txst.edu/clas/coun/degree-plan/sc-concentration.html",
      "https://tea.texas.gov/about-tea/laws-and-rules/sbec-rules-tac/sbec-adopted/24-04-239-20.pdf"
    ]
  },
  "urban-planning": {
    "institution": "University of Texas at Austin · School of Architecture",
    "program": "M.S. Community and Regional Planning",
    "academicYear": "2026–2027",
    "period": "One 12-credit semester; derived four-semester coursework scenario",
    "status": "derived",
    "label": "Program-specific school rate · calculated tuition scenario",
    "amounts": {
      "tuitionResident": {
        "value": 6239,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident tuition · 12-credit semester",
        "scope": "Architecture graduate Fall 2026/Spring 2027 flat rate"
      },
      "tuitionNonresident": {
        "value": 11651,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident tuition · 12-credit semester",
        "scope": "Architecture graduate Fall 2026/Spring 2027 flat rate"
      },
      "programTuitionResident": {
        "value": 24956,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated 48-credit tuition example",
        "scope": "4 × 12-credit semesters at $6,239; constant 2026–27 rates; living excluded"
      },
      "programTuitionNonresident": {
        "value": 46604,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated nonresident tuition example",
        "scope": "4 × $11,651 at current rates; not an official cohort total"
      }
    },
    "sourceURLs": [
      "https://soa.utexas.edu/planning/masters",
      "https://catalog.utexas.edu/general-information/registration-tuition-and-fees/tuition-and-fees/tables-tuition-for-fall-and-spring/"
    ],
    "checkedAt": "2026-10-17",
    "note": "The 48-credit planning master's includes a professional report or thesis. The four-term calculation assumes 12 credits each term; course loads, summer and future rates can change the result.",
    "limitations": [
      "Graduate tuition includes mandatory college/course incidental fees, with catalog exclusions.",
      "Undergraduate preparation and living costs are additional.",
      "48 credits and four semesters are distinct facts: four terms is this budget assumption."
    ],
    "programCredits": 48,
    "duration": {
      "planningMonths": 24,
      "planningDuration": true,
      "label": "48 credits; two-year budget example"
    },
    "qualificationEvidence": "The program explicitly prepares students for professional planning careers."
  },
  "economics": {
    "institution": "University of Texas at Austin",
    "program": "M.A. Economics · accelerated 10-month track",
    "academicYear": "2026–2027",
    "period": "Whole 30-credit program tuition; 10-month option",
    "status": "published",
    "label": "Published program tuition",
    "amounts": {
      "tuitionResident": {
        "value": 36000,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident program tuition",
        "scope": "Published 10-month track; tuition only"
      },
      "tuitionNonresident": {
        "value": 48000,
        "currency": "USD",
        "unit": "USD",
        "label": "Nonresident program tuition",
        "scope": "Published 10-month track; tuition only"
      },
      "track18Resident": {
        "value": 43500,
        "currency": "USD",
        "unit": "USD",
        "label": "18-month resident program tuition",
        "scope": "Published alternative track at 30 credits"
      },
      "track24Resident": {
        "value": 54600,
        "currency": "USD",
        "unit": "USD",
        "label": "24-month resident program tuition",
        "scope": "Published alternative track at 30 credits"
      }
    },
    "sourceURLs": [
      "https://ma.eco.utexas.edu/tuition/",
      "https://ma.eco.utexas.edu/news-and-events/program-length-options/",
      "https://catalog.utexas.edu/general-information/registration-tuition-and-fees/tuition-and-fees/tables-tuition-for-fall-and-spring/"
    ],
    "checkedAt": "2026-10-17",
    "note": "Option III/non-formula-funded MA has its own tuition. The total includes program credit tuition and semester charges; do not replace it with generic graduate rates. Merit tuition reductions may be awarded; university TA/RA appointments are not available to MA students.",
    "limitations": [
      "Living, books, insurance and international fees excluded.",
      "Thirty credits is the minimum; extra credits increase cost.",
      "Not the doctoral economics MS earned en route to PhD."
    ],
    "programCredits": 30,
    "duration": {
      "months": 10,
      "label": "10 months; 18- and 24-month alternatives"
    },
    "qualificationEvidence": "Named Economics MA program with quantitative economics/econometrics coursework."
  },
  "librarian": {
    "institution": "University of North Texas",
    "program": "M.S. Library Science · online",
    "academicYear": "Current advertised estimate; academic price year not stated",
    "period": "Whole 36-credit program tuition and fees estimate",
    "status": "undated",
    "label": "Published Texas resident program estimate",
    "amounts": {
      "tuitionResident": {
        "value": 16500,
        "currency": "USD",
        "unit": "USD",
        "label": "Estimated Texas resident program tuition & fees",
        "scope": "University displays $16.5K for 36 credits; living excluded"
      }
    },
    "sourceURLs": [
      "https://online.unt.edu/programs/graduate/library-science"
    ],
    "checkedAt": "2026-10-17",
    "note": "ALA-accredited library science master's prepares for public, academic and specialist libraries. A school librarian certificate is a distinct route with additional educator requirements.",
    "limitations": [
      "Advertised rounded estimate, not exact enrollment bill.",
      "Living, books and any school-librarian certification costs additional.",
      "No fixed completion duration was verified; use credits and a clearly labeled two-year budget scenario."
    ],
    "programCredits": 36,
    "duration": {
      "planningMonths": 24,
      "planningDuration": true,
      "label": "36 credits; pace varies"
    },
    "qualificationEvidence": "Official page identifies ALA accreditation and professional librarian preparation."
  },
  "epidemiology": {
    "institution": "UTHealth Houston School of Public Health · Austin/hybrid, Houston or online",
    "program": "Master of Public Health in Epidemiology",
    "academicYear": "2026–2027",
    "period": "45-credit degree tuition; technology fee separate",
    "status": "derived",
    "label": "Degree-specific tuition calculation",
    "amounts": {
      "tuitionResident": {
        "value": 12915,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated resident tuition · 45 credits",
        "scope": "45 × published $287/credit; required fees and living excluded"
      },
      "tuitionNonresident": {
        "value": 50580,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated nonresident tuition · 45 credits",
        "scope": "45 × published $1,124/credit; required fees and living excluded"
      },
      "technologyFee": {
        "value": 3825,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated academic/technology fee · 45 credits",
        "scope": "45 × $85/credit, separate from tuition"
      },
      "tuitionTechnologyResident": {
        "value": 16740,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated resident tuition + technology fee",
        "scope": "$12,915 + $3,825; remaining institution/term fees excluded"
      }
    },
    "sourceURLs": [
      "https://sph.uth.edu/academic-programs/masters-programs/epidemiology",
      "https://www.uth.edu/bursars/student-resources/tuition-fees/school-of-public-health"
    ],
    "checkedAt": "2026-10-17",
    "note": "MPH Epidemiology requires 45 credits and typically 18–24 months full-time. The $200 seat deposit is credited to tuition if enrolled, so do not add it again. Liability and other institution fees depend on terms; living costs depend on study location.",
    "limitations": [
      "Computed from current per-credit rates; not a published all-in degree bill.",
      "Institution-wide student fees, term liability, living, books and future tuition changes additional.",
      "Austin hybrid availability does not imply all clinical/research activities are online."
    ],
    "programCredits": 45,
    "duration": {
      "minMonths": 18,
      "maxMonths": 24,
      "label": "Usually 18–24 months full time"
    },
    "qualificationEvidence": "Official program describes preparation for epidemiologic public-health practice and research."
  },
  "nurse-practitioner": {
    "institution": "University of Texas at Arlington",
    "program": "MSN · Adult-Gerontology Primary Care Nurse Practitioner · online",
    "academicYear": "Current advertised rate; 2026–27 entry dates shown, price year not stated",
    "period": "Whole 41-credit nursing graduate curriculum tuition",
    "status": "undated",
    "label": "Published nurse practitioner tuition",
    "amounts": {
      "tuitionResident": {
        "value": 26814,
        "currency": "USD",
        "unit": "USD",
        "label": "Advertised graduate program tuition",
        "scope": "41 × $654 per credit; books and additional course materials excluded"
      },
      "tuitionPerCredit": {
        "value": 654,
        "currency": "USD",
        "unit": "USD",
        "label": "Tuition per credit",
        "scope": "Graduate nursing curriculum only"
      }
    },
    "sourceURLs": [
      "https://academicpartnerships.uta.edu/healthcare-nursing-online-programs/msn-adult-gerontology/primary-care-nurse-practitioner/"
    ],
    "checkedAt": "2026-10-17",
    "note": "This is an adult-gerontology primary care NP example, not every NP specialty. Requires an accredited BSN and active unencumbered RN license first; graduate clinical coursework prepares for national certification and Texas advanced practice recognition.",
    "limitations": [
      "BSN/RN preparation costs are additional.",
      "Living, course materials, licensing/certification and clinical travel excluded.",
      "Online coursework includes supervised clinical practice; do not model it as entirely remote preparation."
    ],
    "programCredits": 41,
    "duration": {
      "minMonths": 29,
      "maxMonths": 33,
      "label": "As few as 29–33 months"
    },
    "qualificationEvidence": "University states CCNE accreditation and eligibility for national AG primary-care NP certification followed by Texas APRN recognition."
  },
  "nutrition": {
    "institution": "UT Southwestern Medical Center, Dallas",
    "program": "Master of Clinical Nutrition · Coordinated Program",
    "academicYear": "2026–2027",
    "period": "24-month program spanning three separately budgeted academic-year portions",
    "status": "published",
    "label": "Published coordinated dietitian program budgets",
    "amounts": {
      "tuitionResident": {
        "value": 10741,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident first-year tuition & fees",
        "scope": "First academic-year portion, not the whole degree"
      },
      "firstYearTotalResident": {
        "value": 45756,
        "currency": "USD",
        "unit": "USD",
        "label": "Texas resident first-year attendance budget",
        "scope": "Published 2026–27 COA, including living/insurance/technology allowances"
      },
      "programTuitionResident": {
        "value": 23666,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated current-budget tuition & fees total",
        "scope": "$10,741 + $11,130 + $1,795 across program portions; future cohort bills can differ"
      },
      "programTotalResident": {
        "value": 112857,
        "currency": "USD",
        "unit": "USD",
        "label": "Calculated current-budget attendance total",
        "scope": "$45,756 + $54,067 + $13,034 across program portions; not a guaranteed cohort price"
      }
    },
    "sourceURLs": [
      "https://www.utsw.edu/education/students/financial-aid/cost-of-attendance/health-professions/",
      "https://shp.utsouthwestern.edu/programs/clinical-nutrition-coordinated-program/",
      "https://www.utsouthwestern.edu/education/students/accounting/tuition-and-fees/school-of-health-professions/clinical-nutrition.html"
    ],
    "checkedAt": "2026-10-17",
    "note": "Post-baccalaureate coordinated master's prepares entry-level registered dietitians and includes supervised practice. The 24-month course begins and ends in August, so the aid budget has a partial third academic-year row. Use current dated COA over the older undated $22,900 program marketing estimate.",
    "limitations": [
      "COA totals include specific loan-fee and insurance assumptions; family-specific bills may differ.",
      "Dallas training costs, not Austin living during later work.",
      "Undergraduate prerequisites and professional licensing after graduation are separate.",
      "The aid-office page heading says 2026–2027, while the page footer dates its estimates March 14, 2025. Retain this date discrepancy when using the published program-year budget."
    ],
    "programCredits": null,
    "duration": {
      "months": 24,
      "label": "24 months, August to August"
    },
    "qualificationEvidence": "Official coordinated program expressly prepares graduates for entry-level registered dietitian work.",
    "yearRows": [
      {
        "programYear": 1,
        "tuitionFeesResident": 10741,
        "tuitionFeesNonresident": 24106,
        "totalResident": 45756,
        "totalNonresident": 59121,
        "scope": "First academic-year portion; 2026–27 COA"
      },
      {
        "programYear": 2,
        "tuitionFeesResident": 11130,
        "tuitionFeesNonresident": 24900,
        "totalResident": 54067,
        "totalNonresident": 67837,
        "scope": "Second academic-year portion; 2026–27 COA"
      },
      {
        "programYear": 3,
        "tuitionFeesResident": 1795,
        "tuitionFeesNonresident": 3415,
        "totalResident": 13034,
        "totalNonresident": 14654,
        "scope": "Final partial academic-year portion; 2026–27 COA"
      }
    ]
  }
};
