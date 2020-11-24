const UserRank = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

const generateUserRank = (watchedMoviesCount) => {
  if (watchedMoviesCount > 20) {
    return UserRank.MOVIE_BUFF;
  }

  if (watchedMoviesCount > 10) {
    return UserRank.FAN;
  }

  if (watchedMoviesCount > 0) {
    return UserRank.NOVICE;
  }

  return ``;
};

export {generateUserRank};
