import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SmartView from "./smart.js";
import {convertToHourFormat} from "../utils/movie.js";
dayjs.extend(relativeTime);

const BLANK_COMMENT = {
  text: ``,
  date: ``,
  emotion: ``
};

const formateCommentDate = (date) => {
  const now = dayjs();

  return dayjs.duration(-now.diff(date)).humanize(true);
};

const createCommentTemplate = (comment) => {
  const {id, emotion, author, date, text} = comment;
  const formattedDate = formateCommentDate(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete" data-id="${id}">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentListTemplate = (comments) => {
  const commentListTemplate = comments
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(createCommentTemplate)
    .join(`\n`);

  return commentListTemplate;
};

const createPopupTemplate = (movie, comments, localComment) => {
  const {
    poster,
    age,
    title,
    original,
    rating,
    director,
    writers,
    actors,
    country,
    genres,
    description,
    runtime,
    releaseDate,
    userInfo: {
      isAtWatchlist,
      isWatched,
      isFavorite
    }
  } = movie;

  const writersTemplate = writers.map((writer) => writer).join(`, `);
  const actorsTemplate = actors.map((actor) => actor).join(`, `);
  const genresTemplate = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);

  const formattedRuntime = convertToHourFormat(runtime);
  const formattedRating = rating.toFixed(1);
  const formattedReleaseDate = dayjs(releaseDate).format(`DD MMMM YYYY`);
  const watchlistButtonChecked = isAtWatchlist ? `checked` : ``;
  const watchedButtonChecked = isWatched ? `checked` : ``;
  const favoriteButtonChecked = isFavorite ? `checked` : ``;

  const commentListTemplate = createCommentListTemplate(comments);
  const commentCount = movie.comments.length;

  const emotion = localComment.emotion;
  const commentText = localComment.text;
  const emotionTemplate = emotion
    ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="${emotion}">`
    : ``;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img 
              class="film-details__poster-img"
              src="./images/posters/${poster}"
              alt="poster of movie: ${title}"
            >

            <p class="film-details__age">${age}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${original}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${formattedRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersTemplate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsTemplate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formattedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formattedRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${genresTemplate}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input
            type="checkbox"
            class="film-details__control-input visually-hidden"
            id="watchlist"
            name="watchlist"
            ${watchlistButtonChecked}
          >
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input
            type="checkbox"
            class="film-details__control-input visually-hidden"
            id="watched"
            name="watched"
            ${watchedButtonChecked}
          >
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input
            type="checkbox"
            class="film-details__control-input visually-hidden"
            id="favorite"
            name="favorite"
            ${favoriteButtonChecked}
          >
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentListTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${emotionTemplate}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
  constructor(movie, comments = []) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._localData = BLANK_COMMENT;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._movie, this._comments, this._localData);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;

    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._closeButtonClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this
      .getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`click`, this._watchlistClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this
    .getElement()
    .querySelector(`#watched`)
    .addEventListener(`click`, this._watchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this
    .getElement()
    .querySelector(`#favorite`)
    .addEventListener(`click`, this._favoriteClickHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(evt.target.dataset.id);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    deleteButtons.forEach((button) => {
      button.addEventListener(`click`, this._deleteClickHandler);
    });
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `IMG`) {
      return;
    }

    const emotion = evt.target.parentElement
      .getAttribute(`for`)
      .substring(`emogi-`.length);

    this.updateLocalData({
      emotion
    });

    this.getElement().scrollTop = this.getElement().scrollHeight;
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateLocalData({text: evt.target.value}, true);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._emojiClickHandler);
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentInputHandler);
  }

  getLocalData() {
    return this._localData;
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }
}
