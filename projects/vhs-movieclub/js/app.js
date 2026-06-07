/**
 * ============================================
 * VHS MovieClub — Main Application Controller
 * ============================================
 * Manages application state, LocalStorage interactions 
 * for likes/comments, language switching, filtering, 
 * pagination, YouTube trailer embedding, the custom 
 * retro VHS video player, VCR tape loader, and P2P WebTorrent.
 * ============================================
 */

import { MOVIES } from './storage.js';
import { createMovieCard, createModalContent, createVhsPlayerHtml } from './components.js';
import { filterMovies } from './filters.js';

// -----------------------------------------
// 1. Localized UI Strings
// -----------------------------------------
const UI_TEXT = {
  uk: {
    allGenres: "Усі жанри",
    allYears: "Усі роки",
    noResults: "Касети не знайдено. Перемотайте магнітофон і спробуйте ще раз.",
    prev: "Назад",
    next: "Далі",
    searchPlaceholder: "Пошук...",
    noComments: "Поки що немає коментарів",
    loadingText: "📼 ЗАВАНТАЖЕННЯ...",
    bufferingText: "⏳ БУФЕРИЗАЦІЯ..."
  },
  ru: {
    allGenres: "Все жанры",
    allYears: "Все годы",
    noResults: "Кассеты не найдены. Перемотайте магнитофон и попробуйте еще раз.",
    prev: "Назад",
    next: "Далее",
    searchPlaceholder: "Поиск...",
    noComments: "Пока нет комментариев",
    loadingText: "📼 ЗАГРУЗКА...",
    bufferingText: "⏳ БУФЕРИЗАЦИЯ..."
  }
};

// -----------------------------------------
// 2. Application State
// -----------------------------------------
const state = {
  currentLang: 'uk',
  currentPage: 1,
  moviesPerPage: 10
};

let gridRenderTimeout;

// -----------------------------------------
// 3. DOM Element Selection
// -----------------------------------------
const movieGrid = document.querySelector('#movie-grid');
const searchBar = document.querySelector('#search-bar');
const yearSelect = document.querySelector('#filter-year');
const genreSelect = document.querySelector('#filter-genre');
const movieModal = document.querySelector('#movie-modal');
const paginationContainer = document.querySelector('#pagination-container');
const langButtons = document.querySelectorAll('.lang-btn');
const loader = document.getElementById('vhs-loader');

// -----------------------------------------
// 4. LocalStorage Helpers
// -----------------------------------------

function getMovieData(id) {
  try {
    const data = JSON.parse(localStorage.getItem(`vhs_movie_${id}`));
    if (data && typeof data.likes === 'number' && Array.isArray(data.comments)) {
      return data;
    }
  } catch (e) {
    console.warn(`[LocalStorage] Corrupted data for movie ${id}. Resetting.`);
  }
  return { likes: 0, comments: [] };
}

function saveMovieData(id, data) {
  try {
    localStorage.setItem(`vhs_movie_${id}`, JSON.stringify(data));
  } catch (e) {
    console.error(`[LocalStorage] Failed to save data for movie ${id}.`, e);
  }
}

// -----------------------------------------
// 5. Dropdown Auto-Population
// -----------------------------------------

function populateDropdowns() {
  const langText = UI_TEXT[state.currentLang];

  const uniqueYears = [...new Set(MOVIES.map(m => m.year))].sort((a, b) => b - a);
  yearSelect.innerHTML = `<option value="all">${langText.allYears}</option>`;
  uniqueYears.forEach(year => {
    yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
  });

  const allGenres = MOVIES.flatMap(m => m.genre[state.currentLang] || []);
  const uniqueGenres = [...new Set(allGenres)].sort();
  
  genreSelect.innerHTML = `<option value="all">${langText.allGenres}</option>`;
  uniqueGenres.forEach(genre => {
    genreSelect.innerHTML += `<option value="${genre}">${genre}</option>`;
  });
}

// -----------------------------------------
// 6. Core Render Pipeline
// -----------------------------------------

function renderCatalog() {
  const searchVal = searchBar.value;
  const yearVal = yearSelect.value;
  const genreVal = genreSelect.value;

  const filteredMovies = filterMovies(MOVIES, searchVal, yearVal, genreVal, state.currentLang);
  
  const totalPages = Math.ceil(filteredMovies.length / state.moviesPerPage);
  const startIndex = (state.currentPage - 1) * state.moviesPerPage;
  const endIndex = startIndex + state.moviesPerPage;
  
  const moviesToRender = filteredMovies.slice(startIndex, endIndex);

  renderMovieGrid(moviesToRender);
  renderPagination(totalPages);
}

function renderMovieGrid(moviesList) {
  const langText = UI_TEXT[state.currentLang];
  clearTimeout(gridRenderTimeout);

  const loaderContent = document.querySelector('.loader-content');
  if (loaderContent) loaderContent.textContent = langText.loadingText;

  if (loader) loader.classList.remove('hidden');
  movieGrid.style.opacity = '0.2';

  gridRenderTimeout = setTimeout(() => {
    movieGrid.innerHTML = '';

    if (moviesList.length === 0) {
      movieGrid.innerHTML = `<p class="no-results">${langText.noResults}</p>`;
    } else {
      movieGrid.innerHTML = moviesList.map(movie => createMovieCard(movie, state.currentLang)).join('');
    }

    if (loader) loader.classList.add('hidden');
    movieGrid.style.opacity = '1';

  }, 400);
}

