/**
 * ============================================
 * VHS MovieClub — Multilingual UI Components
 * ============================================
 * Generates HTML strings for movie cards, the 
 * detailed modal view, and the custom VHS video player.
 * ============================================
 */

/**
 * Generates an HTML string for a single movie card.
 * @param {Object} movie - A movie object from the MOVIES array
 * @param {string} lang - The current language code ('ru' or 'uk')
 * @returns {string} HTML string representing the movie card
 */
export function createMovieCard(movie, lang) {
  const title = movie.title[lang] || 'Название неизвестно';
  const genres = (movie.genre[lang] || []).join(", ");

  return `
    <article class="movie-card" data-id="${movie.id}">
      <div class="card-poster">
        <img 
          src="${movie.poster}" 
          alt="Poster for ${title}" 
          loading="lazy"
        >
      </div>
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        <div class="card-meta">
          <span class="card-year">${movie.year}</span>
          <span class="card-genre">${genres}</span>
        </div>
        <div class="card-rating">★ ${movie.rating}</div>
      </div>
    </article>
  `;
}

/**
 * Generates an HTML string for the detailed view inside the modal.
 * 
 * @param {Object} movie - A movie object from the MOVIES array
 * @param {string} lang - The current language code ('ru' or 'uk')
 * @returns {string} HTML string representing the modal's inner content
 */
export function createModalContent(movie, lang) {
  const title = movie.title[lang] || 'Название неизвестно';
  const description = movie.description[lang] || '';
  const genres = (movie.genre[lang] || []).join(", ");

  const isRu = lang === 'ru';
  const commentsTitle = isRu ? 'Комментарии' : 'Коментарі';
  const commentPlaceholder = isRu ? 'Написать комментарий...' : 'Написати коментар...';
  const submitBtnText = isRu ? 'Отправить' : 'Надіслати';

  return `
    <div class="modal-inner">
      
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal details">
        &times;
      </button>

      <div class="modal-layout">
        
        <div class="modal-poster">
          <img src="${movie.poster}" alt="Detailed poster for ${title}">
        </div>

        <div class="modal-details">
          <h2 class="modal-title">${title}</h2>
          
          <div class="modal-meta">
            <span class="modal-year">${movie.year}</span>
            <span class="meta-divider">•</span>
            <span class="modal-genre">${genres}</span>
            <span class="meta-divider">•</span>
            <span class="modal-rating">★ ${movie.rating} / 10</span>
          </div>

          <p class="modal-description">${description}</p>

          <!-- ==========================================
               VIDEO SECTION (FIXED STRUCTURE)
               ========================================== -->
          <div id="modal-video-container">
            
            <!-- Permanent navigation buttons -->
            <div class="modal-action-buttons video-btn-group">
              <button id="play-trailer-btn" data-trailer="${movie.trailer}" class="retro-btn">📼 PLAY TRAILER</button>
              <button id="play-full-movie-btn" class="retro-btn">📼 WATCH FULL MOVIE</button>
            </div>

            <!-- Dedicated container for dynamic content -->
            <div id="vhs-screen-area"></div>

          </div>

          <!-- ==========================================
               LIKE SECTION
               ========================================== -->
          <div class="modal-actions">
            <button id="modal-like-btn" class="like-btn" data-movie-id="${movie.id}">
              ⚡ LIKE <span id="modal-like-count">0</span>
            </button>
          </div>

          <!-- ==========================================
               COMMENTS SECTION
               ========================================== -->
          <div class="comments-section">
            <h3 class="comments-title">${commentsTitle}</h3>
            
            <div id="modal-comments-list" class="comments-list"></div>
            
            <form id="comment-form" class="comment-form">
              <textarea 
                id="comment-text" 
                class="comment-textarea" 
                placeholder="${commentPlaceholder}" 
                rows="3"
                required
              ></textarea>
              <button type="submit" id="submit-comment-btn" class="submit-comment-btn">
                ${submitBtnText}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML string for the Custom VHS Video Player.
 * Extracted as a separate component to keep app.js logic clean.
 * 
 * @param {string} movieSrc - The URL of the video file
 * @returns {string} HTML string representing the VHS player and its controls
 */
export function createVhsPlayerHtml(movieSrc) {
  return `
    <div class="vhs-player-container">
      
      <!-- 
        Inline styles added to the video tag to strictly prevent horizontal overflow/scrollbars.
        max-width: 100% and width: 100% ensure it never stretches outside the modal wrapper.
      -->
      <video 
        id="vhs-video-player" 
        src="${movieSrc}" 
        style="max-width: 100%; width: 100%; display: block;"
      ></video>
      
      <div class="vhs-controls">
        <button id="vhs-play-btn">PLAY</button>
        <button id="vhs-rew-btn">REW</button>
        <button id="vhs-stop-btn">STOP</button>
        
        <div class="vhs-progress-wrapper">
          <input type="range" id="vhs-timeline" value="0" min="0" step="1" class="vhs-progress-track">
        </div>
        
        <span id="vhs-clock" class="vhs-glow">00:00:00</span>
        
        <div class="vhs-volume-wrapper">
          <input type="range" id="vhs-volume" min="0" max="1" step="0.1" value="1" class="vhs-volume-track">
        </div>

        <!-- New Fullscreen Button -->
        <button id="vhs-fullscreen-btn">📺 FULL</button>
      </div>
    </div>
  `;
}