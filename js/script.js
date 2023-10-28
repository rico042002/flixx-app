// global object
const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'f6607083e1a7079dd499add3c8288a18',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// Display 20 most popular movies
async function displayPopularMovies() {
  // Destructure Results
  const { results } = await fetchAPIData('movie/popular');
  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    const movieDate = movie.release_date.toString();

    // Create a Date object from the API date string
    const date = new Date(movieDate);

    // Add one day to the date
    date.setDate(date.getDate() + 1);

    // Define the desired date format (e.g., "MMM dd, yyyy HH:mm:ss")
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };

    // Format the date according to the defined format
    const formattedDate = date.toLocaleString('en-US', options);
    div.innerHTML = `        
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
      class="card-img-top"
      alt="${movie.title}"
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />`
    } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${formattedDate}</small>
      </p>
    </div>
  `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  // Destructure Results
  const { results } = await fetchAPIData('tv/popular');
  // console.log(results);
  results.forEach((show) => {
    const div = document.createElement('div');
    const date = new Date(show.first_air_date);
    const formattedDate = date.toLocaleDateString();
    div.classList.add('card');
    div.innerHTML = `        
    <a href="tv-details.html?id=${show.id}">
    ${
      show.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
      class="card-img-top"
      alt="${show.name}"
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
    } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${formattedDate}</small>
      </p>
    </div>
  `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

// Display Movie Details
async function displayMovieDetails() {
  // Use .split to turn "?id=999999" into an array
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background img
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  const apiDate = movie.release_date.toString();

  // Create a Date object from the API date string
  const date = new Date(apiDate);

  // Add one day to the date
  date.setDate(date.getDate() + 1);

  // Define the desired date format (e.g., "MMM dd, yyyy HH:mm:ss")
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  // Format the date according to the defined format
  const formattedDate = date.toLocaleString('en-US', options);

  div.innerHTML = `       <div class="details-top">
  <div>
   ${
     movie.poster_path
       ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
      class="card-img-top"
      alt="${movie.title}"
    />`
       : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />`
   } 
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${formattedDate}</p>
    <p>
     ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span>  $${addCommas(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span>  $${addCommas(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(', ')}</div>
</div>`;

  document.querySelector('#movie-details').appendChild(div);

  // console.log(movieId);
  console.log(movie.release_date);
}

// Display show details
async function displayShowDetails() {
  // Use .split to turn "?id=999999" into an array
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}`);
  // console.log(show);
  // Overlay for background img
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');
  const apiDate = show.last_air_date.toString();

  // Create a Date object from the API date string
  const date = new Date(apiDate);

  // Add one day to the date
  date.setDate(date.getDate() + 1);

  // Define the desired date format (e.g., "MMM dd, yyyy HH:mm:ss")
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  // Format the date according to the defined format
  const formattedDate = date.toLocaleString('en-US', options);

  div.innerHTML = `       <div class="details-top">
  <div>
   ${
     show.poster_path
       ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
      class="card-img-top"
      alt="${show.name}"
    />`
       : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
   } 
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${formattedDate}</p>
    <p>
     ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span>   ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span>  ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(', ')}</div>
</div>`;

  document.querySelector('#show-details').appendChild(div);
}

// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.4';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  // console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  // similar to form data, has methods on it
  // console.log(urlParams.get('type'));
  // set global search type to search box type
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    // console.log(results);
    //searchAPIData returns results, page and everything for pagination
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    if (results.length === 0) {
      showAlert('No results found');
      return;
    }
    displaySearchResults(results);
    // clear search box
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term');
  }
}

function displaySearchResults(results) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = ``;
  document.querySelector('#search-results-heading').innerHTML = ``;
  document.querySelector('#pagination').innerHTML = ``;

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    // Function to format a date string to MM/dd/yyyy
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    }

    // get type from global state
    div.innerHTML = `        
    <a href="${global.search.type}-details.html?id=${result.id}">
    ${
      result.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${result.poster_path}" 
      class="card-img-top"
      alt="${global.search.type === 'movie' ? result.title : result.name}"
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${global.search.type === 'movie' ? result.title : result.name}"
  />`
    } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        global.search.type === 'movie' ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          global.search.type === 'movie'
            ? formatDate(result.release_date)
            : formatDate(result.first_air_date)
        }</small>
      </p>
    </div>
  `;
    //put results into heading
    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
  `;

    document.querySelector('#search-results').appendChild(div);
  });
  displayPagination();
}

// Create & Displa Pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <div class="pagination">
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
</div>
  `;

  document.querySelector('#pagination').appendChild(div);
  // Disable previous button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    // increment global search page
    global.search.page++;
    // Make a request and get results
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous Page
  document.querySelector('#prev').addEventListener('click', async () => {
    // increment global search page
    global.search.page--;
    // Make a request and get results
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  // console.log(results);

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
    </h4>
    `;
    // Append Div to DOM
    document.querySelector('.swiper-wrapper').appendChild(div);
    // Need to initialize and add options by creating swiper object
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Fetch data from TMBD API
async function fetchAPIData(endpoint) {
  // Don't do in production level. Only use this method for small projects. You should store your key and make requests from a server
  // Create own backend server, store key, and make request to api from own server
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

// Make Request To Search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    // movie or tv in type, selected by radio button gets put in global state, putting it in URL
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Show Alert
function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  // Add alert class from CSS and class from function argument
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function addCommas(num) {
  return num.toLocaleString();
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      // console.log('Home');
      break;
    case '/shows.html':
      displayPopularShows();
      // console.log('Shows');
      break;
    case '/movie-details.html':
      displayMovieDetails();
      // console.log('Movie Details');
      break;
    case '/tv-details.html':
      displayShowDetails();
      // console.log('TV Details')
      break;
    case '/search.html':
      search();
      // console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
