import {
    combineReducers
} from 'redux'
import userInfo from './login_reducer'
import title from './title_reducer'
import productList from './product_reducer'
import categoryInfo from './category_reducer'


export default combineReducers({
    userInfo,
    title,
    productList,
    categoryInfo
})