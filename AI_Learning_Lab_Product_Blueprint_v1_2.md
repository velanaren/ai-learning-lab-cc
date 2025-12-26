AI Learning Lab — Product Blueprint v1.2 • 2025-12-25

AI Learning Lab
Hyper-personal daily learning system for technical mastery — with Memory and Proof-of-Work

Design constraint (non-negotiable): the default daily experience must fit into a real day.
If it cannot realistically be used daily, it is not solving the problem.

=== New in v1.2 (locked PRD decisions) ===
1) Target user scope: B — Individual learners (multi-user product)
2) Platform/login: C — Web app with OAuth (Google + GitHub)
3) Evidence capture level: D — Evidence includes GitHub integration (import commits/PRs/files) + manual evidence
4) Topic scope for first release: C — Any technical topic (user enters topic name; system generates Topic Graph + plan)

What this document contains
• Phase 0: Auth + multi-user system posture (OAuth + private-by-default).
• The complete Phase 1 questionnaire (v1.1 locked), including the inclusivity section.
• How the system turns answers into a course: Learning Strategy → Topic Graph → Daily Slices.
• Exact Daily Learning Unit structure (short topics by design) and adaptation rules.
• Memory + Proof-of-Work implementation: evidence types, capture flow, internal evidence graph, and user-visible views.
• Minimal set of screens/flows and a clean data model to guide implementation.

Version: v1.2 • Date: 2025-12-25

------------------------------------------------------------
1. Product definition
What we are building
A hyper-personal AI learning system that understands who the learner is, what they want to learn,
and how much time they have — then guides them through a structured learning journey that adapts
as the learner progresses and the ecosystem changes. This is not a chatbot and not a news aggregator.
It is a daily-use learning system you would want to use every day.

The problem we solve
• Learners follow too many sources and lose structure.
• They consume information without consistent practice.
• They learn inconsistently, so progress feels invisible.
• They struggle to apply what they read and validate understanding.

Success looks like
• Learning feels easier to maintain (daily use is realistic).
• Information feels relevant, not overwhelming.
• Progress feels visible and earned (through Memory).
• The system adapts when the learner skips days or speeds up.
• The learner trusts the system enough to keep using it after the cohort ends.

Non-goals (scope control)
• Not a full course marketplace or long-form video platform.
• Not a heavy portfolio builder. Proof-of-work emerges from Memory.
• Not an untrusted code execution sandbox (optional future).
• Not a real-time news feed; ecosystem awareness can start as a curated weekly digest.

------------------------------------------------------------
2. Core loop and mental model
Mental model: Learning → Application → Memory
The system is designed as three reinforcing layers:
• Learning: short daily sessions that build mental models.
• Application: lightweight actions that convert knowledge into capability.
• Memory: structured capture of what was learned and what was done.

Proof-of-work is a view of Memory entries that have evidence attached.
Important: users should never feel they are using a dashboard, a portfolio builder, or a graph editor.
They should feel they are completing a short, intentional daily learning session.

------------------------------------------------------------
3. Phase 0 — Multi-user, login, privacy posture (new)
Purpose
Before learning begins, the product must be safe and usable for many learners (not just you).
Phase 0 establishes: identity, private-by-default data, and evidence security.

Requirements
• Web app with OAuth login: Google + GitHub.
• Each user has their own profile, topics, plans, memory entries, and evidence items.
• Default visibility: private (especially evidence).
• GitHub is used in two places:
  1) Login option (identity).
  2) Evidence import (optional connection / minimal scopes).

------------------------------------------------------------
4. Phase 1 — Questionnaire (v1.1 locked) and learning contract
Purpose
Phase 1 happens once at onboarding (per user, per topic start if needed). The goal is to produce a learning contract:
the system asks decision-oriented questions, then generates a reflective summary (“Here is what I learned about you,
and how I will design your learning path”). The user confirms or corrects the summary before learning begins.

Rules
• Every question must change a course design decision (pace, depth, examples, tools, application frequency).
• Do not ask for diagnoses. Inclusivity is captured through comfort preferences and accessibility toggles.
• Keep it finishable in one sitting (target: 5–8 minutes).

