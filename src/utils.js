const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const convertToHourFormat = (timeInMinutes) => {
  if (timeInMinutes < 60) {
    return `${timeInMinutes}m`;
  }

  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes - (hours * 60);

  return `${hours}h ${minutes}m`;
};

export {getRandomInteger, getRandomItem, convertToHourFormat};
