import "./main.css";
import create from '../../utils/create';
import Finance from "../finance/finance";
import Rss from "../rss-news/rss";
import Popular from "../popular-links/popular";
import Shops from "../shops/shops";
import Travel from "../travel/travel";
import Google from "../google/google";

class Main {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const main = create("main", "", null, this.parentNode);
    const container = create("div", "container", null, main);

    const financeContainer = document.createElement("div");
    financeContainer.classList.add("block", "finance", "masonry");
    container.appendChild(financeContainer);
    this.fin = new Finance(financeContainer);

    const rssNewsContainer = document.createElement("div");
    rssNewsContainer.classList.add("block", "rss", "masonry");
    container.appendChild(rssNewsContainer);
    this.rss = new Rss(rssNewsContainer);

    const popularContainer = document.createElement("div");
    popularContainer.classList.add("block", "popular", "masonry");
    container.appendChild(popularContainer);
    this.popularContainer = new Popular({
      parentNode: popularContainer,
      privateClass: "popular",
      caption: "Popular links",
      arrayDataName: "popularLinks",
    });

    const shopsContainer = document.createElement("div");
    shopsContainer.classList.add("block", "shops", "masonry");
    container.appendChild(shopsContainer);
    this.shopsContainer = new Shops({
      parentNode: shopsContainer,
      privateClass: "shops",
      caption: "Shops",
      arrayDataName: "shopsLinks",
    });

    const travelContainer = document.createElement("div");
    travelContainer.classList.add("block", "travel", "masonry");
    container.appendChild(travelContainer);
    this.travelContainer = new Travel({
      parentNode: travelContainer,
      privateClass: "travel",
      caption: "Travels",
      arrayDataName: "travelLinks",
    });

    const googleContainer = document.createElement("div");
    googleContainer.classList.add("block", "google", "masonry");
    container.appendChild(googleContainer);
    this.googleContainer = new Google({
      parentNode: googleContainer,
      privateClass: "google",
      caption: "Google",
      arrayDataName: "googleLinks",
    });
  }
}

export default Main;
