// 引入的第三方库
import React, { Component } from 'react'
import { Form, Input, Button, Card, Table, message, Modal, Select } from 'antd'
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
// 请求的api
import {
  getUserList,
  postAddUser,
  postDeleteUser,
  postUpdateUser,
} from '../../api'

import { PAGE_SIZE } from '../../config'

// 解构对象 简化代码
const { confirm } = Modal
const { Item } = Form
const { Option } = Select

export default class User extends Component {
  // 表单的ref
  userFormRef = React.createRef()

  state = {
    isShowModal: false, //控制添加模态框的展示
    operaType: 'add',
    userList: [],
    roleList: [],
    currentUserId: '',
  }
  componentDidMount() {
    this.getUsers()
  }

  // 数据库中查找所有用户，以及所有角色
  getUsers = async () => {
    let result = await getUserList()
    let { status, data, msg } = result
    if (status === 0) {
      this.setState({
        userList: data.users.reverse(),
        roleList: data.roles,
        isShowModal: false,
      })
    } else message.error(msg, 1)
  }

  // 添加或者修改用户
  addAndUpdateUser = async (values) => {
    let { operaType, currentUserId } = this.state
    let result
    if (operaType === 'add') result = await postAddUser(values)
    else result = await postUpdateUser({ ...values, _id: currentUserId })
    let { status, msg } = result
    if (status === 0) {
      this.getUsers()
      message.success('操作成功', 1)
    } else message.error(msg, 1)
  }

  // 点击删除后的回调
  deleteUser = (userId) => {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      content: '若删除,该用户将无法使用该平台',
      cancelText: '取消',
      okText: '确认',
      onOk: async () => {
        let result = await postDeleteUser(userId)
        const { status, msg } = result
        if (status === 0) {
          message.success('删除用户成功', 1)
          this.getUsers()
        } else message.error(msg, 1)
      },
    })
  }
  render() {
    let { isShowModal, userList, operaType } = this.state
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) =>
          dayjs(create_time).format('YYYY年 MM月DD日 HH:mm:ss'),
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (role_id) => {
          let role = this.state.roleList.find((item) => item._id === role_id)
          return role && role.name
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (user) => (
          <div>
            <Button
              type="link"
              // 显示修改角色的模态框，并让数据回显
              onClick={() => {
                this.setState(
                  {
                    isShowModal: true,
                    operaType: 'update',
                    currentUserId: user._id,
                  },
                  () => {
                    this.userFormRef.current.setFieldsValue({...user,password:''})
                  }
                )
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              onClick={() => {
                this.deleteUser(user._id)
              }}
            >
              删除
            </Button>
          </div>
        ),
        align: 'center',
      },
    ]
    return (
      <div>
        <Card
          title="角色操作"
          extra={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              // 显示添加角色的模态框
              onClick={() => {
                this.setState({ isShowModal: true, operaType: 'add' }, () => {
                  this.userFormRef.current.resetFields()
                })
              }}
            >
              创建用户
            </Button>
          }
        >
          <Table
            dataSource={userList}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          />
        </Card>
        <Modal
          // 控制模态框标题是修改还是添加
          title={operaType === 'update' ? '修改用户' : '添加用户'}
          visible={isShowModal}
          // 用户模态框点击确认后的回调
          onOk={() => {
            this.userFormRef.current.submit()
          }}
          // 用户模态框点击取消后的回调
          onCancel={() => {
            this.setState({ isShowModal: false })
          }}
          okText="确认"
          cancelText="取消"
        >
          <Form
            ref={this.userFormRef}
            //用户模态框里面的表单提交之后校验成功之后的回调
            onFinish={this.addAndUpdateUser}
            //用户模态框里面的表单提交之后校验失败之后的回调
            onFinishFailed={() => {
              message.warn('用户信息输入不正确，请检查！', 1)
            }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
          >
            <Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入你的用户名!',
                },
                {
                  max: 13,
                  message: '用户名不能超过13位!',
                },
                {
                  min: 4,
                  message: '用户名不能低于4位!',
                },
                {
                  pattern: /^\w+$/,
                  message: '用户名必须是数字、字母、下划线!',
                },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Item>
            <Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入你的密码!',
                },
                {
                  max: 13,
                  message: '密码不能超过13位!',
                },
                {
                  min: 4,
                  message: '密码不能低于4位!',
                },
                {
                  pattern: /^\w+$/,
                  message: '密码必须是数字、字母、下划线!',
                },
              ]}
            >
              <Input type="password" placeholder="请输入密码" />
            </Item>
            <Item
              label="手机号"
              name="phone"
              rules={[
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '手机号格式不正确!',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Item>
            <Item
              label="邮箱"
              name="email"
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_]{4,20}@[a-zA-Z0-9]{2,10}\.com$/,
                  message: '邮箱格式不正确',
                },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Item>
            <Item
              label="角色"
              name="role_id"
              rules={[{ required: true, message: '请选择一个角色' }]}
              initialValue=""
            >
              <Select>
                <Option value="">请选择角色</Option>
                {this.state.roleList.map((item) => {
                  return (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
