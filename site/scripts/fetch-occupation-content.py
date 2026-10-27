#!/usr/bin/env python3
"""Fetch official O*NET 31.0 CSVs and build the reviewed career fact snapshot.

The compact output retains only the 65 occupations in data-sources/occupation-reviewed-index.json.
It does not redistribute source CSV archives. O*NET database content is CC BY 4.0; the
generated output includes attribution, release, reference dates, and source file links.
"""
import csv
import argparse
import json
import tempfile
import time
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://www.onetcenter.org/dl_files/database/db_31_0_csv/"
FILES = [
    "task_statements.csv", "task_ratings.csv", "work_context.csv",
    "work_context_categories.csv", "education.csv", "education_categories.csv",
    "training_and_experience.csv", "training_and_experience_categories.csv",
    "job_zones.csv", "related_occupations.csv",
]
SOURCE = "https://www.onetcenter.org/database.html"
LICENSE = "https://creativecommons.org/licenses/by/4.0/"
CONTEXT_NAMES = [
    "Work Schedules", "Work With or Contribute to a Work Group or Team",
    "Time Pressure", "Contact With Others", "Face-to-Face Discussions with Individuals and Within Teams",
    "Deal With External Customers or the Public in General", "Dealing With Unpleasant, Angry, or Discourteous People",
    "Conflict Situations", "Spend Time Standing", "Indoors, Environmentally Controlled",
    "Indoors, Not Environmentally Controlled", "Outdoors, Exposed to All Weather Conditions",
    "Outdoors, Under Cover", "Exposed to Disease or Infections",
]
SETTING_ELEMENTS = {
    "indoors": ["Indoors, Environmentally Controlled", "Indoors, Not Environmentally Controlled"],
    "outdoors": ["Outdoors, Exposed to All Weather Conditions", "Outdoors, Under Cover"],
}


def csv_rows(path):
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def fetch_files(folder):
    for name in FILES:
        request = urllib.request.Request(BASE + name, headers={"User-Agent": "Fieldguide O*NET 31.0 data review"})
        with urllib.request.urlopen(request, timeout=90) as response, (folder / name).open("wb") as out:
            while True:
                block = response.read(1024 * 256)
                if not block:
                    break
                out.write(block)
        time.sleep(0.15)


