// Fictional narrative-led models for developer regression review, not student validation.
// Answers and review targets authored and frozen before any recommendation-engine run.
// No occupation vectors, target-score mapping, existing synthetic profile helper or
// recommendation function is used in this file. See research/student-model-design-2026-10-18.md.
const deepFreeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return value;
};
export const studentModelMetadata = deepFreeze({
  "schemaVersion": "1.0.0",
  "fixtureVersion": "0.32.0",
  "authoredAt": "2026-10-18",
  "frozenBeforeFirstRecommendationRun": true,
  "evidenceType": "synthetic-regression-only",
  "instrument": {
    "id": "onet-short-form-60",
    "version": "2018-05-01",
    "answerEncoding": "1..5 official API values; unchanged 60 stable IDs"
  },
  "sourceSHA256": {
    "dist/onet-assessment.js": "6f01131f9067e813eb4babbd5b4c563fee32150b0a3e28485fb24ab8a721f8c9",
    "dist/pathway-profile-bank.js": "22ba713875682ad337342930c8ee3ae662e33243e1f7e3ebc209d642c921b2cd",
    "dist/profession-questions.js": "77e97c83b20f6fe98a27859ab6cf3be286b8ba600ee9e1a6a2006ca36140dd0d",
    "dist/lifestyle-builder.js": "d7d2830f762750addbfbc08fcddc65d2c141db8471359bc7c1a5f3267c67c3e1"
  },
  "answerPayloadSHA256": "9ca9ba4ca7af4b482fbbdad79a9d35b85dc8d936e9a25b43a2e712a702b607c6",
  "answerPayloadHashMethod": "SHA256 of Python json.dumps([{id,officialAnswers,fieldPreferences,skills,priorities,context,depth,selectedFamily,lifestyle,reviewTargets},...], sort_keys=True, separators=(comma,colon)); UTF-8; no final newline",
  "authoringRule": "Narratives and observed preferences first; item-level responses then written against actual item wording. Review targets are nonexclusive review hypotheses, never score/rank guarantees."
});

