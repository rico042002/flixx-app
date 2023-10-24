// global object
const global = {
  currentPage: window.location.pathname,
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
    alt="Movie Title"
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
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
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

// Fetch data from TMBD API
async function fetchAPIData(endpoint) {
  // Don't do in production level. Only use this method for small projects. You should store your key and make requests from a server
  // Create own backend server, store key, and make request to api from own server
  const API_KEY = 'b8d74cc0238af3c32a25fe72a48a154e';
  const API_URL = 'https://api.themoviedb.org/3/';

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
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

function addCommas(num) {
  return num.toLocaleString();
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
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
      console.log('TV Details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
