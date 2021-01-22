import Abstract from "../view/abstract";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

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

export const append = (parent, child) => {
  if (parent instanceof Abstract) {
    parent = parent.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  if (parent === null || child === null) {
    throw new Error(`You can't append unexisting elements`);
  }

  parent.appendChild(child);
};

export const replace = (newChild, oldChild) => {
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null || oldChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