export const studentModels = deepFreeze([
  {
    "id": "m32-medical-reasoning",
    "name": "Ari: biology and diagnosis",
    "grade": 11,
    "narrative": "Ari enjoys explaining why illness happens, comparing explanations, and listening to people. A biology presentation and a supervised hospital information-desk shift increased curiosity about consultations. Ari is willing to explore college, medical school and residency, and imagines a modest independent life while training. The aim is useful work with room to keep learning, not a guaranteed physician outcome.",
    "observedContext": "Completed a class experiment, checked sources for a health presentation, and helped visitors find the correct desk. Has never examined or treated a patient.",
    "unmeasuredLimits": "No clinical aptitude, admission readiness, manual dexterity or ability to cope with medical training has been tested.",
    "tags": [
      "professional-training",
      "medicine"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 5,
      "onet-sf-04": 4,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 3,
      "onet-sf-15": 5,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 4,
      "onet-sf-20": 4,
      "onet-sf-21": 2,
      "onet-sf-22": 3,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 5,
      "onet-sf-28": 4,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 5,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 2,
      "onet-sf-39": 4,
      "onet-sf-40": 5,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 4,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 3,
      "onet-sf-51": 4,
      "onet-sf-52": 5,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 2
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 5,
      "field-profile-health-2": 5,
      "field-profile-health-3": 5,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 5,
      "field-profile-science-3": 4,
      "field-profile-building-1": 3,
      "field-profile-building-2": 2,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 3,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 4,
      "field-profile-transportation-production-1": 2,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "curiosity",
      "impact",
      "mastery"
    ],
    "context": {
      "company": "team",
      "rhythm": "variety",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "college",
        "graduate"
      ]
    },
    "depth": {
      "health": {
        "health-care": [
          "health-care-1"
        ],
        "health-investigate": [
          "health-investigate-1"
        ],
        "health-support": [
          "health-support-1"
        ],
        "health-workday": [
          "health-workday-1"
        ],
        "health-refine-1": [
          "health-refine-1-1"
        ],
        "health-refine-2": [
          "health-refine-2-1"
        ],
        "health-refine-3": [
          "health-refine-3-1"
        ],
        "health-refine-4": [
          "health-refine-4-1"
        ],
        "health-role-work": [
          "health-role-work-physician"
        ],
        "health-role-observe": [
          "health-role-observe-physician"
        ],
        "health-role-learning": [
          "health-role-learning-physician"
        ]
      }
    },
    "selectedFamily": "health",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 2,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "health",
        "science"
      ],
      "rolesToInspect": [
        "physician",
        "physician-assistant"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-dental-precision",
    "name": "Jules: precise oral care",
    "grade": 12,
    "narrative": "Jules likes biology, careful model-making and explaining routines to younger cousins. An approved dental observation made restoring a damaged tooth more interesting than broad hospital diagnosis. Jules will consider college prerequisites and dental school but wants to compare costs before committing. Savings matter more than a premium car.",
    "observedContext": "Builds detailed craft models and has watched a dentist with permission. Classroom science is familiar; actual dental treatment is entirely new.",
    "unmeasuredLimits": "Craft experience is narrative context, not a measured dentistry ability or evidence of future licensure.",
    "tags": [
      "dentistry",
      "precision"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 4,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 4,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 4,
      "onet-sf-14": 2,
      "onet-sf-15": 4,
      "onet-sf-16": 2,
      "onet-sf-17": 1,
      "onet-sf-18": 4,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 4,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 4,
      "onet-sf-32": 2,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 4,
      "onet-sf-36": 3,
      "onet-sf-37": 5,
      "onet-sf-38": 4,
      "onet-sf-39": 2,
      "onet-sf-40": 4,
      "onet-sf-41": 2,
      "onet-sf-42": 1,
      "onet-sf-43": 4,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 4,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 1,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 4,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 2,
      "field-profile-health-1": 5,
      "field-profile-health-2": 5,
      "field-profile-health-3": 5,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 4,
      "field-profile-building-1": 3,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 4,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 2,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "independent"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "mastery",
      "impact",
      "stability"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "people"
      ],
      "education": [
        "college",
        "graduate"
      ]
    },
    "depth": {
      "health": {
        "health-care": [
          "health-care-3"
        ],
        "health-investigate": [
          "health-investigate-2"
        ],
        "health-support": [
          "health-support-1"
        ],
        "health-workday": [
          "health-workday-2"
        ],
        "health-refine-1": [
          "health-refine-1-2"
        ],
        "health-refine-2": [
          "health-refine-2-3"
        ],
        "health-refine-3": [
          "health-refine-3-3"
        ],
        "health-refine-4": [
          "health-refine-4-2"
        ],
        "health-role-work": [
          "health-role-work-dentist"
        ],
        "health-role-observe": [
          "health-role-observe-dentist"
        ],
        "health-role-learning": [
          "health-role-learning-dentist"
        ]
      }
    },
    "selectedFamily": "health",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 2,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 1,
        "clothing": 2,
        "saving": 3
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "health"
      ],
      "rolesToInspect": [
        "dentist",
        "dental-hygiene"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-novice-care",
    "name": "Sam: interested but untried care",
    "grade": 10,
    "narrative": "Sam likes helping a relative follow everyday routines and notices small changes in how people feel. Sam enjoys biology but has not had access to a clinic, lab club or paid work. Nursing observation seems more appealing than diagnosing alone. Sam speaks cautiously about ability, wants help learning, and is open to a nursing program without assuming graduate study.",
    "observedContext": "Helped with household reminders and a school biology project. Reports needing support on most unfamiliar tasks.",
    "unmeasuredLimits": "Low exposure and modest self-confidence must not be interpreted as low ability or a ban on care careers.",
    "tags": [
      "low-confidence",
      "low-exposure"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 5,
      "onet-sf-08": 5,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 3,
      "onet-sf-12": 3,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 4,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 5,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 3,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 5,
      "onet-sf-32": 4,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 2,
      "onet-sf-39": 3,
      "onet-sf-40": 4,
      "onet-sf-41": 2,
      "onet-sf-42": 3,
      "onet-sf-43": 4,
      "onet-sf-44": 5,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 5,
      "onet-sf-56": 4,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 4,
      "field-profile-health-2": 5,
      "field-profile-health-3": 5,
      "field-profile-business-1": 3,
      "field-profile-business-2": 2,
      "field-profile-business-3": 3,
      "field-profile-science-1": 3,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 4,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 2,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "supported"
      },
      "visual": {
        "level": "new"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "supported"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "new"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "supported"
      },
      "digital": {
        "level": "new"
      }
    },
    "priorities": [
      "community",
      "impact",
      "stability"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "people"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "health": {
        "health-care": [
          "health-care-2"
        ],
        "health-investigate": [
          "health-investigate-1"
        ],
        "health-support": [
          "health-support-2"
        ],
        "health-workday": [
          "health-workday-2"
        ],
        "health-refine-1": [
          "health-refine-1-1"
        ],
        "health-refine-2": [
          "health-refine-2-2"
        ],
        "health-refine-3": [
          "health-refine-3-2"
        ],
        "health-refine-4": [
          "health-refine-4-3"
        ],
        "health-role-work": [
          "health-role-work-nursing"
        ],
        "health-role-observe": [
          "health-role-observe-nursing"
        ],
        "health-role-learning": [
          "health-role-learning-nursing"
        ]
      }
    },
    "selectedFamily": "health",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 0,
        "groceries": 1,
        "dining": 0,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 1,
        "saving": 1
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "health",
        "education"
      ],
      "rolesToInspect": [
        "nursing"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-care-route-tension",
    "name": "Lee: diagnosis with a short-route preference",
    "grade": 11,
    "narrative": "Lee is fascinated by differential diagnosis and explains case stories from a school health club. Lee currently hopes to start earning quickly and chooses dental assisting preparation, despite preferring physician responsibilities in the role questions. These are two real preferences to discuss rather than proof the routes are interchangeable. Lee wants an expensive future lifestyle before understanding its training timeline.",
    "observedContext": "Health-club reading and family conversations; no clinical performance experience. The short route reflects current money concerns, not inability to study.",
    "unmeasuredLimits": "The model is a route-conflict check. Neither an expensive goal nor an education preference is an aptitude score.",
    "tags": [
      "route-conflict",
      "high-lifestyle"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 5,
      "onet-sf-04": 4,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 3,
      "onet-sf-15": 5,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 4,
      "onet-sf-20": 4,
      "onet-sf-21": 2,
      "onet-sf-22": 3,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 5,
      "onet-sf-28": 4,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 5,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 2,
      "onet-sf-39": 4,
      "onet-sf-40": 5,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 4,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 3,
      "onet-sf-51": 4,
      "onet-sf-52": 5,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 2
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 5,
      "field-profile-health-2": 5,
      "field-profile-health-3": 4,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 4,
      "field-profile-building-1": 3,
      "field-profile-building-2": 2,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "supported"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "new"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "impact",
      "independence",
      "stability"
    ],
    "context": {
      "company": "team",
      "rhythm": "variety",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "health": {
        "health-care": [
          "health-care-1"
        ],
        "health-investigate": [
          "health-investigate-1"
        ],
        "health-support": [
          "health-support-1"
        ],
        "health-workday": [
          "health-workday-1"
        ],
        "health-refine-1": [
          "health-refine-1-1"
        ],
        "health-refine-2": [
          "health-refine-2-1"
        ],
        "health-refine-3": [
          "health-refine-3-1"
        ],
        "health-refine-4": [
          "health-refine-4-1"
        ],
        "health-role-work": [
          "health-role-work-physician"
        ],
        "health-role-observe": [
          "health-role-observe-physician"
        ],
        "health-role-learning": [
          "health-role-learning-dental-assisting"
        ]
      }
    },
    "selectedFamily": "health",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 3,
        "transport": 4,
        "groceries": 3,
        "dining": 3,
        "travel": 3,
        "entertainment": 3,
        "recreation": 3,
        "clothing": 3,
        "saving": 4
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "health",
        "science"
      ],
      "rolesToInspect": [
        "physician",
        "dental-assisting"
      ],
      "rankRequired": false,
      "routeConflict": {
        "taskRole": "physician",
        "learningRole": "dental-assisting",
        "mustExplain": true
      },
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-visual-editor",
    "name": "Ren: revising visual messages",
    "grade": 11,
    "narrative": "Ren likes choosing type, color and layout, showing drafts to classmates, and improving a message after feedback. Drawing is enjoyable; public performance and sales are not. Ren wants to compare graphic design and interface design, can consider a degree or practical study, and accepts shared housing to protect time for creative work.",
    "observedContext": "Designed a club poster, revised it after readers missed the date, and uses basic image tools independently.",
    "unmeasuredLimits": "Enjoyment and practiced tools do not establish professional design aptitude or client readiness.",
    "tags": [
      "creative"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 2,
      "onet-sf-04": 2,
      "onet-sf-05": 5,
      "onet-sf-06": 5,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 3,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 2,
      "onet-sf-17": 2,
      "onet-sf-18": 5,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 3,
      "onet-sf-23": 2,
      "onet-sf-24": 3,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 2,
      "onet-sf-28": 3,
      "onet-sf-29": 5,
      "onet-sf-30": 5,
      "onet-sf-31": 4,
      "onet-sf-32": 3,
      "onet-sf-33": 2,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 2,
      "onet-sf-38": 2,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 5,
      "onet-sf-42": 2,
      "onet-sf-43": 4,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 2,
      "onet-sf-51": 2,
      "onet-sf-52": 3,
      "onet-sf-53": 5,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 5,
      "field-profile-creative-2": 5,
      "field-profile-creative-3": 5,
      "field-profile-technology-1": 4,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 4,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 2,
      "field-profile-business-3": 3,
      "field-profile-science-1": 2,
      "field-profile-science-2": 3,
      "field-profile-science-3": 3,
      "field-profile-building-1": 3,
      "field-profile-building-2": 4,
      "field-profile-building-3": 4,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 2,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 4,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 2,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 2,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "teach"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "creativity",
      "mastery",
      "independence"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "desk"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "creative": {
        "creative-make": [
          "creative-make-1"
        ],
        "creative-revise": [
          "creative-revise-1"
        ],
        "creative-people": [
          "creative-people-1"
        ],
        "creative-workday": [
          "creative-workday-1"
        ],
        "creative-refine-1": [
          "creative-refine-1-1"
        ],
        "creative-refine-2": [
          "creative-refine-2-1"
        ],
        "creative-refine-3": [
          "creative-refine-3-1"
        ],
        "creative-refine-4": [
          "creative-refine-4-1"
        ]
      }
    },
    "selectedFamily": "creative",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "creative",
        "technology"
      ],
      "rolesToInspect": [
        "graphic-design",
        "web-interface-design"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-quiet-writer",
    "name": "Noor: writing without performance",
    "grade": 12,
    "narrative": "Noor spends free time revising fiction, checking facts for the school magazine, and finding a precise word. Music, dance, visual effects and acting do not appeal, so a broad artistic label may obscure this specific writing interest. Noor dislikes persuasion and clinical care, values quiet autonomy, and will explore college writing or another route with a portfolio.",
    "observedContext": "Keeps several story drafts and has edited a factual article with a teacher. Likes research when it serves a story; technical labs are less appealing.",
    "unmeasuredLimits": "This is a specific-task versus broad-pattern contrast to inspect, not a constructed negative correlation or a promise that writing must rank first.",
    "tags": [
      "writing-specific",
      "broad-pattern-contrast"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 2,
      "onet-sf-05": 5,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 2,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 3,
      "onet-sf-12": 5,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 2,
      "onet-sf-17": 1,
      "onet-sf-18": 4,
      "onet-sf-19": 3,
      "onet-sf-20": 2,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 3,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 4,
      "onet-sf-32": 3,
      "onet-sf-33": 2,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 2,
      "onet-sf-38": 2,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 5,
      "onet-sf-42": 1,
      "onet-sf-43": 2,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 2,
      "onet-sf-51": 2,
      "onet-sf-52": 3,
      "onet-sf-53": 1,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 2,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 5,
      "field-profile-creative-2": 5,
      "field-profile-creative-3": 5,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 2,
      "field-profile-health-1": 2,
      "field-profile-health-2": 2,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 3,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 2,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 2,
      "field-profile-services-2": 3,
      "field-profile-services-3": 2,
      "field-profile-education-1": 3,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 2,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 2,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 2,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "teach"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "creativity",
      "independence",
      "mastery"
    ],
    "context": {
      "company": "independent",
      "rhythm": "mix",
      "setting": [
        "desk"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "creative": {
        "creative-make": [
          "creative-make-3"
        ],
        "creative-revise": [
          "creative-revise-4"
        ],
        "creative-people": [
          "creative-people-3"
        ],
        "creative-workday": [
          "creative-workday-4"
        ],
        "creative-refine-1": [
          "creative-refine-1-4"
        ],
        "creative-refine-2": [
          "creative-refine-2-4"
        ],
        "creative-refine-3": [
          "creative-refine-3-3"
        ],
        "creative-refine-4": [
          "creative-refine-4-4"
        ]
      }
    },
    "selectedFamily": "creative",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 0,
        "groceries": 1,
        "dining": 0,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "creative"
      ],
      "rolesToInspect": [
        "writing"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-biology-stories",
    "name": "Imani: science and illustration",
    "grade": 10,
    "narrative": "Imani enjoys pond observations and explaining the findings through drawings, diagrams and short stories. A science fair felt best when visitors understood the poster. Patient care does not attract Imani, and neither science nor creative work should erase the other interest. Imani is willing to compare degrees and keeps future spending moderate.",
    "observedContext": "Collected observations with a club and revised explanatory sketches. Has not worked in a research lab or design studio.",
    "unmeasuredLimits": "Parallel interests are intentional; no single professional identity or aptitude is inferred.",
    "tags": [
      "mixed-interests"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 3,
      "onet-sf-03": 4,
      "onet-sf-04": 4,
      "onet-sf-05": 5,
      "onet-sf-06": 5,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 3,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 4,
      "onet-sf-15": 5,
      "onet-sf-16": 4,
      "onet-sf-17": 1,
      "onet-sf-18": 5,
      "onet-sf-19": 3,
      "onet-sf-20": 2,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 3,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 5,
      "onet-sf-30": 4,
      "onet-sf-31": 4,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 4,
      "onet-sf-38": 3,
      "onet-sf-39": 4,
      "onet-sf-40": 5,
      "onet-sf-41": 5,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 3,
      "onet-sf-51": 4,
      "onet-sf-52": 5,
      "onet-sf-53": 3,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 2,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 5,
      "field-profile-creative-2": 5,
      "field-profile-creative-3": 4,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 2,
      "field-profile-business-3": 3,
      "field-profile-science-1": 5,
      "field-profile-science-2": 5,
      "field-profile-science-3": 5,
      "field-profile-building-1": 3,
      "field-profile-building-2": 4,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 4,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "curiosity",
      "creativity",
      "impact"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "desk",
        "active"
      ],
      "education": [
        "college"
      ]
    },
    "depth": {
      "creative": {
        "creative-make": [
          "creative-make-3"
        ],
        "creative-revise": [
          "creative-revise-3"
        ],
        "creative-people": [
          "creative-people-3"
        ],
        "creative-workday": [
          "creative-workday-2",
          "creative-workday-4"
        ],
        "creative-refine-1": [
          "creative-refine-1-4"
        ],
        "creative-refine-2": [
          "creative-refine-2-4"
        ],
        "creative-refine-3": [
          "creative-refine-3-4"
        ],
        "creative-refine-4": [
          "creative-refine-4-4"
        ]
      }
    },
    "selectedFamily": "creative",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 2,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "creative",
        "science"
      ],
      "rolesToInspect": [
        "writing",
        "graphic-design",
        "environmental-science"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-web-maker",
    "name": "Alex: practical digital builder",
    "grade": 11,
    "narrative": "Alex enjoys making a school club site work, finding a bug and testing a fix. Explaining the site to users is useful but presenting, art performance and retail management are not the main interests. Alex likes a mix of focused coding and team discussion, is open to college, and wants a modest place and reliable transport.",
    "observedContext": "Built a small site using tutorials, kept a bug list and asked two classmates to try it. School math is comfortable; large systems are unfamiliar.",
    "unmeasuredLimits": "An informal project demonstrates exposure only; no programming aptitude or employment readiness is tested.",
    "tags": [
      "digital-project"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 3,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 2,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 5,
      "onet-sf-12": 5,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 5,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 3,
      "onet-sf-20": 2,
      "onet-sf-21": 2,
      "onet-sf-22": 3,
      "onet-sf-23": 5,
      "onet-sf-24": 4,
      "onet-sf-25": 5,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 4,
      "onet-sf-37": 5,
      "onet-sf-38": 2,
      "onet-sf-39": 4,
      "onet-sf-40": 3,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 5,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 3,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 2,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 4,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 5,
      "field-profile-technology-2": 5,
      "field-profile-technology-3": 5,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 4,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 3,
      "field-profile-building-2": 4,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 2,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "teach"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "curiosity",
      "mastery",
      "independence"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "desk"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "technology": {
        "technology-problem": [
          "technology-problem-1"
        ],
        "technology-approach": [
          "technology-approach-1"
        ],
        "technology-result": [
          "technology-result-1"
        ],
        "technology-workday": [
          "technology-workday-1"
        ],
        "technology-refine-1": [
          "technology-refine-1-1"
        ],
        "technology-refine-2": [
          "technology-refine-2-1"
        ],
        "technology-refine-3": [
          "technology-refine-3-1"
        ],
        "technology-refine-4": [
          "technology-refine-4-1"
        ]
      }
    },
    "selectedFamily": "technology",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 2,
        "transport": 2,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "technology"
      ],
      "rolesToInspect": [
        "software",
        "web-developer"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-tech-cautious",
    "name": "Drew: helpful with devices, cautious about ability",
    "grade": 10,
    "narrative": "Drew often helps relatives reconnect devices and likes patiently testing one possible fix at a time. Drew worries about not being a math genius and reports wanting support, despite interest in practical computer work. The goal is useful service and steady income, with college or certificates available to compare rather than an assumed research career.",
    "observedContext": "Has followed device instructions and explained a fix to family. Describes unfamiliar tools as requiring help; has not had coding classes.",
    "unmeasuredLimits": "Anxiety is narrative context, not a diagnosis. Lower confidence must not erase the stated troubleshooting interest.",
    "tags": [
      "low-confidence",
      "support-oriented"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 3,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 2,
      "onet-sf-07": 5,
      "onet-sf-08": 4,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 5,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 4,
      "onet-sf-32": 4,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 4,
      "onet-sf-37": 4,
      "onet-sf-38": 2,
      "onet-sf-39": 4,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 3,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 4,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 4,
      "field-profile-technology-2": 5,
      "field-profile-technology-3": 5,
      "field-profile-health-1": 3,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 3,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 4,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 5,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "supported"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "supported"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "supported"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "community",
      "stability",
      "curiosity"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "technology": {
        "technology-problem": [
          "technology-problem-4"
        ],
        "technology-approach": [
          "technology-approach-4"
        ],
        "technology-result": [
          "technology-result-4"
        ],
        "technology-workday": [
          "technology-workday-4"
        ],
        "technology-refine-1": [
          "technology-refine-1-5"
        ],
        "technology-refine-2": [
          "technology-refine-2-5"
        ],
        "technology-refine-3": [
          "technology-refine-3-5"
        ],
        "technology-refine-4": [
          "technology-refine-4-5"
        ]
      }
    },
    "selectedFamily": "technology",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 0,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "technology",
        "sales-office"
      ],
      "rolesToInspect": [
        "computer-support"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-budget-volunteer",
    "name": "Casey: careful community accounts",
    "grade": 12,
    "narrative": "Casey likes keeping a club budget accurate and explaining why a balance changed. Investing for excitement and sales targets are less attractive than reliable records. Casey wants to compare accounting and bookkeeping, is willing to study a degree, and values predictable work and savings rather than a luxury lifestyle.",
    "observedContext": "Reconciled receipts for a club with adult review; spreadsheets are familiar. Has not prepared audited accounts or advised anyone financially.",
    "unmeasuredLimits": "Checking school records is not professional financial competence, a measured numerical ability or a reason to exclude learning.",
    "tags": [
      "records-and-evidence"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 2,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 3,
      "onet-sf-11": 5,
      "onet-sf-12": 5,
      "onet-sf-13": 4,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 3,
      "onet-sf-24": 5,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 2,
      "onet-sf-28": 3,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 4,
      "onet-sf-35": 5,
      "onet-sf-36": 5,
      "onet-sf-37": 4,
      "onet-sf-38": 2,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 5,
      "onet-sf-48": 5,
      "onet-sf-49": 4,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 3,
      "onet-sf-59": 5,
      "onet-sf-60": 4
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 5,
      "field-profile-business-2": 5,
      "field-profile-business-3": 5,
      "field-profile-science-1": 3,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 4,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 5,
      "field-profile-sales-office-3": 5
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "teach"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "stability",
      "mastery",
      "impact"
    ],
    "context": {
      "company": "mix",
      "rhythm": "routine",
      "setting": [
        "desk"
      ],
      "education": [
        "college",
        "training"
      ]
    },
    "depth": {
      "business": {
        "business-problem": [
          "business-problem-1"
        ],
        "business-evidence": [
          "business-evidence-1"
        ],
        "business-people": [
          "business-people-1"
        ],
        "business-workday": [
          "business-workday-1"
        ],
        "business-refine-1": [
          "business-refine-1-1"
        ],
        "business-refine-2": [
          "business-refine-2-1"
        ],
        "business-refine-3": [
          "business-refine-3-1"
        ],
        "business-refine-4": [
          "business-refine-4-1"
        ]
      }
    },
    "selectedFamily": "business",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 2,
        "saving": 3
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "business",
        "sales-office"
      ],
      "rolesToInspect": [
        "accounting",
        "bookkeeping-clerk"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-debate-law",
    "name": "Morgan: arguments and public service",
    "grade": 11,
    "narrative": "Morgan likes weighing evidence, reading competing accounts and arguing a fair case in debate. The interest is explaining rules and rights rather than selling products. Morgan will consider professional study but wants to compare paralegal work too. A future home and occasional travel matter, while actual legal responsibilities remain unfamiliar.",
    "observedContext": "Researched a school debate and revised a written argument after feedback. Comfortable speaking to classmates; no legal practice experience.",
    "unmeasuredLimits": "Debate success is not a law admission prediction or evidence of legal competence.",
    "tags": [
      "ambitious",
      "professional-training"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 4,
      "onet-sf-06": 4,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 2,
      "onet-sf-10": 3,
      "onet-sf-11": 4,
      "onet-sf-12": 5,
      "onet-sf-13": 3,
      "onet-sf-14": 2,
      "onet-sf-15": 4,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 4,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 3,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 3,
      "onet-sf-31": 4,
      "onet-sf-32": 4,
      "onet-sf-33": 3,
      "onet-sf-34": 4,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 2,
      "onet-sf-39": 3,
      "onet-sf-40": 4,
      "onet-sf-41": 4,
      "onet-sf-42": 3,
      "onet-sf-43": 4,
      "onet-sf-44": 5,
      "onet-sf-45": 4,
      "onet-sf-46": 5,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 4,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 4,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 3,
      "onet-sf-58": 3,
      "onet-sf-59": 4,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 4,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 3,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 5,
      "field-profile-business-2": 5,
      "field-profile-business-3": 5,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 4,
      "field-profile-building-1": 3,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 2,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 4,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 4,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "teach"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "teach"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "impact",
      "curiosity",
      "independence"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "college",
        "graduate"
      ]
    },
    "depth": {
      "business": {
        "business-problem": [
          "business-problem-4"
        ],
        "business-evidence": [
          "business-evidence-3"
        ],
        "business-people": [
          "business-people-4"
        ],
        "business-workday": [
          "business-workday-3"
        ],
        "business-refine-1": [
          "business-refine-1-5"
        ],
        "business-refine-2": [
          "business-refine-2-5"
        ],
        "business-refine-3": [
          "business-refine-3-5"
        ],
        "business-refine-4": [
          "business-refine-4-5"
        ]
      }
    },
    "selectedFamily": "business",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 2,
        "transport": 3,
        "groceries": 2,
        "dining": 1,
        "travel": 2,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 2,
        "saving": 3
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "business",
        "education"
      ],
      "rolesToInspect": [
        "law",
        "paralegal"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-water-observer",
    "name": "Taylor: outdoor environmental questions",
    "grade": 11,
    "narrative": "Taylor likes comparing stream measurements, keeping field notes and returning after rain to see what changed. Outdoor evidence and uncertainty are interesting; treating people and managing a shop are not. Taylor is willing to study science and wants a simple lifestyle with room for hiking equipment rather than expensive dining.",
    "observedContext": "Joined a supervised water-monitoring club and entered results into a shared sheet. Repeated measurements when a reading looked inconsistent.",
    "unmeasuredLimits": "Club measurements do not establish scientific aptitude or readiness for hazardous fieldwork.",
    "tags": [
      "outdoor-investigation"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 4,
      "onet-sf-03": 5,
      "onet-sf-04": 5,
      "onet-sf-05": 3,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 3,
      "onet-sf-14": 5,
      "onet-sf-15": 5,
      "onet-sf-16": 4,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 4,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 4,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 4,
      "onet-sf-38": 3,
      "onet-sf-39": 5,
      "onet-sf-40": 5,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 4,
      "onet-sf-50": 4,
      "onet-sf-51": 4,
      "onet-sf-52": 5,
      "onet-sf-53": 3,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 2,
      "field-profile-business-2": 3,
      "field-profile-business-3": 2,
      "field-profile-science-1": 5,
      "field-profile-science-2": 5,
      "field-profile-science-3": 5,
      "field-profile-building-1": 3,
      "field-profile-building-2": 4,
      "field-profile-building-3": 4,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 2,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "curiosity",
      "impact",
      "variety"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "active",
        "desk"
      ],
      "education": [
        "college",
        "graduate"
      ]
    },
    "depth": {
      "science": {
        "science-wonder": [
          "science-wonder-3"
        ],
        "science-setting": [
          "science-setting-2"
        ],
        "science-result": [
          "science-result-2"
        ],
        "science-workday": [
          "science-workday-2"
        ],
        "science-refine-1": [
          "science-refine-1-1"
        ],
        "science-refine-2": [
          "science-refine-2-1"
        ],
        "science-refine-3": [
          "science-refine-3-1"
        ],
        "science-refine-4": [
          "science-refine-4-1"
        ]
      }
    },
    "selectedFamily": "science",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 1,
        "groceries": 1,
        "dining": 0,
        "travel": 1,
        "entertainment": 2,
        "recreation": 3,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "science"
      ],
      "rolesToInspect": [
        "environmental-science",
        "geoscience"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-bridge-testing",
    "name": "River: structures under constraints",
    "grade": 12,
    "narrative": "River likes physics, model bridges and testing a design until it handles a load. Drawing for expression is enjoyable sometimes, but calculations and safety constraints are the main attraction. River wants engineering study, is prepared to revise a weak design, and dreams of owning a modest home after training.",
    "observedContext": "Built and tested a small model bridge in class and documented its failure points. Has no professional design or construction authority.",
    "unmeasuredLimits": "Classroom models do not establish engineering aptitude or competence to design public structures.",
    "tags": [
      "engineering-study"
    ],
    "officialAnswers": {
      "onet-sf-01": 5,
      "onet-sf-02": 4,
      "onet-sf-03": 3,
      "onet-sf-04": 4,
      "onet-sf-05": 3,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 4,
      "onet-sf-14": 3,
      "onet-sf-15": 5,
      "onet-sf-16": 4,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 4,
      "onet-sf-24": 5,
      "onet-sf-25": 5,
      "onet-sf-26": 4,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 4,
      "onet-sf-37": 5,
      "onet-sf-38": 4,
      "onet-sf-39": 5,
      "onet-sf-40": 3,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 4,
      "onet-sf-50": 3,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 3,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 4,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 4,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 3,
      "field-profile-business-2": 4,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 5,
      "field-profile-science-3": 4,
      "field-profile-building-1": 5,
      "field-profile-building-2": 5,
      "field-profile-building-3": 5,
      "field-profile-trades-1": 4,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 2,
      "field-profile-services-2": 3,
      "field-profile-services-3": 2,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 4,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "independent"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "mastery",
      "impact",
      "curiosity"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "desk",
        "active"
      ],
      "education": [
        "college"
      ]
    },
    "depth": {
      "building": {
        "building-design": [
          "building-design-4"
        ],
        "building-approach": [
          "building-approach-2"
        ],
        "building-impact": [
          "building-impact-2"
        ],
        "building-workday": [
          "building-workday-2"
        ],
        "building-refine-1": [
          "building-refine-1-2"
        ],
        "building-refine-2": [
          "building-refine-2-2"
        ],
        "building-refine-3": [
          "building-refine-3-2"
        ],
        "building-refine-4": [
          "building-refine-4-2"
        ]
      }
    },
    "selectedFamily": "building",
    "lifestyle": {
      "homeMode": "own",
      "choices": {
        "home": 2,
        "transport": 1,
        "groceries": 2,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 2,
        "saving": 3
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "building",
        "science"
      ],
      "rolesToInspect": [
        "civil-engineering"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-circuit-learner",
    "name": "Ash: safe electrical learning",
    "grade": 11,
    "narrative": "Ash likes following diagrams, building low-voltage circuits and finding a loose connection. Paid apprenticeship learning is attractive, though college remains possible. Ash wants a practical career with teamwork, a dependable car and growing savings. No answer implies that unsupervised mains wiring is appropriate for a student.",
    "observedContext": "Completed a supervised low-voltage classroom kit and helped measure parts for a household project. Electrical installation is new.",
    "unmeasuredLimits": "Interest and a kit are not proof of electrical aptitude, safety training, licensure or readiness for unsupervised work.",
    "tags": [
      "paid-training",
      "safety"
    ],
    "officialAnswers": {
      "onet-sf-01": 5,
      "onet-sf-02": 5,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 5,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 5,
      "onet-sf-24": 5,
      "onet-sf-25": 5,
      "onet-sf-26": 4,
      "onet-sf-27": 4,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 4,
      "onet-sf-37": 5,
      "onet-sf-38": 4,
      "onet-sf-39": 4,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 5,
      "onet-sf-50": 3,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 3,
      "field-profile-science-2": 4,
      "field-profile-science-3": 3,
      "field-profile-building-1": 4,
      "field-profile-building-2": 4,
      "field-profile-building-3": 4,
      "field-profile-trades-1": 5,
      "field-profile-trades-2": 5,
      "field-profile-trades-3": 5,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 2,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 4,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 4,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "supported"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "independent"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "mastery",
      "stability",
      "independence"
    ],
    "context": {
      "company": "team",
      "rhythm": "variety",
      "setting": [
        "active"
      ],
      "education": [
        "training",
        "college"
      ]
    },
    "depth": {
      "trades": {
        "trades-systems": [
          "trades-systems-1"
        ],
        "trades-process": [
          "trades-process-2"
        ],
        "trades-place": [
          "trades-place-2"
        ],
        "trades-workday": [
          "trades-workday-1"
        ],
        "trades-refine-1": [
          "trades-refine-1-1"
        ],
        "trades-refine-2": [
          "trades-refine-2-1"
        ],
        "trades-refine-3": [
          "trades-refine-3-1"
        ],
        "trades-refine-4": [
          "trades-refine-4-1"
        ]
      }
    },
    "selectedFamily": "trades",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 2,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 2,
        "saving": 3
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "trades",
        "building"
      ],
      "rolesToInspect": [
        "electrician"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-machine-repair",
    "name": "Cameron: diagnosing mechanical faults",
    "grade": 12,
    "narrative": "Cameron enjoys learning why a bike or engine stops working, trying a repair and checking it rather than changing parts at random. Workshop work and clear customer explanations appeal; desk research and sales do not. Cameron would start with technical training and compares vehicle repair with industrial machinery.",
    "observedContext": "Works on a bicycle with an experienced relative and logs repairs in a notebook. Has watched engine maintenance but does not perform dangerous tasks alone.",
    "unmeasuredLimits": "Informal mechanical exposure is not a measured ability, professional qualification or guaranteed match.",
    "tags": [
      "practical-exposure"
    ],
    "officialAnswers": {
      "onet-sf-01": 5,
      "onet-sf-02": 5,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 5,
      "onet-sf-12": 4,
      "onet-sf-13": 5,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 4,
      "onet-sf-24": 5,
      "onet-sf-25": 5,
      "onet-sf-26": 4,
      "onet-sf-27": 4,
      "onet-sf-28": 4,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 4,
      "onet-sf-37": 5,
      "onet-sf-38": 4,
      "onet-sf-39": 4,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 5,
      "onet-sf-50": 3,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 3,
      "field-profile-science-2": 3,
      "field-profile-science-3": 3,
      "field-profile-building-1": 4,
      "field-profile-building-2": 4,
      "field-profile-building-3": 4,
      "field-profile-trades-1": 5,
      "field-profile-trades-2": 5,
      "field-profile-trades-3": 5,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 2,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 4,
      "field-profile-transportation-production-2": 5,
      "field-profile-transportation-production-3": 4,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "independent"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "mastery",
      "independence",
      "stability"
    ],
    "context": {
      "company": "mix",
      "rhythm": "variety",
      "setting": [
        "active"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "trades": {
        "trades-systems": [
          "trades-systems-3"
        ],
        "trades-process": [
          "trades-process-1"
        ],
        "trades-place": [
          "trades-place-1"
        ],
        "trades-workday": [
          "trades-workday-2"
        ],
        "trades-refine-1": [
          "trades-refine-1-4"
        ],
        "trades-refine-2": [
          "trades-refine-2-4"
        ],
        "trades-refine-3": [
          "trades-refine-3-4"
        ],
        "trades-refine-4": [
          "trades-refine-4-4"
        ]
      }
    },
    "selectedFamily": "trades",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 2,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "trades",
        "transportation-production"
      ],
      "rolesToInspect": [
        "automotive",
        "industrial-machinery-mechanic"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-food-without-sales",
    "name": "Sky: cooking without management",
    "grade": 11,
    "narrative": "Sky likes planning the order of cooking tasks, testing a recipe and preparing food safely for others. Owning a restaurant, bargaining and supervising staff are not appealing. Many official activities are unrelated to cooking and receive unsure or dislike responses; the detailed food interest should still be visible as something to explore, not a forced management identity.",
    "observedContext": "Prepares several family meals each week and helped at a supervised school food event. Adult oversight is still needed for large-service food safety.",
    "unmeasuredLimits": "Cooking at home is neither a professional aptitude result nor proof that restaurant work, hours or earnings will suit Sky.",
    "tags": [
      "food-specific",
      "broad-pattern-contrast"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 3,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 2,
      "onet-sf-11": 3,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 2,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 2,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 2,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 2,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 3,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 2,
      "field-profile-technology-3": 2,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 2,
      "field-profile-business-2": 3,
      "field-profile-business-3": 2,
      "field-profile-science-1": 3,
      "field-profile-science-2": 3,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 5,
      "field-profile-services-2": 5,
      "field-profile-services-3": 5,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "independent"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "mastery",
      "community",
      "stability"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "active"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "services": {
        "services-serve": [
          "services-serve-1"
        ],
        "services-make": [
          "services-make-1"
        ],
        "services-people": [
          "services-people-1"
        ],
        "services-workday": [
          "services-workday-2"
        ],
        "services-refine-1": [
          "services-refine-1-1"
        ],
        "services-refine-2": [
          "services-refine-2-1"
        ],
        "services-refine-3": [
          "services-refine-3-1"
        ],
        "services-refine-4": [
          "services-refine-4-1"
        ]
      }
    },
    "selectedFamily": "services",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 2,
        "dining": 2,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "services"
      ],
      "rolesToInspect": [
        "restaurant-cook",
        "chef"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-salon-listener",
    "name": "Rowan: appearance and consultation",
    "grade": 10,
    "narrative": "Rowan enjoys sketching styles, hearing what someone wants and practicing careful techniques on a mannequin. A welcoming service setting appeals more than science experiments or office accounts. Rowan will consider a licensed training route, likes some spending on clothing, and wants to understand customer work before making a choice.",
    "observedContext": "Has tried a supervised mannequin demonstration and helped organize tools. Enjoys visual planning but has never provided a paid salon service.",
    "unmeasuredLimits": "Appearance interests do not establish dexterity, licensure readiness or permission to practice on others.",
    "tags": [
      "creative-service"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 5,
      "onet-sf-06": 4,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 3,
      "onet-sf-10": 4,
      "onet-sf-11": 3,
      "onet-sf-12": 3,
      "onet-sf-13": 2,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 2,
      "onet-sf-17": 2,
      "onet-sf-18": 5,
      "onet-sf-19": 4,
      "onet-sf-20": 3,
      "onet-sf-21": 4,
      "onet-sf-22": 3,
      "onet-sf-23": 2,
      "onet-sf-24": 3,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 4,
      "onet-sf-31": 4,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 2,
      "onet-sf-41": 3,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 4,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 2,
      "onet-sf-50": 2,
      "onet-sf-51": 2,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 4,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 4,
      "onet-sf-58": 4,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 4,
      "field-profile-creative-2": 5,
      "field-profile-creative-3": 4,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 2,
      "field-profile-health-1": 3,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 3,
      "field-profile-business-2": 4,
      "field-profile-business-3": 3,
      "field-profile-science-1": 2,
      "field-profile-science-2": 3,
      "field-profile-science-3": 2,
      "field-profile-building-1": 3,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 3,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 5,
      "field-profile-services-2": 5,
      "field-profile-services-3": 5,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "independent"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "creativity",
      "community",
      "independence"
    ],
    "context": {
      "company": "team",
      "rhythm": "variety",
      "setting": [
        "people",
        "active"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "services": {
        "services-serve": [
          "services-serve-3"
        ],
        "services-make": [
          "services-make-3"
        ],
        "services-people": [
          "services-people-2"
        ],
        "services-workday": [
          "services-workday-2"
        ],
        "services-refine-1": [
          "services-refine-1-3"
        ],
        "services-refine-2": [
          "services-refine-2-3"
        ],
        "services-refine-3": [
          "services-refine-3-3"
        ],
        "services-refine-4": [
          "services-refine-4-2"
        ]
      }
    },
    "selectedFamily": "services",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 1,
        "clothing": 3,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "services",
        "creative"
      ],
      "rolesToInspect": [
        "hairdresser"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-tutor-explainer",
    "name": "Finley: adapting explanations",
    "grade": 11,
    "narrative": "Finley likes noticing where another student gets stuck and finding a different example. Tutoring a younger pupil was more enjoyable than doing a task for them. Finley likes science and language subjects, is willing to study education, and wants a steady life with time for friends rather than a very high income goal.",
    "observedContext": "Helps at a supervised homework club and has tried two explanations for the same maths idea. No professional teaching experience.",
    "unmeasuredLimits": "Peer tutoring does not establish teaching ability, classroom-management skill or licensing eligibility.",
    "tags": [
      "teaching",
      "peer-exposure"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 4,
      "onet-sf-06": 4,
      "onet-sf-07": 5,
      "onet-sf-08": 5,
      "onet-sf-09": 3,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 3,
      "onet-sf-14": 2,
      "onet-sf-15": 4,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 4,
      "onet-sf-19": 5,
      "onet-sf-20": 4,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 3,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 3,
      "onet-sf-31": 5,
      "onet-sf-32": 5,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 4,
      "onet-sf-41": 3,
      "onet-sf-42": 3,
      "onet-sf-43": 4,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 3,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 5,
      "onet-sf-56": 5,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 3,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 3,
      "field-profile-business-2": 3,
      "field-profile-business-3": 3,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 4,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 2,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 5,
      "field-profile-education-2": 5,
      "field-profile-education-3": 5,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 2,
      "field-profile-transportation-production-2": 3,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "teach"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "independent"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "impact",
      "community",
      "curiosity"
    ],
    "context": {
      "company": "team",
      "rhythm": "mix",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "college"
      ]
    },
    "depth": {
      "education": {
        "education-help": [
          "education-help-2"
        ],
        "education-learners": [
          "education-learners-2"
        ],
        "education-approach": [
          "education-approach-1"
        ],
        "education-workday": [
          "education-workday-1"
        ],
        "education-refine-1": [
          "education-refine-1-2"
        ],
        "education-refine-2": [
          "education-refine-2-2"
        ],
        "education-refine-3": [
          "education-refine-3-2"
        ],
        "education-refine-4": [
          "education-refine-4-2"
        ]
      }
    },
    "selectedFamily": "education",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "education",
        "science"
      ],
      "rolesToInspect": [
        "teaching",
        "high-school-teacher"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-emergency-team",
    "name": "Jordan: calm prepared response",
    "grade": 12,
    "narrative": "Jordan likes first-aid practice, repeated procedures and helping a team respond calmly. Clinical diagnosis over years is less appealing than trained immediate care. Jordan wants an EMT course or related training, accepts varied hours as something to investigate, and values practical service more than expensive travel.",
    "observedContext": "Attended an introductory first-aid course and practiced scenarios with an instructor. Has not provided independent emergency care.",
    "unmeasuredLimits": "Scenario practice does not establish crisis performance, medical competence or fitness for emergency work.",
    "tags": [
      "trained-response"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 4,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 3,
      "onet-sf-06": 3,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 3,
      "onet-sf-10": 2,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 2,
      "onet-sf-14": 3,
      "onet-sf-15": 4,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 4,
      "onet-sf-20": 4,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 2,
      "onet-sf-27": 4,
      "onet-sf-28": 5,
      "onet-sf-29": 4,
      "onet-sf-30": 2,
      "onet-sf-31": 5,
      "onet-sf-32": 4,
      "onet-sf-33": 3,
      "onet-sf-34": 2,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 4,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 4,
      "onet-sf-41": 2,
      "onet-sf-42": 3,
      "onet-sf-43": 3,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 4,
      "onet-sf-50": 5,
      "onet-sf-51": 3,
      "onet-sf-52": 4,
      "onet-sf-53": 2,
      "onet-sf-54": 3,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 2,
      "onet-sf-58": 2,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 4,
      "field-profile-health-2": 4,
      "field-profile-health-3": 3,
      "field-profile-business-1": 2,
      "field-profile-business-2": 3,
      "field-profile-business-3": 2,
      "field-profile-science-1": 3,
      "field-profile-science-2": 3,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 4,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 5,
      "field-profile-public-safety-2": 5,
      "field-profile-public-safety-3": 5,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 3,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 3,
      "field-profile-sales-office-3": 3
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "independent"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "teach"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "impact",
      "community",
      "variety"
    ],
    "context": {
      "company": "team",
      "rhythm": "variety",
      "setting": [
        "people",
        "active"
      ],
      "education": [
        "training",
        "college"
      ]
    },
    "depth": {
      "public-safety": {
        "public-safety-purpose": [
          "public-safety-purpose-1"
        ],
        "public-safety-action": [
          "public-safety-action-1"
        ],
        "public-safety-team": [
          "public-safety-team-1"
        ],
        "public-safety-workday": [
          "public-safety-workday-4"
        ],
        "public-safety-refine-1": [
          "public-safety-refine-1-1"
        ],
        "public-safety-refine-2": [
          "public-safety-refine-2-1"
        ],
        "public-safety-refine-3": [
          "public-safety-refine-3-1"
        ],
        "public-safety-refine-4": [
          "public-safety-refine-4-1"
        ]
      }
    },
    "selectedFamily": "public-safety",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 1,
        "dining": 0,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "public-safety",
        "health"
      ],
      "rolesToInspect": [
        "emt"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-stock-systems",
    "name": "Parker: keeping supplies moving",
    "grade": 11,
    "narrative": "Parker enjoys stock counts, labels, safe handling and making sure a team can find materials. School supply-room volunteering felt satisfying even without a dramatic creative project. Parker likes clear routines and practical teamwork, wants paid training first, and imagines shared rent with a car already owned.",
    "observedContext": "Counts and organizes school-event supplies with adult supervision and checks a list before moving items. No forklift or industrial machinery qualification.",
    "unmeasuredLimits": "Reliable school routines are exposure, not tested physical ability or authorization for hazardous equipment.",
    "tags": [
      "practical-routines"
    ],
    "officialAnswers": {
      "onet-sf-01": 4,
      "onet-sf-02": 4,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 3,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 3,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 4,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 4,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 4,
      "onet-sf-35": 5,
      "onet-sf-36": 5,
      "onet-sf-37": 5,
      "onet-sf-38": 4,
      "onet-sf-39": 5,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 5,
      "onet-sf-48": 5,
      "onet-sf-49": 4,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 3,
      "onet-sf-59": 5,
      "onet-sf-60": 5
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 2,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 4,
      "field-profile-business-3": 4,
      "field-profile-science-1": 2,
      "field-profile-science-2": 3,
      "field-profile-science-3": 2,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 4,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 5,
      "field-profile-transportation-production-2": 5,
      "field-profile-transportation-production-3": 5,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 5,
      "field-profile-sales-office-3": 5
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "supported"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "independent"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "teach"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "stability",
      "community",
      "mastery"
    ],
    "context": {
      "company": "team",
      "rhythm": "routine",
      "setting": [
        "active"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "transportation-production": {
        "transportation-production-move": [
          "transportation-production-move-2"
        ],
        "transportation-production-problem": [
          "transportation-production-problem-2"
        ],
        "transportation-production-setting": [
          "transportation-production-setting-2"
        ],
        "transportation-production-workday": [
          "transportation-production-workday-2"
        ],
        "transportation-production-refine-1": [
          "transportation-production-refine-1-2"
        ],
        "transportation-production-refine-2": [
          "transportation-production-refine-2-2"
        ],
        "transportation-production-refine-3": [
          "transportation-production-refine-3-2"
        ],
        "transportation-production-refine-4": [
          "transportation-production-refine-4-2"
        ]
      }
    },
    "selectedFamily": "transportation-production",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 1,
        "groceries": 0,
        "dining": 0,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "transportation-production",
        "sales-office"
      ],
      "rolesToInspect": [
        "stock-order-filler",
        "warehouse-material-mover"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-route-organizer",
    "name": "Quinn: movement and route details",
    "grade": 12,
    "narrative": "Quinn likes map routes, timing and checking what must reach each destination. A family delivery business made the planning visible, but Quinn has not driven commercial vehicles. Paid training and independent work attract Quinn, who also wants to examine hours, licensing and the cost of transport before committing.",
    "observedContext": "Helped arrange a school delivery schedule and checked addresses with an adult. Commercial driving, lifting demands and overnight work are untried.",
    "unmeasuredLimits": "A preference for movement is not evidence of safe driving ability, license eligibility or tolerance of every driving schedule.",
    "tags": [
      "route-details"
    ],
    "officialAnswers": {
      "onet-sf-01": 4,
      "onet-sf-02": 4,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 2,
      "onet-sf-06": 2,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 2,
      "onet-sf-10": 3,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 3,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 2,
      "onet-sf-18": 2,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 3,
      "onet-sf-24": 4,
      "onet-sf-25": 3,
      "onet-sf-26": 5,
      "onet-sf-27": 3,
      "onet-sf-28": 4,
      "onet-sf-29": 3,
      "onet-sf-30": 2,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 4,
      "onet-sf-35": 5,
      "onet-sf-36": 5,
      "onet-sf-37": 4,
      "onet-sf-38": 4,
      "onet-sf-39": 4,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 2,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 2,
      "onet-sf-46": 2,
      "onet-sf-47": 5,
      "onet-sf-48": 5,
      "onet-sf-49": 4,
      "onet-sf-50": 3,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 2,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 2,
      "onet-sf-58": 3,
      "onet-sf-59": 5,
      "onet-sf-60": 4
    },
    "fieldPreferences": {
      "field-profile-creative-1": 2,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 2,
      "field-profile-technology-1": 2,
      "field-profile-technology-2": 3,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 2,
      "field-profile-health-2": 3,
      "field-profile-health-3": 2,
      "field-profile-business-1": 3,
      "field-profile-business-2": 4,
      "field-profile-business-3": 4,
      "field-profile-science-1": 2,
      "field-profile-science-2": 3,
      "field-profile-science-3": 3,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 3,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 3,
      "field-profile-services-1": 3,
      "field-profile-services-2": 3,
      "field-profile-services-3": 3,
      "field-profile-education-1": 2,
      "field-profile-education-2": 3,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 3,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 3,
      "field-profile-transportation-production-1": 5,
      "field-profile-transportation-production-2": 5,
      "field-profile-transportation-production-3": 5,
      "field-profile-sales-office-1": 3,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "independent"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "teach"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "independence",
      "stability",
      "variety"
    ],
    "context": {
      "company": "independent",
      "rhythm": "mix",
      "setting": [
        "active"
      ],
      "education": [
        "training"
      ]
    },
    "depth": {
      "transportation-production": {
        "transportation-production-move": [
          "transportation-production-move-1"
        ],
        "transportation-production-problem": [
          "transportation-production-problem-1"
        ],
        "transportation-production-setting": [
          "transportation-production-setting-1"
        ],
        "transportation-production-workday": [
          "transportation-production-workday-1"
        ],
        "transportation-production-refine-1": [
          "transportation-production-refine-1-1"
        ],
        "transportation-production-refine-2": [
          "transportation-production-refine-2-1"
        ],
        "transportation-production-refine-3": [
          "transportation-production-refine-3-1"
        ],
        "transportation-production-refine-4": [
          "transportation-production-refine-4-1"
        ]
      }
    },
    "selectedFamily": "transportation-production",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 2,
        "groceries": 1,
        "dining": 0,
        "travel": 1,
        "entertainment": 1,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "transportation-production"
      ],
      "rolesToInspect": [
        "delivery-driver",
        "truck-driver",
        "logistics"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-event-office",
    "name": "Sage: details and requests",
    "grade": 10,
    "narrative": "Sage likes an accurate appointment list, clear messages and helping a busy group know what happens next. A school event was enjoyable because the information stayed organized. Sage prefers an office/service setting to labs or repairs, is open to a certificate or degree, and wants predictable work and modest spending.",
    "observedContext": "Maintained a club event sign-up sheet and corrected duplicate entries with an adult. Has little experience resolving difficult customer situations.",
    "unmeasuredLimits": "Organization at school is not a test of clerical speed, professional judgment or general aptitude.",
    "tags": [
      "organizing"
    ],
    "officialAnswers": {
      "onet-sf-01": 2,
      "onet-sf-02": 2,
      "onet-sf-03": 3,
      "onet-sf-04": 2,
      "onet-sf-05": 3,
      "onet-sf-06": 2,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 3,
      "onet-sf-10": 3,
      "onet-sf-11": 4,
      "onet-sf-12": 5,
      "onet-sf-13": 3,
      "onet-sf-14": 2,
      "onet-sf-15": 3,
      "onet-sf-16": 2,
      "onet-sf-17": 2,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 4,
      "onet-sf-21": 2,
      "onet-sf-22": 2,
      "onet-sf-23": 2,
      "onet-sf-24": 4,
      "onet-sf-25": 2,
      "onet-sf-26": 2,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 3,
      "onet-sf-31": 4,
      "onet-sf-32": 4,
      "onet-sf-33": 3,
      "onet-sf-34": 4,
      "onet-sf-35": 5,
      "onet-sf-36": 5,
      "onet-sf-37": 3,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 2,
      "onet-sf-42": 3,
      "onet-sf-43": 3,
      "onet-sf-44": 4,
      "onet-sf-45": 3,
      "onet-sf-46": 2,
      "onet-sf-47": 5,
      "onet-sf-48": 5,
      "onet-sf-49": 4,
      "onet-sf-50": 2,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 2,
      "onet-sf-54": 2,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 3,
      "onet-sf-58": 3,
      "onet-sf-59": 5,
      "onet-sf-60": 5
    },
    "fieldPreferences": {
      "field-profile-creative-1": 3,
      "field-profile-creative-2": 3,
      "field-profile-creative-3": 3,
      "field-profile-technology-1": 3,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 3,
      "field-profile-health-1": 3,
      "field-profile-health-2": 3,
      "field-profile-health-3": 3,
      "field-profile-business-1": 4,
      "field-profile-business-2": 4,
      "field-profile-business-3": 4,
      "field-profile-science-1": 2,
      "field-profile-science-2": 3,
      "field-profile-science-3": 2,
      "field-profile-building-1": 2,
      "field-profile-building-2": 3,
      "field-profile-building-3": 3,
      "field-profile-trades-1": 2,
      "field-profile-trades-2": 2,
      "field-profile-trades-3": 2,
      "field-profile-services-1": 3,
      "field-profile-services-2": 4,
      "field-profile-services-3": 3,
      "field-profile-education-1": 3,
      "field-profile-education-2": 4,
      "field-profile-education-3": 3,
      "field-profile-public-safety-1": 2,
      "field-profile-public-safety-2": 3,
      "field-profile-public-safety-3": 2,
      "field-profile-transportation-production-1": 3,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 4,
      "field-profile-sales-office-1": 5,
      "field-profile-sales-office-2": 5,
      "field-profile-sales-office-3": 5
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "independent"
      },
      "words": {
        "level": "independent"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "independent"
      },
      "organizing": {
        "level": "teach"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "independent"
      },
      "learning": {
        "level": "independent"
      },
      "digital": {
        "level": "independent"
      }
    },
    "priorities": [
      "stability",
      "community",
      "mastery"
    ],
    "context": {
      "company": "team",
      "rhythm": "routine",
      "setting": [
        "people",
        "desk"
      ],
      "education": [
        "training",
        "college"
      ]
    },
    "depth": {
      "sales-office": {
        "sales-office-help": [
          "sales-office-help-3"
        ],
        "sales-office-problem": [
          "sales-office-problem-3"
        ],
        "sales-office-result": [
          "sales-office-result-3"
        ],
        "sales-office-workday": [
          "sales-office-workday-3"
        ],
        "sales-office-refine-1": [
          "sales-office-refine-1-3"
        ],
        "sales-office-refine-2": [
          "sales-office-refine-2-3"
        ],
        "sales-office-refine-3": [
          "sales-office-refine-3-3"
        ],
        "sales-office-refine-4": [
          "sales-office-refine-4-3"
        ]
      }
    },
    "selectedFamily": "sales-office",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 1,
        "transport": 1,
        "groceries": 1,
        "dining": 1,
        "travel": 1,
        "entertainment": 1,
        "recreation": 1,
        "clothing": 1,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [
        "sales-office",
        "business"
      ],
      "rolesToInspect": [
        "administrative-assistant",
        "office-clerk",
        "receptionist"
      ],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-still-exploring",
    "name": "Remy: little exposure and no clear favorite",
    "grade": 9,
    "narrative": "Remy has tried ordinary school tasks but cannot yet picture most work activities and uses Unsure honestly. A few new settings sound worth seeing, but Remy does not choose a specific creative project when asked. The goal is to learn what options involve; a close-to-home future with low spending is only a first sketch.",
    "observedContext": "No club, job, shadowing or distinctive project history is assumed. Wants supportive introductions and time to revisit answers.",
    "unmeasuredLimits": "Uncertainty is not incapacity. Do not manufacture a differentiated profile or infer a profession from the selected exploration tab.",
    "tags": [
      "undecided",
      "flat",
      "low-exposure"
    ],
    "officialAnswers": {
      "onet-sf-01": 3,
      "onet-sf-02": 3,
      "onet-sf-03": 3,
      "onet-sf-04": 3,
      "onet-sf-05": 3,
      "onet-sf-06": 3,
      "onet-sf-07": 3,
      "onet-sf-08": 3,
      "onet-sf-09": 3,
      "onet-sf-10": 3,
      "onet-sf-11": 3,
      "onet-sf-12": 3,
      "onet-sf-13": 3,
      "onet-sf-14": 3,
      "onet-sf-15": 3,
      "onet-sf-16": 3,
      "onet-sf-17": 3,
      "onet-sf-18": 3,
      "onet-sf-19": 3,
      "onet-sf-20": 3,
      "onet-sf-21": 3,
      "onet-sf-22": 3,
      "onet-sf-23": 3,
      "onet-sf-24": 3,
      "onet-sf-25": 3,
      "onet-sf-26": 3,
      "onet-sf-27": 3,
      "onet-sf-28": 3,
      "onet-sf-29": 3,
      "onet-sf-30": 3,
      "onet-sf-31": 3,
      "onet-sf-32": 3,
      "onet-sf-33": 3,
      "onet-sf-34": 3,
      "onet-sf-35": 3,
      "onet-sf-36": 3,
      "onet-sf-37": 3,
      "onet-sf-38": 3,
      "onet-sf-39": 3,
      "onet-sf-40": 3,
      "onet-sf-41": 3,
      "onet-sf-42": 3,
      "onet-sf-43": 3,
      "onet-sf-44": 3,
      "onet-sf-45": 3,
      "onet-sf-46": 3,
      "onet-sf-47": 3,
      "onet-sf-48": 3,
      "onet-sf-49": 3,
      "onet-sf-50": 3,
      "onet-sf-51": 3,
      "onet-sf-52": 3,
      "onet-sf-53": 3,
      "onet-sf-54": 3,
      "onet-sf-55": 3,
      "onet-sf-56": 3,
      "onet-sf-57": 3,
      "onet-sf-58": 3,
      "onet-sf-59": 3,
      "onet-sf-60": 3
    },
    "fieldPreferences": {
      "field-profile-creative-1": "untried",
      "field-profile-creative-2": "untried",
      "field-profile-creative-3": "untried",
      "field-profile-technology-1": "untried",
      "field-profile-technology-2": "untried",
      "field-profile-technology-3": "untried",
      "field-profile-health-1": "untried",
      "field-profile-health-2": "untried",
      "field-profile-health-3": "untried",
      "field-profile-business-1": "untried",
      "field-profile-business-2": "untried",
      "field-profile-business-3": "untried",
      "field-profile-science-1": "untried",
      "field-profile-science-2": "untried",
      "field-profile-science-3": "untried",
      "field-profile-building-1": "untried",
      "field-profile-building-2": "untried",
      "field-profile-building-3": "untried",
      "field-profile-trades-1": "untried",
      "field-profile-trades-2": "untried",
      "field-profile-trades-3": "untried",
      "field-profile-services-1": "untried",
      "field-profile-services-2": "untried",
      "field-profile-services-3": "untried",
      "field-profile-education-1": "untried",
      "field-profile-education-2": "untried",
      "field-profile-education-3": "untried",
      "field-profile-public-safety-1": "untried",
      "field-profile-public-safety-2": "untried",
      "field-profile-public-safety-3": "untried",
      "field-profile-transportation-production-1": "untried",
      "field-profile-transportation-production-2": "untried",
      "field-profile-transportation-production-3": "untried",
      "field-profile-sales-office-1": "untried",
      "field-profile-sales-office-2": "untried",
      "field-profile-sales-office-3": "untried"
    },
    "skills": {
      "reasoning": {
        "level": "new"
      },
      "numbers": {
        "level": "new"
      },
      "words": {
        "level": "new"
      },
      "visual": {
        "level": "new"
      },
      "practical": {
        "level": "new"
      },
      "people": {
        "level": "new"
      },
      "organizing": {
        "level": "new"
      },
      "science": {
        "level": "new"
      },
      "precision": {
        "level": "new"
      },
      "collaboration": {
        "level": "new"
      },
      "learning": {
        "level": "new"
      },
      "digital": {
        "level": "new"
      }
    },
    "priorities": [
      "curiosity",
      "community"
    ],
    "context": {
      "company": "unknown",
      "rhythm": "unknown",
      "setting": [
        "unknown"
      ],
      "education": [
        "unknown"
      ]
    },
    "depth": {
      "creative": {
        "creative-make": [],
        "creative-revise": [],
        "creative-people": [],
        "creative-workday": [],
        "creative-refine-1": [],
        "creative-refine-2": [],
        "creative-refine-3": [],
        "creative-refine-4": []
      }
    },
    "selectedFamily": "creative",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 0,
        "transport": 0,
        "groceries": 0,
        "dining": 0,
        "travel": 0,
        "entertainment": 0,
        "recreation": 0,
        "clothing": 0,
        "saving": 1
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [],
      "rolesToInspect": [],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  },
  {
    "id": "m32-many-positive",
    "name": "Charlie: many interests still open",
    "grade": 10,
    "narrative": "Charlie likes trying almost anything, from school projects to helping people and making things. None stands out reliably yet. In the creative branch Charlie selects every offered option because all sound interesting, not because each profession has distinct evidence. College, practical training and several working settings remain open; lifestyle preferences are similarly exploratory.",
    "observedContext": "Participates briefly in several school activities without a sustained specialist project. Reports some help is useful across tasks.",
    "unmeasuredLimits": "An all-positive response style must not be turned into a precise winner, measured all-round aptitude or a forced three-career identity.",
    "tags": [
      "broad-positive",
      "flat",
      "mixed-interests"
    ],
    "officialAnswers": {
      "onet-sf-01": 4,
      "onet-sf-02": 4,
      "onet-sf-03": 4,
      "onet-sf-04": 4,
      "onet-sf-05": 4,
      "onet-sf-06": 4,
      "onet-sf-07": 4,
      "onet-sf-08": 4,
      "onet-sf-09": 4,
      "onet-sf-10": 4,
      "onet-sf-11": 4,
      "onet-sf-12": 4,
      "onet-sf-13": 4,
      "onet-sf-14": 4,
      "onet-sf-15": 4,
      "onet-sf-16": 4,
      "onet-sf-17": 4,
      "onet-sf-18": 4,
      "onet-sf-19": 4,
      "onet-sf-20": 4,
      "onet-sf-21": 4,
      "onet-sf-22": 4,
      "onet-sf-23": 4,
      "onet-sf-24": 4,
      "onet-sf-25": 4,
      "onet-sf-26": 4,
      "onet-sf-27": 4,
      "onet-sf-28": 4,
      "onet-sf-29": 4,
      "onet-sf-30": 4,
      "onet-sf-31": 4,
      "onet-sf-32": 4,
      "onet-sf-33": 4,
      "onet-sf-34": 4,
      "onet-sf-35": 4,
      "onet-sf-36": 4,
      "onet-sf-37": 4,
      "onet-sf-38": 4,
      "onet-sf-39": 4,
      "onet-sf-40": 4,
      "onet-sf-41": 4,
      "onet-sf-42": 4,
      "onet-sf-43": 4,
      "onet-sf-44": 4,
      "onet-sf-45": 4,
      "onet-sf-46": 4,
      "onet-sf-47": 4,
      "onet-sf-48": 4,
      "onet-sf-49": 4,
      "onet-sf-50": 4,
      "onet-sf-51": 4,
      "onet-sf-52": 4,
      "onet-sf-53": 4,
      "onet-sf-54": 4,
      "onet-sf-55": 4,
      "onet-sf-56": 4,
      "onet-sf-57": 4,
      "onet-sf-58": 4,
      "onet-sf-59": 4,
      "onet-sf-60": 4
    },
    "fieldPreferences": {
      "field-profile-creative-1": 4,
      "field-profile-creative-2": 4,
      "field-profile-creative-3": 4,
      "field-profile-technology-1": 4,
      "field-profile-technology-2": 4,
      "field-profile-technology-3": 4,
      "field-profile-health-1": 4,
      "field-profile-health-2": 4,
      "field-profile-health-3": 4,
      "field-profile-business-1": 4,
      "field-profile-business-2": 4,
      "field-profile-business-3": 4,
      "field-profile-science-1": 4,
      "field-profile-science-2": 4,
      "field-profile-science-3": 4,
      "field-profile-building-1": 4,
      "field-profile-building-2": 4,
      "field-profile-building-3": 4,
      "field-profile-trades-1": 4,
      "field-profile-trades-2": 4,
      "field-profile-trades-3": 4,
      "field-profile-services-1": 4,
      "field-profile-services-2": 4,
      "field-profile-services-3": 4,
      "field-profile-education-1": 4,
      "field-profile-education-2": 4,
      "field-profile-education-3": 4,
      "field-profile-public-safety-1": 4,
      "field-profile-public-safety-2": 4,
      "field-profile-public-safety-3": 4,
      "field-profile-transportation-production-1": 4,
      "field-profile-transportation-production-2": 4,
      "field-profile-transportation-production-3": 4,
      "field-profile-sales-office-1": 4,
      "field-profile-sales-office-2": 4,
      "field-profile-sales-office-3": 4
    },
    "skills": {
      "reasoning": {
        "level": "supported"
      },
      "numbers": {
        "level": "supported"
      },
      "words": {
        "level": "supported"
      },
      "visual": {
        "level": "supported"
      },
      "practical": {
        "level": "supported"
      },
      "people": {
        "level": "supported"
      },
      "organizing": {
        "level": "supported"
      },
      "science": {
        "level": "supported"
      },
      "precision": {
        "level": "supported"
      },
      "collaboration": {
        "level": "supported"
      },
      "learning": {
        "level": "supported"
      },
      "digital": {
        "level": "supported"
      }
    },
    "priorities": [
      "curiosity",
      "variety",
      "community"
    ],
    "context": {
      "company": "mix",
      "rhythm": "mix",
      "setting": [
        "people",
        "desk",
        "active"
      ],
      "education": [
        "college",
        "training",
        "graduate"
      ]
    },
    "depth": {
      "creative": {
        "creative-make": [
          "creative-make-1",
          "creative-make-2",
          "creative-make-3",
          "creative-make-4",
          "creative-make-5"
        ],
        "creative-revise": [
          "creative-revise-1",
          "creative-revise-2",
          "creative-revise-3",
          "creative-revise-4"
        ],
        "creative-people": [
          "creative-people-1",
          "creative-people-2",
          "creative-people-3",
          "creative-people-4",
          "creative-people-5"
        ],
        "creative-workday": [
          "creative-workday-1",
          "creative-workday-2",
          "creative-workday-3",
          "creative-workday-4",
          "creative-workday-5"
        ],
        "creative-refine-1": [
          "creative-refine-1-1",
          "creative-refine-1-2",
          "creative-refine-1-3",
          "creative-refine-1-4",
          "creative-refine-1-5"
        ],
        "creative-refine-2": [
          "creative-refine-2-1",
          "creative-refine-2-2",
          "creative-refine-2-3",
          "creative-refine-2-4",
          "creative-refine-2-5"
        ],
        "creative-refine-3": [
          "creative-refine-3-1",
          "creative-refine-3-2",
          "creative-refine-3-3",
          "creative-refine-3-4",
          "creative-refine-3-5"
        ],
        "creative-refine-4": [
          "creative-refine-4-1",
          "creative-refine-4-2",
          "creative-refine-4-3",
          "creative-refine-4-4",
          "creative-refine-4-5"
        ]
      }
    },
    "selectedFamily": "creative",
    "lifestyle": {
      "homeMode": "rent",
      "choices": {
        "home": 2,
        "transport": 2,
        "groceries": 2,
        "dining": 2,
        "travel": 2,
        "entertainment": 2,
        "recreation": 2,
        "clothing": 2,
        "saving": 2
      }
    },
    "reviewTargets": {
      "acceptableFamilies": [],
      "rolesToInspect": [],
      "rankRequired": false,
      "routeConflict": null,
      "interpretation": "Review alternatives and explanations against the narrative; these are not guaranteed ranks or expected human outcomes."
    }
  }
]);


