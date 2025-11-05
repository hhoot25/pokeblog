# PokeBlog - Pokemon Card Pull Sharing Platform

A mobile-first web application for Pokemon card collectors to share and discover amazing card pulls. Built with Next.js, Firebase Authentication, and Supabase.

## 🎯 What Does This App Do?

PokeBlog is a social platform where Pokemon card collectors can:
- **Share their pulls**: Upload photos of Pokemon cards they've pulled from packs
- **Browse the feed**: See what other collectors are pulling in real-time
- **Engage with posts**: Like and comment on other users' pulls
- **Track their collection**: Keep a visual record of their best pulls

## ✨ Current Features

### 🔐 Authentication
- Email/password registration and login
- Google OAuth sign-in
- Protected routes (dashboard and post creation require login)

### 📱 Mobile-First Design
- Responsive layout optimized for phone screens
- Touch-friendly UI with large tap targets
- Bottom navigation bar for easy mobile access
- Instagram-style post feed

### 📸 Post Creation
- Upload up to 5 images per post
- Add title and description to your pulls
- Image preview before posting
- Automatic image storage in Supabase

### 🏠 Dashboard/Feed
- View all posts from the community
- See post images, titles, and descriptions
- Display like and comment counts
- User avatars and timestamps
- Empty state with call-to-action for first post

### 📲 QR Code Testing
- Generate QR code to test app on your phone
- Instant access from mobile device
- Perfect for testing mobile experience

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **QR Codes**: qrcode library

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hhoot25/pokeblog.git
cd pokeblog
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [SETUP.md](SETUP.md) for detailed configuration instructions.

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Testing on Mobile

1. Start the dev server (`npm run dev`)
2. Open http://localhost:3000 in your browser
3. Click the QR code icon in the bottom-right corner
4. Scan the QR code with your phone's camera
5. Your phone and computer must be on the same WiFi network

## 📁 Project Structure

```
pokeblog/
├── app/
│   ├── api/qr/          # QR code generation API
│   ├── create-post/     # Post creation page
│   ├── dashboard/       # Main feed/dashboard
│   ├── login/           # Login page
│   ├── signup/          # Sign up page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/
│   └── QRCodeDisplay.tsx # QR code component
├── lib/
│   ├── AuthContext.tsx  # Firebase auth context
│   ├── firebase.ts      # Firebase configuration
│   └── supabase.ts      # Supabase client
└── public/
    └── manifest.json    # PWA manifest
```

## 🗄️ Database Schema

The app uses Supabase with the following tables:

### `users`
- `id` (uuid, primary key)
- `firebase_uid` (text, unique)
- `email` (text)
- `created_at` (timestamp)

### `posts`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `title` (text)
- `description` (text)
- `images` (text array)
- `pull_date` (date)
- `like_count` (integer, default 0)
- `comment_count` (integer, default 0)
- `created_at` (timestamp)

See [SETUP.md](SETUP.md) for complete SQL schema.

## 🎨 Features in Detail

### Landing Page
- Eye-catching gradient hero section
- Clear call-to-action buttons
- Feature highlights with icons
- Mobile-responsive design

### Authentication Flow
- Email/password registration
- Google OAuth integration
- Form validation and error handling
- Automatic redirect to dashboard after login

### Post Creation
- Multi-image upload (up to 5 images)
- Image preview with remove option
- Required title field
- Optional description
- Automatic user creation in Supabase if needed
- Image upload to Supabase Storage

### Dashboard Feed
- Chronological post display
- User information with avatar
- Image gallery with counter
- Like and comment buttons (UI ready)
- Empty state for new users
- Mobile bottom navigation
- Desktop create post button

## 🔜 Planned Features

### Phase 1 (In Progress)
- [ ] Implement like functionality
- [ ] Implement comment system
- [ ] Add pull-to-refresh on mobile
- [ ] Image carousel for multiple images

### Phase 2
- [ ] User profiles
- [ ] Edit/delete posts
- [ ] Follow/unfollow users
- [ ] Notifications
- [ ] Share posts

### Phase 3
- [ ] Search functionality
- [ ] Filter by Pokemon, set, rarity
- [ ] Collection tracking
- [ ] Card value estimates
- [ ] Trading features

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

ISC

## 🔗 Links

- Repository: [github.com/hhoot25/pokeblog](https://github.com/hhoot25/pokeblog)
- Issues: [github.com/hhoot25/pokeblog/issues](https://github.com/hhoot25/pokeblog/issues)

---

Built with ❤️ for the Pokemon card collecting community
