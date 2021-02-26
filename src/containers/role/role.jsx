import React, { Component } from 'react'
import { Form, Input, Button, Card, Table, message, Modal, Tree } from 'antd'
import { PlusCircleOutlined, LinkOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import { getRoleList, postAddRole, postUpdateRole } from '../../api'
import { menuList } from '../../config/menu_config'
import { PAGE_SIZE } from '../../config'


@connect((state) => ({ auth_name: state.userInfo.user.username }))
class Role extends Component {
  addRoleFormRef = React.createRef()
  state = {
    isAddRole: false,
    isSetAuth: false,
    roleList: [],
    treeData: [
      {
        title: '平台功能',
        key: 'top',
        children: menuList,
      },
    ],
    checkedKeys: [],
    currentId: '',
  }
  // 一上来就查找角色列表
  componentDidMount() {
    this.getRoles()
  }

  // 向服务器查找角色列表
  getRoles = async () => {
    let result = await getRoleList()
    const { status, data, msg } = result
    if (status === 0) this.setState({ roleList: data.reverse(), isSetAuth: false })
    else message.error(msg, 1) 
  }
  //向服务器添加角色信息
  addRole = async (roleName) => {
    let result = await postAddRole(roleName)
    const { status, data, msg } = result
    if (status === 0) {
      let roleList = [...this.state.roleList]
      roleList.unshift(data)
      this.setState({ isAddRole: false, roleList })
      message.success('添加角色成功', 1)
    } else message.error(msg, 1)
  }
  // 显示设置权限的模态框
  showSetAuth = (currentId) => {
    let { roleList } = this.state
    let currentRole = roleList.find((item) => item._id === currentId)
    this.setState({
      isSetAuth: true,
      currentId,
      checkedKeys: currentRole.menus,
    })
  }
  //设置角色权限模态框点击确认之后的回调
  setAuthHandleOk = async () => {
    let { currentId, checkedKeys } = this.state
    let { auth_name } = this.props
    let result = await postUpdateRole({
      _id: currentId,
      menus: checkedKeys,
      auth_name,
    })
    const { status, msg } = result
    if (status === 0) {
      this.getRoles()
      message.success('设置角色权限成功！', 1)
    } else message.error(msg, 1)
  }
  render() {
    let { isAddRole, isSetAuth, roleList, treeData, checkedKeys } = this.state

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) =>
          dayjs(create_time).format('YYYY年 MM月DD日 HH:mm:ss'),
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render: (auth_time) =>
          auth_time ? dayjs(auth_time).format('YYYY年 MM月DD日 HH:mm:ss') : '',
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        render: (currentId) => (
          <Button
            type="link"
            onClick={() => {
              this.showSetAuth(currentId)
            }}
          >
            设置权限
          </Button>
        ),
        width: '15%',
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
              onClick={() => {
                //显示角色添加的模态框
                this.setState({ isAddRole: true }, () => {
                  this.addRoleFormRef.current.resetFields()
                })
              }}
            >
              添加角色
            </Button>
          }
        >
          <Table
            dataSource={roleList}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          />
        </Card>
        <Modal
          title="添加角色"
          visible={isAddRole}
          // 添加角色模态框点击确认后的回调
          onOk={() => {
            this.addRoleFormRef.current.submit()
          }}
          // 添加角色模态框点击取消后的回调
          onCancel={() => {
            this.setState({ isAddRole: false })
          }}
          okText="确认"
          cancelText="取消"
        >
          <Form
            ref={this.addRoleFormRef}
            //添加角色模态框里面的表单提交之后校验成功之后的回调
            onFinish={(values) => {
              this.addRole(values.roleName)
            }}
            //添加角色模态框里面的表单提交之后校验失败之后的回调
            onFinishFailed={() => {
              message.warn('角色信息输入不正确，请检查！', 1)
            }}
          >
            <Form.Item
              name="roleName"
              rules={[
                {
                  required: true,
                  message: '角色名不能为空！',
                },
              ]}
            >
              <Input placeholder="请输入角色名" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isSetAuth}
          onOk={this.setAuthHandleOk}
          //设置角色权限模态框点击取消之后的回调
          onCancel={() => {
            this.setState({ isSetAuth: false })
          }}
          okText="确认"
          cancelText="取消"
        >
          <Tree
            checkable
            onCheck={(checkedKeys) => {
              this.setState({ checkedKeys })
            }}
            checkedKeys={checkedKeys}
            treeData={treeData}
            defaultExpandAll
            icon={<LinkOutlined />}
            showIcon
          />
        </Modal>
      </div>
    )
  }
}
export default Role
