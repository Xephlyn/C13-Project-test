'use client';

import { useState, useEffect } from 'react';
import { getBlogPosts } from '../../lib/firebase';

export default function ResourcesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400">Loading resources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
          Error loading resources: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center
        [text-shadow:_0_0_10px_rgb(220_38_38_/_50%)]">
        Resources
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 rounded-lg shadow-lg shadow-red-900/30 
              border border-red-900/30 overflow-hidden hover:border-red-500/50 
              transition-all duration-300"
          >
            {post.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl text-red-400 mb-2">{post.title}</h2>
              <p className="text-gray-400 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-red-900/20 px-2 py-1 rounded-full text-red-400 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                By {post.author} • {new Date(post.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}