4.1 Section 1 — Background & baseline
• Q1. What best describes your current role? (Application Support Engineer / Software Developer / DevOps-SRE / Student / Other)
• Q2. Which of these are you already comfortable with? (multi-select: Linux CLI, Bash scripting, Python, Git, Debugging prod issues, None)
• Q3. Have you used this topic before? (Never / Used basics / Built small things / Used in CI-CD / Used professionally)

4.2 Section 2 — Goals & outcomes
• Q1. Why do you want to learn this topic right now? (pick up to 2: Career transition, Improve current role, Prepare for next topic, Fundamentals, Interview prep)
• Q2. At the end, which outcomes matter most? (multi-select: Build real apps, Use in CI-CD, Understand internals, Troubleshoot, Interview-ready)
• Q3. Which statement fits you? (“use confidently” vs “devops-grade mastery”)

4.3 Section 3 — Learning structure
• Q1. Which learning flow do you trust? (concepts-first / build-first / mix)
• Q2. How should complexity increase? (gradually one layer at a time / through realistic projects)
• Q3. How important is troubleshooting practice? (low / some / very important)

4.4 Section 4 — Platform & tooling
• Q1. What system will you use? (macOS Intel / macOS Apple Silicon / Linux / Windows WSL)
• Q2. Are you okay installing tools locally? (yes / prefer minimal setup / prefer cloud where possible)

4.5 Section 5 — Time & consistency
• Q1. On most days, how much time can you realistically spend? (10–15 / 20–30 / 45–60 minutes)
• Q2. How much total time per week are you comfortable committing? (<5 / 5–10 / 10+ hours)
• Q3. If you miss days, what should the system do? (recap+continue / slow down automatically / ask before adjusting)

4.6 Section 6 — Learning style & depth
• Q1. What helps you understand complex systems? (multi-select: analogies, step-by-step labs, visuals, all)
• Q2. Which frustrates you more? (oversimplified explanations / too much theory without practice)
• Q3. Which do you agree with most? (keep it simple first vs never compromise on accuracy and depth)

4.7 Section 7 — Learning comfort & accessibility (inclusive)
• Q1. Which format helps you learn best? (pick up to 2: text-first, step-by-step labs, diagrams/mental models, short clips ≤3 min only, no videos — transcript/text only)
• Q2. How do you feel about audio/video? (avoid audio-video / short clips only / 5–10 min occasionally / longer videos ok)
• Q3. What overwhelms you most? (pick up to 2: too many new terms, long explanations without checkpoints, too many links, too much UI, setup friction)
• Q4. What daily session style feels most doable? (one concept per day / one concept + small application / project flow)
• Q5. Which order do you prefer? (TL;DR → details / details → summary / example → explanation)
• Q6. If you miss days, how should the system behave? (gentle recap / simplified restart / ask before changing pace)
• Q7. UI comfort toggles (multi-select): Focus Mode, Reduced motion, Larger text, High contrast/dark mode

4.8 Section 8 — Application & proof-of-work
• Q1. What kinds of application are you comfortable with? (multi-select: code/config snippets, running commands, linking GitHub, writing short reflections)
• Q2. What should the system track? (learning only / learning + small applications / learning + applications + evidence links)
• Q3. How important is it to answer later: “What have I actually done in this topic?” (nice-to-have / important / very important)

Output after questionnaire: the learning contract summary
Immediately after onboarding, the system generates a reflective summary that: (1) restates the learner profile, and
(2) explicitly explains how the course will be designed. The user confirms or corrects it before Day 1 begins.

Summary format requirement: the summary must clearly connect answers → course decisions
(what we will skip, what we will emphasize, the daily unit structure, and the learning comfort defaults).

------------------------------------------------------------
5. Phase 2 — Course design and daily learning delivery (any topic)
Goal
Turn the confirmed learning contract into a course that is short by design and realistic for daily use.
The user sees “Today’s learning” rather than long modules. Depth is achieved through sequencing and contextual application.

