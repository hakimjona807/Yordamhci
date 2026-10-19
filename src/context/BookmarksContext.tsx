import React, { createContext, useContext, useState, useEffect } from 'react';

interface BookmarksContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  removeSaved: (id: string) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('bilimhub_bookmarks');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bilimhub_bookmarks', JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeSaved = (id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <BookmarksContext.Provider value={{ savedIds, isSaved, toggleSaved, removeSaved }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export function useBookmarks(): BookmarksContextType {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