function renderPagination(totalPages) {
  const langText = UI_TEXT[state.currentLang];
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = createPageButton(langText.prev, state.currentPage - 1);
  if (state.currentPage === 1) prevBtn.classList.add('disabled');
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = createPageButton(i, i);
    if (i === state.currentPage) pageBtn.classList.add('active');
    paginationContainer.appendChild(pageBtn);
  }

  const nextBtn = createPageButton(langText.next, state.currentPage + 1);
  if (state.currentPage === totalPages) nextBtn.classList.add('disabled');
  paginationContainer.appendChild(nextBtn);
}

function createPageButton(text, targetPage) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = text;
  btn.dataset.page = targetPage;
  return btn;
}

// -----------------------------------------
// 7. Modal Logic & Interactivity
// -----------------------------------------

function formatVhsTime(totalSeconds) {
  if (isNaN(totalSeconds)) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function renderComments(movieId) {
  const commentsList = document.getElementById('modal-comments-list');
  const data = getMovieData(movieId);
  const langText = UI_TEXT[state.currentLang];
  const locale = state.currentLang === 'ru' ? 'ru-RU' : 'uk-UA';

  if (data.comments.length === 0) {
    commentsList.innerHTML = `<p class="no-comments">${langText.noComments}</p>`;
    return;
  }

  commentsList.innerHTML = data.comments.map(c => {
    const date = new Date(c.timestamp);
    const formattedDate = new Intl.DateTimeFormat(locale, {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);

    return `
      <div class="comment-item">
        <p class="comment-text">${c.text}</p>
        <span class="comment-date">${formattedDate}</span>
      </div>
    `;
  }).join('');
}

function openModal(movieId) {
  const movie = MOVIES.find(m => m.id === movieId);
  if (!movie) return;

  movieModal.innerHTML = createModalContent(movie, state.currentLang);
  movieModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const movieData = getMovieData(movieId);
  document.getElementById('modal-like-count').textContent = movieData.likes;
  renderComments(movieId);

  const likeBtn = document.getElementById('modal-like-btn');
  likeBtn.addEventListener('click', () => {
    const updatedData = getMovieData(movieId);
    updatedData.likes += 1;
    saveMovieData(movieId, updatedData);
    document.getElementById('modal-like-count').textContent = updatedData.likes;
    likeBtn.classList.add('liked');
    setTimeout(() => likeBtn.classList.remove('liked'), 300);
  });

  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = document.getElementById('comment-text');
    const text = textarea.value.trim();
    if (!text) return;

    const updatedData = getMovieData(movieId);
    updatedData.comments.push({ text: text, timestamp: Date.now() });
    saveMovieData(movieId, updatedData);
    textarea.value = '';
    renderComments(movieId);
    
    const commentsList = document.getElementById('modal-comments-list');
    commentsList.scrollTop = commentsList.scrollHeight;
  });

  const vhsScreenArea = document.getElementById('vhs-screen-area');

  // --- YouTube Trailer Listener ---
  const playBtn = document.getElementById('play-trailer-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const trailerId = playBtn.dataset.trailer;
      vhsScreenArea.innerHTML = `
        <div class="iframe-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen
          ></iframe>
        </div>
      `;
    });
  }

  // --- Custom VHS Video Player Listener (P2P WebTorrent Edition) ---
  const fullMovieBtn = document.getElementById('play-full-movie-btn');
  if (fullMovieBtn) {
    fullMovieBtn.addEventListener('click', () => {
      
      // Умный выбор источника: P2P магнет -> прямая MP4 ссылка -> тестовое видео
      const torrentId = movie.torrentId || null;
      const fallbackSrc = movie.movieUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

      // Рендерим плеер без конкретного src (WebTorrent сам вставит поток)
      vhsScreenArea.innerHTML = createVhsPlayerHtml(fallbackSrc); 

      const video = document.getElementById('vhs-video-player');
      const vhsPlayBtn = document.getElementById('vhs-play-btn');
      const vhsRewBtn = document.getElementById('vhs-rew-btn');
      const vhsStopBtn = document.getElementById('vhs-stop-btn');
      const vhsTimeline = document.getElementById('vhs-timeline');
      const vhsClock = document.getElementById('vhs-clock');
      const vhsVolume = document.getElementById('vhs-volume');
      const fullscreenBtn = document.getElementById('vhs-fullscreen-btn');

      // Функция инициализации контроллов (вынесена чтобы не дублировать код)
      function initControls() {
        video.addEventListener('loadedmetadata', () => {
          vhsTimeline.max = Math.floor(video.duration);
        });

        vhsPlayBtn.addEventListener('click', () => {
          if (video.paused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(_ => vhsPlayBtn.textContent = 'PAUSE').catch(() => vhsPlayBtn.textContent = 'PLAY');
            } else { vhsPlayBtn.textContent = 'PAUSE'; }
          } else {
            video.pause();
            vhsPlayBtn.textContent = 'PLAY';
          }
        });

        vhsRewBtn.addEventListener('click', () => { video.currentTime = Math.max(0, video.currentTime - 10); });
        
        vhsStopBtn.addEventListener('click', () => { video.pause(); video.currentTime = 0; vhsPlayBtn.textContent = 'PLAY'; });
        
        video.addEventListener('timeupdate', () => {
          vhsTimeline.value = Math.floor(video.currentTime);
          vhsClock.textContent = formatVhsTime(video.currentTime);
        });

        vhsTimeline.addEventListener('input', () => { video.currentTime = vhsTimeline.value; });
        vhsVolume.addEventListener('input', () => { video.volume = vhsVolume.value; });

        if (fullscreenBtn) {
          const playerContainer = document.querySelector('.vhs-player-container');
          fullscreenBtn.addEventListener('click', () => {
            if (playerContainer.requestFullscreen) playerContainer.requestFullscreen();
            else if (playerContainer.webkitRequestFullscreen) playerContainer.webkitRequestFullscreen();
          });
        }
      }

      // Инициализируем кнопки
      initControls();

      // --- ЛОГИКА WEBTORRENT ---
      if (torrentId) {
        vhsPlayBtn.textContent = UI_TEXT[state.currentLang].bufferingText; // Показываем "БУФЕРИЗАЦИЯ..."

        // Инициализируем P2P клиент
        window._activeTorrentClient = new WebTorrent();
        
        window._activeTorrentClient.add(torrentId, function(torrent) {
          // Ищем внутри торрента видеофайл (обычно .mp4)
          const file = torrent.files.find(file => 
            file.name.endsWith('.mp4') || 
            file.name.endsWith('.mkv') || 
            file.name.endsWith('.webm')
          );
          
          if (!file) {
            console.error('MP4 файл не найден в торренте');
            vhsPlayBtn.textContent = 'ERROR';
            return;
          }

          // WebTorrent подменяет src тега <video> и стримит куски (чанки) P2P
          file.renderTo(video, { autoplay: true }, function(err) {
            if (err) {
              console.error('Ошибка WebTorrent:', err);
              vhsPlayBtn.textContent = 'ERROR';
            } else {
              vhsPlayBtn.textContent = 'PAUSE';
            }
          });
        });

      } else {
        // Если магнет-ссылки нет, просто играем обычный MP4 (который мы передали в createVhsPlayerHtml)
        video.play().then(() => {
          vhsPlayBtn.textContent = 'PAUSE';
        }).catch(() => {
          vhsPlayBtn.textContent = 'PLAY';
        });
      }
    });
  }
}

