import icons from 'url:../../img/icons.svg'
import previewView from './previewView.js';
import View from "./View.js";

class BookmarksView extends View{
    _parentEl=document.querySelector('.bookmarks__list')
    _errorMessage = 'No bookmraks yet. find a nice recipe and bookmark it ;)'
    _message=''

    addHandlerRender(handler){
        window.addEventListener('load',handler())
    }

    _generateMarkup(){
        return this._data.map(bookmark=>previewView.render(bookmark,false)).join('')  
    }
    
}
export default new BookmarksView()