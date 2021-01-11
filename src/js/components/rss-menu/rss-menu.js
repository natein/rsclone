import "./rss-menu.css";
import Menu from "../base-menu/baseMenu";
import Rss, { fullUrlArray } from "../rss-news/rss";

const findActiveBookmark = (service) => {
  const localUrlArray = JSON.parse(localStorage.getItem("urlArray"));
  const activeBookmark = localUrlArray.some(
    (bookmark) => bookmark.service === service
  );

  let check = "";
  if (activeBookmark) check = "checked";

  return check;
};

const fillMenuContent = () => {
  const menuContent = document.querySelector(".menu-content");
  const fragment = document.createDocumentFragment();

  fullUrlArray.forEach((service) => {
    const check = findActiveBookmark(service.service);

    const bookmark = document.createElement("div");
    bookmark.classList.add("bookmark");

    bookmark.innerHTML = `
    <input class="input" type="checkbox" data-service="${service.service}" id="${service.service}" name="${service.service}" ${check}>
    <label class="label" for="${service.service}">
      <span>${service.service}</span>
      <img class="bookmark-logo ${service.service}" src="${service.logo}" alt="logo">
    </label>
    `;
    fragment.appendChild(bookmark);
  });
  menuContent.appendChild(fragment);
};

const changeUrlArray = (activeService, serviceClickedCheckbox) => {
  const localUrlArray = JSON.parse(localStorage.getItem("urlArray"));

  if (activeService) {
    const index = localUrlArray.findIndex(
      (service) => service.service === serviceClickedCheckbox
    );
    localUrlArray.splice(index, 1);
  } else {
    const necessaryService = fullUrlArray.find(
      (service) => service.service === serviceClickedCheckbox
    );
    localUrlArray.push(necessaryService);
  }

  localStorage.setItem("urlArray", JSON.stringify(localUrlArray));
};

const changeBookmarks = (e) => {
  const serviceClickedCheckbox = e.target.dataset.service;
  const activeService = findActiveBookmark(serviceClickedCheckbox);

  changeUrlArray(activeService, serviceClickedCheckbox);

  Rss.prototype.fillNewsBookmarks();
};

class RssMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.renderContent();
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(".input");
    labels.forEach((label) => label.addEventListener("click", changeBookmarks));
  }

  renderContent() {
    fillMenuContent();
    this.addListenerToLabel();
  }
}

export default RssMenu;
