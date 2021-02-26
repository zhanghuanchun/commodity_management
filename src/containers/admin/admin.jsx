// 引入的库
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { ClusterOutlined } from '@ant-design/icons'

// 自己的组件
import LeftNav from './left_nav/left_nav'
import Header from './header/header'
import TimeAndWeather from './time_weather/time_weather'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import Detail from '../product/detail'
import AddAndUpdate from '../product/add_update'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../../components/bar/bar'
import Line from '../../components/line/line'
import Pie from '../../components/pie/pie'

// 引入的配置
import { menuList } from '../../config/menu_config.jsx'
// 静态资源
import logo from '../../static/images/logo.png'
import './css/admin.less'

const { Footer, Sider, Content } = Layout

@connect((state) => ({
  userInfo: state.userInfo,
  titlefromredux: state.title,
}))
class Admin extends Component {
  state = {
    collapsed: false,
    title: '',
  }
  componentDidMount() {
    this.getTitleFromMenu()
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  getTitleFromMenu = () => {
    let { pathname } = this.props.location
    let pathKey = pathname.split('/').reverse()[0]
    if (pathname.split('/').indexOf('product') !== -1) pathKey = 'product'
    if (pathKey === 'admin') pathKey = 'home'
    let title = ''
    menuList.forEach((item) => {
      if (item.children instanceof Array) {
        let tmp = item.children.find((citem) => {
          return citem.key === pathKey
        })
        if (tmp) title = tmp.title
      } else {
        if (pathKey === item.key) title = item.title
      }
    })
    this.setState({ title })
  }
  render() {
    let { collapsed, title } = this.state
    let { titlefromredux, userInfo } = this.props
    let { isLogin } = userInfo
    if (!isLogin) {
      return <Redirect to="/login" />
    }
    return (
      <Layout className="admin">
        <Sider
          className="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <header className="nav-header">
            <img src={logo} alt="" />
            <h1 style={{ visibility: collapsed ? 'hidden' : 'visible' }}>
              后台管理
            </h1>
          </header>
          <LeftNav />
        </Sider>
        <Layout>
          <Header className="header" />
          <Content className="content">
            <div className="content-header">
              <div className="content-header-left">
                <h1>
                  <span className="title-icon">
                    {
                      <ClusterOutlined
                        style={{ fontSize: '20px', color: '#13c2c2' }}
                      />
                    }
                  </span>
                  {titlefromredux || title}
                </h1>
              </div>
              <TimeAndWeather />
            </div>
            <div className="content-main">
              <Switch>
                <Route path="/admin" component={Home} exact />
                <Route path="/admin/home" component={Home} exact />
                <Route
                  path="/admin/prod_about/category"
                  component={Category}
                  exact
                />
                <Route
                  path="/admin/prod_about/product"
                  component={Product}
                  exact
                />
                <Route
                  path="/admin/prod_about/product/add_update"
                  component={AddAndUpdate}
                  exact
                />
                <Route
                  path="/admin/prod_about/product/add_update/:_id"
                  component={AddAndUpdate}
                  exact
                />
                <Route
                  path="/admin/prod_about/product/detail/:_id"
                  component={Detail}
                  exact
                />
                <Route path="/admin/user" component={User} exact />
                <Route path="/admin/role" component={Role} exact />
                <Route path="/admin/charts/bar" component={Bar} exact />
                <Route path="/admin/charts/line" component={Line} exact />
                <Route path="/admin/charts/pie" component={Pie} exact />
                <Redirect to="/not_found" />
              </Switch>
            </div>
          </Content>

          <Footer className="footer">
            推荐使用谷歌浏览器，以获取最佳的用户体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin
