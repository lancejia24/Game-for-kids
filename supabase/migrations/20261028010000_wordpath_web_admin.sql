-- WordPath web admin foundation: restricted draft content only.
-- Run in the Supabase SQL Editor as the project operator.
-- No accounts become admins automatically, and child/guest browser progress is not stored here.

CREATE TABLE IF NOT EXISTS public.wordpath_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wordpath_admins ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.wordpath_admins FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.wordpath_admins TO authenticated;

DROP POLICY IF EXISTS wordpath_admins_select_self ON public.wordpath_admins;
CREATE POLICY wordpath_admins_select_self ON public.wordpath_admins
 FOR SELECT TO authenticated
 USING (user_id = (SELECT auth.uid()));

-- Only database operators can add/remove admin memberships.
CREATE OR REPLACE FUNCTION public.wordpath_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
 SELECT EXISTS (
  SELECT 1 FROM public.wordpath_admins AS a
  WHERE a.user_id = (SELECT auth.uid())
 );
$$;
REVOKE ALL ON FUNCTION public.wordpath_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wordpath_is_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.wordpath_words (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 word_text text NOT NULL UNIQUE CHECK (word_text ~ '^[A-Z]{2,10}$'),
 short_definition text NOT NULL CHECK (char_length(btrim(short_definition)) BETWEEN 3 AND 250),
 example_sentence text CHECK (example_sentence IS NULL OR char_length(example_sentence) <= 300),
 category text NOT NULL CHECK (category IN ('animals','food','vehicles','nature','home','school','everyday')),
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
 created_by uuid NOT NULL REFERENCES auth.users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 -- Fail-closed publishing gate; later migrations may replace only after
 -- approved human audio, original images, licensing and educational review exist.
 CONSTRAINT wordpath_publishing_locked CHECK (status <> 'published')
);
CREATE INDEX IF NOT EXISTS wordpath_words_status_updated ON public.wordpath_words (status,updated_at DESC);
ALTER TABLE public.wordpath_words ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.wordpath_words FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.wordpath_words TO anon, authenticated;
GRANT INSERT, UPDATE ON public.wordpath_words TO authenticated;

DROP POLICY IF EXISTS wordpath_words_public_or_admin_read ON public.wordpath_words;
CREATE POLICY wordpath_words_public_or_admin_read ON public.wordpath_words
 FOR SELECT TO anon, authenticated
 USING (status = 'published' OR (SELECT public.wordpath_is_admin()));

DROP POLICY IF EXISTS wordpath_words_admin_insert ON public.wordpath_words;
CREATE POLICY wordpath_words_admin_insert ON public.wordpath_words
 FOR INSERT TO authenticated
 WITH CHECK (
  (SELECT public.wordpath_is_admin())
  AND created_by = (SELECT auth.uid())
  AND status = 'draft'
 );

DROP POLICY IF EXISTS wordpath_words_admin_update ON public.wordpath_words;
CREATE POLICY wordpath_words_admin_update ON public.wordpath_words
 FOR UPDATE TO authenticated
 USING ((SELECT public.wordpath_is_admin()) AND status IN ('draft','archived'))
 WITH CHECK ((SELECT public.wordpath_is_admin()) AND status IN ('draft','archived'));

-- Prevent alteration of immutable identifiers/creation attribution.
CREATE OR REPLACE FUNCTION public.wordpath_preserve_system_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
 IF NEW.id IS DISTINCT FROM OLD.id
    OR NEW.word_text IS DISTINCT FROM OLD.word_text
    OR NEW.created_by IS DISTINCT FROM OLD.created_by
    OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
   RAISE EXCEPTION 'Word identity and author cannot be modified';
 END IF;
 NEW.updated_at := now();
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS wordpath_words_guard ON public.wordpath_words;
CREATE TRIGGER wordpath_words_guard
 BEFORE UPDATE ON public.wordpath_words
 FOR EACH ROW EXECUTE FUNCTION public.wordpath_preserve_system_fields();

COMMENT ON TABLE public.wordpath_words IS 'Admin-authored word drafts; public publishing intentionally disabled until reviewed human audio and media pipeline is available.';
