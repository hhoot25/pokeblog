import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Logo/Icon */}
          <div className="mb-8 animate-bounce">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-full">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            PokeBlog
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            Share Your Epic Pokemon Pulls!
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Join the community of trainers showcasing their best card pulls, rare finds, and collection highlights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/signup"
              className="group relative bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </a>
            <a
              href="/login"
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition border-2 border-white/30"
            >
              Login
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-white font-bold text-lg mb-2">Share Pulls</h3>
              <p className="text-white/80 text-sm">Upload photos of your amazing Pokemon card pulls instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="text-white font-bold text-lg mb-2">Engage</h3>
              <p className="text-white/80 text-sm">Like, comment, and connect with fellow collectors</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-white font-bold text-lg mb-2">Mobile First</h3>
              <p className="text-white/80 text-sm">Optimized for posting on-the-go from your phone</p>
            </div>
          </div>
        </div>
      </div>

      <QRCodeDisplay />
    </main>
  );
}
