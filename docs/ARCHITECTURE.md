# Architecture decision (initial)

Use a TypeScript npm-workspace monorepo. Expo Router and React Native implement the mobile UI, while `@wordpath/core` owns deterministic game state. The core state machine is independent of React Native and is unit tested. Next deliverable: gesture adapter, offline SQLite event store and bundled licensed sound pack. Later use Supabase Auth only for adult accounts, RLS-protected published lesson tables, and a separate Next.js admin web app. Never treat client-side role or locally set entitlement flags as authoritative.

Device text-to-speech is a temporary prototyping convenience. Grapheme selection must be verified against actual audio by an educator before publishing; the current demo is not a validated phonics curriculum.
