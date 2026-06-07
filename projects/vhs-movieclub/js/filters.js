/**
 * ============================================
 * VHS MovieClub — Filtering Logic
 * ============================================
 * This module handles data filtering. It uses 
 * simple string matching (.includes()) to ensure 
 * flawless compatibility with non-Latin alphabets 
 * like Cyrillic (which can break complex RegEx).
 * ============================================
 */

/**
 * Filters an array of movies based on search query, year, genre, and language.
 * 
 * @param {Array} movies - The full array of movie objects to filter.
 * @param {string} searchInput - The search string to match against title and genres.
 * @param {string} yearSelect - The exact year to filter by (e.g., "1994", or "all").
 * @param {string} genreSelect - The exact genre string to filter by (e.g., "Фантастика", or "all").
 * @param {string} currentLang - The active language code ('ru' or 'uk').
 * @returns {Array} A new array containing only the movies that match all criteria.
 */
export function filterMovies(movies, searchInput, yearSelect, genreSelect, currentLang) {
  // 1. Normalize the search string to lowercase and remove extra whitespace
  const query = searchInput ? searchInput.toLowerCase().trim() : '';

  return movies.filter(movie => {
    
    // -----------------------------------------
    // 1. Search Logic (Title & Genres)
    // -----------------------------------------
    // Using .includes() instead of RegEx ensures 100% reliable substring 
    // matching for Cyrillic characters without worrying about Unicode word boundaries.
    let matchesSearch = true;

    if (query) {
      // Safely access localized strings, fallback to empty string if missing
      const title = (movie.title[currentLang] || '').toLowerCase();
      const genres = movie.genre[currentLang] || [];

      // Check if the query is inside the title OR inside ANY of the genres
      const matchesTitle = title.includes(query);
      const matchesGenre = genres.some(g => g.toLowerCase().includes(query));

      matchesSearch = matchesTitle || matchesGenre;
    }

    // -----------------------------------------
    // 2. Year Logic (Exact Match)
    // -----------------------------------------
    let matchesYear = true;

    if (yearSelect && yearSelect !== 'all') {
      matchesYear = movie.year === parseInt(yearSelect, 10);
    }

    // -----------------------------------------
    // 3. Genre Logic (Exact Match from Dropdown)
    // -----------------------------------------
    // The dropdown passes exact strings, so a strict lowercase comparison is best here.
    let matchesGenre = true;

    if (genreSelect && genreSelect !== 'all') {
      const localizedGenres = movie.genre[currentLang] || [];
      const lowerGenreFilter = genreSelect.toLowerCase();
      
      matchesGenre = localizedGenres.some(g => g.toLowerCase() === lowerGenreFilter);
    }

    // -----------------------------------------
    // 4. Combine Conditions
    // -----------------------------------------
    return matchesSearch && matchesYear && matchesGenre;
  });
}