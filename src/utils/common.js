export const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const isKeyEscape = (key) => {
  const ESCAPE_FULL_NAME = `Escape`;
  const ESCAPE_SHORT_NAME = `Esc`;

  return (key === ESCAPE_FULL_NAME || key === ESCAPE_SHORT_NAME);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
