import { useState, useEffect, useCallback } from 'react';
import { createBook } from '../types/book';

// Enhanced mock data with more realistic book information
const MOCK_BOOKS = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'fiction',
    publicationYear: 1960,
    isbn: '978-0-06-112008-4',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    pages: 376,
    language: 'English',
    status: 'read',
    rating: 5,
    publisher: 'J.B. Lippincott & Co.',
    coverImage: '/images/4img.jpg',
    notes: 'A powerful story about justice and morality.',
    isFavorite: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    genre: 'science_fiction',
    publicationYear: 1949,
    isbn: '978-0-452-28423-4',
    description: 'A dystopian social science fiction novel about totalitarian control.',
    pages: 328,
    language: 'English',
    status: 'read',
    rating: 5,
    publisher: 'Secker & Warburg',
    coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    notes: 'Thought-provoking and eerily relevant.',
    isFavorite: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'romance',
    publicationYear: 1813,
    isbn: '978-0-14-143951-8',
    description: 'A romantic novel about manners, upbringing, morality, and marriage.',
    pages: 432,
    language: 'English',
    status: 'reading',
    rating: 4,
    publisher: 'T. Egerton',
    coverImage: '/images/7img.jpg',
    notes: 'Beautiful writing and character development.',
    isFavorite: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'fiction',
    publicationYear: 1951,
    isbn: '978-0-316-76948-0',
    description: 'A coming-of-age story about teenage rebellion and alienation.',
    pages: 277,
    language: 'English',
    status: 'want_to_read',
    rating: null,
    publisher: 'Little, Brown and Company',
    coverImage: '/images/2img.jpg',
    notes: 'Heard great things about this classic.',
    isFavorite: false,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'history',
    publicationYear: 2011,
    isbn: '978-0-06-231609-7',
    description: 'A brief history of humankind and how we came to dominate the world.',
    pages: 443,
    language: 'English',
    status: 'available',
    rating: 4,
    publisher: 'Harper',
    coverImage: '/images/8img.jpg',
    notes: 'Fascinating insights into human evolution.',
    isFavorite: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    genre: 'fantasy',
    publicationYear: 1997,
    isbn: '978-0-439-70818-8',
    description: 'A young wizard discovers his magical heritage on his 11th birthday.',
    pages: 309,
    language: 'English',
    status: 'read',
    rating: 5,
    publisher: 'Bloomsbury',
    coverImage: '/images/6img.jpg',
    notes: 'A magical adventure that started it all.',
    isFavorite: true,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'fiction',
    publicationYear: 1988,
    isbn: '978-0-06-231500-7',
    description: 'A philosophical story about following your dreams.',
    pages: 163,
    language: 'English',
    status: 'reading',
    rating: 4,
    publisher: 'HarperOne',
    coverImage: '/images/1img.jpg',
    notes: 'Inspiring and beautifully written.',
    isFavorite: false,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'fiction',
    publicationYear: 1925,
    isbn: '978-0-7432-7356-5',
    description: 'A classic American novel set in the Jazz Age.',
    pages: 180,
    language: 'English',
    status: 'available',
    rating: 4,
    publisher: 'Scribner',
    coverImage: '/images/3img.jpg',
    notes: 'Beautiful prose and compelling characters.',
    isFavorite: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  }
];

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize books from localStorage or use mock data
  useEffect(() => {
    const initializeBooks = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const savedBooks = localStorage.getItem('bookshelf_books');
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          setBooks(parsedBooks.map(book => createBook(book)));
        } else {
          const initialBooks = MOCK_BOOKS.map(book => createBook(book));
          setBooks(initialBooks);
          localStorage.setItem('bookshelf_books', JSON.stringify(initialBooks));
        }
      } catch (err) {
        setError('Failed to load books');
        console.error('Error loading books:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeBooks();
  }, []);

  // Save books to localStorage whenever books change
  const saveBooks = useCallback((updatedBooks) => {
    try {
      localStorage.setItem('bookshelf_books', JSON.stringify(updatedBooks));
    } catch (err) {
      console.error('Error saving books:', err);
      setError('Failed to save books');
    }
  }, []);

  const addBook = useCallback((bookData) => {
    try {
      const newBook = createBook({
        ...bookData,
        publicationYear: Number(bookData.publicationYear) || new Date().getFullYear(),
        pages: bookData.pages ? Number(bookData.pages) : null,
        rating: bookData.rating ? Number(bookData.rating) : null,
        price: bookData.price ? Number(bookData.price) : null,
      });

      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      return newBook;
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book');
      return null;
    }
  }, [books, saveBooks]);

  const updateBook = useCallback((id, bookData) => {
    try {
      const updatedBooks = books.map(book =>
        book.id === id
          ? createBook({
              ...book,
              ...bookData,
              publicationYear: Number(bookData.publicationYear) || book.publicationYear,
              pages: bookData.pages ? Number(bookData.pages) : null,
              rating: bookData.rating ? Number(bookData.rating) : null,
              price: bookData.price ? Number(bookData.price) : null,
              updatedAt: new Date(),
            })
          : book
      );

      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      return updatedBooks.find(book => book.id === id) || null;
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Failed to update book');
      return null;
    }
  }, [books, saveBooks]);

  const deleteBook = useCallback((id) => {
    try {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      return true;
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book');
      return false;
    }
  }, [books, saveBooks]);

  const deleteMultipleBooks = useCallback((ids) => {
    try {
      const updatedBooks = books.filter(book => !ids.includes(book.id));
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      return true;
    } catch (err) {
      console.error('Error deleting books:', err);
      setError('Failed to delete books');
      return false;
    }
  }, [books, saveBooks]);

  const toggleFavorite = useCallback((id) => {
    try {
      const updatedBooks = books.map(book =>
        book.id === id
          ? createBook({ ...book, isFavorite: !book.isFavorite, updatedAt: new Date() })
          : book
      );
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      return true;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
      return false;
    }
  }, [books, saveBooks]);

  const searchBooks = useCallback((query, filters = {}) => {
    if (!query.trim() && Object.keys(filters).length === 0) return books;
    
    return books.filter(book => {
      // Text search
      const matchesQuery = !query.trim() || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.toLowerCase().includes(query.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(query.toLowerCase()));

      // Filter by status
      const matchesStatus = !filters.status || book.status === filters.status;
      
      // Filter by genre
      const matchesGenre = !filters.genre || book.genre === filters.genre;
      
      // Filter by rating
      const matchesRating = !filters.rating || book.rating === Number(filters.rating);
      
      // Filter by year
      const matchesYear = !filters.year || book.publicationYear === Number(filters.year);
      
      // Filter by favorites
      const matchesFavorite = filters.favorites === undefined || book.isFavorite === filters.favorites;

      return matchesQuery && matchesStatus && matchesGenre && matchesRating && matchesYear && matchesFavorite;
    });
  }, [books]);

  const sortBooks = useCallback((booksToSort, sortBy, sortOrder = 'asc') => {
    return [...booksToSort].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      // Handle dates
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, []);

  const getBookStats = useCallback(() => {
    const stats = {
      total: books.length,
      read: books.filter(book => book.status === 'read').length,
      reading: books.filter(book => book.status === 'reading').length,
      wantToRead: books.filter(book => book.status === 'want_to_read').length,
      favorites: books.filter(book => book.isFavorite).length,
      totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
      averageRating: books.filter(book => book.rating).reduce((sum, book, _, arr) => 
        sum + book.rating / arr.length, 0
      ).toFixed(1),
      genreCount: [...new Set(books.map(book => book.genre))].length,
      booksThisYear: books.filter(book => 
        new Date(book.createdAt).getFullYear() === new Date().getFullYear()
      ).length,
    };

    // Find most common genre
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
    
    stats.favoriteGenre = Object.keys(genreCounts).reduce((a, b) => 
      genreCounts[a] > genreCounts[b] ? a : b, ''
    );

    return stats;
  }, [books]);

  const exportBooks = useCallback(() => {
    try {
      const dataStr = JSON.stringify(books, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `bookshelf-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (err) {
      console.error('Error exporting books:', err);
      setError('Failed to export books');
      return false;
    }
  }, [books]);

  const importBooks = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBooks = JSON.parse(e.target.result);
          if (!Array.isArray(importedBooks)) {
            throw new Error('Invalid file format');
          }
          
          const validBooks = importedBooks
            .filter(book => book.title && book.author)
            .map(book => createBook(book));
          
          const updatedBooks = [...books, ...validBooks];
          setBooks(updatedBooks);
          saveBooks(updatedBooks);
          resolve(validBooks.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [books, saveBooks]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    deleteMultipleBooks,
    toggleFavorite,
    searchBooks,
    sortBooks,
    getBookStats,
    exportBooks,
    importBooks,
    clearError,
  };
};