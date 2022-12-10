import { MODEL_CLOSE_SEC } from './config.js';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable';
import { _ } from 'core-js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0. Update results view to mark the selected search result and the selected bookmark--
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //loading the recipe
    await model.loadRecipe(id);

    // rendering the recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError()
    console.error(err);
  }
}
// controlRecipes();

const controlSearchResults = async function () {

  try {
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //2. Load search results
    await model.loadSearchResults(query);

    //3. Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4.Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2.Render New pagination buttons
  paginationView.render(model.state.search);

}

const controlServings = function (newServing) {
  // Update the recipe servings in the state--
  model.updateServings(newServing);

  // render again the whole recipe-- ❌❌❌ , Now we will only update the changed material-- ✅✅✅
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Rendering bookmark into bookmarks area--
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderMessage("Make sure that ingredients format is correct :)");

    setTimeout(() => {
      addRecipeView.renderSpinner();
    }, 2 * 1000);

    //Upload the new Recipe data--
    await model.uploadRecipe(newRecipe);

    // Rendering own recipe--
    recipeView.render(model.state.recipe);

    // render bookmarks--
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL--
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      //Success message--
      addRecipeView.renderMessage();
    }, MODEL_CLOSE_SEC * 1000);

    setTimeout(() => {
      // close window
      addRecipeView._toggleWindow();
    }, 4 * 1000);

  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
