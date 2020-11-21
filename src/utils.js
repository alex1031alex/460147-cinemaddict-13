const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export {getRandomInteger, getRandomItem};
