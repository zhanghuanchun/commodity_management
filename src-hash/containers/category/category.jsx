// 第三方库
import React, { Component } from 'react'
import { Form, Input, Button, Card, Table, message, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

// 引入的redux anctioncreator
import { CreatSaveCategoryInfoAction } from '../../redux/action_creators/category_action'
// 引入的请求api
import { getCategoryList, postCategoryAdd, postCategoryUpdate } from '../../api'

// 引入的默认配置
import { PAGE_SIZE } from '../../config'

// 操作redux，把全部的商品分类信息，存入redux里
@connect(() => ({}), { saveCategoryInfo: CreatSaveCategoryInfoAction })
class Category extends Component {
  state = {
    categoryList: [], //商品分类列表
    visible: false, // 控制模态框是否可见
    modalType: '', // 当前模态框的操作类型：增加 修改
    isLoading: true, //控制页面加载
    currentUpdatingCategory: {}, // 当前正在修改的商品分类
  }
  formRef = React.createRef()
  //页面挂载后请求商品分类数据
  componentDidMount() {
    this.getCategory()
  }

  // 异步请求:向服务器数据库查找商品分类
  getCategory = async () => {
    let result = await getCategoryList()
    const { status, data, msg } = result
    if (status === 0) {
      this.setState({ categoryList: data.reverse(), isLoading: false })
      this.props.saveCategoryInfo(data) //请求成功，把全部的商品分类信息存入redux中
    } else message.error(msg, 1)
  }

  // 点击添加商品分类按钮的回调
  showModalAdd = () => {
    this.setState({
      visible: true,
      modalType: 'add',
    })
  }

  // 点击某一项修改商品分类按钮的回调
  showModalUpdate = (currentUpdatingCategory) => {
    this.setState(
      {
        visible: true,
        modalType: 'update',
        currentUpdatingCategory,
      },
      () => {
        //设置模态框的状态为可见之后，调用该方法把商品分类的名字传入Input框中，如果不写在状态改变之后的回调里，那么由于setState这个函数的异步执行的，会发生找不到表单formRef的情况，原因是模态框的状态为不可见，也就是没有被挂载，
        this.formRef.current.setFieldsValue({
          categoryName: currentUpdatingCategory.name,
        })
      }
    )
    // setTimeout(() => {
    //   this.formRef.current.setFieldsValue({
    //     categoryName: currentUpdatingCategory.name,
    //   })
    // })
  }

  //点击模态框确认按钮的回调
  handleOk = () => {
    this.formRef.current.submit()
  }

  //点击模态框取消按钮的回调 包括点击右上角的×号或者点击其他地方进行隐藏模态框
  handleCancel = () => {
    this.formRef.current.resetFields()
    this.setState({
      visible: false,
    })
  }

  // 异步请求:向服务器数据库添加商品分类
  toAdd = async (categoryObj) => {
    let result = await postCategoryAdd(categoryObj)
    const { status, data, msg } = result
    if (status === 0) {
      let categoryList = [...this.state.categoryList]
      categoryList.unshift(data)
      this.setState({ categoryList, visible: false })
      this.formRef.current.resetFields()
      message.success('添加分类成功！', 1)
    } else message.error(msg, 1)
  }

  // 异步请求:向服务器数据库修改商品分类
  toUpdate = async (categoryObj) => {
    let result = await postCategoryUpdate(categoryObj)
    const { status, msg } = result
    if (status === 0) {
      message.success('更新商品分类成功!', 1)
      this.getCategory()
      this.formRef.current.resetFields() //['categoryName']
      this.setState({ visible: false })
    } else message.error(msg, 1)
  }

  // 输入框提交校验成功之后的回调
  onFinish = (values) => {
    // console.log('Received values of form: ', values)
    let { modalType, currentUpdatingCategory } = this.state
    if (modalType === 'add') {
      this.toAdd(values)
    }
    if (modalType === 'update') {
      this.toUpdate({
        categoryId: currentUpdatingCategory._id,
        categoryName: values.categoryName,
      })
    }
  }

  // 输入框提交校验失败之后的回调
  onFinishFailed = () => {
    message.warn('表单输入有误，请检查！', 1)
  }

  render() {
    const {
      categoryList,
      visible,
      modalType,
      // currentUpdatingCategory
    } = this.state
    // console.log('---render---', currentUpdatingCategory.name)
    const columns = [
      {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'name',
        key: 'operation',
        render: (currentUpdatingCategory) => (
          <Button
            type="link"
            onClick={() => {
              this.showModalUpdate(currentUpdatingCategory)
            }}
          >
            修改分类
          </Button>
        ),
        width: '25%',
        align: 'center',
      },
    ]
    return (
      <div>
        <Card
          title="商品分类"
          extra={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={this.showModalAdd}
            >
              添加
            </Button>
          }
        >
          <Table
            dataSource={categoryList}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
            loading={this.state.isLoading}
          />
        </Card>
        <Modal
          title={modalType === 'add' ? '添加商品分类' : '修改商品分类'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="categoryName"
              rules={[
                {
                  required: true,
                  message: '商品分类内容不能为空！',
                },
              ]}
              // initialValue={currentUpdatingCategory.name}
            >
              <Input placeholder="请输入商品分类" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Category
