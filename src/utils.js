export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN: {
      container.prepend(element);
      break;
    }
    case RenderPosition.AFTEREND: {
      container.after(element);
      break;
    }
    case RenderPosition.BEFOREBEGIN: {
      container.before(element);
      break;
    }
    case RenderPosition.BEFOREEND: {
      container.append(element);
      break;
    }
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (min = 0, max = 1) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const convertToHourFormat = (timeInMinutes) => {
  if (timeInMinutes < 60) {
    return `${timeInMinutes}m`;
  }

  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes - (hours * 60);

  return `${hours}h ${minutes}m`;
};

export const isKeyEscape = (key) => {
  const ESCAPE_FULL_NAME = `Escape`;
  const ESCAPE_SHORT_NAME = `Esc`;

  return (key === ESCAPE_FULL_NAME || key === ESCAPE_SHORT_NAME);
};
