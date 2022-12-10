import View from "./view.js";
import icon from "url:../../img/icons.svg";


class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages);


    //1. page 1 and there are other pages also---
    if (curPage === 1 && numPages > 1) {
      return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //2. last one--
    if (curPage === numPages && numPages > 1) {
      return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>page ${curPage - 1}</span>
          </button>`;
    }

    //3. other pages--(i.e. in b/w first and last)--
    if (curPage < numPages) {
      return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>page ${curPage - 1}</span>
          </button>
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //4. page 1 only, and no other pages there--
    if (numPages === 1) return '';
  }
};

export default new PaginationView();