def top_categories(rows, descriptions, limit=3):
    values = []
    for row in rows:
        if row.get("Recommend Suppress") == "Y":
            continue
        key = (row.get("Element ID"), row.get("Scale ID"), row.get("Category"))
        value = float(row.get("Data Value") or 0)
        values.append({"category": row.get("Category"), "label": descriptions.get(key, row.get("Category") or ""), "percent": round(value, 1), "sampleSize": int(row["N"]) if row.get("N", "").isdigit() else None, "referenceDate": row.get("Date")})
    values.sort(key=lambda x: x["percent"], reverse=True)
    return values if limit is None else values[:limit]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", help="Use already-downloaded O*NET 31.0 CSV files in this directory")
    args = parser.parse_args()
    index = json.loads((ROOT / "data-sources/occupation-reviewed-index.json").read_text())
    codes = {x["soc"] for x in index}
    if len(codes) != len(index):
        raise SystemExit("Reviewed occupation index should contain unique SOC codes")
    with tempfile.TemporaryDirectory(prefix="onet31-occupation-") as tmp:
        folder = Path(args.source_dir) if args.source_dir else Path(tmp)
        if not args.source_dir:
            fetch_files(folder)
        tasks = defaultdict(list)
        for row in csv_rows(folder / "task_statements.csv"):
            if row["O*NET-SOC Code"] in codes:
                tasks[row["O*NET-SOC Code"]].append(row)
        importance = {}
        for row in csv_rows(folder / "task_ratings.csv"):
            if row["O*NET-SOC Code"] in codes and row["Scale ID"] == "IM":
                importance[(row["O*NET-SOC Code"], row["Task ID"])] = {"value": float(row["Data Value"] or 0), "sampleSize": int(row["N"]) if row.get("N", "").isdigit() else None}

        context_desc = {(r["Element ID"], r["Scale ID"], r["Category"]): r["Category Description"] for r in csv_rows(folder / "work_context_categories.csv")}
        education_desc = {(r["Element ID"], r["Scale ID"], r["Category"]): r["Category Description"] for r in csv_rows(folder / "education_categories.csv")}
        training_desc = {(r["Element ID"], r["Scale ID"], r["Category"]): r["Category Description"] for r in csv_rows(folder / "training_and_experience_categories.csv")}
        contexts = defaultdict(list)
        for row in csv_rows(folder / "work_context.csv"):
            if row["O*NET-SOC Code"] in codes and row["Element Name"] in CONTEXT_NAMES and row["Scale ID"].endswith("P"):
                contexts[row["O*NET-SOC Code"]].append(row)
        education = defaultdict(list)
        for row in csv_rows(folder / "education.csv"):
            if row["O*NET-SOC Code"] in codes and row["Element Name"] == "Required Level of Education":
                education[row["O*NET-SOC Code"]].append(row)
        training = defaultdict(list)
        for row in csv_rows(folder / "training_and_experience.csv"):
            if row["O*NET-SOC Code"] in codes and row["Element Name"] in {"Related Work Experience", "On-the-Job Training", "On-Site or In-Plant Training", "Job-related Apprenticeship"}:
                training[row["O*NET-SOC Code"]].append(row)
        zones = {r["O*NET-SOC Code"]: r for r in csv_rows(folder / "job_zones.csv") if r["O*NET-SOC Code"] in codes}
        related = defaultdict(list)
        for row in csv_rows(folder / "related_occupations.csv"):
            if row["O*NET-SOC Code"] in codes:
                related[row["O*NET-SOC Code"]].append(row)

        output = {}
        for career in index:
            code = career["soc"]
            ranked = sorted(tasks[code], key=lambda r: (importance.get((code, r["Task ID"]), {}).get("value", 0), r["Task Type"] == "Core"), reverse=True)
            # The main page shows three high-importance sourced tasks; full O*NET tasks remain in the source.
            task_records = [{"id": r["Task ID"], "text": r["Task"], "importance": importance.get((code, r["Task ID"]), {}).get("value"), "sampleSize": importance.get((code, r["Task ID"]), {}).get("sampleSize"), "taskType": r["Task Type"], "referenceDate": r["Date"]} for r in ranked[:3]]
            crows = contexts[code]
            context_items = []
            for name in CONTEXT_NAMES:
                these = [r for r in crows if r["Element Name"] == name]
                if not these:
                    continue
                sample = these[0]
                suppressed = [r for r in these if r.get("Recommend Suppress") == "Y"]
                context_items.append({"id": sample["Element ID"], "name": name, "responses": top_categories(these, context_desc, None), "distributionStatus": "partial_recommended_suppression" if suppressed else "complete_categories", "suppressedCategoryCount": len(suppressed), "sampleSize": int(sample["N"]) if sample.get("N", "").isdigit() else None, "scale": sample["Scale Name"], "referenceDate": sample["Date"]})
            settings = []
            setting_status = {}
            for setting, element_names in SETTING_ELEMENTS.items():
                any_time = 0
                complete = True
                suppressed = False
                for name in element_names:
                    rows = [r for r in crows if r["Element Name"] == name and r["Category"]]
                    if not rows:
                        complete = False
                        continue
                    if any(r.get("Recommend Suppress") == "Y" for r in rows):
                        suppressed = True
                        complete = False
                        continue
                    # For these time-at-work context questions, category 1 means Never.
                    any_time += sum(float(r["Data Value"] or 0) for r in rows if r["Category"] != "1")
                if suppressed:
                    setting_status[setting] = "not_derived_recommended_suppression"
                    continue
                if not complete:
                    setting_status[setting] = "not_available"
                    continue
                # The two related indoor/outdoor questions have separate response
                # bases; average their shares instead of summing percentages.
                if any_time / len(element_names) >= 40:
                    settings.append(setting)
                    setting_status[setting] = "reported_exposure_threshold_met"
                else:
                    setting_status[setting] = "below_browse_threshold"
            ed = education[code]
            exp = training[code]
            output[career["id"]] = {
                "soc": code,
                "jobZone": int(zones[code]["Job Zone"]) if code in zones else None,
                "jobZoneReferenceDate": zones.get(code, {}).get("Date"),
                "tasks": task_records,
                "education": top_categories(ed, education_desc),
                "training": {name: top_categories([r for r in exp if r["Element Name"] == name and r["Category"]], training_desc) for name in ["Related Work Experience", "On-the-Job Training", "On-Site or In-Plant Training"]},
                "apprenticeshipImportance": next((round(float(r["Data Value"]), 2) for r in exp if r["Element Name"] == "Job-related Apprenticeship"), None),
                "context": context_items,
                "settings": settings,
                "settingStatus": setting_status,
                "settingRule": "Indoor/outdoor browse tags are set when the mean share across two related O*NET context items shows at least 40% of incumbent responses reporting any time in that environment. Related item percentages are averaged, not added. A browse tag is not derived if O*NET marks any category for either item Recommend Suppress. This is an editorial browse threshold, not a job requirement.",
                "relatedIds": [r["Related O*NET-SOC Code"] for r in sorted(related[code], key=lambda r: int(r["Index"]))[:6]],
            }

    gaps = []
    for career in index:
        facts = output[career["id"]]
        missing = [field for field, present in [
            ("task statements", bool(facts["tasks"])),
            ("work context", bool(facts["context"])),
            ("worker education distribution", bool(facts["education"])),
            ("experience/training distributions", any(bool(rows) for rows in facts["training"].values())),
            ("Job Zone", bool(facts["jobZone"])),
        ] if not present]
        if missing:
            if career["soc"] == "27-1019.00":
                reason = "The reviewed title is a Fieldguide editorial mapping to a broader SOC group; O*NET 31.0 contains no occupation-level record for this SOC, so those occupation facts cannot be assigned to tattoo artists specifically."
            else:
                reason = "No unsuppressed occupation-level rows for these fields were available in the downloaded O*NET 31.0 tables. The missing distributions do not mean zero experience, training, or exposure."
            gaps.append({"id": career["id"], "soc": career["soc"], "missing": missing, "reason": reason})
    metadata = {"publisher": "O*NET 31.0 Database", "retrieved": "2026-10-16", "sourceURL": SOURCE, "licenseURL": LICENSE, "attribution": "Includes O*NET® 31.0 Database content, U.S. Department of Labor, Employment and Training Administration.", "modifications": "Selected three high-importance task statements; retained all unsuppressed context, education, and training response categories; withheld category shares O*NET marks Recommend Suppress; derived indoor/outdoor browse tags only from complete category sets with a disclosed 40% threshold. Retained source dates and sample counts where supplied.", "coverage": {"reviewed": len(index), "withTasks": sum(bool(v["tasks"]) for v in output.values()), "withContext": sum(bool(v["context"]) for v in output.values()), "withEducation": sum(bool(v["education"]) for v in output.values()), "withTraining": sum(bool(any(v for v in x["training"].values())) for x in output.values()), "contextItemsWithSuppressedCategories": sum(1 for v in output.values() for item in v["context"] if item["suppressedCategoryCount"]), "settingTagsNotDerivedDueToSuppression": sum(1 for v in output.values() for status in v["settingStatus"].values() if status == "not_derived_recommended_suppression"), "gaps": gaps}}
    payload = {"metadata": metadata, "occupations": output}
    (ROOT / "data-sources/onet31-occupation-facts.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    module = "export const onet31Metadata=" + json.dumps(metadata, ensure_ascii=False, separators=(",", ":")) + ";\nexport const onet31Facts=" + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (ROOT / "dist/onet-occupation-data.js").write_text(module)
    (ROOT / "validation/occupation-source-coverage.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(metadata["coverage"], indent=2))


if __name__ == "__main__":
    main()
