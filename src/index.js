import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImage } from './js/fetch-images';
import { makePhotoCard } from './js/make-photo-card';
import { onScroll, onTopBtn } from './js/scroll';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
loadMore.addEventListener('click', onLoadMore);

let page = 1;
const perPage = 40;
let query = '';
let simpleLightBox;

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.target.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMore.classList.add('is-hidden');

  if (query === '') {
    Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
    return;
  }

  fetchImage(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        makePhotoCard(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (data.totalHits > perPage) {
          loadMore.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  const perPage = 40;
  page += 1;
  simpleLightBox.destroy();

  fetchImage(query, page, perPage)
    .then(({ data }) => {
      makePhotoCard(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMore.classList.add('is-hidden');
        Notiflix.Report.info("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}
