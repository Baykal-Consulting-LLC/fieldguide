# Fieldguide assessment blueprint

Stage 2 working specification • Version 0.1 • October 16, 2026

## Purpose and audience

Fieldguide helps students in grades 9–12 explore what interests them, gather evidence of their strengths, and connect that understanding to possible college subjects and useful experiences. It begins as a private family tool. The initial design assumes English and uses US college-planning references; the student can record another college system. Specific college recommendations require subsequent research in that system.

The student should leave with a clearer account of what she wants to investigate, questions to discuss with a counselor, and a small action plan. Completion is not a selection decision, diagnosis, admission forecast, or standardized aptitude score.

## Assessment architecture

Use separate components so demonstrated performance, self-reported preferences, and confidence retain their meaning. No total potential score is calculated. Estimates below are provisional design targets to verify with high school users.

| Component | Question | Prototype content | Intended production content | Estimated time |
| --- | --- | --- | --- | --- |
| Curiosity | Which activities attract me? | 12 original activity prompts; five preference levels plus not tried | Select an exact established interest measure; retain original reflection separately | 4–6 minutes |
| Priorities | What matters to me? | Choose and order three of eight priorities | Original values reflection; optional established external exercise | 3–4 minutes |
| Confidence and exposure | What have I tried and how confident do I feel? | Four activities with separate exposure and confidence fields | Review coverage and wording with students and a counselor | 3–4 minutes |
| Problem exploration | How do I respond to different tasks? | Four original numerical, verbal, logical, and spatial activities | Optional enrichment; a standardized ability route remains a separate decision | 5–8 minutes |
| Evidence | What experiences and existing results can inform my thinking? | One project record and an optional external assessment record | Several project records and appropriately interpreted external reports | 4–5 minutes |
| Reflection | What matters in my own story? | Three optional narrative prompts | Original prompts reviewed for clarity and counseling value | 3–5 minutes |

Context is optional: nickname, grade, application year, and target college system. Users can explore the interface without entering personal information. Six activities are deliberate interface units, not six independent validated scales.

## Instrument decision

The established-interest candidate is the O*NET Mini-IP, currently delivered through the official Interest Profiler. For stage 2, link to the official tool instead of copying, shortening, rewording, or rescoring its items. The on-site curiosity activity is original and clearly identified as a reflection. Its answers are summarized literally, without RIASEC scores or occupational-match calculations.

Before integration, select the precise version, delivery route, license, attribution, administration rules, age suitability, missing-data rules, and reporting method. The 2021 manual must be read alongside current implementation documentation and the October 2025 linkage report.

For aptitude evidence, the recommended first route is to record results from a suitable established external assessment, preserving the instrument, date, scale, comparison population, and source interpretation. The prototype accepts an optional text record, without converting scores or assigning percentiles. Uploaded documents, OCR, and automated interpretation are outside stage 2.

If we later develop a new standardized ability battery, that requires a separate measurement program with suitable expertise and participant data. The four original challenges do not substitute for it.

## Question and administration rules

Curiosity prompts describe original situations across making, investigation, expression, helping, initiative, and organization. There are two prompts per editorial theme, but those groupings are not scored as psychometric dimensions. Answers are stored by stable item identifiers. “Not tried” and unanswered remain distinct from dislike.

Priorities are selected and explicitly ordered by the student. The interface offers move-up and move-down controls. Selection order is not silently assumed to be preference order. Fewer than three can be saved as a draft; completion requires three.

Confidence is recorded separately from exposure for each activity. An unanswered confidence field remains unknown. The design permits low exposure with high confidence and high exposure with low confidence. It does not infer either from the other.

Challenges are untimed. Each has one reviewed keyed answer and a rationale. Feedback appears after submission, making them learning experiences. The report records only answers on those activities and explains that these are not normed ability measures. No speed, intelligence, or career-fit score is inferred.

Evidence and narrative prompts may be saved without completing all fields. A project description is needed to mark evidence complete. For an external result, the interface asks for the instrument and original result description, rather than forcing a number into a common scale. All private narrative responses are editable.

