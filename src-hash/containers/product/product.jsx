// 第三方库
import React, { Component } from 'react'
import { Input, Button, Card, Table, message, Select } from 'antd'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
//请求的api
import {
  getProductList,
  postProductStateUpdate,
  getSearchProductList,
} from '../../api'
// 引入的自己组件
import { CreatSaveProductListAction } from '../../redux/action_creators/product_action'
// 默认配置
import { PAGE_SIZE } from '../../config'
const { Option } = Select

@connect(() => ({}), { saveProductlist: CreatSaveProductListAction })
class Product extends Component {
  state = {
    productList: [], //商品列表数据(分页)
    current: 0, //当前在哪一页
    total: 0, //一共有几页
    keyWord: '', //搜索关键词
    searchType: 'productName', //搜索类型
    isLoading: true,
  }
  // 组件挂载到页面上请求商品信息
  componentDidMount() {
    this.getProducts()
  }
  // 请求商品信息的方法,包括搜索商品，页面切换
  getProducts = async (current = 1) => {
    let { keyWord, searchType } = this.state
    // console.log(current)
    let result
    if (this.isSearch)      //判断是搜索后展示商品信息还是直接展示商品信息
      result = await getSearchProductList({
        pageNum: current,
        pageSize: PAGE_SIZE,
        searchType,
        keyWord,
      })
    else result = await getProductList(current, PAGE_SIZE)
    // console.log(result)
    let { status, data, msg } = result
    let { list, pageNum, total } = data
    if (status === 0) {
      this.setState({
        productList: list,
        current: pageNum,
        total,
        isLoading: false,
      })
      this.props.saveProductlist(list) //把请求过来的当前页码的商品列表存入rudex里
    } else message.error(msg, 1)
  }

  // 搜索框发生改变的回调，当输入的内容为空时，重新请求全部商品信息
  searchInputChange = (e) => {
    let keyWord = e.target.value
    this.isSearch = true
    if (keyWord.trim() === '') {
      this.isSearch = false
      this.getProducts()
    }
    this.setState({ keyWord })
  }
  //更改商品状态的方法
  changeProductState = async (item) => {
    let { _id, status } = item
    if (status === 1) status = 2
    else status = 1
    let result = await postProductStateUpdate({ productId: _id, status })
    let { msg, data } = result
    if (result.status === 0) {
      let productList = [...this.state.productList].map((value) => {
        if (value._id === _id) value.status = status
        return value
      })
      this.setState({ productList })
      message.success(data, 1)
    } else message.error(msg, 1)
  }
  render() {
    let { productList, total, current } = this.state
    const dataSource = productList

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: '17%',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (price) => '￥' + price,
        align: 'center',
        width: '9%',
      },
      {
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        render: (item) => {
          return (
            <div>
              <span>{item.status === 1 ? '在售' : '已停售'}</span>
              <div style={{ height: '7px' }}></div>
              <Button
                type={item.status === 1 ? 'danger' : 'primary'}
                onClick={() => {
                  this.changeProductState(item)
                }}
              >
                {item.status === 1 ? '下架' : '上架'}
              </Button>
            </div>
          )
        },
        align: 'center',
        width: '11%',
      },
      {
        title: '操作',
        // dataIndex: 'opra',
        key: 'opra',
        render: (item) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  // console.log(item._id);
                  this.props.history.push(
                    `/admin/prod_about/product/detail/${item._id}`
                  )
                }}
              >
                详情
              </Button>
              <br />
              <Button
                type="link"
                onClick={() => {
                  this.props.history.push(
                    `/admin/prod_about/product/add_update/${item._id}`
                  )
                }}
              >
                修改
              </Button>
            </div>
          )
        },
        align: 'center',
        width: '9%',
      },
    ]
    return (
      <div>
        <Card
          title={
            <div>
              <Select
                defaultValue="productName"
                onChange={(searchType) => {
                  this.setState({ searchType })
                }}
              >
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
              <Input
                style={{ margin: '0px 10px', width: '20%' }}
                placeholder="请输入搜索关键字"
                allowClear
                onChange={this.searchInputChange}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  this.getProducts()
                }}
              >
                搜索
              </Button>
            </div>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                this.props.history.push('/admin/prod_about/product/add_update')
              }}
            >
              添加商品
            </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey="_id"
            loading={this.state.isLoading}
            pagination={{
              total: total,
              defaultPageSize: PAGE_SIZE,
              onChange: this.getProducts,
              current: current,
            }}
          />
        </Card>
      </div>
    )
  }
}
export default Product
