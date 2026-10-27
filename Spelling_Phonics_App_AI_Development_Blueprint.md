# MASTER DEVELOPMENT BLUEPRINT
## Cross-Platform Phonics, Reading & Spelling Learning App
**Version:** 1.0 (implementation specification)  
**Platforms:** iPhone, iPad, Android phones, Android tablets  
**Working title:** WordPath (placeholder; do not assume trademark clearance)  
**Primary audience:** Beginning readers, children with parent-managed profiles, teens, adult literacy learners, and English-language learners  
**Owner-facing requirement:** The owner must add and manage words, audio, images, phonics lessons, and learning pathways from a secure web backend without code changes or new app releases.

---

## 0. Instructions to the AI development agent

You are the lead mobile developer, backend developer, learning-product engineer, accessibility engineer, and QA engineer. **Build a working, production-oriented iOS/Android application and a functional web-based admin panel from this specification.** Do not merely generate UI mockups, boilerplate, or a concept description. Break development into independently working, tested milestones, completing the core learning engine before extras. Use a monorepo with shared types and well-defined dependencies. Before installing dependencies, check current stable Expo/React Native versions and documentation for compatibility. Provide real migrations, environment variable templates, tests, README/setup instructions, and demo seed content. Never fabricate deployments, payments, app store approval, or passing test results. If cloud credentials or signing certificates are absent, implement and demonstrate the pieces that can run locally, and list the exact outstanding steps.

**Preserve the vision:** This is an educational tool inspired by the complementary *mechanics* of (A) phonics-card recognition and spoken sound questions, and (B) picture-driven physical letter-card word construction. Reference products supplied by the owner: https://www.amazon.com/dp/B0C5B4YHF8 and https://www.amazon.com/dp/B0D49YXR29 . These are conceptual references, not a request to reproduce their copyrighted artwork, branding, recordings, exact cards, or proprietary content. It must teach learners to recognize sounds, blend/segment words, spell them by manipulating letters, understand their meaning, and move through an explicit learning pathway. It is **not** primarily an arcade game, an AI-generated banner tool, a generic flashcard screen, or a random-word spelling quiz. Do not copy third-party product branding, card art, recorded sounds, proprietary instructional sequences, or other protected assets.

**Nonnegotiables:**
- Real iOS and Android builds from one mobile codebase; tablet-responsive.
- English first. Word-answer strings contain **2 through 10 English letters**, inclusive, for v1. One word per spelling challenge; case-insensitive validation.
- Admin-created published content appears in the app after synchronization, **without an app-store update**, provided no code change is needed.
- Spoken phonics teaching and pictured/spoken word building are separate but connected learning experiences.
- Large, touch-friendly draggable letter tiles with **tap-to-select/tap-to-place alternative**.
- Correct handling of duplicate letter tiles (e.g. LETTER, BANANA, STRAWBERRY).
- Age-neutral curriculum content with **Kids**, **Teens**, and **Adults** presentation modes. The starting skill is chosen or established by an optional placement check; do not force adults through preschool screens.
- Offline gameplay for downloaded/packaged lessons and durable progress sync after reconnection.
- Parent-controlled child profiles, no child-directed ads, no chat/social features, no open-ended generative AI directed at children, no unnecessary data collection.
- Clear accessibility, error feedback, audio replay, progress saving, and parent/admin controls.

## 1. Product definition & educational goals

### Product promise
"Listen to sounds. Build words with letters. Understand them. Grow into confident readers and spellers." The app combines:

**Toy concept A — Phonics recognition:** Show or speak a phonics prompt. Learner recognizes letters, phonemes, sound-spelling patterns, short/long vowels, consonant blends, digraphs, vowel teams, silent letters, word beginnings/endings, and increasingly difficult decoding patterns. Provide multiple forms of prompt, not just one multiple-choice layout.

**Toy concept B — Picture-led spelling:** Show a curated picture or illustration and speak the target word. Learner places individual draggable letter tiles in answer slots in the correct order, hears feedback, and can move placed tiles back or swap them.

**Combined progression:** Hear/identify → practice sound(s) → blend/segment → arrange letters → hear/read completed word → learn meaning/use → revisit skill until mastered.

**Instructional integrity:** Word length is not itself a reading curriculum. Pathways must advance by **phonics skills and prerequisites**, using shorter and longer words where appropriate. Avoid asserting that each letter makes one sound. A digraph such as SH may be two letter tiles but corresponds to one phoneme; a silent-e pattern requires its own explanation. Educator-reviewable phonics data is needed rather than assuming phonemes can be reliably derived from spelling.

