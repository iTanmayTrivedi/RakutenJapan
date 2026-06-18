ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 2840;

CREATE TABLE IF NOT EXISTS public.point_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  points_redeemed INTEGER NOT NULL CHECK (points_redeemed > 0),
  reward_type TEXT NOT NULL,
  reward_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.point_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their redemptions"
  ON public.point_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create their redemptions"
  ON public.point_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_point_redemptions_user ON public.point_redemptions(user_id, created_at DESC);