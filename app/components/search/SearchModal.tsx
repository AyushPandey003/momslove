'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type SearchResult = {
  type: 'article' | 'tag' | 'category';
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author_name?: string;
  published_at?: Date;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const navigateToResult = useCallback((result: SearchResult) => {
    onClose();
    
    if (result.type === 'article') {
      router.push(`/blog/${result.slug}`);
    } else if (result.type === 'tag') {
      router.push(`/tags/${result.slug}`);
    } else if (result.type === 'category') {
      router.push(`/categories/${result.slug}`);
    }
  }, [onClose, router]);
  
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Close on ESC
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Navigate results with arrow keys
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
      }
      
      // Select with Enter
      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        navigateToResult(results[selectedIndex]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigateToResult, onClose]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setResults([]);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  
  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results || []);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-24 mx-4 overflow-hidden transform transition-all">
        {/* Search input */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, tags, categories..."
            className="flex-1 outline-none text-black placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        
        {/* Results */}
        <div className="max-h-[70vh] overflow-y-auto py-2">
          {searchTerm.trim().length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Enter at least 2 characters to search</p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            <div>
              {/* Group results by type */}
              {['article', 'tag', 'category'].map(type => {
                const typeResults = results.filter(r => r.type === type);
                if (!typeResults.length) return null;
                
                return (
                  <div key={type} className="mb-4">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {type === 'article' ? 'Articles' : type === 'tag' ? 'Tags' : 'Categories'}
                    </h3>
                    <ul>
                      {typeResults.map((result) => {
                        const resultIndex = results.findIndex(r => r.id === result.id && r.type === result.type);
                        const isSelected = resultIndex === selectedIndex;
                        
                        return (
                          <li 
                            key={`${result.type}-${result.id}`}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                              isSelected ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => navigateToResult(result)}
                            onMouseEnter={() => setSelectedIndex(resultIndex)}
                          >
                            {result.type === 'article' ? (
                              <div className="flex gap-3">
                                {result.cover_image && (
                                  <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                                    <Image 
                                      src={result.cover_image} 
                                      alt={result.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-medium text-black">{result.title}</h4>
                                  {result.excerpt && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{result.excerpt}</p>
                                  )}
                                  {result.author_name && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      By {result.author_name}
                                      {result.published_at && ` • ${new Date(result.published_at).toLocaleDateString()}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  result.type === 'tag' ? 'bg-blue-500' : 'bg-green-500'
                                }`}></div>
                                <span className="text-sm font-medium text-black">{result.title}</span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Keyboard shortcuts */}
        {results.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-500 font-mono">↑</kbd>
              <kbd className="ml-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-500 font-mono">↓</kbd>
              <span className="ml-2">to navigate</span>
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-500 font-mono">Enter</kbd>
              <span className="ml-2">to select</span>
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-500 font-mono">Esc</kbd>
              <span className="ml-2">to close</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 