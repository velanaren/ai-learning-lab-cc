# Product Requirements Document: AI Learning Lab

**Version:** 1.2
**Date:** 2025-12-25
**Status:** Draft
**Target Implementation:** Claude Code
**Document Owner:** Product Team

---

## 1. Introduction/Overview

### What We're Building
AI Learning Lab is a hyper-personal daily learning system for technical mastery. It's designed to help individual learners master any technical topic through structured, adaptive learning with built-in Memory and Proof-of-Work tracking.

### The Problem We Solve
Technical learners face four critical challenges:
1. **Structure loss**: Following too many sources without coherent structure
2. **Practice gap**: Consuming information without consistent application
3. **Invisible progress**: Inconsistent learning makes growth hard to see
4. **Validation struggle**: Difficulty applying knowledge and validating understanding

### The Solution
A web-based learning system that:
- Adapts to each learner's profile, goals, and time constraints
- Delivers one concept per day in 10-30 minute sessions
- Tracks both learning (Memory) and doing (Proof-of-Work)
- Generates personalized learning paths for ANY technical topic
- Makes daily learning feel achievable, not overwhelming

### Design Constraint (Non-Negotiable)
**The default daily experience must fit into a real day.** If it cannot realistically be used daily, it is not solving the problem.

---

## 2. Goals

### Primary Goals
1. **Daily Achievability**: 90% of users can complete their daily learning unit within their chosen time budget
2. **Personalization**: Learning path adapts to user's background, goals, time, and learning preferences
3. **Visible Progress**: Users can answer "What have I learned?" and "What have I done?" at any time
4. **Topic Flexibility**: Support any technical topic through AI-generated Topic Graphs
5. **Trust & Retention**: Users continue using the system after initial motivation fades

### Success Criteria
- User completes questionnaire and locks their first Topic Graph
- User completes at least 5 consecutive days of learning
- User creates at least 3 Memory entries with evidence attached (Proof-of-Work)
- System generates personalized daily content that respects time budget
- User can view their learning timeline and filter by proof-backed entries

---

## 3. Technology Stack & Rationale

### Recommended Stack (Optimized for Claude Code Implementation)

Based on the requirement for **clean, attractive UI** (inspired by lelezhang.design aesthetic) and **Claude Code development workflow**, the following stack is recommended:

#### Frontend & Full-Stack Framework
- **Next.js 14+ (App Router)** with TypeScript
  - *Rationale*: Modern React framework with excellent DX, server components, API routes, and built-in optimization
  - *UI Benefit*: Fast page transitions, smooth interactions, great performance
  - *Claude Code Benefit*: Well-structured file conventions, TypeScript support, extensive documentation

#### Styling & UI Components
- **Tailwind CSS 3+**
  - *Rationale*: Utility-first CSS for rapid, consistent styling with design tokens
  - *UI Benefit*: Enables minimalist, clean aesthetic with precise control

- **Shadcn/ui Component Library**
  - *Rationale*: Beautiful, accessible components built on Radix UI primitives
  - *UI Benefit*: Professional components with customizable design system
  - *Claude Code Benefit*: Copy-paste components, easy to modify and understand

- **Framer Motion**
  - *Rationale*: Smooth, declarative animations
  - *UI Benefit*: Subtle transitions (0.15s duration like reference site), delightful micro-interactions

#### Backend & Database
- **Next.js API Routes** (serverless functions)
  - *Rationale*: Collocated with frontend, TypeScript end-to-end

- **PostgreSQL** (via Docker for local dev)
  - *Rationale*: Robust relational database for structured learning data

- **Prisma ORM**
  - *Rationale*: Type-safe database access, excellent migrations, great DX
  - *Claude Code Benefit*: Schema-first design, auto-generated types, clear documentation

#### Authentication
- **NextAuth.js v5** (Auth.js)
  - *Rationale*: Built for Next.js, supports OAuth providers (Google, GitHub)
  - *Claude Code Benefit*: Well-documented, convention-based configuration

#### AI Integration
- **Groq API** (LLM inference)
  - *Rationale*: Fast inference for topic graph generation, learning content creation, summaries
  - *Models*: llama-3.1-70b-versatile (reasoning), mixtral-8x7b (fast generation)

#### Development Tools
- **TypeScript 5+**: Type safety throughout
- **ESLint + Prettier**: Code quality and formatting
- **Zod**: Runtime validation and type inference
- **Docker Compose**: Local PostgreSQL + future services

### File Structure (Next.js App Router)
```
ai-learning-lab/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth-related routes
│   │   │   ├── login/
│   │   │   └── callback/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── today/
│   │   │   ├── memory/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── onboarding/        # Questionnaire flow
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── groq/
│   │   │   ├── topics/
│   │   │   └── memory/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── onboarding/
│   │   ├── learning/
│   │   ├── memory/
│   │   └── shared/
│   ├── lib/                   # Utilities & core logic
│   │   ├── db/               # Prisma client
│   │   ├── groq/             # AI integration
│   │   ├── auth/             # Auth utilities
│   │   └── utils/
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── docker-compose.yml
└── package.json
```

---

## 4. User Stories

### As a New User (Onboarding)
- **US-1**: As a learner, I want to sign in with my Google or GitHub account so I can start learning without creating a new password
- **US-2**: As a learner, I want to enter any technical topic I want to learn so the system can create a personalized path
- **US-3**: As a learner, I want to answer questions about my background and goals so the system understands how to teach me
- **US-4**: As a learner, I want to see a clear summary of what the system learned about me so I can confirm it's accurate before starting
- **US-5**: As a learner, I want to review the generated Topic Graph so I can ensure it covers what I need to learn
- **US-6**: As a learner, I want to lock my Topic Graph so my daily plan is stable and trustworthy

### As a Daily User (Learning Flow)
- **US-7**: As a learner, I want to see today's concept immediately when I open the app so I can start learning without friction
- **US-8**: As a learner, I want each daily session to fit within my time budget (10-30 min) so I can maintain consistency
- **US-9**: As a learner, I want to understand WHY a concept matters before learning it so I stay motivated
- **US-10**: As a learner, I want to see a concrete example of each concept so I can connect theory to practice
- **US-11**: As a learner, I want to reflect on what I learned so the system can track my understanding
- **US-12**: As a learner, I want optional application moments so I can practice without pressure
- **US-13**: As a learner, I want to attach evidence of what I built so I can track proof-of-work

### As a Returning User (Memory & Progress)
- **US-14**: As a learner, I want to see my learning timeline so I can review what I've covered
- **US-15**: As a learner, I want to filter my memory by "applied" and "proof-backed" so I can see what I've actually done
- **US-16**: As a learner, I want to import commits/PRs from GitHub as evidence so I don't have to manually document everything
- **US-17**: As a learner, I want a weekly review that shows my progress and suggests adjustments so the system adapts to my reality
- **US-18**: As a learner, I want the system to handle missed days gracefully so I don't feel guilty or lost

### As a Privacy-Conscious User
- **US-19**: As a learner, I want my learning data and evidence to be private by default so I control what others can see
- **US-20**: As a learner, I want to understand what GitHub permissions are needed so I can make informed decisions

---

## 5. Functional Requirements

### Phase 0: Authentication & Multi-User Foundation

#### FR-0.1: OAuth Authentication
- **FR-0.1.1**: System MUST support Google OAuth login
- **FR-0.1.2**: System MUST support GitHub OAuth login
- **FR-0.1.3**: System MUST create a User record on first successful OAuth login
- **FR-0.1.4**: System MUST maintain session state using secure HTTP-only cookies
- **FR-0.1.5**: System MUST redirect authenticated users to dashboard, unauthenticated users to login

#### FR-0.2: Multi-User Data Isolation
- **FR-0.2.1**: Each user MUST have separate UserProfile, Topics, MemoryEntries, and EvidenceItems
- **FR-0.2.2**: All database queries MUST filter by authenticated user ID
- **FR-0.2.3**: System MUST return 403 Forbidden if user attempts to access another user's data

#### FR-0.3: Privacy & Visibility
- **FR-0.3.1**: All EvidenceItems MUST default to `visibility: "private"`
- **FR-0.3.2**: Users MAY optionally mark evidence as "shareable" (future feature)
- **FR-0.3.3**: GitHub connection scope MUST request minimal permissions (read:user, read:commits)

---

### Phase 1: Questionnaire & Learning Contract

#### FR-1.1: Topic Selection
- **FR-1.1.1**: User MUST enter a topic name (free text input, e.g., "Docker", "Kubernetes basics", "Go programming")
- **FR-1.1.2**: System MUST create a Topic record associated with the user
- **FR-1.1.3**: System MUST display topic name throughout onboarding for context

