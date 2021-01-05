import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart.js";
dayjs.extend(duration);

const StatFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const filter = {
  [StatFilter.ALL_TIME]: (movies) => movies,

  [StatFilter.TODAY]: (movies, now = dayjs()) => movies
    .filter((movie) => dayjs(movie.userInfo.watchingDate).isAfter(now.subtract(1, `day`))),

  [StatFilter.WEEK]: (movies, now = dayjs()) => movies
    .filter((movie) => dayjs(movie.userInfo.watchingDate).isAfter(now.subtract(1, `week`))),

  [StatFilter.MONTH]: (movies, now = dayjs()) => movies
    .filter((movie) => dayjs(movie.userInfo.watchingDate).isAfter(now.subtract(1, `month`))),

  [StatFilter.YEAR]: (movies, now = dayjs()) => movies
    .filter((movie) => dayjs(movie.userInfo.watchingDate).isAfter(now.subtract(1, `year`)))
};

const getGenresStats = (movies) => {
  const genresStats = {};

  movies
    .reduce((acc, movie) => acc.concat(movie.genres), [])
    .forEach((genre) => {
      if (genresStats[genre]) {
        genresStats[genre]++;
        return;
      }
      genresStats[genre] = 1;
    });

  return genresStats;
};

const getTotalDuration = (movies) => {
  const totalDuration = movies.reduce((acc, movie) => acc + movie.runtime, 0);
  const hours = dayjs.duration(totalDuration, `m`).hours();
  const minutes = dayjs.duration(totalDuration, `m`).minutes();

  return {hours, minutes};
};

const getTopGenre = (movies) => {
  if (movies.length === 0) {
    return ``;
  }

  const genresStats = getGenresStats(movies);
  return Object.entries(genresStats).sort((a, b) => b[1] - a[1])[0][0];
};

const renderChart = (ctx, movies) => {
  if (movies.length === 0) {
    return;
  }

  const BAR_HEIGHT = 50;

  const labels = [];
  const counts = [];

  Object
    .entries(getGenresStats(movies))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      labels.push(label);
      counts.push(count);
    });

  ctx.height = BAR_HEIGHT * Object.values(labels).length;

  const myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const crateStatsTemplate = (localData) => {
  const {movies, currentFilter, userRank} = localData;
  const movieCount = movies.length;
  const {hours, minutes} = getTotalDuration(movies);
  const topGenre = getTopGenre(movies);
  const userRankTemplate = userRank || ``;

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRankTemplate}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-all-time"
        value="all-time"
        ${StatFilter.ALL_TIME === currentFilter ? `checked` : ``}
      >
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-today"
        value="today"
        ${StatFilter.TODAY === currentFilter ? `checked` : ``}
      >
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-week"
        value="week"
        ${StatFilter.WEEK === currentFilter ? `checked` : ``}
      >
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-month"
        value="month"
        ${StatFilter.MONTH === currentFilter ? `checked` : ``}
      >
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-year"
        value="year"
        ${StatFilter.YEAR === currentFilter ? `checked` : ``}
      >
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${movieCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(movies, userRank) {
    super();

    this._movies = movies;
    this._userRank = userRank;
    this._chart = null;
    this._currentFilter = StatFilter.ALL_TIME;
    this._localData = {
      movies: this._movies,
      currentFilter: this._currentFilter,
      userRank: this._userRank
    };

    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._setChart();
    this._setInnerHandler();
  }

  getTemplate() {
    return crateStatsTemplate(this._localData);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    const newFilter = evt.target.value;

    if (this._currentFilter === newFilter) {
      return;
    }

    this._currentFilter = newFilter;
    const filteredMovies = filter[this._currentFilter](this._movies);

    this.updateLocalData({movies: filteredMovies, currentFilter: this._currentFilter});
  }

  _setInnerHandler() {
    this.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`change`, this._filterChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandler();
    this._setChart();
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const ctx = this.getElement().querySelector(`.statistic__chart`);

    this._chart = renderChart(ctx, this._localData.movies);
  }
}
