import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Edit3, Trash2, Search, X, Filter, Grid, List, 
  Star, Heart, Eye, BookOpen, Clock, CheckCircle,
  SortAsc, SortDesc, MoreVertical
} from 'lucide-react';

const BookList = ({ 
  books, 
  onEdit, 
  onDelete, 
  onSearch, 
  onToggleFavorite,
  onBulkDelete 
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: '',
    genre: '',
    rating: '',
    favorites: false,
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    statuses: [...new Set(books.map(book => book.status))],
    genres: [...new Set(books.map(book => book.genre))],
    ratings: [1, 2, 3, 4, 5],
  }), [books]);

  // Apply search and filters
  const filteredBooks = useMemo(() => {
    let result = books;

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(book => book.status === filters.status);
    }
    if (filters.genre) {
      result = result.filter(book => book.genre === filters.genre);
    }
    if (filters.rating) {
      result = result.filter(book => book.rating === Number(filters.rating));
    }
    if (filters.favorites) {
      result = result.filter(book => book.isFavorite);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [books, searchQuery, filters, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      genre: '',
      rating: '',
      favorites: false,
    });
    setSearchQuery('');
    onSearch('');
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === filteredBooks.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(filteredBooks.map(book => book.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBooks.size > 0) {
      onBulkDelete(Array.from(selectedBooks));
      setSelectedBooks(new Set());
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reading': return <BookOpen size={16} className="text-blue-500" />;
      case 'read': return <CheckCircle size={16} className="text-green-500" />;
      case 'want_to_read': return <Clock size={16} className="text-orange-500" />;
      default: return <Eye size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-green-100 text-green-800 border-green-200';
      case 'want_to_read': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'available': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'borrowed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-blue-300" />
          </div>
        )}
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={selectedBooks.has(book.id)}
            onChange={() => handleSelectBook(book.id)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white/90"
          />
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(book.id)}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
        >
          <Heart
            size={16}
            className={book.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 bg-white/90 ${getStatusColor(book.status)}`}>
            {getStatusIcon(book.status)}
            {t(`status.${book.status}`)}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {t('table.author')}: {book.author}
          </p>
          {book.rating && (
            <div className="flex items-center gap-2 mb-2">
              {renderStars(book.rating)}
              <span className="text-sm text-gray-500">({book.rating}/5)</span>
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>{t('table.genre')}:</span>
            <span className="font-medium">{t(`genres.${book.genre}`)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('table.year')}:</span>
            <span className="font-medium">{book.publicationYear}</span>
          </div>
          {book.pages && (
            <div className="flex justify-between">
              <span>{t('form.pages')}:</span>
              <span className="font-medium">{book.pages}</span>
            </div>
          )}
        </div>

        {book.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(book)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex-1 justify-center text-sm font-medium"
          >
            <Edit3 size={14} />
            {t('buttons.edit')}
          </button>
          <button
            onClick={() => setDeleteConfirm(book.id)}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex-1 justify-center text-sm font-medium"
          >
            <Trash2 size={14} />
            {t('buttons.delete')}
          </button>
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={selectedBooks.has(book.id)}
          onChange={() => handleSelectBook(book.id)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />

        {/* Book Cover Thumbnail */}
        <div className="w-16 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex-shrink-0 flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <BookOpen size={24} className="text-blue-300" />
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {book.title}
              </h3>
              <p className="text-gray-600 text-sm truncate">
                {book.author}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{t(`genres.${book.genre}`)}</span>
                <span>{book.publicationYear}</span>
                {book.pages && <span>{book.pages} pages</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-1">
                  {renderStars(book.rating)}
                </div>
              )}

              {/* Status */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(book.status)}`}>
                {getStatusIcon(book.status)}
                {t(`status.${book.status}`)}
              </span>

              {/* Favorite */}
              <button
                onClick={() => onToggleFavorite(book.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <Heart
                  size={16}
                  className={book.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
                />
              </button>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                  title={t('buttons.edit')}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(book.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  title={t('buttons.delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('messages.search_placeholder')}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={18} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Filter size={18} />
            {t('filters.sort_by')}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('filters.by_status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('filters.all')}</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('filters.by_genre')}
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('filters.all')}</option>
                  {filterOptions.genres.map(genre => (
                    <option key={genre} value={genre}>
                      {t(`genres.${genre}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('filters.sort_by')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="title">{t('filters.sort_title')}</option>
                    <option value="author">{t('filters.sort_author')}</option>
                    <option value="publicationYear">{t('filters.sort_year')}</option>
                    <option value="rating">{t('filters.sort_rating')}</option>
                    <option value="createdAt">{t('filters.sort_date_added')}</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    title={sortOrder === 'asc' ? t('filters.ascending') : t('filters.descending')}
                  >
                    {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {t('buttons.clear')}
                </button>
              </div>
            </div>

            {/* Favorites Toggle */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.favorites}
                  onChange={(e) => handleFilterChange('favorites', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Heart size={16} className="text-red-500" />
                  Show only favorites
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedBooks.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {t('table.selected_count', { count: selectedBooks.size })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <Trash2 size={16} />
                {t('buttons.delete')}
              </button>
              <button
                onClick={() => setSelectedBooks(new Set())}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select All */}
      {filteredBooks.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedBooks.size === filteredBooks.length && filteredBooks.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {t('table.select_all')} ({filteredBooks.length})
          </span>
        </div>
      )}

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">{t('messages.no_books')}</p>
          <p className="text-gray-400 text-sm">
            {searchQuery || Object.values(filters).some(f => f) 
              ? 'Try adjusting your search or filters'
              : 'Start building your library today!'
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-4'
        }>
          {filteredBooks.map((book) => (
            viewMode === 'grid' 
              ? <BookCard key={book.id} book={book} />
              : <BookListItem key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('actions.delete_book')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('messages.confirm_delete')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                {t('buttons.delete')}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;