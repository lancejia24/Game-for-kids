# WordPath: Phonics, Reading and Spelling

Cross-platform Expo / React Native mobile prototype for a structured phonics and letter-building learning pathway. The full requirements are in [the Master Development Blueprint](Spelling_Phonics_App_AI_Development_Blueprint.md).

## Developer quick start

```sh
npm install
npm test
npm run typecheck
npm run start -w @wordpath/mobile
```

Use Node 22 and an Expo SDK 54-compatible Expo Go or development client. The current sample lessons are local and use synthesized device speech, with only four development-only sample words. Parent-controlled accounts, a publishing admin, teacher-reviewed audio/media, content sync and app-store readiness are **not yet delivered**.

See [drag and offline session milestone](docs/OFFLINE_DRAG_MILESTONE.md) for what works, what was tested, and the next tasks.

## Development instructions

Build the complete Apple and Android phonics, reading, and spelling application using the attached Master Development Blueprint as the authoritative specification.

Read the entire document before writing code.

Follow its requirements carefully, especially the combination of the two original educational toys, the structured phonics learning pathway, 2–10 letter drag-and-drop spelling, and the admin dashboard that allows me to add and publish new words without updating the app.

Use React Native, Expo, TypeScript, Supabase, and Next.js as specified.

Start by establishing the project architecture, then implement the first fully playable learning experience. Continue development in the phases defined in the blueprint.

Do not create mock screens with nonfunctional buttons. Implement real features, database migrations, permissions, and automated tests.

Do not remove or simplify requirements without explaining the technical reason. Keep the app suitable for children, teenagers, and adults, with different interfaces but one shared learning system.

Report what has actually been implemented, what has been tested, and what remains incomplete. Do not claim success without verifying it.

Start with Phase 0 and Phase 1 of the attached blueprint.
