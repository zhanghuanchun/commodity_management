// 第三方库
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Card, Button, message } from 'antd'
import { LeftCircleOutlined } from '@ant-design/icons'

// 自己定义向服务器发出请求的api
import { getProductInfo, getCategoryList } from '../../api'
// 引入的配置
import {BASE_URL} from '../../config'

// 引入的样式文件
import './css/detail.less'

// 与redux进行交互，取得redux保存的当前页码的商品列表 和 全部的商品分类列表
@connect((state) => ({
  productList: state.productList,
  categoryInfo: state.categoryInfo,
}))
class Detail extends Component {
  state = {
    currentProduct: {}, // 当前点击详情的商品对象
    categoryName: '', // 当前商品的分类名字
    isLoading: true, // 是否处于加载中
  }

  componentDidMount() {
    let { productList, match, categoryInfo } = this.props //从props 取得当前页码的商品列表，全部的商品分类信息，以及浏览器的路径信息
    let productId = match.params._id // 取得由product路由传递过来的商品_id
    if (productList.length > 0) {
      //判断redux里是否有商品列表信息 如果有拿着_id进行遍历，如果没有向服务器再次发送请求
      let currentProduct = productList.find((item) => item._id === productId)
      this.categoryId = currentProduct.categoryId //把当前商品的分类id设置为实例对象的属性，以便一会根据商品分类id查找商品分类名字
      this.setState({ currentProduct, isLoading: !categoryInfo.length })
    } else this.getProduct(productId)
    if (categoryInfo.length > 0) {
      //判断redux里是否有全部的商品分类信息 如果有拿着当前商品的分类id进行查找，返回商品分类名，如果没有向服务器再次发送请求
      let category = categoryInfo.find((item) => item._id === this.categoryId)
      this.setState({ categoryName: category.name })
    } else this.getCategoryName()
  }
  //向服务器发送请求全部的商品分类信息
  getCategoryName = async () => {
    let result = await getCategoryList()
    let { status, data, msg } = result
    if (status === 0) {
      let category = data.find((item) => item._id === this.categoryId)
      category && this.setState({ categoryName: category.name, isLoading: false })
    } else message.error(msg, 1)
  }

  //根据商品id向服务器请求商品信息
  getProduct = async (productId) => {
    let result = await getProductInfo(productId)
    let { status, data, msg } = result
    if (status === 0) {
      if(data){
        this.categoryId = data.categoryId //把当前商品的分类id设置为实例对象的属性，以便一会根据商品分类id查找商品分类名字
        this.setState({
          currentProduct: data,
        })
      }
    } else message.error(msg, 1)
  }
  render() {
    let { name, desc, price, imgs, detail } = this.state.currentProduct
    return (
      <Card
        title={
          <div>
            <Button
              type="link"
              icon={<LeftCircleOutlined />}
              onClick={() => {
                this.props.history.goBack()
              }}
            >
              <span>返回</span>
            </Button>
            <span>商品详情</span>
          </div>
        }
      >
        <List loading={this.state.isLoading}>
          <List.Item>
            <div className="prod">
              <span className="prod-title">商品名称：</span>
              <span>{name}</span>
            </div>
          </List.Item>
          <List.Item>
            <div className="prod">
              <span className="prod-title">商品描述：</span>
              <span>{desc}</span>
            </div>
          </List.Item>
          <List.Item>
            <div className="prod">
              <span className="prod-title">商品价格：</span>
              <span>{price}</span>
            </div>
          </List.Item>
          <List.Item>
            <div className="prod">
              <span className="prod-title">所属分类：</span>
              <span>{this.state.categoryName}</span>
            </div>
          </List.Item>
          <List.Item>
            <div className="prod">
              <span className="prod-title">商品图片：</span>
              <span>
                {imgs &&
                  imgs.map((item, index) => {
                    return (
                      <img
                        key={index}
                        src={`${BASE_URL}/upload/` + item}
                        alt="商品图片"
                        style={{ width: '200px' }}
                      />
                    )
                  })}
              </span>
            </div>
          </List.Item>
          <List.Item>
            <div className="prod">
              <span className="prod-title">商品详情：</span>
              <span dangerouslySetInnerHTML={{ __html: detail }}></span>
            </div>
          </List.Item>
        </List>
      </Card>
    )
  }
}
export default Detail
