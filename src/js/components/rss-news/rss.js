import "./rss.css";

const jsonApi = "https://api.rss2json.com/v1/api.json?rss_url=";

const urlArray = [
  {
    service: "Lenta-ru",
    logo: "https://lenta.ru/images/small_logo.png",
    links: [
      "https://lenta.ru/rss/news",
      "https://lenta.ru/rss/top7",
      "https://lenta.ru/rss/last24",
      "https://lenta.ru/rss/articles",
      "https://lenta.ru/rss/news/russia",
      "https://lenta.ru/rss/photo",
    ],
  },
  {
    service: "Газета-Ru",
    logo: "https://img.gazeta.ru/files3/677/4728677/gazeta_logo.jpg",
    links: [
      "https://www.gazeta.ru/export/rss/first.xml",
      "https://www.gazeta.ru/export/rss/lenta.xml",
      "https://www.gazeta.ru/export/rss/lastnews.xml",
      "https://www.gazeta.ru/export/rss/politics.xml",
      "https://www.gazeta.ru/export/rss/business.xml",
      "https://www.gazeta.ru/export/rss/social.xml",
    ],
  },
  {
    service: "TUT-BY",
    logo: "https://img.tyt.by/i/rss/news/logo.gif",
    links: [
      "https://news.tut.by/rss/index.rss",
      "https://news.tut.by/rss/economics.rss",
      "https://news.tut.by/rss/society.rss",
    ],
  },

  {
    service: "Lsm-lv",
    logo: "https://www.lsm.lv//assets/logo/lsm_hi.png",
    links: [
      "https://www.lsm.lv/rss/?lang=lv&catid=22",
      "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
      "https://www.lsm.lv/rss/?lang=lv&catid=65",
    ],
  },
];

const getRss = async (url = "https://lenta.ru/rss/news") => {
  const request = await fetch(`${jsonApi}${url}`);
  const data = await request.json();
  return data;
};

class Rss {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.numberLink = 0;
    this.permissionAddListener = true;
    this.render();
  }

  fillNewsBookmarks() {
    const bookmarksContainer = this.parentNode.querySelector(".bookmarks");

    urlArray.forEach((service) => {
      const bookmark = document.createElement("img");
      bookmark.classList.add("logo", `${service.service}`);
      bookmark.src = service.logo;
      bookmarksContainer.appendChild(bookmark);
      bookmark.addEventListener("click", () => {
        this.numberLink = 0;
        this.fillContentBlock(service);
        this.changePage(service);
      });
    });
  }

  setNewsTitle(text) {
    const title = this.parentNode.querySelector(".title");
    title.textContent = text;
  }

  setNumberPage(currentNumber, amountNumbers) {
    const currentPage = this.parentNode.querySelector(".current-page");
    const amountPages = this.parentNode.querySelector(".amount-pages");

    currentPage.textContent = currentNumber;
    amountPages.textContent = amountNumbers;
  }

  clearContentBlock() {
    const topics = this.parentNode.querySelectorAll(".topic");
    topics.forEach((topic) => topic.parentElement.removeChild(topic));
  }

  async fillContentBlock(service, shift = 0) {
    this.numberLink += shift;

    const amountLinks = service.links.length;
    if (this.numberLink < 0) this.numberLink = amountLinks - 1;
    if (this.numberLink >= amountLinks) this.numberLink = 0;

    const url = service.links[this.numberLink];
    const rssNews = await getRss(url);

    const content = this.parentNode.querySelector(".content");

    this.clearContentBlock();

    rssNews.items.forEach((news) => {
      const correctTitle =
        news.description.includes("<img") === true ? "" : news.description;

      const topic = document.createElement("div");
      topic.classList.add("topic");
      topic.innerHTML = `
        <img class="topic-img" src="${news.enclosure.link}" alt="topic">
        <a class="topic-link" title="${correctTitle}" href="${news.link}" target="_blank">${news.title}</a>
      `;
      content.appendChild(topic);
    });

    this.setNewsTitle(rssNews.feed.title);
    this.setNumberPage(this.numberLink + 1, amountLinks);
  }

  changePage(service) {
    const prevPage = this.parentNode.querySelector(".prev-page");
    const nextPage = this.parentNode.querySelector(".next-page");

    prevPage.onclick = () => {
      this.fillContentBlock(service, -1);
    };

    nextPage.onclick = () => {
      this.fillContentBlock(service, 1);
    };
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="rss-header">
      <h3>News</h3>
      <div class="rss-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="bookmarks"> </div>
    <div class="title"> </div>
    <div class="content"> </div>
    <div class="number-pages">
      <span class="prev-page">&lt;</span>
      <span class="nav-page">
        <span class="current-page">1</span>
        <span>&frasl;</span>
        <span class="amount-pages">3</span>
      </span>
      <span class="next-page">&gt;</span>
    </div>
    `;
    this.fillNewsBookmarks();
    this.fillContentBlock(urlArray[0], 0);
    this.changePage(urlArray[0]);
  }
}

export default Rss;
