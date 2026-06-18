
INSERT INTO public.user_roles (user_id, role) VALUES
  ('b6878490-1857-43d5-851c-712ffb38fdd3', 'admin'),
  ('b6878490-1857-43d5-851c-712ffb38fdd3', 'seller')
ON CONFLICT (user_id, role) DO NOTHING;
