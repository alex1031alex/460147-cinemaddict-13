import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomItem} from "../utils.js";

const GenresCount = {
  MIN: 1,
  MAX: 3
};

const WritersCount = {
  MIN: 2,
  MAX: 5
};

const ActorsCount = {
  MIN: 3,
  MAX: 5
};

const genres = [
  `Musical`,
  `Western`,
  `Comedy`,
  `Drama`,
  `Cartoon`,
  `History`,
  `Action`,
  `Horror`
];

const titles = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const ages = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

const directors = [
  `Anthony Mann`,
  `Luc Besson`,
  `Steaven Speelberg`,
  `Quentin Tarantino`,
  `Francis Coppola`
];

const countries = [
  `USA`,
  `Great Britain`,
  `Canada`,
  `Germany`,
  `France`,
  `Italy`,
  `Australia`
];

const writers = [
  `Ann Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Jan Timman`,
  `Gyula Sax`,
  `Andras Adorjan`,
  `Zoltan Ribly`
];

const actors = [
  `John Wane`,
  `Radford Newman`,
  `Erich von Stroiheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`,
  `Heather Langekamp`,
  `Pamella Anderson`,
  `John Travolta`,
  `Dolf Lungren`
];

const getRandomSublist = (list, minLength, maxLength) => {
  if (maxLength >= list.length) {
    return list.slice();
  }

  const sublistLength = minLength === maxLength
    ? minLength
    : getRandomInteger(minLength, maxLength);

  const sublist = [];
  let workList = list.slice();

  for (let i = 0; i < sublistLength; i++) {
    const randomIndex = getRandomInteger(0, workList.length - 1);
    sublist.push(workList[randomIndex]);
    workList = workList
      .slice(0, randomIndex)
      .concat(workList.slice(randomIndex + 1));
  }

  return sublist;
};

const generateDescription = () => {
  const MIN_SENTENCE_COUNT = 1;
  const MAX_SENTENCE_COUNT = 5;

  const sourceText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  let sentences = sourceText.split(/\s(?=[A-Z])/);

  const description = getRandomSublist(
      sentences,
      MIN_SENTENCE_COUNT,
      MAX_SENTENCE_COUNT
  ).join(``);

  return description;
};

const generateRating = () => {
  return (getRandomInteger(10, 99) / 10);
};

const generateReleaseDate = () => {
  const year = getRandomInteger(1929, 2019);
  const monthNumber = getRandomInteger(0, 11);
  const dayNumber = getRandomInteger(1, 31);

  return new Date(new Date(year, monthNumber, 1).setDate(dayNumber));
};

const generateRuntime = () => {
  const MIN_RUNTIME = 30;
  const MAX_RUNTIME = 120;

  return getRandomInteger(MIN_RUNTIME, MAX_RUNTIME);
};

const generateMovie = () => {
  const title = getRandomItem(titles);

  const releaseDate = generateReleaseDate();

  return {
    id: nanoid(),
    title,
    poster: getRandomItem(posters),
    description: generateDescription(),
    rating: generateRating(),
    releaseDate,
    runtime: generateRuntime(),
    genres: getRandomSublist(genres, GenresCount.MIN, GenresCount.MAX),
    original: title,
    age: getRandomItem(ages),
    director: getRandomItem(directors),
    writers: getRandomSublist(writers, WritersCount.MIN, WritersCount.MAX),
    actors: getRandomSublist(actors, ActorsCount.MIN, ActorsCount.MAX),
    country: getRandomItem(countries),
    userInfo: {
      isAtWatchlist: Boolean(getRandomInteger(0, 1)),
      isWatched: Boolean(getRandomInteger(0, 1)),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    }
  };
};

export {generateMovie};
