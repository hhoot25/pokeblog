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
}

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchUserPosts();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', user.uid)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', user.uid)
        .single();

      if (!userData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-[935px] mx-auto px-4 h-[60px] flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:opacity-60 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-base">{profile?.email || user.email}</h1>
          <button onClick={logout} className="hover:opacity-60 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-[935px] mx-auto">
        {/* Profile Header - Instagram Horizontal Layout */}
        <div className="bg-white border-b border-gray-300 px-4 py-8 md:px-8">
          <div className="flex items-center gap-8">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-36 md:h-36 bg-gray-200 rounded-full flex items-center justify-center text-3xl md:text-5xl font-semibold flex-shrink-0">
              {profile?.email?.[0].toUpperCase() || user.email?.[0].toUpperCase() || '?'}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {/* Username and Edit Button */}
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-light">{profile?.username || profile?.email || user.email}</h2>
                <button className="bg-transparent border border-gray-300 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                  Edit profile
                </button>
                <button className="hover:opacity-60 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                <div>
                  <span className="font-semibold">{posts.length}</span>
                  <span className="text-gray-500 ml-1">posts</span>
                </div>
                <div>
                  <span className="font-semibold">{posts.reduce((sum, post) => sum + post.like_count, 0)}</span>
                  <span className="text-gray-500 ml-1">likes</span>
                </div>
                <div>
                  <span className="font-semibold">{posts.reduce((sum, post) => sum + post.comment_count, 0)}</span>
                  <span className="text-gray-500 ml-1">comments</span>
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <div className="text-sm">
                  <p>{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-300">
          <div className="flex justify-center">
            <button className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 border-t border-gray-900 -mt-px">
              <svg className="w-3 h-3 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Posts
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">Share Posts</h3>
              <p className="text-sm text-gray-500">When you share posts, they'll appear on your profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-px bg-gray-300">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
                  {post.images && post.images.length > 0 ? (
                    <>
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{post.comment_count}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 md:hidden">
        <div className="flex justify-around items-center h-12">
          <button onClick={() => router.push('/dashboard')} className="p-2 opacity-40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button className="p-2 opacity-40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button onClick={() => router.push('/create-post')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="p-2 opacity-40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="p-2">
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
              {user.email?.[0].toUpperCase()}
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
}