### Primary learning outcomes
1. Recognize letter names and letter sounds.
2. Hear and distinguish phonemes and common spelling patterns.
3. Blend spoken phonemes into words and segment words into sounds.
4. Build/spell words of 2–10 letters using interactive tiles.
5. Read and recognize taught words in new contexts.
6. Understand vocabulary via appropriate pictures, definitions, and simple sentences.
7. Demonstrate independent recall, not just success after hints.

## 2. Target learner experiences

- **Kids Mode:** Friendly, colorful, very large targets, illustrated rewards, voice-first navigation, minimal text dependence, no countdowns by default, child-safe area.
- **Teens Mode:** Modern, less childish appearance, personal progress, relevant examples, optional friendly challenges without penalties.
- **Adults Mode:** Clean/neutral style, useful everyday vocabulary, clearer explanations and practical sentence examples. Same pedagogy underneath, adjustable assistance.
- **English Learner option:** Slower replay, optional written meaning in the first language as a future feature; v1 supports English audio and English definitions. Never claim translations that have not been reviewed.
- **Parent/guardian:** Owns parent account, creates local child aliases, controls downloads, purchases, cloud sync, progress and account deletion.
- **Administrator:** Authenticated, authorized website account managing word and lesson content and publication.

Do not rely on self-reported age alone as a privacy compliance strategy. Treat the product as potentially child-directed and obtain appropriate legal/policy review before release.

## 3. Essential learner flows

### A. First launch
1. Splash with original brand.
2. Choose Kids / Teens / Adults presentation (parent may select for children).
3. Choose local guest learner, optional adult account or parent-managed account. **Core free offline lesson playable without transmitting child data.**
4. Choose "Start from beginning" or "Find my level" (optional 5–10 brief, audio-guided tasks).
5. Start first eligible skill lesson; save state.

### B. Daily lesson (short, 5–8 minutes recommended, not enforced)
1. Friendly spoken and visual objective such as "Let's hear /sh/".
2. Sound recognition task: hear a sound and select the matching letters or compare examples.
3. Guided picture/word: show image, say target word, offer replay.
4. Word build: learner places shuffled **individual letter tiles** (2–10) in answer slots.
5. Sound it out: play skill-appropriate segmented phonemes or blends; highlight grapheme groupings visually without implying one letter = one sound.
6. Meaning: short accessible definition and optional example sentence; image may be replayed.
7. Review: 1–2 prior difficult words or related patterns.
8. Display encouraging summary and next eligible lesson.

### C. Word-building task mechanics (precise)
- Generate exactly N slots and N movable **tile instances**, where N is the normalized grapheme/letter character count (2–10); duplicated letters must receive different unique tile instance IDs.
- Shuffle order robustly; avoid starting in already-correct order except by deliberate test setting.
- Support drag to empty slot, drag between slots, drag back to tray, and swapping/reordering filled slots. Also support **tap tile → tap target slot**, keyboard/focus affordances, and undo/reset.
- Never mark a letter wrong just for hovering over a slot; feedback follows a deliberate placement or final check depending on assistance mode.
- Correct answer requires **all filled slots matching normalized target sequence**. Check only once on completion or after explicit "Check" in advanced mode. Compare string and length, not tile identity.
- Provide modes: **Guided** (picture/audio, optional letter outlines); **Practice** (picture/audio, no outlines); **Challenge** (audio only or definition, limited help). Difficulty is configurable per lesson.
- If a placement is wrong, show a calm cue, offer replay, highlight relevant skill after a reasonable attempt; do not shame, deduct scores, or time-lock learners.
- Hints are graduated: replay whole word → show starting sound/target grapheme → display one letter location → show completed word. Hints affect mastery scoring; assisted completion is celebrated but **not counted as independent mastery**.
- At completion: speak full word and optionally demonstrate blending; show meaning/animation briefly; progress event saved locally immediately.
- Handle phoneme-to-grapheme alignment independently of tile positions (e.g. SH = two letters, one sound; silent E may have no independent phoneme).
- Support rotation, small iPhone sizes, tablets, dynamic text and audio interruption. Up to 10 slots may wrap into 2 visual rows of 5 on phones, preserving **left-to-right logical answer order**, accessibility reading order and drop targets. Avoid making the tiles too small.

