import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomItem} from "../utils/common.js";

const comments = {};

const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const authors = [
  `John Nunn`,
  `Jonathan Speelman`,
  `Murrey Chandler`,
  `Anthony Miles`,
  `Nigel Short`,
  `Michael Adams`
];

const texts = [
  `Good movie! Very, very interesting.`,
  `Bad movie!`,
  `I am exciting!`,
  `Too boring... I am sleeping right now.`,
  `I did not undestand. Why was it made?`,
  `So-so. The movie is not bad, but I am a little disappointed.`,
  `I saw something better...`
];

const generateDate = () => {
  const MAX_DAY_GAP = 30;
  const daysGap = getRandomInteger(0, MAX_DAY_GAP);
  const currentDate = new Date();

  const hours = getRandomInteger(0, 23);
  const minutes = getRandomInteger(0, 59);

  currentDate.setHours(hours, minutes, 59, 999);
  currentDate.setDate(currentDate.getDate() - daysGap);

  return new Date(currentDate);
};

export const generateComment = (movieId) => {
  if (!comments[movieId]) {
    comments[movieId] = [];
  }

  const comment = {
    id: nanoid(),
    emotion: getRandomItem(emotions),
    author: getRandomItem(authors),
    date: generateDate(),
    text: getRandomItem(texts)
  };

  comments[movieId].push(comment);

  return comment.id;
};

export const getComments = (movieId) => {
  return comments[movieId];
};