export const studentModelInvariants = deepFreeze([
  {id:'official-60',kind:'schema',rule:'Exactly 60 official stable IDs with integer answers 1..5; no untried in the official instrument.'},
  {id:'custom-separation',kind:'schema',rule:'36 original field answers are separately labeled; untried is allowed only in original field questions.'},
  {id:'skill-not-aptitude',kind:'interpretation',rule:'Experience levels and narrative observations are not measured ability or career-success probabilities.'},
  {id:'confidence-nonexclusion',kind:'behavior',rule:'Changing only skill familiarity must not erase interest evidence or prohibit an occupation.'},
  {id:'lifestyle-separation',kind:'behavior',rule:'Changing only nine lifestyle choices changes financial explanations, not the official interest scores or stated task preferences.'},
  {id:'route-conflict',kind:'behavior',rule:'Responsibility and preparation disagreements remain explicit; clinical routes must never be represented as interchangeable.'},
  {id:'flat-response',kind:'behavior',rule:'Uniform Unsure/Like official profiles and indiscriminate depth selections do not justify an artificially differentiated winner.'},
  {id:'task-contrast',kind:'review',rule:'Review specific writing/food evidence even if broad interest matching is weak; do not alter official answers until a preferred career wins.'},
  {id:'no-forced-rank',kind:'review',rule:'Acceptable families/roles are review targets, not an expected fixed top rank, a required three results, or predictions about humans.'},
  {id:'fresh-state',kind:'schema',rule:'Each builder call returns independent mutable state without adding synthetic notes as machine-scored answers.'}
]);

