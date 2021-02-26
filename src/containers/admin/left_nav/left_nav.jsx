import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { CreatSaveTitleAction } from '../../../redux/action_creators/title_action'
import { menuList } from '../../../config/menu_config.jsx'
const { SubMenu, Item } = Menu

@connect((state) => ({ user: state.userInfo.user }), {
  saveTitle: CreatSaveTitleAction,
})
@withRouter
class LeftNav extends Component {
  isHaveAuth = (menu_item) => {
    const { username, role } = this.props.user
    const { menus } = role
    if (username === 'admin' || username === 'zhanghuanchun') {
      return true
    } else if (!menu_item.children) {
      return menus.find((item) => item === menu_item.key)
    } else if (menu_item.children) {
      return menu_item.children.some(
        (child_menu_item) => menus.indexOf(child_menu_item.key) !== -1
      )
    }
  }

  createMenu = (target) => {
    return target.map((item) => {
      if (this.isHaveAuth(item)) {
        if (item.children) {
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.createMenu(item.children)}
            </SubMenu>
          )
        } else {
          return (
            <Item
              key={item.key}
              icon={item.icon}
              onClick={() => {
                this.props.saveTitle(item.title)
              }}
            >
              <Link to={item.path}>{item.title}</Link>
            </Item>
          )
        }
      } else {
        return null
      }
    })
  }
  render() {
    let { pathname } = this.props.location
    if(pathname==='/admin') pathname='/admin/home'
    // console.log('--rednder--', pathname.split('/').reverse()[0])
    return (
      <Menu
        selectedKeys={
          pathname.split('/').indexOf('product') === -1
            ? pathname.split('/').reverse()[0]
            : 'product'
        }
        defaultOpenKeys={pathname.split('/').splice(2)}
        mode="inline"
        theme="dark"
      >
        {this.createMenu(menuList)}
      </Menu>
    )
  }
}
export default LeftNav
