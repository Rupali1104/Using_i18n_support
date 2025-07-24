import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormValidation = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validateBook = useCallback((formData) => {
    const newErrors = {};

    // Title validation
    if (!formData.title?.trim()) {
      newErrors.title = t('errors.title_required');
    } else if (formData.title.length > 200) {
      newErrors.title = t('errors.title_too_long');
    }

    // Author validation
    if (!formData.author?.trim()) {
      newErrors.author = t('errors.author_required');
    } else if (formData.author.length > 100) {
      newErrors.author = t('errors.author_too_long');
    }

    // Genre validation
    if (!formData.genre) {
      newErrors.genre = t('errors.genre_required');
    }

    // Publication year validation
    if (formData.publicationYear) {
      const year = Number(formData.publicationYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > 9999) {
        newErrors.publicationYear = t('errors.year_invalid');
      } else if (year > currentYear) {
        newErrors.publicationYear = t('errors.year_future');
      } else if (year < 1000) {
        newErrors.publicationYear = t('errors.year_too_old');
      }
    }

    // ISBN validation (optional but validate format if provided)
    if (formData.isbn && formData.isbn.trim()) {
      const cleanIsbn = formData.isbn.replace(/[- ]/g, '');
      const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
      if (!isbnRegex.test(cleanIsbn)) {
        newErrors.isbn = t('errors.isbn_invalid');
      }
    }

    // Pages validation (optional but validate if provided)
    if (formData.pages) {
      const pages = Number(formData.pages);
      if (isNaN(pages) || pages <= 0) {
        newErrors.pages = t('errors.pages_invalid');
      } else if (pages > 10000) {
        newErrors.pages = t('errors.pages_too_high');
      }
    }

    // Rating validation (optional but validate if provided)
    if (formData.rating) {
      const rating = Number(formData.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        newErrors.rating = t('errors.rating_invalid');
      }
    }

    // Price validation (optional but validate if provided)
    if (formData.price) {
      const price = Number(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = t('errors.price_invalid');
      }
    }

    // URL validation for cover image (optional but validate if provided)
    if (formData.coverImage && formData.coverImage.trim()) {
      try {
        new URL(formData.coverImage);
      } catch {
        newErrors.coverImage = t('errors.url_invalid');
      }
    }

    // Description validation (optional)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = t('errors.description_too_long');
    }

    // Notes validation (optional)
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = t('errors.notes_too_long');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [t]);

  const validateField = useCallback((fieldName, value, formData = {}) => {
    const fieldErrors = {};
    
    switch (fieldName) {
      case 'title':
        if (!value?.trim()) {
          fieldErrors.title = t('errors.title_required');
        } else if (value.length > 200) {
          fieldErrors.title = t('errors.title_too_long');
        }
        break;
        
      case 'author':
        if (!value?.trim()) {
          fieldErrors.author = t('errors.author_required');
        } else if (value.length > 100) {
          fieldErrors.author = t('errors.author_too_long');
        }
        break;
        
      case 'genre':
        if (!value) {
          fieldErrors.genre = t('errors.genre_required');
        }
        break;
        
      case 'publicationYear':
        if (value) {
          const year = Number(value);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1000 || year > 9999) {
            fieldErrors.publicationYear = t('errors.year_invalid');
          } else if (year > currentYear) {
            fieldErrors.publicationYear = t('errors.year_future');
          }
        }
        break;
        
      case 'isbn':
        if (value && value.trim()) {
          const cleanIsbn = value.replace(/[- ]/g, '');
          const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
          if (!isbnRegex.test(cleanIsbn)) {
            fieldErrors.isbn = t('errors.isbn_invalid');
          }
        }
        break;
        
      case 'pages':
        if (value) {
          const pages = Number(value);
          if (isNaN(pages) || pages <= 0) {
            fieldErrors.pages = t('errors.pages_invalid');
          } else if (pages > 10000) {
            fieldErrors.pages = t('errors.pages_too_high');
          }
        }
        break;
        
      case 'rating':
        if (value) {
          const rating = Number(value);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            fieldErrors.rating = t('errors.rating_invalid');
          }
        }
        break;
        
      case 'price':
        if (value) {
          const price = Number(value);
          if (isNaN(price) || price < 0) {
            fieldErrors.price = t('errors.price_invalid');
          }
        }
        break;
        
      case 'coverImage':
        if (value && value.trim()) {
          try {
            new URL(value);
          } catch {
            fieldErrors.coverImage = t('errors.url_invalid');
          }
        }
        break;
        
      case 'description':
        if (value && value.length > 1000) {
          fieldErrors.description = t('errors.description_too_long');
        }
        break;
        
      case 'notes':
        if (value && value.length > 500) {
          fieldErrors.notes = t('errors.notes_too_long');
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      ...fieldErrors,
      // Clear error if validation passes
      ...(Object.keys(fieldErrors).length === 0 && { [fieldName]: undefined })
    }));
    
    return Object.keys(fieldErrors).length === 0;
  }, [t]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const hasErrors = Object.keys(errors).some(key => errors[key]);

  return {
    errors,
    validateBook,
    validateField,
    clearErrors,
    clearFieldError,
    hasErrors,
  };
};