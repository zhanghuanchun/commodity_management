import { Button } from 'antd'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import './css/not_found.less'
export default class NotFound extends Component {
  render() {    
    if (this.props.location.pathname === '/') {
      return <Redirect to="/admin/home" />
    } else {
      return (
        <div className="not-found">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            className="btn"
            onClick={() => {
              this.props.history.replace('/admin/home')
            }}
          >
            Back to home page
          </Button>
        </div>
      )
    }
  }
}