#### FR-1.2: Questionnaire Structure
The questionnaire MUST include 8 sections matching the blueprint (see section 4 of blueprint). Each question MUST:
- **FR-1.2.1**: Display clear question text and answer options
- **FR-1.2.2**: Support single-select, multi-select, or scale input types
- **FR-1.2.3**: Validate that required questions are answered before proceeding
- **FR-1.2.4**: Show progress indicator (e.g., "Section 2 of 8")
- **FR-1.2.5**: Allow navigation back to previous sections to revise answers

#### FR-1.3: Section-by-Section Requirements

**Section 1: Background & Baseline**
- **FR-1.3.1**: Q1 - Current role (single-select: Application Support Engineer, Software Developer, DevOps-SRE, Student, Other)
- **FR-1.3.2**: Q2 - Comfortable skills (multi-select: Linux CLI, Bash scripting, Python, Git, Debugging prod issues, None)
- **FR-1.3.3**: Q3 - Prior experience with topic (single-select: Never, Used basics, Built small things, Used in CI-CD, Used professionally)

**Section 2: Goals & Outcomes**
- **FR-1.3.4**: Q1 - Why learning now (multi-select, max 2: Career transition, Improve current role, Prepare for next topic, Fundamentals, Interview prep)
- **FR-1.3.5**: Q2 - Desired outcomes (multi-select: Build real apps, Use in CI-CD, Understand internals, Troubleshoot, Interview-ready)
- **FR-1.3.6**: Q3 - Depth preference (single-select: "use confidently" vs "devops-grade mastery")

**Section 3: Learning Structure**
- **FR-1.3.7**: Q1 - Learning flow (single-select: concepts-first, build-first, mix)
- **FR-1.3.8**: Q2 - Complexity increase (single-select: gradually one layer at a time, through realistic projects)
- **FR-1.3.9**: Q3 - Troubleshooting importance (single-select: low, some, very important)

**Section 4: Platform & Tooling**
- **FR-1.3.10**: Q1 - Operating system (single-select: macOS Intel, macOS Apple Silicon, Linux, Windows WSL)
- **FR-1.3.11**: Q2 - Installation comfort (single-select: yes, prefer minimal setup, prefer cloud)

**Section 5: Time & Consistency**
- **FR-1.3.12**: Q1 - Daily time budget (single-select: 10-15 min, 20-30 min, 45-60 min)
- **FR-1.3.13**: Q2 - Weekly time commitment (single-select: <5 hours, 5-10 hours, 10+ hours)
- **FR-1.3.14**: Q3 - Missed day behavior (single-select: recap+continue, slow down automatically, ask before adjusting)

**Section 6: Learning Style & Depth**
- **FR-1.3.15**: Q1 - What helps understanding (multi-select: analogies, step-by-step labs, visuals, all)
- **FR-1.3.16**: Q2 - What frustrates (single-select: oversimplified explanations, too much theory without practice)
- **FR-1.3.17**: Q3 - Depth philosophy (single-select: keep it simple first, never compromise on accuracy and depth)

**Section 7: Learning Comfort & Accessibility**
- **FR-1.3.18**: Q1 - Best format (multi-select, max 2: text-first, step-by-step labs, diagrams/mental models, short clips ≤3 min, no videos—transcript/text only)
- **FR-1.3.19**: Q2 - Audio/video preference (single-select: avoid audio-video, short clips only, 5-10 min occasionally, longer videos ok)
- **FR-1.3.20**: Q3 - Overwhelm triggers (multi-select, max 2: too many new terms, long explanations without checkpoints, too many links, too much UI, setup friction)
- **FR-1.3.21**: Q4 - Daily session style (single-select: one concept per day, one concept + small application, project flow)
- **FR-1.3.22**: Q5 - Content order (single-select: TL;DR → details, details → summary, example → explanation)
- **FR-1.3.23**: Q6 - Missed day behavior (single-select: gentle recap, simplified restart, ask before changing pace)
- **FR-1.3.24**: Q7 - UI comfort toggles (multi-select: Focus Mode, Reduced motion, Larger text, High contrast/dark mode)

**Section 8: Application & Proof-of-Work**
- **FR-1.3.25**: Q1 - Comfortable application types (multi-select: code/config snippets, running commands, linking GitHub, writing short reflections)
- **FR-1.3.26**: Q2 - Tracking preference (single-select: learning only, learning + small applications, learning + applications + evidence links)
- **FR-1.3.27**: Q3 - Proof-of-work importance (single-select: nice-to-have, important, very important)

#### FR-1.4: Data Persistence
- **FR-1.4.1**: All questionnaire answers MUST be saved to UserProfile table in real-time or per-section
- **FR-1.4.2**: User MUST be able to return to incomplete questionnaire and resume from last section

#### FR-1.5: Learning Contract Summary Generation
- **FR-1.5.1**: System MUST call Groq API to generate a reflective summary immediately after questionnaire completion
- **FR-1.5.2**: Summary MUST include:
  - Learner profile restatement (role, baseline, goals)
  - Course design decisions (pace, depth, daily structure)
  - Learning comfort defaults (format preferences, accessibility settings)
  - What will be emphasized and what will be skipped
- **FR-1.5.3**: Summary MUST be shown to user in a reviewable format
- **FR-1.5.4**: User MUST confirm or request corrections to summary before proceeding
- **FR-1.5.5**: System MUST generate LearningStrategy record based on confirmed summary

#### FR-1.6: Learning Contract UI Requirements
- **FR-1.6.1**: Summary MUST be presented in readable, well-formatted text (not raw JSON)
- **FR-1.6.2**: User MUST have "Confirm & Continue" and "Edit My Answers" buttons
- **FR-1.6.3**: If user edits answers, summary MUST be regenerated

---

### Phase 2: Topic Graph & Daily Learning Delivery

#### FR-2.1: Topic Graph Generation
- **FR-2.1.1**: System MUST call Groq API to generate a draft Topic Graph based on:
  - Topic name
  - User's LearningStrategy (depth, pace, outcomes)
  - Estimated total hours (from weekly commitment)
- **FR-2.1.2**: Each Topic Graph node MUST include:
  - Concept name (single idea, short title)
  - Prerequisites (array of concept IDs)
  - Difficulty level (beginner, intermediate, advanced)
  - "Why it matters" (1 sentence real-world relevance)
  - Common confusions (1-2 misconceptions)
  - Example hook (minimal code/command example)
  - Optional application moment (small action, 5-10 min)
- **FR-2.1.3**: System MUST generate 15-40 concept nodes for typical 4-8 week learning path
- **FR-2.1.4**: Topic Graph MUST respect prerequisite ordering (no circular dependencies)

#### FR-2.2: Topic Graph Review & Lock
- **FR-2.2.1**: System MUST display Topic Graph as a reviewable outline (NOT a graph UI)
- **FR-2.2.2**: Outline view MUST show:
  - Grouped by difficulty or phase
  - Concept names with "why it matters" preview
  - Estimated day number for each concept
- **FR-2.2.3**: User MUST be able to request regeneration with adjustments (e.g., "add more troubleshooting", "skip basics")
- **FR-2.2.4**: User MUST explicitly lock the Topic Graph before daily plan generation
- **FR-2.2.5**: System MUST create a TopicGraphVersion record (immutable snapshot)
- **FR-2.2.6**: Locked graph version MUST be used for all subsequent daily planning

#### FR-2.3: Daily Plan Generation
- **FR-2.3.1**: System MUST generate DailyPlan based on:
  - Locked TopicGraphVersion
  - LearningStrategy (time budget, pacing)
  - Prerequisite ordering
- **FR-2.3.2**: Daily plan MUST sequence concepts respecting prerequisites
- **FR-2.3.3**: System MUST assign one concept per day (Day 1, Day 2, etc.)
- **FR-2.3.4**: Daily plan MUST be queryable (e.g., "What is Day 5?")

#### FR-2.4: Daily Learning Unit (DLU) Structure
Each Daily Learning Unit MUST follow this invariant structure:

