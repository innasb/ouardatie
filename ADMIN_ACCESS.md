# OUARDATIE Admin Panel Access

## Accessing the Admin Dashboard

To access the admin dashboard, you need to:

1. First create an admin user account in Supabase
2. Navigate to the admin login by adding `#admin` to the URL or by manually setting the page to 'admin' in the App state

## Creating an Admin User

Since Supabase authentication is set up, you need to create a user account:

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. Confirm the user

### Option 2: Using Supabase SQL Editor
Run this SQL command in your Supabase SQL Editor:

```sql
-- This creates a test admin user
-- Email: admin@ouardatie.com
-- Password: admin123

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@ouardatie.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Admin Panel Features

Once logged in, you can:

- **Dashboard**: View statistics, sales overview, and order summaries
- **Products Management**: Add, edit, delete products with image uploads
- **Orders Management**: View, update order status, and export orders to CSV
- **Shipping Options**: Manage shipping prices by wilaya

## Important Notes

- Images in the product management are stored as base64 data URLs for simplicity
- To implement full image storage, you would need to set up Supabase Storage buckets
- The admin panel is protected by Supabase authentication
- Only authenticated users can access admin features
