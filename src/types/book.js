// Book interface definition
export const createBook = (data) => ({
  id: data.id || Date.now().toString(),
  title: data.title || '',
  author: data.author || '',
  genre: data.genre || '',
  publicationYear: data.publicationYear || new Date().getFullYear(),
  isbn: data.isbn || '',
  description: data.description || '',
  pages: data.pages || null,
  language: data.language || 'English',
  status: data.status || 'available',
  rating: data.rating || null,
  purchaseDate: data.purchaseDate || null,
  price: data.price || null,
  publisher: data.publisher || '',
  coverImage: data.coverImage || '',
  notes: data.notes || '',
  isFavorite: data.isFavorite || false,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date(),
});

export const createBookFormData = (book = null) => ({
  title: book?.title || '',
  author: book?.author || '',
  genre: book?.genre || '',
  publicationYear: book?.publicationYear || '',
  isbn: book?.isbn || '',
  description: book?.description || '',
  pages: book?.pages || '',
  language: book?.language || 'English',
  status: book?.status || 'available',
  rating: book?.rating || '',
  purchaseDate: book?.purchaseDate || '',
  price: book?.price || '',
  publisher: book?.publisher || '',
  coverImage: book?.coverImage || '',
  notes: book?.notes || '',
  isFavorite: book?.isFavorite || false,
});

export const BOOK_STATUSES = ['available', 'reading', 'read', 'want_to_read', 'borrowed', 'lent'];

export const BOOK_GENRES = [
  'fiction', 'non_fiction', 'mystery', 'romance', 'science_fiction',
  'fantasy', 'biography', 'history', 'self_help', 'business',
  'technology', 'health', 'travel', 'cooking', 'art',
  'philosophy', 'psychology', 'education', 'children', 'young_adult'
];

export const SORT_OPTIONS = [
  'title', 'author', 'publicationYear', 'rating', 'createdAt'
];

export const validateBookData = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!data.author?.trim()) {
    errors.author = 'Author is required';
  }
  
  if (!data.genre) {
    errors.genre = 'Genre is required';
  }
  
  if (data.publicationYear && (isNaN(data.publicationYear) || data.publicationYear < 1000 || data.publicationYear > new Date().getFullYear())) {
    errors.publicationYear = 'Invalid publication year';
  }
  
  if (data.pages && (isNaN(data.pages) || data.pages <= 0)) {
    errors.pages = 'Invalid page count';
  }
  
  if (data.rating && (isNaN(data.rating) || data.rating < 1 || data.rating > 5)) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  return errors;
};