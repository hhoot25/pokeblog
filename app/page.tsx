import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">PokeBlog</h1>
        <p className="text-xl mb-8">Share Your Pokemon Pulls!</p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
      <QRCodeDisplay />
    </main>
  );
}
