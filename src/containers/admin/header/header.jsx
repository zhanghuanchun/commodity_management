import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button, Avatar } from 'antd'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleOutlined,
  PoweroffOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import screenfull from 'screenfull'
import { CreateDelUserInfoFromStateAction } from '../../../redux/action_creators/login_action'
import { CreatClearTitleAction } from '../../../redux/action_creators/title_action'
import logo from '../../../static/images/tx.jpg'

import './css/header.less'
const { confirm } = Modal
@connect(
  (state) => ({
    userInfo: state.userInfo,
  }),
  {
    deleteUserInfo: CreateDelUserInfoFromStateAction,
    clearTitle: CreatClearTitleAction,
  }
)
@withRouter
class Header extends Component {
  state = {
    isFull: false,
  }
  componentDidMount() {
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({ isFull })
    })
  }
  logOut = () => {
    let { deleteUserInfo, clearTitle } = this.props
    confirm({
      title: '确定退出?',
      icon: <ExclamationCircleOutlined />,
      content: '若退出需要重新登录',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        deleteUserInfo()
        clearTitle()
      },
    })
  }

  fullScreenHandle = () => {
    screenfull.toggle()
  }

  render() {
    let { isFull } = this.state
    let { userInfo } = this.props

    return (
      <header className="header">
        <div className="header-left">欢迎</div>
        <div className="header-right">
          <Button
            // icon={
            //   isFull ? (
            //     <FullscreenExitOutlined style={{ fontSize: '16px' }} />
            //   ) : (
            //     <FullscreenOutlined style={{ fontSize: '16px' }} />
            //   )
            // }
            size="small"
            onClick={this.fullScreenHandle}
          >
            {React.createElement(
              isFull ? FullscreenExitOutlined : FullscreenOutlined
            )}
          </Button>
          <span className="username">
            <Avatar src={logo} className="avatar" size={30} />
            {userInfo.user.username}
          </span>
          <Button
            className="logout-btn"
            type="link"
            onClick={this.logOut}
            icon={<PoweroffOutlined style={{ fontSize: '21px' }} />}
          ></Button>
        </div>
      </header>
    )
  }
}

export default Header
