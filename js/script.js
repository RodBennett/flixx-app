const global = {
    currentPage: window.location.pathname,
};

async function displayPopularMovies() {
    const { results } = await fetchApiData("movie/popular");

    results.forEach((popularMovie) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = ` 
        <a href="movie-details.html?id=${popularMovie.id}">
        ${popularMovie.poster_path
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
          <small class="text-muted">Released: ${popularMovie.release_date} </small>
        </p>
      </div>
    `;
        document.querySelector('#popular-movies').appendChild(div)
    });
}

// displaying popular shows on show page
async function displayPopularShows() {
    const { results } = await fetchApiData("tv/popular");
    console.log(results)

    results.forEach((popularTVshow) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <a href="tv-details.html?id=${popularTVshow.id}">
        ${popularTVshow.poster_path
                ? `<img
      src="https://image.tmdb.org/t/p/w500${popularTVshow.poster_path}"
      class="card-img-top"
      alt="${popularTVshow.name}"
    />`
                : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${popularMovie.name}"
  />`
            }
    <div class="card-body">
          <h5 class="card-title">Show Title<${popularTVshow.name}/h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${popularTVshow.first_air_date}</small>
          </p>
        </div>
`;
        document.querySelector("#popular-shows").appendChild(div)
    })

}

// fetch data from TMDB api
async function fetchApiData(endpoint) {
    const API_KEY = "3ec64837b0b519f60b5c00b44c0bdf48";
    const API_URL = "https://api.themoviedb.org/3/";

    showSpinner();

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    const data = await response.json();

    hideSpinner();

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
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

// init function creates routers for different html page
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayPopularMovies();
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/movie-details.html":
            console.log("Movie Details");
            break;
        case "/tv-details.html":
            console.log("TV Details");
            break;
    }
    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