### D. Phonics recognition task mechanics
Supported templates in v1:
- Hear letter name/sound → select letter from 2–4 choices.
- Hear phoneme → choose corresponding letter/grapheme (e.g. M, SH, CH) from known patterns.
- See a letter/grapheme → hear its sound on tap; choose matching picture/word example.
- Hear/see word → identify first/last sound (approved content; don't conflate letter with sound).
- Blend/segment task using curated sound clips, grapheme highlighting, and instructor-approved answer.
Later: minimal pairs, syllable segmentation, vowel teams, more complicated spelling patterns.

## 4. Curriculum / adaptive pathway

**Stages are skill families, not age categories or rigid word-length buckets.** Each pathway has ordered skill nodes with prerequisites, supported activities, review thresholds, and optional branches.

| Stage | Skills / learning goal | Typical word examples | Activities |
|---|---|---|---|
| 0 | Listening, letter names, auditory awareness | A-Z sounds | Listen, choose, match |
| 1 | Frequent consonants, short vowel sounds, simple VC/CVC | AT, CAT, DOG, SUN | Identify, blend, build |
| 2 | Adjacent consonants / blends, common digraphs | FISH, SHIP, STOP | Hear grapheme, select, spell |
| 3 | Long-vowel patterns, silent-e, vowel teams | CAKE, TRAIN, LIGHT | Pattern explanation, build |
| 4 | Longer words, syllables, common endings | RABBIT, BANANA, RAINBOW | Segment syllables, spell |
| 5 | Multi-syllable decoding and expanded vocabulary | ELEPHANT (8), BUTTERFLY (9), STRAWBERRY (10) | Spell, define, use in sentence |
| 6 | Applied vocabulary, reading, review | 2–10 letter words | Listen, spell, choose meaning |

**Example advanced words demonstrate *length* support, not guaranteed decodability at an early stage.** Every stage must use an educator-reviewable set of skill tags and prerequisites. A word may appear in multiple lessons for different purposes, but content versions must be stable for progress accounting.

### Placement and progression
- Placement check is optional and **not a clinical/diagnostic assessment**. 5–10 skill-sampling tasks, with a simple recommended starting point and manual override.
- Per skill track: independent accuracy, hint usage, attempts, answer latency optionally collected locally (do not use speed as the main mastery measure), review due date.
- Suggested configurable mastery default: at least **4 of 5 recent unassisted attempts** correct across at least **2 separate practice sessions** for a skill; use sufficiently distinct words/contexts. Do not conflate word memorization and phonics understanding. Flag rule as adjustable, not educationally validated.
- After incorrect/unassisted failures, insert relevant prerequisite practice; do not trap learners indefinitely; allow "try easier" and manual level choice.
- Spaced review recommendation: 1, 3, 7, then 14 days after mastery, subject to user usage pattern; adapt when missed. Make this algorithm configurable and transparent.
- For a guessed or assisted word, track "completed with help" separately from "mastered independently".
- Never force adult learners through childish activities. Ability and presentation are separate state fields.

## 5. Mobile screens & information architecture

**Mobile routes/screens:**
1. Splash / welcome
2. Privacy notice and adult/parent-managed onboarding
3. Learner profile chooser / create profile
4. Presentation mode selection (Kids, Teens, Adults)
5. Placement choice / assessment
6. Home dashboard: Continue, current pathway, progress, downloaded lessons
7. Pathway map: skill units, locked/unlocked/needs review, accessible list alternative
8. Lesson intro with clear goal
9. Phonics sound recognition screen
10. Picture-led drag-and-drop word builder
11. Word meaning & example / result
12. Lesson summary and recommended next skill
13. Practice/review history / word gallery
14. Settings: audio, reduced motion, assistance, accessibility
15. Parent area: learner profile and learning summary, cloud account and deletion, purchases behind parental gate
16. Adult purchases/unlock screen behind required safeguards
17. Download packs/offline status and sync state

**Admin web screens:** secure sign-in, dashboard, word library, Add/Edit Word, word preview, image/audio uploads, skill taxonomy, lesson builder, pathway builder, bulk CSV import with row-level validation, draft/publish/revision history, content health/issues, release tracking, admin activity log.

### Visual & interaction principles
- Minimum practical 44x44 pt touch targets (or relevant platform accessible guidelines), plus generous drop zones; use scalable coordinates responsive to tablet/phone.
- Avoid thin text or tiny draggable tiles at 10 letters.
- Visuals are high contrast; child mode is playful but not distracting; use text + icon, not color alone.
- All instructions should work with audio and on-screen text; respect system reduced-motion settings and accessible announcements.
- Volume/replay is always discoverable; give a silent/captioned fallback when device audio unavailable.
- No manipulative streaks, negative punishment for mistakes, or irrelevant mini-games.

## 6. Admin content model & publishing rules

**Admin word form fields**
- `word_text` (required, uppercase normalized for comparisons, 2–10 A–Z letters, English v1); `locale` (`en-US` initial).
- `display_text`, `pronunciation_ipa` optional, **reviewed whole-word audio** required to publish.
- `image_asset` required for picture-led words; words with abstract meanings may instead be valid only for audio/definition templates.
- `short_definition`, `example_sentence`, `category` (food, animals, vehicles, school, nature, etc.).
- `syllables` array and optional syllable-break display (reviewed; not autogenerated as guaranteed correct).
- `phoneme_grapheme_segments` ordered array (letters/graphemes, phonemes, sound asset IDs, notes e.g. silent letter) curated/reviewed. Must align with word text without changing spelling.
- `skill_tags` list and prerequisites as applicable, `recommended_stage`, `difficulty_score` (optional), `lesson_eligibility`.
- `status` (`draft`, `in_review`, `published`, `archived`), `version`, created/modified/published timestamps, authored_by/reviewed_by.
- `source/license/rights_status` for images/audio/content (do not import copyrighted card art/audio).

**Admin workflows:**
- Create → autosave draft → validate audio/picture/required metadata → preview both a phonics activity and a word-building activity → publish explicit version.
- Add/edit/archive words; archives must not corrupt existing user history or downloaded lessons.
- Bulk import CSV: preview mapping, reject invalid letters/length, report exact bad rows, prohibit publish until required audio and content checks are complete.
- Upload files with MIME/size validation, authorized paths, rights metadata and thumbnail/processing states.
- Lesson editor chooses skill objective, approved words (or rule-based pool), question templates, guided/practice/challenge progression and review settings.
- Curriculum editor maintains directed acyclic prerequisite graph; reject circular prerequisites.
- Version published content; do not silently mutate published lessons for users already mid-session. Update on next safe sync/session boundary.
- Admin must be able to add a new 10-letter word with duplicates, image, audio and skill tags and publish it, then see it in a new eligible lesson after the phone syncs with **no mobile rebuild**.

## 7. Data model (minimum SQL entities)

Use Supabase Postgres with **UUID primary keys**, timestamped records, explicit check constraints, indexes, RLS and foreign keys. The following is a logical model; implement complete migrations and RLS policies in SQL.

| Table | Key columns and intent |
|---|---|
| `accounts` | `id` = auth user UUID; adult account type, created_at; no extra child PIIs |
| `learner_profiles` | id, owner_account_id nullable for local-only, display_alias, presentation_mode, pathway_id, settings, local_created_at; separate child privacy flags |
| `word_entries` | id, locale, word_text, display_text, definition, example, status, version, length, primary_image_id, whole_audio_id, rights_status, timestamps |
| `media_assets` | id, storage_path, type image/audio, hash, MIME, license/source, review status, metadata, owner/admin id |
| `phonics_skills` | id, slug, title, description, type, stage, active, teaching notes |
| `skill_prerequisites` | skill_id, prerequisite_skill_id; DAG validated |
| `word_skills` | word_id, skill_id, instructional role |
| `word_segments` | word_id, sequence_index, letters/grapheme, phoneme label/audio_id, silent flag, start/end letter offsets |
| `learning_pathways` | id, slug, label, locale, published_version |
| `pathway_nodes` | pathway_id, skill_id/lesson_id, ordering and prerequisites |
| `lessons` | id, skill objective, title, mode eligibility, difficulty, status, version, configured practice parameters |
| `lesson_items` | id, lesson_id, word_id nullable, activity type, prompt data, choice IDs, hint policy, ordering |
| `attempt_events` | UUID idempotency key, learner_id, lesson/item/content version, local timestamp, sync timestamp, correctness, independent/assisted, hint_count, attempts, device client id, minimal metadata |
| `learner_skill_progress` | learner_id + skill_id, independently correct/window, mastered state, last practiced, review due, version; server aggregation |
| `lesson_progress` | learner_id, lesson_id/version, active/finished, position, updated_at |
| `content_releases` | id, manifest version, published_at, minimum compatible app version, checksums |
| `account_entitlements` | owner_account_id, SKU, verified store, status, transaction reference, timestamps |
| `admin_audit_log` | administrator_id, action, entity, entity_id, timestamp, safe diff; never log passwords/tokens |

**Privacy caveat:** On-device guest profiles can initially exist only in local SQLite, not in server `learner_profiles` or `attempt_events`; upload only if a properly configured adult-controlled account and any needed parent consent are in place. No direct child auth is needed for MVP. Design a minimal separation between guest and cloud profile IDs.

**Examples of content records:**
- CAT (3 letters): image cat, word audio, segments /k/ /æ/ /t/, Stage 1.
- FISH (4 letters): show F-I-S-H tiles, teach SH as one digraph (S and H remain separate letter tiles), Stage 2.
- TRAIN (5 letters): Stage 3 vowel team AI, educator-approved phoneme alignment.
- RABBIT (6 letters): Stage 4 syllables.
- RAINBOW (7 letters): Stage 4.
- ELEPHANT (8 letters): Stage 5.
- BUTTERFLY (9 letters): Stage 5.
- STRAWBERRY (10 letters): Stage 5; the letter R occurs three times; layout wraps on phones.
- WATERMELON (10 letters): Stage 5; confirmed length and sound data required before publishing.

## 8. Architecture & repository structure

**Recommended stack (verify currently compatible versions):**
- Mobile: React Native + Expo + TypeScript, Expo Router navigation.
- Interaction: supported gesture library and animation tooling compatible with Expo/React Native; use an accessible tap-to-place fallback and write collision/slot movement tests.
- Audio: `expo-audio` for playback of approved recordings and phonics chunks. No microphone needed in MVP.
- Local/offline: `expo-sqlite` for saved word/lesson packs, local progress and pending events, plus file system cache of downloaded assets.
- Backend: Supabase Postgres + Auth (adult users), Storage, secure server/Edge Functions where needed, RLS for row access.
- Web admin: Next.js + TypeScript with server-side authorization and Supabase RLS.
- Purchases: native Apple in-app purchase / StoreKit and Google Play Billing through a compatible library or appropriately reviewed purchase SDK; **not ordinary Stripe checkout for in-app digital unlocks** unless an applicable platform policy exception has been reviewed.
- Monorepo: pnpm or equivalent; shared typed validation models (e.g. Zod) and testable pure learning engine.

Proposed layout:
```
/apps/mobile
  /app                    # Expo Router screens
  /src/components         # tiles, picture/audio cards, modal dialogs
  /src/features/phonics   # recognition flows
  /src/features/spelling  # word-building state machine
  /src/features/learning  # lesson runtime, adaptive progression
  /src/features/offline   # assets, SQLite, idempotent sync
  /src/features/parent    # adult controls, profiles
/apps/admin               # Next.js secure admin dashboard
/packages/core            # shared domain types, validators, game engine
/packages/curriculum      # skills, mastery logic, lesson evaluation
/packages/ui              # optional tokens/shared assets, as compatible
/supabase/migrations      # schema/RLS/versioned migrations
/supabase/seed            # educator-reviewed seed content
/tests                    # unit/integration/e2e
/docs                     # setup, architecture, moderation, release checklist
```

### Offline-first rules
- Package a free starter lesson and needed audio/images locally; first game works in airplane mode.
- Additional released lesson packs have version/checksum, all needed content assets, and complete download status; no partly installed pack should appear playable.
- Store events with UUIDs; sync with idempotent upserts or RPCs when online. Local progress is immediate, server-aggregated progress derived from verified events; avoid duplicate counting after retries.
- Account/profile conflict handling must be documented and tested; do not overwrite completed offline progress with stale server state.
- Downloaded lessons continue to play when the backend is unavailable; respect content expiration/withdrawal on next safe sync without destroying learner results.
- App upgrades should migrate local schema safely. Sync only appropriately consented/account-linked data.

## 9. Security, safety, privacy & store readiness

- Treat the presence of a Kids mode as a child-privacy design requirement, not as an exemption from laws merely because adults also use the app. Assess whether it is a child-directed or mixed-audience service and obtain legal review of COPPA and any relevant jurisdictions before collecting child data or launch.
- **No advertisements in children's learning screens**, no chat, no user-generated public content, no location services or microphone/camera access for v1.
- Protect children behind **an effective adult/parental gate** for purchases, external links, account settings, and any data transmission/consent flow as required. A gate by itself is **not** legal parental consent.
- Local guest profile should require minimal information (alias only), no child name, birthday, location or contacts required. Avoid unapproved third-party analytics/SDKs. Document what telemetry exists, if any, and disable it for child flows unless lawful and appropriately consented.
- Include privacy policy, parent notice, age-appropriate interfaces, secure deletion/export procedures, retention rules and support/contact information.
- On Apple, evaluate whether the product should be placed in the Kids Category versus its mixed-age positioning; app marketing, metadata and ongoing category restrictions must align with final choice.
- For Android, meet Google Play Families policies for any child-targeted component and ensure Play declarations are accurate.
- Use in-app purchase infrastructure appropriate to each app store, verify receipts server-side as appropriate, handle restore purchase, refund/revocation and offline entitlements carefully. Never grant a premium entitlement based solely on client-provided success.
- Implement RLS: admins only mutate content; public clients read approved/published versions; parent accounts only read their authorized profile data; service role keys never ship to mobile; private unpublished assets must never be exposed via public URLs.
- Content is hand-reviewed/approved for accuracy, pedagogy, spelling, pronunciation, definition, rights and age appropriateness. If AI assists with draft content or text-to-speech production, require human review before publishing. The learner experience must not depend on AI API calls.
- Child-safe errors, no open-ended external browser links in child mode, no insecure public storage of progress or credentials.

## 10. Monetization (implement after core gameplay)

**Proposed initial business model, subject to market testing:**
- Free: intro pathway, perhaps 20–30 reviewed words and basic progress stored locally.
- Premium: one-time paid unlock of the first full curriculum; suggested **$9.99 as a pricing experiment**, not a revenue guarantee.
- Future: additional educator-approved lesson packs, parent/teacher features, or subscriptions *only if* these add continuing value and fit store policies.
- Purchases require adult gate, clear offer/restore UI, server-verified entitlements where available, and no child-targeted pressure to buy.
- Avoid third-party advertising as a monetization strategy in children's mode.

## 11. Definition of done & test cases

**Core functional acceptance:**
1. A fresh install with no internet can start the included first phonics lesson, hear audio, and complete a 3-letter word.
2. A 2-letter word and a 10-letter word display fully on small Android phone, iPhone and iPad/tablet without clipped slots or touch targets.
3. STRAWBERRY, BANANA and LETTER support each repeated letter as a separate movable tile. Correct answer validates without confusing identical letter instances.
4. Dragging, swapping, returning, undoing, and **tap-to-place** work reliably across iOS and Android.
5. Learner can replay word audio repeatedly; audio interruption is handled gracefully; missing/unavailable media has accessible fallback.
6. FISH teaches a SH grapheme with an appropriate sound explanation, rather than pronouncing every written letter as an individual phoneme.
7. Completing a task with heavy hints does not count as independent mastery; unassisted repeats across sessions can unlock advancement.
8. Same learner sees appropriate UI in Kids vs Adults mode without losing ability/progress.
9. Admin can create a 10-letter word with required audio/image/skill tags, preview, publish and see it on a device after sync; no new binary required.
10. Admin attempts to publish invalid entries (11 letters, missing audio, unreviewed segments, unsupported assets) are blocked with explanatory validation.
11. Bulk import reports errors per row rather than silently skipping or publishing incomplete content.
12. Child/guest can play starter pack with no account and no mandatory submission of personal information.
13. A downloaded word pack works offline; multiple repeated sync requests do not duplicate progress or mastery scores.
14. RLS tests show non-admin users cannot modify content, and one parent cannot read another parent's linked learner progress.
15. Locked paid content cannot be unlocked by spoofed client flags; purchase restore works on both stores in test environments.
16. Screen-reader labels, large text, reduced motion, replay, and touch target tests are included.
17. All production links/privacy disclosures/parent gates are verified on real test devices before app submission.

**Automated test requirements:**
- Unit tests: character counting, word normalization, duplicates, deterministic shuffling, swapping, validation, phoneme grouping, mastery and review scheduling.
- Integration tests: published content/versioning, migrations, RLS, sync deduplication and account access.
- Mobile E2E smoke tests: onboarding → sound game → drag/tap spelling → save progress → background/resume → offline/reconnect → admin-published content sync.
- Performance checks: voice playback responsiveness, low-end Android touch gestures, app launch cold start, memory usage with cached packs.
- Accessibility and human educational review: sample lessons checked by educator/reading specialist; field testing with both children and adult learners.

## 12. Delivery milestones and scope guardrails

### Phase 0 — Foundation and setup
Deliver monorepo, architecture decision record, environmental templates, formatting/lint/typecheck/test setup, application boot on both platforms, admin boot, and source-controlled migrations. Include a working README. **Acceptance:** run locally with no hard-coded credentials.

### Phase 1 — Core game vertical slice (highest priority)
Deliver actual phonics recognition activity, word builder with draggable/tappable letters, 2–10 character handling, audio replay, illustrations, hint logic, repeated letters, success/error feedback, a seeded offline lesson with roughly 30–50 reviewed words. Include real tests. **Acceptance:** playable iOS/Android builds, not screenshots.

### Phase 2 — Admin and content delivery
Deliver Supabase schema/RLS, admin login, word CRUD, image/audio upload, content validation, draft/review/publish/archive, lesson/pathway builder (simple but real), seed and CSV import, mobile sync to published manifest. **Acceptance:** adding/publishing a word from admin changes mobile available content after sync.

### Phase 3 — Curriculum and profiles
Deliver skill prerequisites, adaptable progression, review scheduling, Kids/Teens/Adults modes, placement choice, parent-managed profiles, learner history and dashboard, resume lesson, offline progress and merge/sync. **Acceptance:** progress/mastery behavior is predictable and tested.

### Phase 4 — Product hardening & launch
Deliver accessibility QA, consent/parent gates, privacy/data deletion, store entitlements and restore, release builds, beta distribution/TestFlight/Google Play testing, crash monitoring appropriate to privacy commitments, detailed store submission checklist. **Acceptance:** store-ready candidate; do not claim approved until approved.

### Explicitly OUT OF SCOPE for v1
Online multiplayer; open-ended chatbot/AI tutor for minors; speech recognition/scoring pronunciation; user-submitted public word packs; marketplace/social sharing; third-party advertising; video capture; AR; massive animations; unsupported languages; more than 10 letters; mandatory login; complex teacher classrooms; remote push notifications; automatic AI publishing without review.

## 13. AI agent execution protocol / expected response

When you begin implementation:
1. Summarize architecture and assumptions briefly, preserving all hard requirements.
2. Inspect existing repository, if supplied, before modifying it. **If no repository is supplied**, scaffold a new one.
3. Create an issue/task checklist for phases and implementation order, with dependencies.
4. **Start coding Phase 0 and Phase 1**, prioritizing a complete real playable vertical slice over a broad unimplemented feature list.
5. Build the actual drag/tap word-engine as a testable pure state machine: start task, move tile, swap, unplace, hint, validate, complete, persist result.
6. Use meaningful seed lessons with valid word lengths and assets you have rights to. For placeholder audio/art in a local demo, clearly label it as development-only and do not claim it is publish-ready. No external proprietary toy assets.
7. Implement migrations and admin once the core flow is playable; wire up real APIs rather than fake success UI.
8. Run relevant tests, lint, typecheck and builds. Report commands and actual outcomes. Fix failures before claiming a phase is completed.
9. At each milestone give: files changed, working screens/features, test results, remaining blockers, commands to run, and next prioritized milestone.
10. Do not quietly substitute a responsive website for an App Store/Play Store build, or replace phonics teaching with just word memorization.

**Required first deliverable:** A functioning offline-first iOS/Android demo where a learner hears and recognizes basic letter sounds, sees/hears a picture word, spells it with movable tiles of length 2–10, receives phonics-aware feedback and progresses through a short working lesson. The admin content platform must then be added as the next usable milestone.

---

## 14. Official documentation to verify during implementation

- Expo Router: https://docs.expo.dev/router/introduction/
- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo Audio: https://docs.expo.dev/versions/latest/sdk/audio/
- Apple App Review Guidelines / Kids Category: https://developer.apple.com/app-store/review/guidelines/
- Apple kids design: https://developer.apple.com/kids/
- FTC COPPA guidance: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Google Play Families policy: https://support.google.com/googleplay/android-developer/answer/9893335
- Google Play Billing: https://developer.android.com/google/play/billing

*This is an engineering specification, not a legal compliance certification. Confirm platform and privacy requirements against current documentation at build and release time.*
