// 第三方库
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Form, Select, Input, message } from 'antd'
import { LeftCircleOutlined, MoneyCollectOutlined } from '@ant-design/icons'

// 引入自己的组件
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'

// 向服务器发起请求的API
import {
  getCategoryList,
  postProductAdd,
  getProductInfo,
  postProductUpdate,
} from '../../api'

//解构用到的对象属性，简化代码
const { Item } = Form
const { Option } = Select

// 从redux里拿全部的商品分类信息，以便展示到选择框里
@connect((state) => ({
  categoryInfo: state.categoryInfo,
  productList: state.productList,
}))
class AddAndUpdate extends Component {
  state = {
    categoryInfo: [], //全部的商品分类信息
    productInfo: {},
    operaType: 'add',
  }
  // 自己定义的组件的ref,便于操作组件内部的方法
  picturesWall = React.createRef()
  richTextEditor = React.createRef()
  formRef = React.createRef()

  //当页面挂载后，从props拿redux里的商品分类信息,如果有存入状态后展示到页面上，如果没有请求服务器
  componentDidMount() {
    let { categoryInfo, productList, match } = this.props
    let productId = match.params._id
    if (categoryInfo.length) this.setState({ categoryInfo })
    else this.getCategory()
    if (productId) {
      if (productList.length > 0) {
        let productInfo = productList.find((item) => item._id === productId)
        this.formRef.current.setFieldsValue({ ...productInfo })
        this.picturesWall.current.setFileList(productInfo.imgs)
        this.richTextEditor.current.setRichText(productInfo.detail)
        this.setState({ productInfo, operaType: 'update' })
      } else this.getProductById(productId)
    }
  }
  getProductById = async (productId) => {
    let result = await getProductInfo(productId)
    const { status, data, msg } = result
    if (status === 0) {
      if(data){
        this.formRef.current.setFieldsValue({ ...data })
        this.picturesWall.current.setFileList(data.imgs)
        this.richTextEditor.current.setRichText(data.detail)
        this.setState({ productInfo: data, operaType: 'update' })
      }
    } else message.error(msg, 1)
  }

  //向服务器请求全部的商品分类信息
  getCategory = async () => {
    let result = await getCategoryList()
    let { status, data, msg } = result
    if (status === 0) this.setState({ categoryInfo: data })
    else message.error(msg, 1)
  }

  // 点击表单中提交按钮的校验成功之后的回调
  onFinish = async (values) => {
    let imgs = this.picturesWall.current.getImgNameList() //调用组件库里的方法，拿到用户传入的图片信息
    let detail = this.richTextEditor.current.getRichText() //调用组件库里的方法，拿到用户传入的商品详情的Html
    let { operaType } = this.state

    let result
    if (operaType === 'add') {
      result = await postProductAdd({ ...values, imgs, detail }) //向服务器发送请求，保存商品信息
    } else {
      const _id = this.state.productInfo._id
      result = await postProductUpdate({ _id, ...values, imgs, detail }) //向服务器发送请求，保存商品信息
    }

    const { status, msg } = result
    if (status === 0) {
      message.success('操作商品成功', 1)
      this.props.history.replace('/admin/prod_about/product') //成功之后跳转到商品展示列表页面
    } else message.error(msg, 1)
  }
  // 点击表单中提交按钮的校验失败之后的回调
  onFinishFailed = () => {
    message.warning('商品信息填写有误，请检查！')
  }
  render() {
    let { operaType } = this.state
    // console.log(name, desc, price, categoryId)
    return (
      <Card
        title={
          <div>
            <Button
              type="link"
              onClick={this.props.history.goBack}
              icon={<LeftCircleOutlined />}
            >
              <span>返回</span>
            </Button>
            <span>{operaType === 'update' ? '商品修改' : '商品添加'}</span>
          </div>
        }
      >
        <Form
          ref={this.formRef}
          labelCol={{ flex: 'none' }}
          labelAlign="right"
          wrapperCol={{ flex: 1, lg: 9 }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Item
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
            name="name"
            // initialValue={name}
          >
            <Input style={{ marginLeft: '3px' }} placeholder="商品名称" />
          </Item>

          <Item
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
            name="desc"
            // initialValue={desc}
          >
            <Input style={{ marginLeft: '3px' }} placeholder="商品描述" />
          </Item>

          <Item
            label="商品价格"
            rules={[{ required: true, message: '请输入商品价格' }]}
            name="price"
          >
            <Input
              placeholder="商品价格"
              addonAfter="元"
              prefix={
                <MoneyCollectOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              type="number"
              style={{ marginLeft: '3px' }}
            />
          </Item>

          <Item
            label="商品分类"
            rules={[{ required: true, message: '请选择一个分类' }]}
            name="categoryId"
            initialValue=""
          >
            <Select style={{ marginLeft: '3px' }}>
              <Option value="">请选择分类</Option>
              {this.state.categoryInfo.map((item) => {
                return (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Item>

          <Item label="商品图片" wrapperCol={{ lg: 14 }}>
            <PicturesWall ref={this.picturesWall} />
          </Item>

          <Item label="商品详情" wrapperCol={{ lg: 18 }}>
            <RichTextEditor ref={this.richTextEditor} />
          </Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Card>
    )
  }
}
export default AddAndUpdate
