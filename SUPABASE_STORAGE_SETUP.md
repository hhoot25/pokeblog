# Supabase Storage Setup

Before you can upload images, you need to create a storage bucket in Supabase.

## Steps to Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your pokeblog project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"

3. **Create the Bucket**
   - Name: `post-images`
   - Make it **Public** (toggle the switch ON)
   - Click "Create bucket"

4. **Set Storage Policies** (Make it publicly readable)
   - Click on the `post-images` bucket
   - Go to "Policies" tab
   - Click "New Policy"
   - Select "For full customization" under INSERT
   - Policy name: `Allow public uploads`
   - Use this policy:

   ```sql
   ((bucket_id = 'post-images'::text))
   ```

   - Click "Review" then "Save policy"

5. **Add SELECT Policy** (Allow public viewing)
   - Click "New Policy" again
   - Select "For full customization" under SELECT
   - Policy name: `Allow public downloads`
   - Use this policy:

   ```sql
   ((bucket_id = 'post-images'::text))
   ```

   - Click "Review" then "Save policy"

## Quick Alternative (Using SQL)

You can also run this SQL in the Supabase SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true);

-- Allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'post-images');

-- Allow public downloads
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'post-images');
```

## Verify

After setup, you should be able to upload images when creating posts!
