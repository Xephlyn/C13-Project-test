'use client';

import { useState } from 'react';
import { createBlogPost } from '../lib/firebase';

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createBlogPost({
        title,
        content,
        author: 'Admin', // You can get this from auth context
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });

      setSuccess(true);
      setTitle('');
      setContent('');
      setTags('');
      setImageUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 border border-red-900/30">
      <h2 className="text-2xl text-red-400 mb-6">Create New Blog Post</h2>

      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 text-green-400 p-4 rounded-lg mb-4">
          Blog post created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-red-900/30 rounded-lg px-4 py-2
              text-gray-200 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 bg-gray-800 border border-red-900/30 rounded-lg px-4 py-2
              text-gray-200 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-gray-800 border border-red-900/30 rounded-lg px-4 py-2
              text-gray-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-gray-800 border border-red-900/30 rounded-lg px-4 py-2
              text-gray-200 focus:outline-none focus:border-red-500"
            placeholder="e.g., music theory, recording, mixing"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting ? 'bg-gray-700' : 'bg-red-700 hover:bg-red-600'
          } text-white px-6 py-3 rounded-lg transition-colors duration-300`}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}