const global = {
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    // this is for pagination
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "3ec64837b0b519f60b5c00b44c0bdf48",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

async function displayPopularMovies() {
  const { results } = await fetchApiData("movie/popular");

  results.forEach((popularMovie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` 
        <a href="movie-details.html?id=${popularMovie.id}">
        ${
          popularMovie.poster_path
            ? `<img
          src="https://image.tmdb.org/t/p/w500${popularMovie.poster_path}"
          class="card-img-top"
          alt="${popularMovie.title}"
        />`
            : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${popularMovie.title}"
      />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${popularMovie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Released: 
          ${formatDate(popularMovie.release_date)} 
            </small>
        </p>
      </div>
    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
};

// displaying popular shows on show page
async function displayPopularShows() {
  const { results } = await fetchApiData("tv/popular");
  console.log(results);

  results.forEach((popularTVshow) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="tv-details.html?id=${popularTVshow.id}">
        ${
          popularTVshow.poster_path
            ? `<img
      src="https://image.tmdb.org/t/p/w500${popularTVshow.poster_path}"
      class="card-img-top"
      alt="${popularTVshow.name}"
    />`
            : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${popularTVshow.name}"
  />`
        }
    <div class="card-body">
          <h5 class="card-title">${popularTVshow.name}</h5>
          <p class="card-text">
            <small class="text-muted">First Aired: 
            ${formatDate(popularTVshow.first_air_date)}
            </small>
          </p>
        </div>
`;
    document.querySelector("#popular-shows").appendChild(div);
  });
};

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  console.log(movieId);

  const movie = await fetchApiData(`movie/${movieId}`);

  displayBackdrop("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `        
    <div class="details-top">
    <div>
    ${
      movie.poster_path
        ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
        alt="Movie Title"
      />`
        : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="Movie Title"
    />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)}
      </p>
      <p class="text-muted">Release Date: ${formatDate(movie.release_date)}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
       
      </ul>
      <a href="${
        movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
        movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
        movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } mins</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
    ${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(", ")}</div>
  </div>
`;
  document.querySelector("#movie-details").appendChild(div);
};

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchApiData(`tv/${showId}`);

  displayBackdrop("show", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `<div class="details-top">
    <div>
    ${
      show.poster_path
        ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
    alt="Movie Title"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="Movie Title"
/>`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)}
      </p>
      <p class="text-muted">Released: ${formatDate(show.first_air_date)}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        show.homepage
      }" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
          show.last_episode_to_air.name
        }
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    ${show.production_companies
      .map((company) => `<div class="list-group">${company.name}</div>`)
      .join("")}
  </div>
</div>
`;

  document.querySelector("#show-details").appendChild(div);
};

// Display backdrop path
function displayBackdrop(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  console.log(global.search.term);

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    // seting up for pagination: "page, total_pages, total_results" come from json object
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results for that title found", "error");
      return;
    }
    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term", "error");
  }
};

async function displaySearchResults(results) {
  // clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` 
        <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img
          src="https://image.tmdb.org/t/p/w500${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type === "tv" ? result.name : result.title}"
        />`
            : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${global.search.type === "tv" ? result.name : result.title}"
      />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">
        ${global.search.type === "tv" ? result.name : result.title}</h5>
        <p class="card-text">
          <small class="text-muted">Released: 
          ${
            global.search.type === "tv"
              ? formatDate(result.first_air_date)
              : formatDate(result.release_date)
          } </small>
        </p>
      </div>
    `;
    // first page of pagination: results.length = 20 because this is what the json object returns from tmdb api
    document.querySelector("#search-results-heading").innerHTML = `
        <h2>Showing ${results.length} of ${global.search.totalResults} for "${global.search.term}"</h2>`;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
};

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <div class="pagination">
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  </div>
`;
  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page / disable next button on last page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  if (global.search.totalPages === 1) {
    document.querySelector("#prev").remove();
    document.querySelector("#next").remove();
  }

  // change to next page

  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_page } = await searchAPIData();
    displaySearchResults(results);
  });

  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_page } = await searchAPIData();
    displaySearchResults(results);
  });
}

async function displaySlider() {
  const { results } = await fetchApiData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Title" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i>${movie.vote_average} / 10
        </h4>
`;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 700,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    // for media queries, values are measured in px
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

async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    // see https://developers.themoviedb.org/3/search/search-tv-shows for url.  Type changes according to radio selection
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// fetch data from TMDB api
async function fetchApiData(endpoint) {
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

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// highight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// show alert
function showAlert(message, className) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(date) {
  return (format = new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }));
}

// init function creates routers for different html page
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      console.log("home");
      break;
    case "/shows.html":
      displayPopularShows();
      console.log("shows");
      break;
    case "/movie-details.html":
      displayMovieDetails();
      console.log("movie-details");
      break;
    case "/tv-details.html":
      displayShowDetails();
      console.log("tv-details");
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
