import {createUserProfileTemplate} from "./view/user-profile.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);

render(siteHeader, createUserProfileTemplate(), `beforeend`);
