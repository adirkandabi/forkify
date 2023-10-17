import icons from 'url:../../img/icons.svg'
import View from "./View.js";

class PaginationView extends View{
    _parentEl=document.querySelector('.pagination')
   
    addHandlerClick(handler){
        this._parentEl.addEventListener('click',function(e){
            const btn=e.target.closest('.btn--inline')
            if(!btn)return
            const goToPage=+btn.dataset.goto
            handler(goToPage)
        })
    }

    _generateMarkup(){
        const numPages=Math.ceil(this._data.results.length/this._data.resultPerPage)
       if(!numPages) return
        const currPage=this._data.page
        let markup=''
        // Page 1, and there are other pages
        if(currPage===1 && numPages>1){
            return this._generateMarkupBTN(currPage,'next') 
        }  
        // Page 1, NO other pages
        if(numPages===1){
            return ''
        } 
        // Last page
        if(currPage===numPages && numPages>1){
           return this._generateMarkupBTN(currPage,'prev')
        }  
        // Other page 
        if(currPage<numPages && currPage!=1){
           return `${this._generateMarkupBTN(currPage,'next')} ${this._generateMarkupBTN(currPage,'prev')}`
        }
    }

    _generateMarkupBTN(currPage,type){
        return `<button  data-goto="${type==='prev'?currPage-1:currPage+1}" class="btn--inline pagination__btn--${type}">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-${type==='next'? 'right':'left'}"></use>
        </svg>
        ${type==='next'?`<span>Page ${currPage+1}</span>`:`<span>Page ${currPage-1}</span>`}
    </button>
   `
    }
   
}
export default new PaginationView()