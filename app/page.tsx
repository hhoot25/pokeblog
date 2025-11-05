import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-10 mb-4 shadow-2xl">
          {/* Logo */}
          <h1 className="text-center font-bold text-5xl mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PokeBlog
          </h1>

          {/* Description */}
          <p className="text-center text-gray-300 text-base mb-8">
            Share your Pokemon card pulls with the community
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <a
              href="/signup"
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-semibold py-3 px-6 rounded-xl text-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Sign up
            </a>
            <a
              href="/login"
              className="block w-full bg-gray-700/50 text-gray-100 text-base font-semibold py-3 px-6 rounded-xl text-center border border-gray-600 hover:bg-gray-600/50 transition-all"
            >
              Log in
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-400">
            Get the app.
          </p>
        </div>
      </div>

      <QRCodeDisplay />
    </main>
  );
}
