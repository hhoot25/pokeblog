'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  created_at: string;
  like_count: number;
  comment_count: number;
  users: {
    email: string;
  };
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'trending'>('recent');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, filter]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users (
            email
          )
        `);

      if (filter === 'trending') {
        query = query.order('like_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-[935px] mx-auto px-4 h-[60px] flex items-center justify-between">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PokeBlog</h1>

          <div className="flex items-center gap-5">
            <button onClick={() => router.push('/create-post')} className="text-gray-300 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="text-gray-300 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={() => router.push('/profile')} className="hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.email?.[0].toUpperCase()}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-[935px] mx-auto flex">
          <button
            onClick={() => setFilter('recent')}
            className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition ${
              filter === 'recent'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilter('trending')}
            className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition ${
              filter === 'trending'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <main className="max-w-[470px] mx-auto pt-4">
        {loadingPosts ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Posts Yet</h3>
            <p className="text-base text-gray-400 mb-6">
              When you share photos, they'll appear here.
            </p>
            <button
              onClick={() => router.push('/create-post')}
              className="text-blue-400 text-base font-semibold hover:text-blue-300 transition"
            >
              Share your first post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center px-4 py-3 bg-gray-800/50">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                    {post.users?.email?.[0].toUpperCase() || '?'}
                  </div>
                  <span className="text-base font-semibold text-white">{post.users?.email || 'Unknown'}</span>
                </div>

                {/* Post Image */}
                {post.images && post.images.length > 0 && (
                  <div className="w-full aspect-square bg-gray-900">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-4 py-3 flex items-center gap-5 bg-gray-800/50">
                  <button className="text-gray-300 hover:text-red-400 transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="text-gray-300 hover:text-blue-400 transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button className="ml-auto text-gray-300 hover:text-yellow-400 transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Likes */}
                {post.like_count > 0 && (
                  <div className="px-4 pb-2 bg-gray-800/50">
                    <span className="text-sm font-semibold text-white">{post.like_count} likes</span>
                  </div>
                )}

                {/* Caption */}
                <div className="px-4 pb-3 bg-gray-800/50">
                  <p className="text-base text-white">
                    <span className="font-semibold mr-2">{post.users?.email}</span>
                    {post.title}
                  </p>
                  {post.description && (
                    <p className="text-sm text-gray-300 mt-2">{post.description}</p>
                  )}
                </div>

                {/* Comments */}
                {post.comment_count > 0 && (
                  <button className="px-4 pb-2 text-sm text-gray-400 hover:text-gray-300 bg-gray-800/50 w-full text-left">
                    View all {post.comment_count} comments
                  </button>
                )}

                {/* Time */}
                <div className="px-4 pb-3 bg-gray-800/50">
                  <time className="text-xs text-gray-500 uppercase">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden">
        <div className="flex justify-around items-center h-14">
          <button className="p-2 text-blue-400">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-300 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button onClick={() => router.push('/create-post')} className="p-2 text-gray-300 hover:text-white transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-300 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={() => router.push('/profile')} className="p-2">
            <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-xs font-semibold">
              {user.email?.[0].toUpperCase()}
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
}