function closeModal() {
  movieModal.classList.add('hidden');
  
  // ВАЖНО: Убиваем P2P клиент при закрытии модалки, 
  // чтобы он не качал фильм в фоне и не жрал оперативку/трафик
  if (window._activeTorrentClient) {
    window._activeTorrentClient.destroy();
    window._activeTorrentClient = null;
  }
  
  movieModal.innerHTML = ''; 
  document.body.style.overflow = '';
}

// -----------------------------------------
// 8. Event Listeners
// -----------------------------------------

searchBar.addEventListener('input', () => {
  state.currentPage = 1;
  renderCatalog();
});

yearSelect.addEventListener('change', () => {
  state.currentPage = 1;
  renderCatalog();
});

genreSelect.addEventListener('change', () => {
  state.currentPage = 1;
  renderCatalog();
});

paginationContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn || btn.classList.contains('disabled')) return;

  const targetPage = parseInt(btn.dataset.page, 10);
  if (targetPage !== state.currentPage) {
    state.currentPage = targetPage;
    renderCatalog();
    document.querySelector('.catalog-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const newLang = btn.dataset.lang;
    if (newLang === state.currentLang) return;

    state.currentLang = newLang;

    langButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    searchBar.placeholder = UI_TEXT[state.currentLang].searchPlaceholder;

    populateDropdowns();
    state.currentPage = 1;
    renderCatalog();
  });
});

movieGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.movie-card');
  if (card) {
    const id = parseInt(card.dataset.id, 10);
    openModal(id);
  }
});

movieModal.addEventListener('click', (e) => {
  if (e.target.closest('#modal-close-btn') || e.target === movieModal) {
    closeModal();
  }
});

// -----------------------------------------
// 9. App Initialization
// -----------------------------------------

function init() {
  console.log(`[App] Initializing VHS MovieClub in "${state.currentLang}"...`);
  movieGrid.style.position = 'relative'; 
  searchBar.placeholder = UI_TEXT[state.currentLang].searchPlaceholder;
  populateDropdowns();
  renderCatalog();
  console.log('[App] Initialization complete. All systems (Trailers, VHS Player, WebTorrent P2P) armed.');
}

init();