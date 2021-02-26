import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { CreateUserInfoToStateAction } from '../../redux/action_creators/login_action'
import { postLogin } from '../../api/index'
import logo from '../../static/images/logo.png'
import './css/login.less'
const { Item } = Form

@connect((state) => ({ isLogin: state.userInfo.isLogin }), {
  saveUserInfo: CreateUserInfoToStateAction,
})
class Login extends Component {
  onFinish = async (values) => {
    // console.log('Received values of form: ', values)
    let { history, saveUserInfo } = this.props
    let result = await postLogin(values)
    let { status, data, msg } = result
    if (status === 0) {
      saveUserInfo({ data, remember: values.remember })
      history.replace('/admin/home')
    } else {
      message.warn(msg, 1)
    }
  }
  onFinishFailed = () => {
    message.warn("用户名或密码格式不正确", 1)
  }
  pwdValidator = (rule, value, callback) => {
    if (value === '') {
      callback('请输入你的密码!')
    } else if (value.length < 4) {
      callback('密码不能低于4位！')
    } else if (value.length > 13) {
      callback('密码不能超过13位！')
    } else if (!/^\w+$/.test(value)) {
      callback('密码必须是数字、字母、下划线！')
    } else {
      callback()
    }
  }
  forgetpwd = (e) => {
    e.preventDefault()
    message.success('亲亲，您没有权限哦，请联系管理员', 1)
  }

  render() {
    let { isLogin } = this.props
    if (isLogin) {
      return <Redirect to="/admin" />
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <div className="bg_img"></div>
        <div className="bg_mask"></div>
        <section>
          <div className="form_mask"></div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed = {this.onFinishFailed}
          >
            <Item
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
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                  />
                }
                placeholder=" 用户名"
              />
            </Item>

            <Item
              name="password"
              rules={[
                {
                  validator: this.pwdValidator,
                },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                  />
                }
                type="password"
                placeholder=" 密码"
              />
            </Item>
            <Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="login-form-rem">记住我</Checkbox>
              </Form.Item>

              <a
                className="login-form-forgot"
                href="#1"
                onClick={this.forgetpwd}
              >
                忘记密码
              </a>
            </Item>

            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default Login
