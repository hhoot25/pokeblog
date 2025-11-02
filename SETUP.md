# PokeBlog Setup Guide

A mobile-first web application for sharing Pokemon card pulls with QR code testing support.

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **Database & Storage**: Supabase
- **PWA**: Installable as a mobile app

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web icon (</>)
   - Copy the configuration values

### 3. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Once created, go to Settings > API
4. Copy your project URL and anon/public key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then fill in your actual values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Create Database Schema in Supabase

Run this SQL in the Supabase SQL Editor:

```sql
-- Users table (synced with Firebase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - you may want to refine these)
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (firebase_uid = auth.uid());

CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create own posts" ON posts FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));

CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));

CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()));
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Testing on Your Phone via QR Code

1. Make sure your computer and phone are on the **same WiFi network**
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000` in your browser
4. Click the QR code icon in the bottom-right corner
5. Scan the QR code with your phone's camera
6. The app will open on your phone at your computer's local IP address

**Important**: Windows Firewall may block the connection. If it doesn't work:
- Allow Node.js through Windows Firewall
- Or temporarily disable the firewall for testing

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
pokeblog/
├── app/
│   ├── api/
│   │   └── qr/          # QR code generation API
│   ├── dashboard/       # Main dashboard page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout with AuthProvider
│   └── page.tsx        # Home page
├── components/
│   └── QRCodeDisplay.tsx  # QR code component for mobile testing
├── lib/
│   ├── AuthContext.tsx    # Firebase Auth context
│   ├── firebase.ts        # Firebase configuration
│   └── supabase.ts        # Supabase configuration
├── public/
│   └── manifest.json      # PWA manifest
└── .env.local.example     # Environment variables template
```

## Features Implemented

- ✅ Firebase Authentication (Email/Password + Google)
- ✅ Mobile-first responsive design
- ✅ QR code testing for mobile devices
- ✅ PWA support (installable on mobile)
- ✅ Supabase database setup
- ✅ TypeScript + TailwindCSS

## Next Steps (To Build)

1. **Create Post Functionality**
   - Image upload with camera access
   - Post creation form
   - Image optimization for mobile

2. **Posts Feed**
   - Display posts with images
   - Infinite scroll
   - Filter/search functionality

3. **Social Features**
   - Like/unlike posts
   - Comment system
   - Share functionality

4. **User Profiles**
   - View user profiles
   - Edit profile
   - Post history

5. **Advanced Features**
   - Real-time updates
   - Notifications
   - Image gallery/lightbox

## Troubleshooting

### QR Code Not Working

- Ensure both devices are on the same WiFi network
- Check Windows Firewall settings
- Try using your computer's IP address directly: `http://192.168.x.x:3000`

### Firebase Auth Errors

- Verify all environment variables are set correctly
- Check Firebase Console for enabled auth methods
- Ensure your domain is authorized in Firebase settings

### Supabase Connection Issues

- Verify Supabase URL and anon key are correct
- Check if RLS policies are properly configured
- Ensure database tables are created

## License

ISC
