import UserProfileView from "../view/user-profile.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";

const UserRank = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

export default class UserProfile {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._currentUserRank = null;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentUserRank = this._getUserRank();

    const prevUserProfileComponent = this._userProfileComponent;
    this._userProfileComponent = new UserProfileView(this._currentUserRank);

    if (prevUserProfileComponent === null) {
      render(
          this._container,
          this._userProfileComponent,
          RenderPosition.BEFOREEND
      );

      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _handleModelEvent() {
    if (this._currentUserRank === this._getUserRank()) {
      return;
    }

    this.init();
  }

  _getUserRank() {
    const watchedMoviesCount = this._moviesModel
      .get()
      .filter((movie) => movie.userInfo.isWatched).length;

    if (watchedMoviesCount > 20) {
      return UserRank.MOVIE_BUFF;
    }

    if (watchedMoviesCount > 10) {
      return UserRank.FAN;
    }

    if (watchedMoviesCount > 0) {
      return UserRank.NOVICE;
    }

    return null;
  }

  getCurrentUserRank() {
    return this._currentUserRank;
  }
}
