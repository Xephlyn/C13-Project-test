import Link from 'next/link';
import { BookOpenIcon, QuestionMarkCircleIcon, FolderIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-12">
          <Link 
            href="/library" 
            className="flex flex-col items-center text-red-500 hover:text-red-400 transition-colors"
          >
            <FolderIcon className="h-6 w-6 mb-1" />
            <span className="text-sm">Library</span>
          </Link>

          <Link 
            href="/resources" 
            className="flex flex-col items-center text-red-500 hover:text-red-400 transition-colors"
          >
            <BookOpenIcon className="h-6 w-6 mb-1" />
            <span className="text-sm">Resources</span>
          </Link>

          <Link 
            href="/faq" 
            className="flex flex-col items-center text-red-500 hover:text-red-400 transition-colors"
          >
            <QuestionMarkCircleIcon className="h-6 w-6 mb-1" />
            <span className="text-sm">FAQ</span>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Your Audio App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}