Pipeline
Step | Input | Output
A | Confirmed user profile | Learning strategy (pace, depth, structure, comfort defaults)
B | Topic name + Topic Graph generator | Draft Topic Graph (concept nodes + prerequisites) + outline view
C | User review/edits + Lock | Locked Topic Graph version (stable)
D | Learning strategy + locked graph | Daily plan (sequence of Daily Learning Units)
E | Daily usage signals | Memory entries + adaptation signals

Topic Graph (concept-level) — quality over randomness
Because v1 supports ANY topic, the system MUST:
• Generate a draft Topic Graph.
• Show it as a reviewable outline (not a graph UI).
• Require user lock/confirmation before planning begins.
• Store the locked graph as a version (so “Day 1” is reproducible and trustworthy).

Topic node template
• Concept name (one idea only)
• Prerequisites (concept IDs)
• Difficulty (beginner/intermediate/advanced)
• Why it matters (real-world relevance in one sentence)
• Common confusion (1–2 misconceptions)
• Example hook (minimal example)
• Optional application moment (small action if the learner opts in)

Daily Learning Unit (DLU) — invariant structure
Concept (5–7 min) → Concrete example (5 min) → Reflection (2–3 min) → Application optional (5–10 min)
Rule: one day = one concept. Keep it finishable.

Hard constraints (why topics stay short)
• One concept per day. If the concept is too big, split it into smaller nodes.
• No deep dives inside the DLU. Deep dives are optional links shown only when the learner asks or when needed later.
• Application is finishable. Default application moment is 5–10 minutes and optional.
• Accessibility defaults apply. If the learner prefers text-only, do not require videos; use text + diagrams + checklists.

Adaptation rules (what changes over time)
• Skipped days: show a short recap (1–3 minutes) and resume. If user preference is “ask before adjusting,” prompt before slowing down.
• Faster progress: unlock stretch concepts or shorten prerequisite review, but do not skip foundations.
• Repeated confusion: present an alternate explanation (new analogy) plus a micro-lab to validate understanding.
• Low application density: if the user opted into application, gently increase frequency of application moments; never force.
• Overwhelm: reduce external links, enforce Focus Mode, and split upcoming concepts into smaller nodes.

------------------------------------------------------------
6. Phase 3 — Memory and Proof-of-Work (implementation design)
Goal
Capture learning as structured Memory. Proof-of-work is a byproduct: a Memory entry becomes proof-backed only when evidence is attached.
The evidence graph exists internally to enable intelligent queries, not to create a “graph product.”

Topic / Skill → Concept → Memory Entry → Evidence Items
Evidence graph is internal. UI shows simple views (timeline, filters).

Memory Entry (system of record)
• Concept: what was learned
• Reflection: what changed in understanding / what is unclear
• Action taken (optional): what the learner did during application
• Tags: topic, skill, difficulty, phase
• Timestamp: when it occurred
• Evidence items (optional): links/uploads/outputs attached to this entry

Evidence types (v1.2, aligned to PRD decision D)
• GitHub (imported): repo link, PR link, commit link, file path link (marked verifiable)
• Manual links: demo URL, gist, diagram
• Execution evidence: screenshot of terminal output; pasted output (marked self-reported)
• Artifacts: small code/config snippet; markdown notes

Evidence capture UX (low-friction)
• Evidence prompt appears only after an application moment: “Did this produce something you want to remember?”
• Provide at most 3 primary actions: Import from GitHub, Paste output, Skip.
• Default visibility is private. Users can later mark items shareable (optional).
• Never ask the user to curate a portfolio. Memory entries accumulate naturally.

User-visible views powered by the internal evidence graph
• Memory Timeline: chronological list of entries (all learning).
• Applied Filter: show entries where an action was taken.
• Proof-backed Filter: show entries with evidence attached.
• Topic/Skill View: group proof-backed entries by topic or skill for quick “what have I done?” answers.
• Weekly Digest: gentle summary (applied vs read-only; count of proof-backed entries).

Truthfulness guardrails
• A memory entry is not labeled proof-backed unless at least one evidence item is attached.
• Evidence is labeled by source type: verifiable (GitHub link) vs user-provided (screenshot/output).
• System never invents metrics or achievements; it asks the learner to provide them if needed.

