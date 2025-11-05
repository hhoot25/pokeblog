# PokeBlog Database Setup Guide

This guide will help you set up the complete database schema for PokeBlog in Supabase.

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your **pokeblog** project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Schema Script

1. Open the file `supabase-schema.sql` in this project
2. **Copy the entire contents** of the file
3. **Paste** it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

That's it! The script will create everything automatically.

---

## What Gets Created

The script automatically creates:

### 📊 **Tables**
- ✅ **users** - User profiles linked to Firebase Auth
- ✅ **posts** - Pokemon pull posts with images and metadata
- ✅ **likes** - User likes on posts
- ✅ **comments** - Comments on posts (with threading support)

### ⚡ **Automatic Features**
- ✅ **Auto-incrementing counters** - Like and comment counts update automatically
- ✅ **Timestamps** - `created_at` and `updated_at` managed automatically
- ✅ **Indexes** - Fast queries for feeds and searches
- ✅ **Cascading deletes** - When a user/post is deleted, related data is cleaned up

### 🔒 **Security (Row Level Security)**
- ✅ **Public read access** - Anyone can view posts, likes, and comments
- ✅ **Authenticated write** - Only logged-in users can create content
- ✅ **Owner-only edit/delete** - Users can only modify their own content

### 📁 **Storage**
- ✅ **post-images bucket** - For storing Pokemon card images
- ✅ **Public access** - Images can be viewed by anyone
- ✅ **Upload permissions** - Anyone can upload (filtered by your app)

---

## Verification

After running the script, verify everything is set up:

### Check Tables
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'posts', 'likes', 'comments');
```

You should see all 4 tables listed.

### Check Storage Bucket
```sql
SELECT * FROM storage.buckets WHERE id = 'post-images';
```

You should see the `post-images` bucket.

---

## How It Works

### 🔄 **Automatic Like/Comment Counting**

When someone likes a post:
```javascript
// Your app code
await supabase.from('likes').insert({ user_id, post_id });

// Database automatically:
// 1. Adds the like to the 'likes' table
// 2. Increments 'like_count' on the post by 1
```

When someone unlikes:
```javascript
await supabase.from('likes').delete().match({ user_id, post_id });

// Database automatically:
// 1. Removes the like
// 2. Decrements 'like_count' by 1
```

Same for comments! You never need to manually update counts.

### 👤 **User Creation Flow**

When a user signs up with Firebase:
```javascript
// 1. Firebase creates auth user
// 2. Your app creates Supabase user record
await supabase.from('users').insert({
  firebase_uid: firebaseUser.uid,
  email: firebaseUser.email
});
```

### 📝 **Creating Posts**

```javascript
// 1. Upload images to storage
const { data } = await supabase.storage
  .from('post-images')
  .upload(fileName, file);

// 2. Create post with image URLs
await supabase.from('posts').insert({
  user_id: userId,
  title: 'Amazing Charizard!',
  description: 'Pulled from my first pack!',
  images: [imageUrl],
  pull_date: '2025-01-15'
});
```

---

## Database Schema Diagram

```
┌─────────────┐
│    users    │
├─────────────┤
│ id          │◄───┐
│ firebase_uid│    │
│ email       │    │
│ username    │    │
│ avatar_url  │    │
└─────────────┘    │
                   │
┌─────────────┐    │
│    posts    │    │
├─────────────┤    │
│ id          │◄───┼──┐
│ user_id     │────┘  │
│ title       │       │
│ description │       │
│ images[]    │       │
│ like_count  │       │
│ comment_count       │
└─────────────┘       │
       ▲              │
       │              │
┌──────┴──────┐       │
│             │       │
│   ┌─────────────┐  │
│   │    likes    │  │
│   ├─────────────┤  │
│   │ user_id     │  │
│   │ post_id     │──┘
│   └─────────────┘
│
│   ┌─────────────┐
│   │  comments   │
│   ├─────────────┤
│   │ user_id     │
│   │ post_id     │──┘
│   │ content     │
│   │ parent_id   │ (for replies)
│   └─────────────┘
```

---

## Troubleshooting

### Error: "relation already exists"
This is normal if you've run the script before. The script uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS` to handle this safely.

### Error: "permission denied"
Make sure you're running the script as the project owner in the Supabase SQL Editor.

### Storage bucket not working
Make sure the storage policies were created. Check with:
```sql
SELECT * FROM storage.policies;
```

### Posts not showing up
Check if RLS policies are enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

---

## Next Steps

After running the schema:

1. ✅ Database is ready
2. ✅ Storage is configured
3. ✅ Your app can now:
   - Create users
   - Post Pokemon pulls
   - Like and comment
   - View feeds

Test it by:
1. Running `npm run dev`
2. Signing up
3. Creating a post
4. Viewing it in the dashboard!

---

## Additional SQL Queries (Optional)

### View all posts with user info
```sql
SELECT * FROM posts_with_details ORDER BY created_at DESC;
```

### Count total posts
```sql
SELECT COUNT(*) FROM posts;
```

### Most liked posts
```sql
SELECT title, like_count FROM posts ORDER BY like_count DESC LIMIT 10;
```

### User leaderboard
```sql
SELECT u.email, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.email
ORDER BY post_count DESC;
```

---

## Schema Updates

If you need to add features later, you can run additional SQL commands. The existing `DROP POLICY IF EXISTS` statements make the script safe to re-run.

**Example: Add a new column**
```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
```

---

You're all set! Your database is now fully configured and ready to handle all your Pokemon pull posts! 🎉
