// debouce();

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}">
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "be0f2d59",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    //   console.log(response.data);
    return response.data.Search;
  },
};

// const root = document.querySelector(".autocomplete");
createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
  root: document.querySelector("#left-autocomplete"),
});

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
  root: document.querySelector("#right-autocomplete"),
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  // console.log(movie);
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "be0f2d59",
      i: movie.imdbID,
    },
  });

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  const runComparision = () => {
    // console.log("time for comparision");

    const rightSideStats = document.querySelectorAll(
      "#right-summary .notification"
    );

    const leftSideStats = document.querySelectorAll(
      "#left-summary .notification"
    );

    console.log(leftSideStats);
    console.log(rightSideStats);

    leftSideStats.forEach((leftStat, index) => {
      const rightStat = rightSideStats[index];
      // console.log(leftStat, rightStat);
    });
  };

  if (leftMovie && rightMovie) {
    runComparision();
  }

  // console.log(response.data);
  summaryElement.innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  const dollar = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  // console.log(dollar);
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  console.log(awards);
  return `
  <article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movieDetail.Poster}" />
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
</article>
<article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollar} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
