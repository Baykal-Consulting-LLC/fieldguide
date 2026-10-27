-- Applied to fieldguide / production through the authenticated Neon tool on 2026-10-17.
-- Schema-only. The browser has no database credentials or direct Data API access.
CREATE TABLE public.student_guides (
  user_id text PRIMARY KEY,
  bundle jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (jsonb_typeof(bundle) = 'object')
);
