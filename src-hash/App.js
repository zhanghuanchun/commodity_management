import React,{Component} from 'react'

import {Route,Switch} from 'react-router-dom'
import Admin from './containers/admin/admin.jsx'
import Login from './containers/login/login.jsx'
import NotFound from './components/not-found/not_found'

export default class App extends Component{
  render(){
    return (
      <div className='app'>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path='/' component={NotFound}/>
        </Switch>
      </div>
    )
  }
}


