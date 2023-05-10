import { getSearchMovies, getWeeklyTrendsPagination } from './fetchmoviedata';
import { createCatalogPagination } from './pagination';
import { createWeeklyTrendsPagination } from './pagination';
import { createMovieCardMarkup } from './createmoviecardmarkup';
import { warningMessageMarkup } from './createwarningmessagemurkup';
import { createDropdownYearList } from './createyearmarkup';
import { refs } from './refs';

let page = 1;

export function onCatalogPage() {
  createDropdownYearList();
  onWeeklyTrends();

  refs.formSearchEl.addEventListener('submit', onSearchMovies);

  async function onSearchMovies(evt) {
    refs.paginationEl.classList.remove('tui-pagination--is-hidden');

    evt.preventDefault();
    const query = evt.target.elements.searchQuery.value.trim();
    const year = evt.target.elements.selectYear.value;

    refs.galleryEl.innerHTML = '';
    refs.movieGalleryMessageEl.innerHTML = '';

    try {
      const videos = await getSearchMovies(query, page, year);

      createCatalogPagination(videos, query, year);

      if (videos.results.length === 0) {
        refs.paginationEl.classList.add('tui-pagination--is-hidden');
        renderWarningMessage();
        return;
      }

      if (videos.results.length < 20) {
        refs.paginationEl.classList.add('tui-pagination--is-hidden');
      }

      await renderMovies(videos.results);
    } catch (error) {
      console.log(error.message);
    }
  }

  // ===========Завантаження трендових фільмів тижня при переході на каталог=======

  async function onWeeklyTrends() {
    try {
      const trendsMovies = await getWeeklyTrendsPagination(page);
      await renderMovies(trendsMovies.results);

      createWeeklyTrendsPagination(trendsMovies);
    } catch (error) {
      console.log(error.message);
      renderWarningMessage();
    }
  }

  function renderWarningMessage() {
    const markup = warningMessageMarkup();
    refs.movieGalleryMessageEl.insertAdjacentHTML('beforeend', markup);
  }
}

export async function renderMovies(movies) {
  const markup = await createMovieCardMarkup(movies);

  refs.movieGalleryEl.insertAdjacentHTML('beforeend', markup);
}

// ======================DropDownList=========================

dropDownBtn.addEventListener('click', onDropDownMenu);

function onDropDownMenu() {
  refs.dropDownListEL.classList.toggle('dropdown__list--visible');
}

dropDownList.addEventListener('click', onChangeValue);

function onChangeValue(evt) {
  let yearValue = evt.target.textContent;
  refs.dropDownBtnEl.innerHTML = yearValue;
  refs.dropDownListEL.classList.toggle('dropdown__list--visible');
  refs.yearValueEl.value = yearValue;
}
