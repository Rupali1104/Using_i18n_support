import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Book, Plus, Search, BarChart3, Heart, BookOpen, 
  Star, TrendingUp, Calendar, Award, ArrowRight, Clock
} from 'lucide-react';

const Home = ({ books, onNavigate }) => {
  const { t, i18n } = useTranslation();

  // Calculate quick stats
  const stats = {
    total: books.length,
    read: books.filter(book => book.status === 'read').length,
    reading: books.filter(book => book.status === 'reading').length,
    favorites: books.filter(book => book.isFavorite).length,
    booksThisYear: books.filter(book => 
      new Date(book.createdAt).getFullYear() === new Date().getFullYear()
    ).length,
  };

  // Get recent books
  const recentBooks = books
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const features = [
    {
      icon: Book,
      title: t('navigation.books'),
      description: `${stats.total} books in your library`,
      action: () => onNavigate('books'),
      color: 'bg-blue-500',
      stats: `${stats.read} read, ${stats.reading} reading`,
    },
    {
      icon: Plus,
      title: t('navigation.add_book'),
      description: 'Add new books to your collection',
      action: () => onNavigate('add-book'),
      color: 'bg-green-500',
      stats: 'Quick and easy book entry',
    },
    {
      icon: BarChart3,
      title: t('navigation.statistics'),
      description: 'View your reading analytics',
      action: () => onNavigate('statistics'),
      color: 'bg-purple-500',
      stats: `${stats.booksThisYear} books this year`,
    },
    {
      icon: Search,
      title: 'Search & Filter',
      description: 'Find books by title, author, or genre',
      action: () => onNavigate('books'),
      color: 'bg-orange-500',
      stats: 'Advanced filtering options',
    },
  ];

  const quickStats = [
    { icon: Book, label: 'Total Books', value: stats.total, color: 'text-blue-600' },
    { icon: BookOpen, label: 'Books Read', value: stats.read, color: 'text-green-600' },
    { icon: Heart, label: 'Favorites', value: stats.favorites, color: 'text-red-600' },
    { icon: Calendar, label: 'This Year', value: stats.booksThisYear, color: 'text-purple-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <Book size={32} />
            </div>
            <div className="absolute top-8 right-8">
              <Star size={24} />
            </div>
            <div className="absolute bottom-4 left-8">
              <Heart size={28} />
            </div>
            <div className="absolute bottom-8 right-4">
              <BookOpen size={36} />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
              <Book size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('navigation.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              {t('messages.welcome_message')}. Organize, track, and discover your next great read.
            </p>
            <button
              onClick={() => onNavigate('add-book')}
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus size={20} />
              {t('actions.add_new_book')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={32} />
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
            onClick={feature.action}
          >
            <div className="p-6">
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {feature.description}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {feature.stats}
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-200">
                <span>Explore</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Books */}
      {recentBooks.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Recently Added Books
            </h2>
            <button
              onClick={() => onNavigate('books')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors duration-200"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBooks.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded mb-4 flex items-center justify-center">
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
                    <BookOpen size={48} className="text-blue-300" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    book.status === 'read' ? 'bg-green-100 text-green-800' :
                    book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`status.${book.status}`)}
                  </span>
                  {book.isFavorite && (
                    <Heart size={16} className="text-red-500 fill-current" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language & Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Language Support */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={24} className="text-green-600" />
            Multi-Language Support
          </h3>
          <p className="text-gray-600 mb-4">
            Currently viewing in <strong>{i18n.language === 'en' ? 'English' : 
            i18n.language === 'es' ? 'Español' : 
            i18n.language === 'fr' ? 'Français' : 'Deutsch'}</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span>English</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇪🇸</span>
              <span>Español</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇫🇷</span>
              <span>Français</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇩🇪</span>
              <span>Deutsch</span>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-600" />
            Key Features
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Advanced search and filtering
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Reading progress tracking
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Personal ratings and notes
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Detailed statistics and analytics
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Export and import functionality
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;