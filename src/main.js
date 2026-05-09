import "./css/styles.css"
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

let query = "";
let page = 1;
let totalPages = 0;


const formEl = document.querySelector(".form");
formEl.addEventListener("submit", onSearch);

const loadMoreBtn = document.querySelector(".js-load-more-btn");
loadMoreBtn.addEventListener("click", onLoadMore);

const galleryList = document.querySelector('.js-gallery');
const loader = document.querySelector('.js-loader');

async function onSearch(event) {
  event.preventDefault();

  query = event.currentTarget.elements["search-text"].value.trim();

  if (query === "") {
    iziToast.warning({
      massage: "Please enter a search query.",
      position: "topRight",
    });
    return;
  }

  page = 1;
  clearGallery(galleryList);
  hideLoadMoreButton();
  showLoader(loader);


  try {
    const data = await getImagesByQuery(query, page);
  
    if (data.hits.length === 0) {
      iziToast.error({
        message: "Sorry, no images found!",
        position: "topRight",
      });
    } else {
      createGallery(data.hits);
      totalPages = Math.ceil(data.totalHits / 15);

      if (page < totalPages) {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    iziToast.error({
      message: "Something went wrong!",
      position: "topRight",
    });
  } finally {
    hideLoader(loader);
    event.target.reset();
  }

}

async function onLoadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    smoothScroll();

    if (page >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: "Error loading more images!",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }

}

function smoothScroll() {
  const card = document.querySelector(".gallery-item");
  if (card) {
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}