------------------------------------------------------------
7. Screens and flows (minimal, implementation-ready)
Core screens (v1.2)
• Welcome / Landing
• Login (Google OAuth / GitHub OAuth)
• Topic choice (enter any topic)
• Questionnaire (8 sections)
• Learning contract summary (confirm/correct)
• Topic graph outline (review/edit/lock)
• Today (Daily Learning Unit)
• Memory (timeline + filters)
• Weekly review (recap + adjustment suggestion)
• Settings (time budget, pace preference, accessibility toggles, application preference, link budget)
• GitHub connection (connect/select repo; import commits/PRs as evidence)

Onboarding flow (v1.2)
• User lands → logs in (OAuth) → enters a topic they want to learn (e.g., Docker / Go / “Kubernetes basics”).
• User completes the 8-section questionnaire.
• System produces the learning contract summary (including learning comfort defaults).
• User confirms/corrects summary.
• System generates a draft Topic Graph → user locks it.
• System generates the plan and starts Day 1 immediately.

Daily flow (unchanged)
• Open app → see Today’s concept + “why it matters” in one sentence.
• Read concept explanation (short).
• Try the minimal example.
• Answer 1–2 reflection prompts.
• Optional: complete the application moment.
• End: memory entry saved automatically; evidence prompt only if an application occurred.

Weekly review flow (unchanged)
• Show completed vs skipped days.
• Show applied vs read-only concepts (simple counts and examples).
• Suggest one adjustment (pace, recap, smaller chunks, more/less application).
• User accepts or overrides the adjustment.

------------------------------------------------------------
8. Data model (clean, sufficient for v1.2)
Entity | Key fields (examples) | Why it exists
User | id, email, name, created_at | Multi-user identity
AuthAccount | user_id, provider (google/github), provider_user_id, token_ref | OAuth link + sessions
UserProfile | role, baseline_skills[], goals/outcomes[], platform, daily_minutes/weekly_hours, pacing_pref, learning_style[], comfort_prefs, application_pref, evidence_pref | Stores confirmed learning contract inputs
LearningStrategy | start_level, phase_weighting, daily_slice_policy, application_frequency, content_format_policy, link_budget_policy | Derived decisions used to assemble the plan
Topic | user_id, name, description, tags[] | Many topics per user
TopicGraphVersion | topic_id, version, created_at, locked_by_user, nodes_json | Stable, reproducible concept graph per topic
Concept | topic_graph_version_id, title, prereq_ids[], difficulty, why_it_matters, common_confusions[], example_template, application_template | Single concept node used for sequencing & daily slicing
DailyPlan | user_id, topic_id, topic_graph_version_id, generated_at, concept_sequence[] | Stores upcoming daily schedule tied to locked graph
MemoryEntry | user_id, topic_id, concept_id, reflection_text, action_taken, tags[], created_at | System of record for learning & application
EvidenceItem | memory_entry_id, type, url_or_blob_ref, label, source_type (verifiable/self-reported), visibility | Makes memory proof-backed; supports proof views
GitHubConnection | user_id, connected_at, scopes, selected_repos[] | Enables evidence import safely

------------------------------------------------------------
9. Definition of done (v1.2)
Phase 0 done (new)
• OAuth login works (Google + GitHub).
• Multi-user separation: users cannot access others’ data.
• Default evidence visibility is private.

Phase 1 done
• Questionnaire includes all 8 sections and matches the locked wording.
• Learning contract summary is generated and the user can correct and confirm it.
• Confirmed profile persists and is used for planning.

Phase 2 done
• User can enter any topic; draft topic graph is generated and shown as an outline.
• User can lock graph version; daily plan is generated from locked graph.
• Daily Learning Unit follows the invariant template and respects the daily time budget.
• One concept per day is enforced by design (concept splitting supported).
• Adaptation handles skipped days and repeated confusion.

Phase 3 done
• Every completed day creates a MemoryEntry automatically.
• Evidence capture is optional and low-friction; evidence items attach to memory entries.
• GitHub connection enables importing commits/PRs as verifiable evidence.
• Memory timeline supports filters: applied and proof-backed.
• Proof view answers “what have I actually done?” using evidence-backed entries only.
