# Quick Start Guide - PokeBlog

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication > Email/Password and Google
4. Copy your config from Project Settings

### Step 3: Set Up Supabase

1. Go to https://supabase.com/dashboard
2. Create a new project
3. Copy your URL and anon key from Settings > API
4. Run the SQL schema from [SETUP.md](SETUP.md#5-create-database-schema-in-supabase)

### Step 4: Create Environment File

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Firebase and Supabase credentials.

### Step 5: Run the App

```bash
npm run dev
```

Visit http://localhost:3000

### Step 6: Test on Your Phone 📱

1. Make sure your phone is on the **same WiFi** as your computer
2. Click the QR code icon in the bottom-right corner
3. Scan with your phone camera
4. Done! The app opens on your phone

## 🎯 What You Get

- ✅ Working authentication (email + Google)
- ✅ Mobile-responsive design
- ✅ QR code testing feature
- ✅ PWA (installable on phone)
- ✅ Database schema ready

## 🔧 Troubleshooting

**QR code not working?**
- Check if both devices are on same WiFi
- Allow Node.js through Windows Firewall
- Use the network URL shown in terminal: http://192.168.x.x:3000

**Firebase errors?**
- Double-check all environment variables
- Make sure auth methods are enabled in Firebase Console

**Supabase errors?**
- Verify URL and anon key are correct
- Check if database schema was created

## 📚 Next Steps

See [README.md](README.md) for full documentation and [SETUP.md](SETUP.md) for detailed setup instructions.

## 🎮 Ready to Build Features?

Now that the foundation is set up, you can start building:
1. Post creation with image upload
2. Posts feed
3. Like/comment system
4. User profiles

Happy coding! 🚀
