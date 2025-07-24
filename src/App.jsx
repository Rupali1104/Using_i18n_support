import React, { Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation';
import Home from './components/Home';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Statistics from './components/Statistics';
import LoadingSpinner from './components/LoadingSpinner';
import { useBooks } from './hooks/useBooks';
import { createBookFormData } from './types/book';
import './i18n';

const App = () => {
  const { t } = useTranslation();
  const { 
    books, 
    loading, 
    error,
    addBook, 
    updateBook, 
    deleteBook, 
    deleteMultipleBooks,
    toggleFavorite,
    searchBooks,
    clearError
  } = useBooks();

  const [currentView, setCurrentView] = useState('home');
  const [editingBook, setEditingBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Update filtered books when books change
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setEditingBook(null);
  };

  const handleAddBook = async (bookData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBook = addBook(bookData);
      if (newBook) {
        showNotification(t('messages.book_added'));
        setCurrentView('books');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      showNotification(t('errors.generic_error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setCurrentView('edit-book');
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedBook = updateBook(editingBook.id, bookData);
      if (updatedBook) {
        showNotification(t('messages.book_updated'));
        setCurrentView('books');
        setEditingBook(null);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showNotification(t('errors.generic_error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const success = deleteBook(id);
      if (success) {
        showNotification(t('messages.book_deleted'));
        // Update filtered books if search is active
        setFilteredBooks(prevFiltered => 
          prevFiltered.filter(book => book.id !== id)
        );
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showNotification(t('errors.generic_error'), 'error');
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      const success = deleteMultipleBooks(ids);
      if (success) {
        showNotification(`${ids.length} books deleted successfully`);
        setFilteredBooks(prevFiltered => 
          prevFiltered.filter(book => !ids.includes(book.id))
        );
      }
    } catch (error) {
      console.error('Error deleting books:', error);
      showNotification(t('errors.generic_error'), 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const success = toggleFavorite(id);
      if (success) {
        const book = books.find(b => b.id === id);
        showNotification(
          book?.isFavorite 
            ? 'Removed from favorites' 
            : 'Added to favorites'
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification(t('errors.generic_error'), 'error');
    }
  };

  const handleSearch = (query, filters = {}) => {
    const results = searchBooks(query, filters);
    setFilteredBooks(results);
  };

  const handleFormCancel = () => {
    setEditingBook(null);
    setCurrentView(currentView === 'edit-book' ? 'books' : 'home');
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading your library..." />;
    }

    switch (currentView) {
      case 'home':
        return (
          <Home 
            books={books}
            onNavigate={handleViewChange}
          />
        );
      case 'books':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <BookList
              books={filteredBooks}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
              onBulkDelete={handleBulkDelete}
              onToggleFavorite={handleToggleFavorite}
              onSearch={handleSearch}
            />
          </div>
        );
      case 'add-book':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <BookForm
              onSubmit={handleAddBook}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        );
      case 'edit-book':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <BookForm
              book={editingBook}
              onSubmit={handleUpdateBook}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        );
      case 'statistics':
        return <Statistics books={books} />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          currentView={currentView === 'edit-book' ? 'books' : currentView}
          onViewChange={handleViewChange} 
        />
        
        <main>
          {renderContent()}
        </main>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-2 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Notification Display */}
        {notification && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default App;