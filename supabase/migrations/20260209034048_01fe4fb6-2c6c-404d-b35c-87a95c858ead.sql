
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'seller', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS: admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: users can insert their own role (for signup)
CREATE POLICY "Users can insert own role"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update products table: allow sellers to manage products
-- Sellers can insert products
CREATE POLICY "Sellers can insert products"
ON public.products FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'seller') AND seller_name IS NOT NULL);

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'seller'));

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'seller'));

-- Admin policies for products
CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update orders (change status)
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add seller_user_id to products for ownership tracking
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_user_id uuid REFERENCES auth.users(id);

-- Update seller policies to use seller_user_id
DROP POLICY IF EXISTS "Sellers can update own products" ON public.products;
CREATE POLICY "Sellers can update own products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'seller') AND seller_user_id = auth.uid());

DROP POLICY IF EXISTS "Sellers can delete own products" ON public.products;
CREATE POLICY "Sellers can delete own products"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'seller') AND seller_user_id = auth.uid());
