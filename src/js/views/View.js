import { mark } from "regenerator-runtime";
import icon from "url:../../img/icons.svg";

export default class View {
    _data;

    /**
     * Render the recieved object(data) to th DOM
     * @param {object | object[]} data the data to be rendered (eg: recipe, etc) on its parent element in the DOM
     * @returns if the data is an empty array, then this function will not proceed further an call the renderError function
     * @author Gaurav Joshi
     */

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkUp = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarkUp);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            //Updates changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Updates changed ATTRIBUES
            if (!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value));
        })
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markUp = `<div class="spinner">
          <svg>
            <use href="${icon}#icon-loader"></use>
          </svg>`

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    renderError(message = this._errorMessage) {
        const markUp = `<div class="error">
            <div>
                <svg>
                   <use href="${icon}#icon-alert-triangle"></use>
                </svg>
            </div>
                <p>${message}</p>
          </div>`

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    renderMessage(message = this._message) {
        const markUp = `<div class="error">
        <div>
            <svg>
               <use href="${icon}#icon-smile"></use>
            </svg>
        </div>
            <p>${message}</p>
      </div>`

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }


}