Every section supports revisiting. The student can leave mid-activity; answered items persist immediately when browser storage is available. A completed module can be reopened without losing its prior responses. A module becomes incomplete if required answers are removed.

## User journey

1. **Overview:** see the six short activities, current progress, and a clear way to begin.
2. **Context:** optionally add grade and planning horizon; this can be changed later.
3. **Explore myself:** complete activities in any order, with progress and short instructions.
4. **My reflection:** inspect a literal summary of personal answers, evidence, and unresolved questions.
5. **Explore directions:** browse an editorial collection of eight broad academic directions, save interesting ones, and compare up to three.
6. **Next steps:** choose an exploration activity or add an original action, mark it complete, and revisit later.
7. **Example report:** view an explicitly fictional sample showing a possible future report format.

The editorial directions remain available regardless of answers. Stage 2 does not claim to personalize career recommendations. The example report never substitutes sample facts for missing student data.

## Design system

Working name: **Fieldguide**. Visual direction: an inviting field notebook for possible futures. Use a warm paper background, deep forest text, coral, lilac, and chartreuse accents, generous spacing, and restrained line illustration. The primary task is starting or resuming a short activity.

The desktop interface has a persistent sidebar and a spacious main workspace. Mobile uses a compact header and an accessible navigation drawer. Cards carry one clear action. Display time as an estimate and completion as counts, without comparing the student to other students.

Use labeled horizontal bars only when their scale is meaningful. The personal reflection favors quotations, lists, and evidence cards. Different evidence types never share a misleading common axis. Illustration is decorative; important information remains text.

Accessibility targets include semantic landmarks, keyboard operation, visible focus, labeled inputs, non-color status indicators, responsive typography, reduced-motion support, accessible dialogs, and text alternatives. These are design and implementation targets, not a claim of certified conformance.

## Data and privacy

The prototype uses browser-local storage and sends no answers to an application server or AI service. The hosting provider still serves the site and applies its normal access and operational behavior. Private hosting is restricted to the owner's account; it does not create separate student accounts.

Progress is specific to this browser and device. Browser storage is not encrypted by the application and is accessible to people using the same browser profile. Avoid collecting full name, date of birth, school, transcripts, or other unnecessary personal details. A visible data panel supports JSON export and explicit deletion. An unavailable storage API produces a notice that progress is only available for the current session.

There is no background synchronization, analytics SDK, email, counselor sharing, or public student profile. These are future scope decisions. Export is user initiated, and the export file contains the student's entered data.

## Stage 2 completion criteria

- The complete journey works at desktop and mobile sizes.
- Activities accept, save, resume, and edit responses.
- Unknown answers never appear as low scores.
- The student can inspect and delete local data.
- Academic directions are explicitly editorial, without fabricated match percentages.
- Personal and fictional sample reports cannot be confused.
- Challenge answer keys and rationales are reviewed.
- Keyboard interactions, key navigation, persistence, and empty states are checked.
- The blueprint identifies decisions needed before validated assessment integration.

## Stage 3 decisions still required

Choose the exact established interest integration and external aptitude instrument, if any. Review the proposed content with high school students and a qualified counselor. Define any recommendation logic and its evidentiary limits before implementing it. A broader deployment needs additional requirements for student identity, permissions, device sharing, retention, and oversight.

The family can use stage 2 to review the language and journey. Its results remain exploratory until supporting work justifies stronger interpretations.

## Source anchors

- [Research brief](../../research/01-research-brief.md) and [annotated library](../../research/02-source-library.md).
- [O*NET manual](https://www.onetcenter.org/dl_files/IP_Manual.pdf), [current formats](https://www.onetcenter.org/IP.html), [2025 linkage report](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf), and [tools license](https://www.onetcenter.org/license_tools.html).
- [ASCA appraisal and advisement](https://www.schoolcounselor.org/Standards-Positions/Position-Statements/ASCA-Position-Statements/The-School-Counselor-and-Individual-Student-Planni).
- [ITC and ATP digital assessment guidelines](https://www.intestcom.org/upload/media-library/tba-guidelines-ver-11-july-2025-1754044782Z3vV9.pdf).
