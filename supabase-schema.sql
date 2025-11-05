-- PokeBlog Database Schema
-- Run this entire script in your Supabase SQL Editor

-- =============================================
-- 1. ENABLE UUID EXTENSION
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 2. CREATE TABLES
-- =============================================

-- Users table (synced with Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  pull_date DATE,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- =============================================
-- 4. CREATE FUNCTIONS FOR AUTO-UPDATES
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. CREATE TRIGGERS
-- =============================================

-- Trigger to auto-update updated_at for users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at for posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at for comments
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-increment like_count when a like is added
DROP TRIGGER IF EXISTS increment_post_like_count ON likes;
CREATE TRIGGER increment_post_like_count
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_like_count();

-- Trigger to auto-decrement like_count when a like is removed
DROP TRIGGER IF EXISTS decrement_post_like_count ON likes;
CREATE TRIGGER decrement_post_like_count
    AFTER DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_like_count();

-- Trigger to auto-increment comment_count when a comment is added
DROP TRIGGER IF EXISTS increment_post_comment_count ON comments;
CREATE TRIGGER increment_post_comment_count
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_comment_count();

-- Trigger to auto-decrement comment_count when a comment is removed
DROP TRIGGER IF EXISTS decrement_post_comment_count ON comments;
CREATE TRIGGER decrement_post_comment_count
    AFTER DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION decrement_comment_count();

-- =============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7. CREATE RLS POLICIES
-- =============================================

-- USERS POLICIES
-- Allow everyone to read user profiles
DROP POLICY IF EXISTS "Allow public read access to users" ON users;
CREATE POLICY "Allow public read access to users"
    ON users FOR SELECT
    USING (true);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Allow users to insert own profile" ON users;
CREATE POLICY "Allow users to insert own profile"
    ON users FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Allow users to update own profile" ON users;
CREATE POLICY "Allow users to update own profile"
    ON users FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- POSTS POLICIES
-- Allow everyone to read posts
DROP POLICY IF EXISTS "Allow public read access to posts" ON posts;
CREATE POLICY "Allow public read access to posts"
    ON posts FOR SELECT
    USING (true);

-- Allow authenticated users to create posts
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON posts;
CREATE POLICY "Allow authenticated users to create posts"
    ON posts FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own posts
DROP POLICY IF EXISTS "Allow users to update own posts" ON posts;
CREATE POLICY "Allow users to update own posts"
    ON posts FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete their own posts
DROP POLICY IF EXISTS "Allow users to delete own posts" ON posts;
CREATE POLICY "Allow users to delete own posts"
    ON posts FOR DELETE
    USING (true);

-- LIKES POLICIES
-- Allow everyone to read likes
DROP POLICY IF EXISTS "Allow public read access to likes" ON likes;
CREATE POLICY "Allow public read access to likes"
    ON likes FOR SELECT
    USING (true);

-- Allow authenticated users to create likes
DROP POLICY IF EXISTS "Allow authenticated users to create likes" ON likes;
CREATE POLICY "Allow authenticated users to create likes"
    ON likes FOR INSERT
    WITH CHECK (true);

-- Allow users to delete their own likes
DROP POLICY IF EXISTS "Allow users to delete own likes" ON likes;
CREATE POLICY "Allow users to delete own likes"
    ON likes FOR DELETE
    USING (true);

-- COMMENTS POLICIES
-- Allow everyone to read comments
DROP POLICY IF EXISTS "Allow public read access to comments" ON comments;
CREATE POLICY "Allow public read access to comments"
    ON comments FOR SELECT
    USING (true);

-- Allow authenticated users to create comments
DROP POLICY IF EXISTS "Allow authenticated users to create comments" ON comments;
CREATE POLICY "Allow authenticated users to create comments"
    ON comments FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own comments
DROP POLICY IF EXISTS "Allow users to update own comments" ON comments;
CREATE POLICY "Allow users to update own comments"
    ON comments FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow users to delete their own comments
DROP POLICY IF EXISTS "Allow users to delete own comments" ON comments;
CREATE POLICY "Allow users to delete own comments"
    ON comments FOR DELETE
    USING (true);

-- =============================================
-- 8. CREATE STORAGE BUCKET FOR POST IMAGES
-- =============================================

-- Create the storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 9. CREATE STORAGE POLICIES
-- =============================================

-- Allow public uploads to post-images bucket
DROP POLICY IF EXISTS "Allow public uploads to post-images" ON storage.objects;
CREATE POLICY "Allow public uploads to post-images"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'post-images');

-- Allow public downloads from post-images bucket
DROP POLICY IF EXISTS "Allow public downloads from post-images" ON storage.objects;
CREATE POLICY "Allow public downloads from post-images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'post-images');

-- Allow users to delete their own images
DROP POLICY IF EXISTS "Allow users to delete own images" ON storage.objects;
CREATE POLICY "Allow users to delete own images"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'post-images');

-- =============================================
-- 10. CREATE HELPFUL VIEWS (OPTIONAL)
-- =============================================

-- View to get posts with user information and engagement stats
CREATE OR REPLACE VIEW posts_with_details AS
SELECT
    p.*,
    u.email,
    u.username,
    u.avatar_url,
    COUNT(DISTINCT l.id) as actual_like_count,
    COUNT(DISTINCT c.id) as actual_comment_count
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, u.email, u.username, u.avatar_url;

-- =============================================
-- SETUP COMPLETE!
-- =============================================

-- Verify tables were created
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'posts', 'likes', 'comments');

-- Verify storage bucket was created
SELECT * FROM storage.buckets WHERE id = 'post-images';
