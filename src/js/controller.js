import * as model from './model.js'
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultView from './views/resultView.js'
import bookmarksView from './views/bookmarksView.js'
import paginationView from './views/paginationView.js'
import addRecipeView from './views/addRecipeView.js'
 import 'core-js/stable'

// if(module.hot){
//   module.hot.accept()
// }
 
const controlRecipes=async function(){
  try{ 
    const id =window.location.hash.slice(1)
    if(!id)return
    recipeView.renderSpinner()
    //Upadte results view to mark selected search result
    resultView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)
    // Loaing recipe 
    await model.loadRecipe(id)
    const {recipe}=model.state   
    console.log(recipe);
      
    // Rendering recipe
    recipeView.render(recipe)
  }catch(err){
    recipeView.renderError()
    console.error(err)
    
  }
}
const controlSearchResults=async function(){
  try{
    resultView.renderSpinner()
    // 1) Get search query
    const query=searchView.getQuery()
    if(!query){
      resultView.renderError()
      return
    } 
    // 2) Load search results 
   await model.loadSearchResults(query)
   // 3) Render results
   console.log(model.getSearchResultsPage());
   
   resultView.render(model.getSearchResultsPage())
   // 4) Render 
    paginationView.render(model.state.search)
    
  }catch(err){
    console.error(err)
  }
}
const controlPagination=function(page){
  resultView.render(model.getSearchResultsPage(page))
  paginationView.render(model.state.search)
}
const controlServings=function(newServings){
  // Update the recipe servings (in state)
    model.updateServings(newServings)
  // Update the recipe view
    const recipe=model.state.recipe 
    //recipeView.render(recipe)
    recipeView.update(recipe)
}

const controlAddBookmark=function(){
  // 1) Add/remove bookmark
  const recipe=model.state.recipe
  if(recipe.bookmarked) model.removeBookmark(recipe.id)
  else model.addBookmark(recipe)
  // 2) Update recipe view
  recipeView.render(recipe)
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe=async function(newRecipe){
  try{
    // Show loading spinner
    addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe);
   
    // Render recipe
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)
    //Chabge ID in URL

    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow('clear')
    },MODAL_CLOSE_SEC*1000)

  }
  catch(err){
    console.error(err);
    addRecipeView.renderError(err.message)
  }
}

const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmarks(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandkerUpload(controlAddRecipe)
}

window.addEventListener('load', function () {
 init()
})
