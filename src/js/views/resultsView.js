import View from "./view.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = "No recipe found for your query! Please try again ;)";
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView._generateMarkup(bookmark))
      .join('');
  }

}
export default new ResultsView(); 