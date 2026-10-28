# Curriculum candidate bank milestone

The starter editor has 35 **editorial candidate** words ranging from 2 to 10 characters, tagged with approximate spelling-skill groups and simple meanings. They are suggestions, not a scientifically sequenced/approved curriculum. The four original demo lessons remain separate. Administrators can copy one candidate into the protected Supabase word library as a **draft**. No child-facing lesson, IPA, synthesized audio, recorded human speech, illustration or published release is created by this operation.

## Rules
- Only a logged-in approved WordPath administrator may import a candidate, through a server action with the same existing RLS as ordinary draft creation.
- Importing uses a server-side allowlist ID, not user-provided editable meanings/categories.
- Duplicate words are blocked by the existing unique database constraint and shown as already present.
- No candidate becomes visible to children: the existing database publishing CHECK constraint continues to prohibit published rows.
- Before publishing: qualified educator reviews spelling sequence and word definitions, determines phoneme/grapheme mapping and IPA, creates rights-cleared art and genuine human recordings (or clearly labels optional synthetic SSML), and tests offline and accessibility behavior.

## Next milestone
Content review UI, audio files + verifiable hash checks, approved picture animations, release packages, public read paths for fully approved lessons, then teaching content shared by mobile and web with the existing mastery engine.