- **FR-2.4.1**: **Concept Introduction** (5-7 min)
  - Concept title and "why it matters" (1 sentence)
  - Core explanation (short, clear, aligned to user's learning style)
  - Key takeaways (2-3 bullet points)

- **FR-2.4.2**: **Concrete Example** (5 min)
  - Minimal, runnable example (code snippet, command, or diagram)
  - Step-by-step walkthrough
  - Expected output or result

- **FR-2.4.3**: **Reflection Prompts** (2-3 min)
  - 1-2 questions to validate understanding
  - Free text input (saved to MemoryEntry)

- **FR-2.4.4**: **Optional Application Moment** (5-10 min)
  - Only shown if user opted into application during questionnaire
  - Small, finishable action (write snippet, run command, modify example)
  - Clear success criteria
  - Evidence capture prompt after completion

#### FR-2.5: DLU Content Generation
- **FR-2.5.1**: System MUST call Groq API to generate DLU content for each day
- **FR-2.5.2**: Content MUST respect user's learning preferences:
  - Format (text-first, video, diagrams)
  - Depth (simple vs accurate)
  - Order (TL;DR first, example first, etc.)
  - Accessibility (no videos if user prefers text-only)
- **FR-2.5.3**: Content MUST fit within user's daily time budget
- **FR-2.5.4**: Generated content MUST be cached for performance (not regenerated on each view)

#### FR-2.6: Daily Learning UI Requirements
- **FR-2.6.1**: "Today" screen MUST show current day's DLU immediately
- **FR-2.6.2**: Progress indicator MUST show "Day X of Y"
- **FR-2.6.3**: Navigation MUST allow moving to next day only after current day is marked complete
- **FR-2.6.4**: User MUST be able to mark day as complete manually
- **FR-2.6.5**: System MUST create MemoryEntry automatically when day is marked complete
- **FR-2.6.6**: If application moment was completed, evidence prompt MUST appear

#### FR-2.7: Adaptation Rules
- **FR-2.7.1**: **Skipped Days**: If user misses 1-2 days, show 1-3 min recap of last concept before today's content
- **FR-2.7.2**: **Longer Absence**: If user misses 3+ days, offer to slow down pace (if pref is "ask before adjusting")
- **FR-2.7.3**: **Faster Progress**: If user completes days early and shows mastery, unlock optional "stretch concepts"
- **FR-2.7.4**: **Repeated Confusion**: If user struggles with reflection (detected via saved answers), offer alternate explanation or micro-lab
- **FR-2.7.5**: **Overwhelm**: If user explicitly reports overwhelm, reduce link density and split upcoming concepts into smaller nodes

---

### Phase 3: Memory & Proof-of-Work

#### FR-3.1: Memory Entry Creation
- **FR-3.1.1**: System MUST automatically create a MemoryEntry when user completes a Daily Learning Unit
- **FR-3.1.2**: MemoryEntry MUST include:
  - Linked concept (concept_id)
  - User's reflection text (from reflection prompts)
  - Action taken (optional, from application moment)
  - Tags (topic, skill, difficulty, phase)
  - Timestamp
  - Evidence item IDs (array, initially empty)
- **FR-3.1.3**: User MUST be able to manually add MemoryEntry for self-study or external learning

#### FR-3.2: Evidence Capture Flow
- **FR-3.2.1**: Evidence prompt MUST appear only after an application moment is completed
- **FR-3.2.2**: Prompt MUST ask: "Did this produce something you want to remember?"
- **FR-3.2.3**: User MUST have these primary actions:
  - Import from GitHub (if connected)
  - Paste output/link
  - Upload screenshot
  - Skip
- **FR-3.2.4**: All evidence MUST default to `visibility: "private"`
- **FR-3.2.5**: Evidence MUST be attached to current MemoryEntry

#### FR-3.3: Evidence Types
System MUST support these evidence types:

- **FR-3.3.1**: **GitHub (Imported)**
  - Repo link
  - PR link
  - Commit link
  - File path link
  - Marked as `source_type: "verifiable"`

- **FR-3.3.2**: **Manual Links**
  - Demo URL
  - Gist link
  - Diagram link (Excalidraw, Figma, etc.)
  - Marked as `source_type: "user-provided"`

- **FR-3.3.3**: **Execution Evidence**
  - Terminal output (pasted text)
  - Screenshot upload
  - Marked as `source_type: "self-reported"`

- **FR-3.3.4**: **Artifacts**
  - Code snippet (text)
  - Config file (text)
  - Markdown notes
  - Marked as `source_type: "user-provided"`

#### FR-3.4: GitHub Integration
- **FR-3.4.1**: User MUST be able to connect GitHub account separately from login (optional)
- **FR-3.4.2**: System MUST request minimal OAuth scopes (read:user, read:commits, read:pull_requests)
- **FR-3.4.3**: User MUST be able to select which repos to import evidence from
- **FR-3.4.4**: System MUST allow importing:
  - Recent commits (last 30 days)
  - Recent PRs (last 30 days)
  - Specific file paths
- **FR-3.4.5**: Imported GitHub items MUST be attached to selected MemoryEntry
- **FR-3.4.6**: GitHub connection MUST be revocable from settings

#### FR-3.5: Memory Timeline View
- **FR-3.5.1**: Memory timeline MUST show all MemoryEntries in reverse chronological order
- **FR-3.5.2**: Each entry MUST display:
  - Concept name
  - Date
  - Reflection preview (first 100 chars)
  - Proof-backed badge (if evidence attached)
  - Evidence count
- **FR-3.5.3**: User MUST be able to expand entry to see full reflection and evidence items

#### FR-3.6: Memory Filters
- **FR-3.6.1**: **All**: Show all MemoryEntries (default)
- **FR-3.6.2**: **Applied**: Show entries where action_taken is not null
- **FR-3.6.3**: **Proof-Backed**: Show entries with at least one EvidenceItem attached
- **FR-3.6.4**: **By Topic**: Group entries by topic_id
- **FR-3.6.5**: **By Skill**: Group entries by skill tag

#### FR-3.7: Weekly Review Flow
- **FR-3.7.1**: System MUST generate weekly review every 7 days from user's start date
- **FR-3.7.2**: Weekly review MUST show:
  - Days completed vs skipped (count + percentage)
  - Applied vs read-only concepts (count)
  - Proof-backed entries count
  - Example highlights (1-2 entries with evidence)
- **FR-3.7.3**: System MUST suggest one adjustment based on actual usage:
  - If >2 skipped days: offer to slow down pace
  - If all days completed: offer to increase complexity or unlock stretch concepts
  - If no application: gently encourage trying application moments
  - If overwhelmed signals: offer to split upcoming concepts
- **FR-3.7.4**: User MUST be able to accept or reject suggested adjustment

#### FR-3.8: Truthfulness Guardrails
- **FR-3.8.1**: MemoryEntry MUST NOT be labeled "proof-backed" unless at least one EvidenceItem is attached
- **FR-3.8.2**: Evidence MUST be labeled by source_type: "verifiable", "user-provided", or "self-reported"
- **FR-3.8.3**: System MUST NOT invent metrics, achievements, or badges without user-provided evidence
- **FR-3.8.4**: GitHub evidence MUST include link to verify authenticity

---

### Cross-Cutting Functional Requirements

#### FR-4.1: Settings & Preferences
- **FR-4.1.1**: User MUST be able to update daily time budget
- **FR-4.1.2**: User MUST be able to toggle accessibility preferences (Focus Mode, Reduced motion, Larger text, High contrast)
- **FR-4.1.3**: User MUST be able to adjust application frequency (none, occasional, every day)
- **FR-4.1.4**: User MUST be able to view and disconnect GitHub connection
- **FR-4.1.5**: Settings changes MUST take effect immediately for future DLUs (not retroactively)

#### FR-4.2: Navigation
- **FR-4.2.1**: Authenticated users MUST have persistent navigation to: Today, Memory, Settings
- **FR-4.2.2**: Today view MUST be the default landing page for authenticated users
- **FR-4.2.3**: Unauthenticated users MUST be redirected to landing/login page

#### FR-4.3: Error Handling
- **FR-4.3.1**: If Groq API call fails, system MUST show user-friendly error and allow retry
- **FR-4.3.2**: If database operation fails, system MUST log error and show generic error message (not expose DB details)
- **FR-4.3.3**: If GitHub OAuth fails, system MUST allow user to continue without GitHub connection

#### FR-4.4: Data Export (Future)
- **FR-4.4.1**: User SHOULD be able to export their MemoryEntries as JSON
- **FR-4.4.2**: User SHOULD be able to export proof-backed entries as Markdown resume format

---

## 6. Non-Goals (Out of Scope)

### Explicitly NOT Building
1. **Course Marketplace**: No multi-instructor courses, no paid course creation, no revenue sharing
2. **Long-Form Video Platform**: No hosting of video content, no live streaming, no video editing tools
3. **Portfolio Builder UI**: No drag-drop portfolio creation, no public profiles (privacy-first)
4. **Code Execution Sandbox**: No in-browser code execution, no untrusted code running
5. **Real-Time News Feed**: No live topic updates, no breaking news alerts, no social feed
6. **Gamification**: No points, levels, badges, or leaderboards (progress is intrinsic, not competitive)
7. **Social Features**: No following, comments, likes, or sharing (v1 is single-player)
8. **Mobile Native Apps**: Web-responsive only, no iOS/Android native apps
9. **Offline Mode**: No offline content access, requires internet connection
10. **Collaborative Learning**: No study groups, no peer review, no shared workspaces

### Deferred to Future Versions
- Public shareable profiles (if users opt-in)
- Team/cohort learning features
- Curated ecosystem digests (weekly newsletters)
- Advanced GitHub analytics (contribution graphs, language breakdown)
- Integration with other evidence sources (GitLab, Bitbucket, Notion)

---

## 7. Design Considerations

### Design Philosophy
Inspired by lelezhang.design aesthetic: **minimalist, personality-driven, clean with warm human touches**.

### Core Design Principles
1. **Generous Whitespace**: Let content breathe, avoid visual clutter
2. **Subtle Interactions**: 0.15s transitions, smooth animations via Framer Motion
3. **Personality Without Noise**: Warm, conversational tone in microcopy, but professional UI
4. **Visual Hierarchy**: Clear focus on primary actions, muted secondary elements
5. **Accessibility First**: High contrast mode, focus indicators, keyboard navigation, screen reader support

### Color Palette Recommendations
```
Primary Background: #FBFBFC (warm off-white)
Primary Text: #1A1A1A (near black, high contrast)
Secondary Text: #6B7280 (warm gray)
Accent/Primary Action: #3B82F6 (blue, trust/learning)
Success/Progress: #10B981 (green, growth)
Proof-Backed Highlight: #F59E0B (amber, achievement)
Error/Warning: #EF4444 (red, attention)
```

### Typography
- **Headings**: Inter or Instrument Sans (clean, modern)
- **Body**: System font stack for performance (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Code**: JetBrains Mono or Fira Code (monospace with ligatures)

### Component Design Patterns

#### Daily Learning Unit Card
```
┌──────────────────────────────────────────┐
│  Day 5 • Docker                         │
│  ────────────────────────────────────   │
│                                          │
│  Understanding Container Images          │
│  Why it matters: Images are the blueprint│
│  for containers—mastering images means   │
│  faster builds and smaller deployments.  │
│                                          │
│  [Continue Reading →]                    │
└──────────────────────────────────────────┘
```

#### Memory Entry Card
```
┌──────────────────────────────────────────┐
│  Docker Container Images  🏆 Proof-backed│
│  2 days ago                              │
│  ────────────────────────────────────    │
│  "Learned how multi-stage builds reduce  │
│  image size by 70%. Built a Go app..."   │
│                                          │
│  📎 2 evidence items                     │
│  [View Details]                          │
└──────────────────────────────────────────┘
```

#### Evidence Capture Modal (Low-Friction)
```
┌────────────────────────────────────────────┐
│  Nice work! Did this produce something    │
│  you want to remember?                    │
│  ──────────────────────────────────────   │
│                                            │
│  [🐙 Import from GitHub]                  │
│  [📋 Paste output or link]                │
│  [Skip for now]                           │
│                                            │
└────────────────────────────────────────────┘
```

### Responsive Design
- **Desktop (1024px+)**: Two-column layout (content + context sidebar)
- **Tablet (768px-1023px)**: Single column, collapsible sidebar
- **Mobile (320px-767px)**: Single column, bottom navigation

### Animation Guidelines
- Page transitions: 150ms ease-out
- Card hover: subtle lift (2px shadow)
- Button press: scale(0.98)
- Loading states: skeleton screens (not spinners)
- Success feedback: gentle confetti or checkmark animation

### Accessibility Requirements
- **FR-7.1**: All interactive elements MUST have visible focus indicators
- **FR-7.2**: All images and icons MUST have descriptive alt text
- **FR-7.3**: Color MUST NOT be the only means of conveying information
- **FR-7.4**: All forms MUST have clear labels and error messages
- **FR-7.5**: Keyboard navigation MUST work for all core flows
- **FR-7.6**: Screen reader announcements MUST guide through questionnaire and daily learning
- **FR-7.7**: Reduced motion preference MUST disable animations when enabled

---

## 8. Technical Considerations

### Database Schema (Prisma)

#### User & Auth Tables
```prisma
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  name          String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  authAccounts  AuthAccount[]
  profile       UserProfile?
  topics        Topic[]
  memoryEntries MemoryEntry[]
  githubConn    GitHubConnection?
}

model AuthAccount {
  id              String   @id @default(cuid())
  userId          String
  provider        String   // "google" | "github"
  providerUserId  String
  accessToken     String?  @db.Text
  refreshToken    String?  @db.Text
  expiresAt       DateTime?

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerUserId])
  @@index([userId])
}

model UserProfile {
  id                   String   @id @default(cuid())
  userId               String   @unique

  // Section 1: Background
  role                 String?
  baselineSkills       String[] @default([])
  priorExperience      String?

  // Section 2: Goals
  learningGoals        String[] @default([])
  desiredOutcomes      String[] @default([])
  depthPreference      String?

  // Section 3: Structure
  learningFlow         String?
  complexityIncrease   String?
  troubleshootingPref  String?

  // Section 4: Platform
  operatingSystem      String?
  installationComfort  String?

  // Section 5: Time
  dailyMinutes         Int?
  weeklyHours          Int?
  missedDayBehavior    String?

  // Section 6: Style
  understandingHelpers String[] @default([])
  frustrationTrigger   String?
  depthPhilosophy      String?

  // Section 7: Comfort & Accessibility
  preferredFormats     String[] @default([])
  audioVideoPreference String?
  overwhelmTriggers    String[] @default([])
  sessionStyle         String?
  contentOrder         String?
  uiToggles            String[] @default([])

  // Section 8: Application
  applicationTypes     String[] @default([])
  trackingPreference   String?
  proofOfWorkImportance String?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model LearningStrategy {
  id                   String   @id @default(cuid())
  userId               String
  topicId              String

  startLevel           String   // "beginner" | "intermediate" | "advanced"
  phaseWeighting       Json     // { "fundamentals": 40, "application": 40, "advanced": 20 }
  dailySlicePolicy     String   // "one-concept-strict" | "micro-concepts-allowed"
  applicationFrequency String   // "none" | "optional-frequent" | "required-daily"
  contentFormatPolicy  Json     // { "video": false, "diagrams": true, "text": true }
  linkBudgetPolicy     String   // "minimal" | "moderate" | "extensive"

  createdAt            DateTime @default(now())

  @@index([userId, topicId])
}
```

#### Topic & Learning Tables
```prisma
model Topic {
  id                 String               @id @default(cuid())
  userId             String
  name               String
  description        String?
  tags               String[]             @default([])
  createdAt          DateTime             @default(now())

  user               User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  graphVersions      TopicGraphVersion[]
  dailyPlans         DailyPlan[]
  memoryEntries      MemoryEntry[]

  @@index([userId])
}

model TopicGraphVersion {
  id                 String     @id @default(cuid())
  topicId            String
  version            Int        @default(1)
  nodesJson          Json       // Array of concept nodes
  lockedByUser       Boolean    @default(false)
  lockedAt           DateTime?
  createdAt          DateTime   @default(now())

  topic              Topic      @relation(fields: [topicId], references: [id], onDelete: Cascade)
  concepts           Concept[]
  dailyPlans         DailyPlan[]

  @@unique([topicId, version])
  @@index([topicId])
}

model Concept {
  id                    String               @id @default(cuid())
  graphVersionId        String

  title                 String
  prerequisiteIds       String[]             @default([])
  difficulty            String               // "beginner" | "intermediate" | "advanced"
  whyItMatters          String
  commonConfusions      String[]             @default([])
  exampleTemplate       String               @db.Text
  applicationTemplate   String?              @db.Text

  graphVersion          TopicGraphVersion    @relation(fields: [graphVersionId], references: [id], onDelete: Cascade)
  memoryEntries         MemoryEntry[]

  @@index([graphVersionId])
}

model DailyPlan {
  id                 String               @id @default(cuid())
  userId             String
  topicId            String
  graphVersionId     String

  conceptSequence    Json                 // Array of { day: 1, conceptId: "..." }
  generatedAt        DateTime             @default(now())

  topic              Topic                @relation(fields: [topicId], references: [id], onDelete: Cascade)
  graphVersion       TopicGraphVersion    @relation(fields: [graphVersionId], references: [id], onDelete: Cascade)

  @@unique([userId, topicId, graphVersionId])
  @@index([userId, topicId])
}
```

#### Memory & Evidence Tables
```prisma
model MemoryEntry {
  id                 String          @id @default(cuid())
  userId             String
  topicId            String
  conceptId          String?

  reflectionText     String          @db.Text
  actionTaken        String?         @db.Text
  tags               String[]        @default([])
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  user               User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic              Topic           @relation(fields: [topicId], references: [id], onDelete: Cascade)
  concept            Concept?        @relation(fields: [conceptId], references: [id], onDelete: SetNull)
  evidenceItems      EvidenceItem[]

  @@index([userId, topicId])
  @@index([createdAt])
}

model EvidenceItem {
  id                 String       @id @default(cuid())
  memoryEntryId      String

  type               String       // "github" | "manual_link" | "screenshot" | "output" | "artifact"
  urlOrBlobRef       String       @db.Text
  label              String?
  sourceType         String       // "verifiable" | "user-provided" | "self-reported"
  visibility         String       @default("private") // "private" | "shareable"
  createdAt          DateTime     @default(now())

  memoryEntry        MemoryEntry  @relation(fields: [memoryEntryId], references: [id], onDelete: Cascade)

  @@index([memoryEntryId])
}

model GitHubConnection {
  id                 String       @id @default(cuid())
  userId             String       @unique

  connectedAt        DateTime     @default(now())
  accessToken        String       @db.Text
  scopes             String[]     @default([])
  selectedRepos      String[]     @default([])

  user               User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### API Routes Structure

```
/api/auth/
  [...nextauth]/route.ts       # NextAuth.js handlers

/api/topics/
  route.ts                     # POST: Create topic
  [id]/route.ts                # GET: Fetch topic details
  [id]/graph/route.ts          # POST: Generate Topic Graph
  [id]/graph/lock/route.ts     # POST: Lock Topic Graph version
  [id]/plan/route.ts           # GET: Fetch daily plan

/api/onboarding/
  profile/route.ts             # POST: Save questionnaire answers
  summary/route.ts             # POST: Generate learning contract summary

/api/learning/
  today/route.ts               # GET: Fetch today's DLU
  [day]/complete/route.ts      # POST: Mark day as complete

/api/memory/
  route.ts                     # GET: Fetch memory entries, POST: Create entry
  [id]/route.ts                # GET: Fetch single entry, PATCH: Update entry
  [id]/evidence/route.ts       # POST: Add evidence to entry

/api/github/
  connect/route.ts             # POST: Initiate GitHub OAuth connection
  repos/route.ts               # GET: Fetch user's repos
  import/route.ts              # POST: Import commits/PRs as evidence

/api/groq/
  generate/route.ts            # POST: Generic Groq API proxy (internal use)
```

### Environment Variables
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_learning_lab

# Auth (NextAuth.js)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Groq API
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL_REASONING=llama-3.1-70b-versatile
GROQ_MODEL_FAST=mixtral-8x7b-instant-v0.1
```

### Performance Considerations
- **FR-8.1**: Topic Graph generation MUST complete within 10 seconds
- **FR-8.2**: Daily Learning Unit content MUST be cached after first generation
- **FR-8.3**: Memory timeline MUST paginate (20 entries per page)
- **FR-8.4**: Database queries MUST use proper indexes (defined in Prisma schema)
- **FR-8.5**: Images MUST use Next.js Image component with optimization
- **FR-8.6**: API routes MUST implement rate limiting for Groq API calls

### Security Considerations
- **FR-8.7**: All API routes MUST validate user authentication
- **FR-8.8**: User input MUST be sanitized before database insertion
- **FR-8.9**: OAuth tokens MUST be encrypted at rest
- **FR-8.10**: GitHub access tokens MUST use minimal scopes
- **FR-8.11**: Evidence file uploads MUST validate file types and size (<5MB)
- **FR-8.12**: HTTPS MUST be enforced in production

---

## 9. Groq API Integration & Prompts

### Groq API Setup

```typescript
// lib/groq/client.ts
import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODELS = {
  reasoning: "llama-3.1-70b-versatile",  // For complex generation
  fast: "mixtral-8x7b-instant-v0.1",     // For quick responses
};
```

### Prompt Templates

#### 1. Learning Contract Summary Generation

**Purpose**: Generate reflective summary after questionnaire completion

**Input**: UserProfile data (all questionnaire answers)

**Prompt Template**:
```typescript
const learningContractPrompt = `You are an expert learning designer. Based on the following learner profile, generate a clear, reflective learning contract summary.

LEARNER PROFILE:
- Role: ${profile.role}
- Baseline Skills: ${profile.baselineSkills.join(", ")}
- Prior Experience with Topic: ${profile.priorExperience}
- Learning Goals: ${profile.learningGoals.join(", ")}
- Desired Outcomes: ${profile.desiredOutcomes.join(", ")}
- Daily Time Budget: ${profile.dailyMinutes} minutes
- Weekly Commitment: ${profile.weeklyHours} hours
- Learning Flow Preference: ${profile.learningFlow}
- Depth Philosophy: ${profile.depthPhilosophy}
- Preferred Formats: ${profile.preferredFormats.join(", ")}
- Accessibility Needs: ${profile.uiToggles.join(", ")}
- Application Preference: ${profile.trackingPreference}

TASK:
Generate a learning contract summary in this format:

## Who You Are
[2-3 sentences restating their background, role, and current skill level]

## What You Want to Achieve
[2-3 sentences describing their goals and desired outcomes]

## How We'll Design Your Learning Path
[3-4 bullet points explaining course design decisions:]
- Pace: [daily time budget, weekly structure]
- Depth: [simple-first vs accuracy-first, based on their philosophy]
- Structure: [concepts-first, build-first, or mixed]
- Application: [frequency and type of hands-on work]

## Learning Comfort Defaults
[2-3 bullet points on format, accessibility, overwhelm prevention]

## What We'll Emphasize
[2 bullet points on what will be prioritized based on their goals]

## What We'll Skip or Minimize
[2 bullet points on what will be de-emphasized to respect time budget]

Keep the tone warm, clear, and actionable. Use "we" language (collaborative). Make it feel like a thoughtful teacher who listened carefully.`;

const response = await groq.chat.completions.create({
  model: MODELS.reasoning,
  messages: [{ role: "user", content: learningContractPrompt }],
  temperature: 0.7,
  max_tokens: 1000,
});

return response.choices[0].message.content;
```

**Expected Output**: Markdown-formatted summary (500-800 words)

---

#### 2. Topic Graph Generation

**Purpose**: Generate structured concept graph for any technical topic

**Input**:
- Topic name (e.g., "Docker", "Kubernetes basics")
- LearningStrategy (depth, outcomes, time commitment)
- UserProfile (baseline skills, prior experience)

**Prompt Template**:
```typescript
const topicGraphPrompt = `You are an expert curriculum designer for technical topics. Generate a Topic Graph (concept-level learning path) for the following topic.

TOPIC: ${topicName}

LEARNER CONTEXT:
- Baseline Skills: ${profile.baselineSkills.join(", ")}
- Prior Experience with ${topicName}: ${profile.priorExperience}
- Desired Outcomes: ${strategy.desiredOutcomes.join(", ")}
- Start Level: ${strategy.startLevel}
- Weekly Hours Available: ${profile.weeklyHours}
- Depth Preference: ${strategy.depthPhilosophy}

REQUIREMENTS:
1. Generate 15-40 concept nodes (target: ${estimatedConcepts} concepts based on ${profile.weeklyHours} hours/week for 6-8 weeks)
2. Each concept should be ONE clear idea (if too big, split into smaller nodes)
3. Respect prerequisite ordering (foundational concepts first)
4. Label difficulty: beginner, intermediate, or advanced
5. Focus on outcomes: ${strategy.desiredOutcomes.join(", ")}

OUTPUT FORMAT (JSON):
{
  "concepts": [
    {
      "id": "concept-1",
      "title": "Clear, concise concept name (5-8 words max)",
      "prerequisiteIds": ["concept-id-1", "concept-id-2"],
      "difficulty": "beginner | intermediate | advanced",
      "whyItMatters": "One sentence explaining real-world relevance",
      "commonConfusions": [
        "Misconception 1 that learners often have",
        "Misconception 2 to address"
      ],
      "exampleHook": "Minimal code snippet, command, or diagram reference",
      "applicationMoment": "Optional: Small 5-10 min action learner can take (e.g., 'Run docker ps and inspect output')"
    }
  ]
}

IMPORTANT:
- If learner has prior experience (${profile.priorExperience}), skip absolute basics
- If depth preference is "simple-first", start with practical usage before internals
- If depth preference is "never compromise", include architecture and internals early
- Ensure prerequisites are realistic (don't require concept-20 to understand concept-5)

Generate the Topic Graph now as valid JSON.`;

const response = await groq.chat.completions.create({
  model: MODELS.reasoning,
  messages: [{ role: "user", content: topicGraphPrompt }],
  temperature: 0.6,
  max_tokens: 4000,
  response_format: { type: "json_object" },
});

const topicGraph = JSON.parse(response.choices[0].message.content);
return topicGraph;
```

**Expected Output**: JSON object with array of concept nodes

---

#### 3. Daily Learning Unit Content Generation

**Purpose**: Generate full DLU content for a specific concept

**Input**:
- Concept (from Topic Graph)
- UserProfile (learning preferences, time budget, format preferences)
- LearningStrategy

**Prompt Template**:
```typescript
const dluPrompt = `You are an expert technical educator. Generate a complete Daily Learning Unit for the following concept.

CONCEPT: ${concept.title}
Why it matters: ${concept.whyItMatters}
Difficulty: ${concept.difficulty}

LEARNER PREFERENCES:
- Daily Time Budget: ${profile.dailyMinutes} minutes (including optional application)
- Preferred Formats: ${profile.preferredFormats.join(", ")}
- Content Order: ${profile.contentOrder}
- Depth Philosophy: ${profile.depthPhilosophy}
- Learning Flow: ${profile.learningFlow}
- Overwhelm Triggers: ${profile.overwhelmTriggers.join(", ")}

STRUCTURE REQUIREMENTS:
1. **Concept Introduction** (5-7 min read)
   - Hook: Start with ${concept.whyItMatters}
   - Core Explanation: Clear, ${profile.depthPhilosophy === 'simple-first' ? 'simple-first' : 'accurate and detailed'}
   - Key Takeaways: 2-3 bullet points

2. **Concrete Example** (5 min)
   - Use this as inspiration: ${concept.exampleHook}
   - Provide runnable code/command with expected output
   - Step-by-step walkthrough

3. **Reflection Prompts** (2-3 min)
   - 2 questions to validate understanding
   - Open-ended, encourage thinking

4. **Application Moment** (5-10 min, optional)
   ${concept.applicationMoment ? `- Suggested activity: ${concept.applicationMoment}` : '- Design a small, finishable action related to this concept'}
   - Clear success criteria
   - Should produce evidence (code, output, or insight)

FORMAT PREFERENCES:
${profile.preferredFormats.includes('text-first') ? '- Prioritize clear text explanations' : ''}
${profile.preferredFormats.includes('diagrams/mental models') ? '- Include ASCII diagram or describe visual mental model' : ''}
${profile.audioVideoPreference === 'avoid audio-video' || profile.preferredFormats.includes('no videos—transcript/text only') ? '- NO VIDEO LINKS (user prefers text-only)' : ''}
${profile.contentOrder === 'TL;DR → details' ? '- Start with TL;DR summary, then details' : ''}
${profile.contentOrder === 'example → explanation' ? '- Start with example, then explain concepts' : ''}

COMMON CONFUSIONS TO ADDRESS:
${concept.commonConfusions.map(c => `- ${c}`).join('\n')}

IMPORTANT:
- Total content must fit within ${profile.dailyMinutes} minutes
- Avoid overwhelming: ${profile.overwhelmTriggers.includes('too many new terms') ? 'limit jargon, define terms inline' : ''}
- ${profile.overwhelmTriggers.includes('too many links') ? 'Maximum 2 external links' : 'Can include helpful links'}
- ${profile.overwhelmTriggers.includes('setup friction') ? 'Minimize setup steps, use what learner already has' : ''}

OUTPUT FORMAT (Markdown):
Generate the complete Daily Learning Unit content now.`;

const response = await groq.chat.completions.create({
  model: MODELS.reasoning,
  messages: [{ role: "user", content: dluPrompt }],
  temperature: 0.7,
  max_tokens: 2500,
});

return response.choices[0].message.content;
```

**Expected Output**: Markdown-formatted DLU content (800-1500 words)

---

#### 4. Weekly Review & Adjustment Suggestion

**Purpose**: Analyze user's weekly activity and suggest one adaptation

**Input**:
- MemoryEntries from past 7 days
- Completed vs skipped days
- Applied vs read-only entries
- User's pacing preference

**Prompt Template**:
```typescript
const weeklyReviewPrompt = `You are a thoughtful learning coach. Analyze this learner's past week and suggest ONE helpful adjustment.

WEEKLY ACTIVITY:
- Days Completed: ${completedDays} / 7
- Days Skipped: ${skippedDays}
- Concepts Learned: ${completedDays}
- Applied (action taken): ${appliedCount}
- Proof-backed (evidence attached): ${proofBackedCount}

LEARNER PREFERENCES:
- Missed Day Behavior Preference: ${profile.missedDayBehavior}
- Application Preference: ${profile.trackingPreference}
- Daily Time Budget: ${profile.dailyMinutes} minutes

TASK:
1. Provide a brief, warm summary of the week (2-3 sentences)
2. Suggest ONE adjustment from these options:
   - If >2 skipped days and pref is "ask before adjusting": Suggest slowing down pace
   - If all days completed + all applied: Suggest increasing complexity or unlocking stretch concepts
   - If 0 applied and user opted into application: Gently encourage trying application moments
   - If user seems overwhelmed (many skips + low completion): Suggest splitting upcoming concepts
   - If steady progress: Affirm current pace and suggest maintaining momentum

OUTPUT FORMAT (Markdown):
## This Week's Progress
[2-3 sentence summary with specific numbers and positive tone]

## Suggested Adjustment
[Clear, actionable suggestion in 2-3 sentences. Frame as invitation, not mandate.]

Keep tone encouraging, data-driven, and respectful of their autonomy.`;

const response = await groq.chat.completions.create({
  model: MODELS.fast,
  messages: [{ role: "user", content: weeklyReviewPrompt }],
  temperature: 0.8,
  max_tokens: 400,
});

return response.choices[0].message.content;
```

**Expected Output**: Markdown summary + suggestion (200-300 words)

---

### Groq API Error Handling

```typescript
// lib/groq/error-handler.ts
export async function callGroqWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;

      // Don't retry on 4xx errors (bad request, auth issues)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Exponential backoff for 5xx and network errors
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

---

## 10. Claude Code Implementation Strategy

### How to Leverage Claude Code Features

Claude Code is uniquely suited for this project because of its:
1. **Long context**: Can understand entire codebase and Blueprint simultaneously
2. **Tool use**: File operations, git integration, terminal commands
3. **Iterative development**: Build feature-by-feature with continuous validation
4. **Skills system**: Custom workflows for repetitive tasks

### Recommended Implementation Workflow

#### Phase 0: Project Setup & Foundation
**Skills to Create:**
- `/setup-nextjs`: Initialize Next.js project with TypeScript, Tailwind, Shadcn/ui
- `/setup-db`: Setup Prisma schema, generate migrations, seed database
- `/setup-auth`: Configure NextAuth.js with Google + GitHub providers

**Tasks:**
1. Initialize Next.js 14 project with App Router
2. Install dependencies (Tailwind, Shadcn/ui, Prisma, NextAuth, Groq SDK, Framer Motion)
3. Setup Prisma schema (all models from section 8)
4. Configure NextAuth.js with OAuth providers
5. Create Docker Compose file for local PostgreSQL
6. Setup environment variables template
7. Implement base layout with navigation
8. Create reusable UI components (Button, Card, Input, Modal from Shadcn/ui)

**Claude Code Commands:**
```bash
# Let Claude setup the entire foundation
"Setup a Next.js 14 project with TypeScript, Tailwind CSS, and App Router.
Use the file structure from section 3 of the PRD. Install all dependencies
including Prisma, NextAuth, Groq SDK, Shadcn/ui, and Framer Motion."

"Create the complete Prisma schema based on section 8 of the PRD. Include all
models: User, AuthAccount, UserProfile, LearningStrategy, Topic, TopicGraphVersion,
Concept, DailyPlan, MemoryEntry, EvidenceItem, GitHubConnection."

"Setup NextAuth.js v5 with Google and GitHub OAuth providers. Create the
[...nextauth]/route.ts file and configure session handling."
```

#### Phase 1: Authentication & Onboarding
**Skills to Create:**
- `/create-api-route [name]`: Scaffold new API route with TypeScript types
- `/create-page [path]`: Scaffold new page with layout

**Tasks:**
1. Build landing page with OAuth login buttons
2. Implement OAuth callback handlers
3. Create protected route middleware
4. Build topic selection screen
5. Build 8-section questionnaire UI (multi-step form)
6. Implement questionnaire data persistence
7. Integrate Groq API for learning contract summary generation
8. Build summary review & confirmation screen

**Claude Code Commands:**
```bash
"Create the login page at /app/login with Google and GitHub OAuth buttons.
Style it with Tailwind to match the minimalist aesthetic from section 7."

"Build the questionnaire flow at /app/onboarding with 8 sections matching
FR-1.3 from the PRD. Use a multi-step form with progress indicator. Include
all 27 questions with proper input types (single-select, multi-select, scale)."

"Implement the Groq API integration for learning contract summary generation.
Use the prompt template from section 9.1 of the PRD. Create API route at
/api/onboarding/summary."

"Create the learning contract summary review screen. Show the generated
summary with 'Confirm & Continue' and 'Edit My Answers' buttons. Match the
card design from section 7."
```

#### Phase 2: Topic Graph & Daily Learning
**Skills to Create:**
- `/generate-topic-graph [topicName]`: Quick test of topic graph generation
- `/preview-dlu [conceptId]`: Preview generated DLU content

**Tasks:**
1. Implement Topic Graph generation (Groq API integration)
2. Build Topic Graph outline review UI
3. Implement graph lock functionality
4. Generate daily plan from locked graph
5. Build "Today" screen with DLU rendering
6. Implement Markdown rendering for DLU content
7. Create reflection prompt UI
8. Implement day completion flow
9. Add navigation between days

**Claude Code Commands:**
```bash
"Implement Topic Graph generation using Groq API. Use the prompt template
from section 9.2 of the PRD. Create API route at /api/topics/[id]/graph.
Return JSON with concept nodes."

"Build the Topic Graph review screen at /app/onboarding/graph. Display
concepts as a grouped outline (by difficulty). Show 'Why it matters' for
each concept. Include 'Lock & Continue' button."

"Create the Today screen at /app/(dashboard)/today. Fetch current day's DLU
content from API. Render Markdown content with syntax highlighting for code
blocks. Include reflection prompts at the bottom."

"Implement the Daily Learning Unit content generation. Use the prompt
template from section 9.3 of the PRD. Cache generated content in database.
Create API route at /api/learning/today."
```

#### Phase 3: Memory & Proof-of-Work
**Skills to Create:**
- `/create-memory-entry [conceptId]`: Quick memory entry creation for testing
- `/import-github-evidence`: Test GitHub evidence import flow

**Tasks:**
1. Implement automatic Memory Entry creation on day completion
2. Build Memory timeline UI
3. Implement evidence capture modal
4. Add GitHub OAuth connection (separate from login)
5. Implement GitHub commits/PRs import
6. Build evidence attachment flow
7. Implement memory filters (all, applied, proof-backed)
8. Create weekly review generation
9. Build weekly review UI with adjustment suggestion

**Claude Code Commands:**
```bash
"Implement automatic MemoryEntry creation when user completes a day. Save
reflection text and action taken to database. Create API route at
/api/memory/route.ts."

"Build the Memory timeline at /app/(dashboard)/memory. Display all
MemoryEntries in reverse chronological order. Show proof-backed badge for
entries with evidence. Use card design from section 7."

"Create the evidence capture modal. Show after application moment completion.
Include 'Import from GitHub', 'Paste output', and 'Skip' buttons. Match the
low-friction design from section 7."

"Implement GitHub connection flow. Create separate OAuth connection (not
login) with minimal scopes (read:user, read:commits, read:pull_requests).
Store connection in GitHubConnection table. Create API route at
/api/github/connect."

"Build the weekly review screen. Generate review using Groq API (prompt
template from section 9.4). Show progress summary and adjustment suggestion.
Include 'Accept' and 'Keep Current Pace' buttons."
```

#### Phase 4: Settings & Polish
**Tasks:**
1. Build settings screen (time budget, accessibility, preferences)
2. Implement Focus Mode toggle
3. Add reduced motion preference
4. Implement dark mode / high contrast mode
5. Add loading states (skeleton screens)
6. Implement error boundaries
7. Add success animations (Framer Motion)
8. Polish responsive design (mobile, tablet, desktop)
9. Add keyboard navigation
10. Test screen reader compatibility

**Claude Code Commands:**
```bash
"Create the settings page at /app/(dashboard)/settings. Include sections for
time budget, accessibility toggles (Focus Mode, Reduced motion, Larger text,
High contrast), and application preferences. Save updates to UserProfile."

"Implement dark mode using Tailwind's dark variant. Add toggle in settings.
Persist preference to database and apply on page load."

"Add Framer Motion animations for page transitions (150ms ease-out), card
hover effects, and success feedback. Follow animation guidelines from
section 7."

"Create skeleton loading states for Topic Graph, Daily Learning Unit, and
Memory timeline. Use Shadcn/ui Skeleton component."
```

### Development Best Practices for Claude Code

1. **Incremental Commits**: Ask Claude Code to commit after each completed feature
   ```bash
   "Commit the questionnaire implementation with a descriptive message"
   ```

2. **Type Safety**: Always request TypeScript types for API responses
   ```bash
   "Create TypeScript types for the Topic Graph API response in /src/types/topic.ts"
   ```

3. **Component Reusability**: Extract reusable components early
   ```bash
   "Extract the concept card into a reusable component at /src/components/learning/ConceptCard.tsx"
   ```

4. **Testing**: Request validation steps
   ```bash
   "Add console logs to debug the Groq API response. Show me what the response looks like."
   ```

5. **Documentation**: Generate inline comments for complex logic
   ```bash
   "Add JSDoc comments to the topic graph generation function explaining the algorithm"
   ```

### Skill Recommendations

Create these custom skills for faster development:

#### `/create-api`
```bash
# Quickly scaffold a new API route with TypeScript, auth check, and error handling
```

#### `/add-groq-prompt [name]`
```bash
# Add a new Groq prompt template to lib/groq/prompts.ts
```

#### `/create-component [name]`
```bash
# Scaffold a new React component with TypeScript, props interface, and basic styling
```

#### `/test-flow [flowName]`
```bash
# Generate test data and guide through testing a complete user flow
```

---

## 11. Success Metrics

### Phase 0 Success (Auth & Multi-User)
- [ ] User can sign in with Google OAuth
- [ ] User can sign in with GitHub OAuth
- [ ] Each user has isolated data (cannot see other users' topics/memory)
- [ ] Evidence defaults to private visibility
- [ ] Session persists across page refreshes

### Phase 1 Success (Questionnaire & Learning Contract)
- [ ] User can enter a topic name
- [ ] User can complete all 8 sections of questionnaire
- [ ] User can navigate back to edit previous answers
- [ ] Learning contract summary is generated successfully via Groq API
- [ ] User can confirm or reject summary
- [ ] UserProfile is saved with all answers
- [ ] LearningStrategy is created based on confirmed summary

### Phase 2 Success (Topic Graph & Daily Learning)
- [ ] Topic Graph is generated for any valid topic via Groq API
- [ ] Topic Graph contains 15-40 concepts with prerequisites
- [ ] User can review Topic Graph as outline
- [ ] User can lock Topic Graph version
- [ ] Daily plan is generated from locked graph
- [ ] User can view "Today's" Daily Learning Unit
- [ ] DLU content respects user's time budget and format preferences
- [ ] User can complete reflection prompts
- [ ] Optional application moment appears when enabled
- [ ] Day completion creates MemoryEntry automatically
- [ ] User can navigate to next day after completion

### Phase 3 Success (Memory & Proof-of-Work)
- [ ] MemoryEntry is created with reflection text
- [ ] Evidence capture modal appears after application moment
- [ ] User can paste output/link as evidence
- [ ] User can connect GitHub (separate from login OAuth)
- [ ] User can import GitHub commits/PRs as evidence
- [ ] Evidence is attached to MemoryEntry
- [ ] Memory timeline displays all entries
- [ ] "Proof-backed" filter shows only entries with evidence
- [ ] Weekly review is generated via Groq API
- [ ] User can accept or reject adjustment suggestion

### Overall Product Success
- [ ] Average questionnaire completion time: <8 minutes
- [ ] Daily Learning Unit completion time: within user's time budget (90% compliance)
- [ ] Topic Graph generation time: <10 seconds
- [ ] At least 60% of users complete 5+ consecutive days
- [ ] At least 40% of users attach evidence to 3+ memory entries
- [ ] Zero cross-user data leakage incidents
- [ ] Page load time (LCP): <2.5 seconds on 4G connection
- [ ] Accessibility score (Lighthouse): >90

---

## 12. Implementation Phases & Checklist

### Phase 0: Foundation (Week 1)
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Install Shadcn/ui components (Button, Card, Input, Label, Checkbox, RadioGroup, Select, Textarea, Modal, Skeleton)
- [ ] Setup Prisma with PostgreSQL
- [ ] Create all database models (schema.prisma)
- [ ] Run initial migration
- [ ] Setup Docker Compose for local DB
- [ ] Configure NextAuth.js with Google OAuth
- [ ] Configure NextAuth.js with GitHub OAuth
- [ ] Create protected route middleware
- [ ] Build base layout with navigation
- [ ] Create landing page with login
- [ ] Test OAuth login flow end-to-end

### Phase 1: Onboarding (Week 2-3)
- [ ] Create topic selection screen
- [ ] Build multi-step questionnaire UI
  - [ ] Section 1: Background (3 questions)
  - [ ] Section 2: Goals (3 questions)
  - [ ] Section 3: Structure (3 questions)
  - [ ] Section 4: Platform (2 questions)
  - [ ] Section 5: Time (3 questions)
  - [ ] Section 6: Style (3 questions)
  - [ ] Section 7: Comfort (7 questions)
  - [ ] Section 8: Application (3 questions)
- [ ] Implement progress indicator
- [ ] Add form validation
- [ ] Implement back/forward navigation
- [ ] Create API route for saving profile (/api/onboarding/profile)
- [ ] Setup Groq API client
- [ ] Implement learning contract summary generation
- [ ] Create API route for summary (/api/onboarding/summary)
- [ ] Build summary review screen
- [ ] Implement confirm/edit flow
- [ ] Create LearningStrategy generation logic
- [ ] Test complete onboarding flow

### Phase 2A: Topic Graph (Week 4)
- [ ] Implement Topic Graph generation prompt
- [ ] Create API route for graph generation (/api/topics/[id]/graph)
- [ ] Build graph outline review UI
- [ ] Group concepts by difficulty/phase
- [ ] Add "Why it matters" preview
- [ ] Implement regeneration with feedback
- [ ] Create lock functionality
- [ ] Save TopicGraphVersion to database
- [ ] Generate daily plan from locked graph
- [ ] Create API route for daily plan (/api/topics/[id]/plan)
- [ ] Test Topic Graph for various topics (Docker, Go, Kubernetes)

### Phase 2B: Daily Learning (Week 5-6)
- [ ] Implement DLU content generation prompt
- [ ] Create API route for today's DLU (/api/learning/today)
- [ ] Build "Today" screen UI
- [ ] Implement Markdown rendering (with syntax highlighting)
- [ ] Create concept introduction section
- [ ] Create concrete example section
- [ ] Create reflection prompts UI
- [ ] Create optional application moment section
- [ ] Implement day completion API (/api/learning/[day]/complete)
- [ ] Auto-create MemoryEntry on completion
- [ ] Add day navigation (previous, next)
- [ ] Implement recap for skipped days
- [ ] Cache DLU content in database
- [ ] Test daily flow for full week

### Phase 3A: Memory System (Week 7)
- [ ] Create MemoryEntry model methods
- [ ] Create API routes for memory (/api/memory)
- [ ] Build Memory timeline UI
- [ ] Display entries in reverse chronological order
- [ ] Implement pagination (20 per page)
- [ ] Create expanded entry view
- [ ] Implement filters dropdown
- [ ] Add "All" filter
- [ ] Add "Applied" filter
- [ ] Add "Proof-backed" filter
- [ ] Add "By Topic" grouping
- [ ] Test memory timeline with 50+ entries

### Phase 3B: Evidence & Proof-of-Work (Week 8)
- [ ] Build evidence capture modal
- [ ] Create "Paste output" flow
- [ ] Implement manual link attachment
- [ ] Create screenshot upload (file handling)
- [ ] Create API route for evidence (/api/memory/[id]/evidence)
- [ ] Implement GitHub connection OAuth flow (separate)
- [ ] Create API route for GitHub connection (/api/github/connect)
- [ ] Implement repo selection UI
- [ ] Build commit/PR import logic
- [ ] Create API route for import (/api/github/import)
- [ ] Attach GitHub evidence to memory entries
- [ ] Display evidence items in memory entry view
- [ ] Add "Proof-backed" badge to timeline cards
- [ ] Test evidence flow (manual + GitHub)

### Phase 3C: Weekly Review (Week 9)
- [ ] Implement weekly review generation prompt
- [ ] Create API route for weekly review (/api/learning/weekly)
- [ ] Calculate weekly statistics (completed, skipped, applied, proof-backed)
- [ ] Generate adjustment suggestion via Groq
- [ ] Build weekly review UI
- [ ] Display progress summary
- [ ] Display adjustment suggestion
- [ ] Implement accept/reject adjustment
- [ ] Schedule weekly review trigger (cron or on 7th day visit)
- [ ] Test weekly review with various activity patterns

### Phase 4: Settings & Polish (Week 10-11)
- [ ] Build settings page UI
- [ ] Implement time budget update
- [ ] Implement accessibility toggles (Focus Mode, Reduced motion, Larger text, High contrast)
- [ ] Implement dark mode
- [ ] Add GitHub connection management (view, disconnect)
- [ ] Create application preference toggle
- [ ] Implement Focus Mode (hide distractions)
- [ ] Add Framer Motion animations
  - [ ] Page transitions (150ms)
  - [ ] Card hover effects
  - [ ] Success feedback animations
- [ ] Create loading states (skeleton screens)
  - [ ] Topic Graph loading
  - [ ] DLU loading
  - [ ] Memory timeline loading
- [ ] Implement error boundaries
- [ ] Add error messages for API failures
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Implement keyboard navigation
- [ ] Test with screen reader (basic ARIA support)
- [ ] Run Lighthouse audit (aim for >90 accessibility score)

### Phase 5: Testing & Deployment (Week 12)
- [ ] Create seed script for test data
- [ ] Test complete user journey (signup → day 7 → weekly review)
- [ ] Test edge cases (empty states, API failures, slow connections)
- [ ] Implement rate limiting for Groq API
- [ ] Add analytics tracking (privacy-respecting)
- [ ] Create Docker production build
- [ ] Setup environment variables for production
- [ ] Deploy to hosting platform (Vercel recommended)
- [ ] Test OAuth in production environment
- [ ] Run performance audit
- [ ] Create user documentation (README)
- [ ] Prepare demo video/screenshots

---

## 13. Open Questions

### Technical Decisions Needed
1. **Groq API Rate Limiting**: What are the rate limits for Groq API? Should we implement request queuing?
2. **Content Caching Strategy**: Should we pre-generate all DLU content when graph is locked, or generate on-demand?
3. **Image Storage**: For screenshot uploads, use local filesystem, AWS S3, or Vercel Blob Storage?
4. **Analytics**: Should we track usage analytics? If yes, which privacy-respecting tool (Plausible, PostHog)?

### Product Decisions Needed
5. **Topic Graph Editing**: Can users edit locked Topic Graph later, or must they start a new topic?
6. **Multi-Topic Support**: Can users learn multiple topics concurrently, or one at a time?
7. **Evidence Sharing**: Should v1 include shareable proof-of-work view (public URL), or defer to v2?
8. **Pausing Topics**: Can users pause a topic and resume later, or is it always active?

### UX Refinements Needed
9. **Onboarding Length**: Is 8 sections too long? Should we allow skipping optional sections?
10. **Mobile Experience**: Should we build a simplified mobile view, or full responsive?
11. **Notifications**: Should we send email reminders for missed days (requires email service)?
12. **Keyboard Shortcuts**: Should we add keyboard shortcuts for power users (j/k navigation, etc.)?

---

## 14. Appendix

### Glossary
- **DLU (Daily Learning Unit)**: Structured daily lesson with concept, example, reflection, and optional application
- **Topic Graph**: Directed graph of concept nodes with prerequisites, representing full learning path
- **Memory Entry**: Captured record of what was learned and applied for a specific concept
- **Proof-of-Work**: Memory entries with attached evidence (code, links, outputs)
- **Learning Contract**: User-confirmed summary of how their course will be designed

### References
- Blueprint Document: `AI_Learning_Lab_Product_Blueprint_v1_2.md`
- Design Inspiration: https://lelezhang.design
- Next.js Documentation: https://nextjs.org/docs
- Shadcn/ui Components: https://ui.shadcn.com
- Prisma Documentation: https://www.prisma.io/docs
- Groq API Documentation: https://console.groq.com/docs

### Contact
For questions about this PRD, contact the product team.

---

**End of PRD**

*This document is optimized for implementation with Claude Code. Each section includes specific prompts and commands to guide development. The implementation checklist provides clear milestones for tracking progress.*
