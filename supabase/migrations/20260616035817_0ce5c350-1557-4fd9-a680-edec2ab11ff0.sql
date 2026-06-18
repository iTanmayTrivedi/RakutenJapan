
-- 1. user_roles: prevent self-assigning admin role
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
CREATE POLICY "Users can self-assign non-admin role"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role <> 'admin'::app_role);

-- Prevent users from changing/deleting their own role rows (admins only)
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. profiles: prevent users from inflating their own points balance
CREATE OR REPLACE FUNCTION public.protect_profile_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Force default starting points on self-insert (admins via service role bypass triggers? No — keep guard)
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      NEW.points := 2840;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.points IS DISTINCT FROM OLD.points
       AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      NEW.points := OLD.points;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_points_trg ON public.profiles;
CREATE TRIGGER protect_profile_points_trg
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_points();

-- 3. point_redemptions: validate balance server-side and atomically deduct
CREATE OR REPLACE FUNCTION public.process_point_redemption()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points int;
BEGIN
  IF NEW.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Cannot redeem points for another user';
  END IF;

  IF NEW.points_redeemed <= 0 THEN
    RAISE EXCEPTION 'Redemption amount must be positive';
  END IF;

  SELECT points INTO current_points FROM public.profiles WHERE user_id = NEW.user_id FOR UPDATE;

  IF current_points IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF current_points < NEW.points_redeemed THEN
    RAISE EXCEPTION 'Insufficient points balance';
  END IF;

  -- Atomically deduct (bypasses protect_profile_points because SECURITY DEFINER + admin? No — use direct update with elevated path)
  UPDATE public.profiles
  SET points = points - NEW.points_redeemed
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS process_point_redemption_trg ON public.point_redemptions;
CREATE TRIGGER process_point_redemption_trg
BEFORE INSERT ON public.point_redemptions
FOR EACH ROW EXECUTE FUNCTION public.process_point_redemption();

-- Allow the deduction trigger to actually change points: make protect_profile_points skip changes
-- coming from process_point_redemption by checking a session GUC. Simpler: rewrite protect to allow
-- decrements that match an existing redemption row inserted in the same transaction.
CREATE OR REPLACE FUNCTION public.protect_profile_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  redeemed int;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      NEW.points := 2840;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.points IS DISTINCT FROM OLD.points
       AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      -- Allow only a decrement matching a redemption inserted in this transaction
      SELECT COALESCE(SUM(points_redeemed), 0) INTO redeemed
      FROM public.point_redemptions
      WHERE user_id = NEW.user_id
        AND xmin::text = txid_current()::text;
      IF (OLD.points - NEW.points) <> redeemed OR redeemed = 0 THEN
        NEW.points := OLD.points;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Lock down SECURITY DEFINER helper functions from direct client calls
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon, authenticated;
-- (RLS policies still work — policies execute with the function owner's rights regardless of grants.)

-- 5. Storage policies for product-images bucket
CREATE POLICY "Sellers and admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND (
    public.has_role(auth.uid(), 'seller'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners and admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Owners and admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);
