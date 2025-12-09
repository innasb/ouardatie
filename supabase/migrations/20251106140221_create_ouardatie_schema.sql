/*
  # OUARDATIE E-commerce Database Schema

  ## Overview
  This migration creates the complete database schema for the OUARDATIE minimalist clothing e-commerce platform.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name (e.g., "Dresses", "Tops")
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. products
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (numeric) - Product price
  - `category_id` (uuid, foreign key) - Reference to categories
  - `images` (text[]) - Array of image filenames stored locally
  - `available_sizes` (text[]) - Array of available sizes
  - `available_colors` (text[]) - Array of available colors
  - `is_featured` (boolean) - Whether product is featured on home page
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 3. shipping_options
  - `id` (uuid, primary key)
  - `wilaya` (text) - Algerian province name
  - `desk_price` (numeric) - Price for desk delivery
  - `home_price` (numeric) - Price for home delivery
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. orders
  - `id` (uuid, primary key)
  - `customer_name` (text) - Customer full name
  - `customer_phone` (text) - Customer phone number
  - `wilaya` (text) - Delivery wilaya
  - `commune` (text) - Delivery commune
  - `shipping_type` (text) - "desk" or "home"
  - `shipping_cost` (numeric) - Calculated shipping cost
  - `total_amount` (numeric) - Total order amount including shipping
  - `status` (text) - Order status: pending, confirmed, shipped, delivered, canceled
  - `payment_method` (text) - "card" or "cash"
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Order update timestamp

  ### 5. order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - Reference to orders
  - `product_id` (uuid, foreign key) - Reference to products
  - `product_name` (text) - Product name at time of order
  - `product_price` (numeric) - Product price at time of order
  - `quantity` (integer) - Quantity ordered
  - `size` (text) - Selected size
  - `color` (text) - Selected color
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for categories and products
  - Authenticated admin access for all operations
  - Orders table secured for admin access only
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  available_sizes text[] DEFAULT '{}',
  available_colors text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shipping_options table
CREATE TABLE IF NOT EXISTS shipping_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya text UNIQUE NOT NULL,
  desk_price numeric NOT NULL CHECK (desk_price >= 0),
  home_price numeric NOT NULL CHECK (home_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  wilaya text NOT NULL,
  commune text NOT NULL,
  shipping_type text NOT NULL CHECK (shipping_type IN ('desk', 'home')),
  shipping_cost numeric NOT NULL CHECK (shipping_cost >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'canceled')),
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'cash')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL CHECK (product_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  size text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for shipping_options
CREATE POLICY "Shipping options are publicly readable"
  ON shipping_options FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shipping options"
  ON shipping_options FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipping options"
  ON shipping_options FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipping options"
  ON shipping_options FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for order_items
CREATE POLICY "Authenticated users can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Dresses'),
  ('Tops'),
  ('Bottoms'),
  ('Outerwear'),
  ('Accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample shipping options for Algerian wilayas
INSERT INTO shipping_options (wilaya, desk_price, home_price) VALUES
  ('Alger', 400, 600),
  ('Oran', 500, 700),
  ('Constantine', 500, 700),
  ('Annaba', 500, 700),
  ('Blida', 450, 650),
  ('Sétif', 500, 700),
  ('Tizi Ouzou', 450, 650),
  ('Béjaïa', 500, 700)
ON CONFLICT (wilaya) DO NOTHING;