import instance from './myAxios'
import {
    BASE_URL,
    LOCATION_ID,
    WEATHER_AK,
} from '../config/index'

// 获取天气
export const getWeather = () => (instance.get(`https://devapi.qweather.com/v7/weather/now?location=${LOCATION_ID}&key=${WEATHER_AK}`))
// 登录
export const postLogin = values => (instance.post(`${BASE_URL}/login`, values))

// 获取商品分类信息
export const getCategoryList = () => (instance.get(`${BASE_URL}/manage/category/list`))

// 添加商品分类
export const postCategoryAdd = ({
    categoryName
}) => (instance.post(`${BASE_URL}/manage/category/add`, {
    categoryName
}))

// 更新商品分类
export const postCategoryUpdate = ({
    categoryId,
    categoryName
}) => (instance.post(`${BASE_URL}/manage/category/update`, {
    categoryId,
    categoryName
}))
// 获取商品列表
export const getProductList = (pageNum, pageSize) => (instance.get(`${BASE_URL}/manage/product/list?pageNum=${pageNum}&pageSize=${pageSize}`))

// 更新商品状态
export const postProductStateUpdate = ({
    productId,
    status
}) => (instance.post(`${BASE_URL}/manage/product/updateStatus`, {
    productId,
    status
}))

// 搜索商品信息
export const getSearchProductList = ({
    pageNum,
    pageSize,
    searchType,
    keyWord
}) => instance.get(`${BASE_URL}/manage/product/search?pageNum=${pageNum}&pageSize=${pageSize}&${searchType}=${keyWord}`)

// 根据商品id获取商品信息
export const getProductInfo = (productId) => (instance.get(`${BASE_URL}/manage/product/info?productId=${productId}`))
//  根据分类ID获取分类信息
export const getCategoryById = (categoryId) => (instance.get(`${BASE_URL}/manage/category/info?categoryId=${categoryId}`))

// 删除图片
export const postDeleteImage = (name) => instance.post(`${BASE_URL}/manage/img/delete`, {
    name
})

// 添加商品
export const postProductAdd = ({
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}) => (instance.post(`${BASE_URL}/manage/product/add`, {
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}))

// 更新商品
export const postProductUpdate = ({
    _id,
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}) => (instance.post(`${BASE_URL}/manage/product/update`, {
    _id,
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}))

// 获取角色列表
export const getRoleList = () => (instance.get(`${BASE_URL}/manage/role/list`))

// 添加角色
export const postAddRole = (roleName) => instance.post(`${BASE_URL}/manage/role/add`, {
    roleName
})

// 给角色设置权限
export const postUpdateRole = ({
    _id,
    menus,
    auth_name,
}) => instance.post(`${BASE_URL}/manage/role/update`, {
    _id,
    menus,
    auth_time: Date.now(),
    auth_name
})

// 获取用户列表
export const getUserList = () => (instance.get(`${BASE_URL}/manage/user/list`))

// 添加用户
export const postAddUser = (userObj) => instance.post(`${BASE_URL}/manage/user/add`, {
    ...userObj
})

// 修改用户
export const postUpdateUser = (userObj) => instance.post(`${BASE_URL}/manage/user/update`, {
    ...userObj
})


// 删除用户
export const postDeleteUser = (userId) => instance.post(`${BASE_URL}/manage/user/delete`, {
    userId
})