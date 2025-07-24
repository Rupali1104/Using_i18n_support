import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Book, BookOpen, Clock, Star, Heart, TrendingUp,
  Calendar, Target, Award, BarChart3
} from 'lucide-react';

const Statistics = ({ books }) => {
  const { t } = useTranslation();

  // Calculate statistics
  const stats = {
    total: books.length,
    read: books.filter(book => book.status === 'read').length,
    reading: books.filter(book => book.status === 'reading').length,
    wantToRead: books.filter(book => book.status === 'want_to_read').length,
    favorites: books.filter(book => book.isFavorite).length,
    totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
    averageRating: books.filter(book => book.rating).length > 0 
      ? (books.filter(book => book.rating).reduce((sum, book) => sum + book.rating, 0) / books.filter(book => book.rating).length).toFixed(1)
      : 0,
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
  
  const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => 
    genreCounts[a] > genreCounts[b] ? a : b, ''
  );

  // Calculate reading progress
  const readingProgress = stats.total > 0 ? (stats.read / stats.total * 100).toFixed(1) : 0;

  // Get top genres
  const topGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  // Get recent books
  const recentBooks = books
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = 'blue' }) => {
    const percentage = max > 0 ? (value / max * 100) : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('navigation.statistics')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('messages.library_stats', { count: stats.total, genres: stats.genreCount })}
        </p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Book}
          title={t('statistics.total_books')}
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          title={t('statistics.books_read')}
          value={stats.read}
          subtitle={`${readingProgress}% of library`}
          color="green"
        />
        <StatCard
          icon={Clock}
          title={t('statistics.currently_reading')}
          value={stats.reading}
          color="orange"
        />
        <StatCard
          icon={Heart}
          title="Favorites"
          value={stats.favorites}
          color="red"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Star}
          title={t('statistics.average_rating')}
          value={stats.averageRating}
          subtitle="out of 5 stars"
          color="yellow"
        />
        <StatCard
          icon={Calendar}
          title={t('statistics.books_this_year')}
          value={stats.booksThisYear}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Pages"
          value={stats.totalPages.toLocaleString()}
          color="indigo"
        />
        <StatCard
          icon={Award}
          title="Genres Explored"
          value={stats.genreCount}
          color="emerald"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reading Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} />
            Reading Progress
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label={t('status.read')}
              value={stats.read}
              max={stats.total}
              color="green"
            />
            <ProgressBar
              label={t('status.reading')}
              value={stats.reading}
              max={stats.total}
              color="blue"
            />
            <ProgressBar
              label={t('status.want_to_read')}
              value={stats.wantToRead}
              max={stats.total}
              color="orange"
            />
          </div>
        </div>

        {/* Top Genres */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Award size={20} />
            Top Genres
          </h3>
          <div className="space-y-4">
            {topGenres.map(({ genre, count }, index) => (
              <div key={genre} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">
                    {t(`genres.${genre}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{count} books</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.total * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock size={20} />
          Recently Added Books
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentBooks.map((book) => (
            <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover object-center rounded"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                    }}
                  />
                ) : (
                  <BookOpen size={32} className="text-blue-300" />
                )}
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2">{book.author}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  book.status === 'read' ? 'bg-green-100 text-green-800' :
                  book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {t(`status.${book.status}`)}
                </span>
                {book.isFavorite && (
                  <Heart size={14} className="text-red-500 fill-current" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Goals */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target size={20} />
            Reading Goals
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stats.booksThisYear}</div>
            <div className="text-blue-100">Books This Year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stats.totalPages.toLocaleString()}</div>
            <div className="text-blue-100">Pages Read</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stats.genreCount}</div>
            <div className="text-blue-100">Genres Explored</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;