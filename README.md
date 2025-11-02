# PokeBlog - Pokemon Pull Sharing Platform

A mobile-first Progressive Web App (PWA) for sharing and discovering Pokemon card pulls. Built with Next.js, Firebase Auth, and Supabase.

## Features

- **Mobile-First Design**: Optimized for phone screens with touch-friendly UI
- **QR Code Testing**: Scan a QR code to instantly test on your phone
- **Firebase Authentication**: Email/password and Google sign-in
- **PWA Support**: Install on your phone like a native app
- **Real-time Database**: Powered by Supabase
- **Image Upload**: Share photos of your Pokemon pulls
- **Social Features**: Like, comment, and share posts

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

See [SETUP.md](SETUP.md) for detailed setup instructions.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Test on Your Phone

1. Open http://localhost:3000 in your browser
2. Click the QR code icon in the bottom-right corner
3. Scan the QR code with your phone
4. The app opens on your phone automatically!

**Note**: Your phone and computer must be on the same WiFi network.

## Project Overview

This is an MVP (Minimum Viable Product) for a Pokemon card pull sharing platform where users can:

- Post photos of their Pokemon card pulls
- View pulls from other users
- Like and comment on posts
- Filter posts by rarity, set, or Pokemon type
- Share posts with friends

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **PWA**: Next.js PWA support

## Documentation

- [SETUP.md](SETUP.md) - Complete setup guide with Firebase and Supabase configuration
- [Database Schema](SETUP.md#5-create-database-schema-in-supabase) - SQL schema for Supabase

## Development Roadmap

### Phase 1: MVP (Current)
- ✅ Authentication system
- ✅ Mobile-responsive layout
- ✅ QR code testing
- ⬜ Post creation with image upload
- ⬜ Posts feed
- ⬜ Like/comment functionality

### Phase 2: Social Features
- ⬜ User profiles
- ⬜ Following system
- ⬜ Share functionality
- ⬜ Notifications

### Phase 3: Advanced Features
- ⬜ Search and filters
- ⬜ Collection tracking
- ⬜ Card value estimates
- ⬜ Trading features

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

ISC