// Async so importing the FROZEN fixture cannot execute/import the app's matching
// dependency graph. Consumers explicitly opt into state construction afterwards.
export async function buildStudentModelState(specOrId, {family} = {}) {
  const spec = typeof specOrId === 'string' ? studentModels.find(s => s.id === specOrId) : specOrId;
  if (!spec || !studentModels.some(s => s.id === spec.id)) throw new Error('Unknown fictional student model');
  const selected = family ?? spec.selectedFamily;
  if (!Object.hasOwn(spec.depth, selected)) throw new Error('No authored depth answers for this family');
  const [{freshState}, {buildLifestyleInputs}] = await Promise.all([
    import('../dist/model.js'), import('../dist/lifestyle-builder.js')
  ]);
  const state = freshState();
  state.profile.nickname = spec.name;
  state.profile.grade = String(spec.grade);
  state.guide.entry = 'assessment';
  state.guide.lifestylePreset = 'custom';
  Object.assign(state.guide.lifestyleBuilder, structuredClone(spec.lifestyle), {step:8,complete:true,reviewing:false});
  state.finance.lifestyle = buildLifestyleInputs(state.guide.lifestyleBuilder, state.finance.lifestyle);
  const journey = state.profileJourney;
  journey.started = true;
  journey.introSeen = true;
  journey.followupIntroSeen = true;
  journey.questionMode = 'all';
  journey.officialInterest = {instrument:'onet-short-form-60',version:'2018-05-01',answers:structuredClone(spec.officialAnswers)};
  journey.fieldPreferences = structuredClone(spec.fieldPreferences);
  journey.skills = structuredClone(spec.skills);
  journey.answers = {...structuredClone(spec.context),values:true};
  journey.family = selected;
  journey.families = [selected];
  journey.suggestedFamilies = []; // Recommendations are deliberately not computed.
  journey.depth = structuredClone(spec.depth);
  journey.depthIndexes = Object.fromEntries(Object.entries(spec.depth).map(([id,answers]) => [id,Object.keys(answers).length-1]));
  state.priorities = [...spec.priorities];
  return state;
}
