import React, { Component } from 'react'
import dayjs from 'dayjs'
import {
  message
} from 'antd'
import { getWeather } from '../../../api'
import { WEATHER_IMG_URL } from '../../../config'
import './css/time_weather.less'

export default class TimeAndWeather extends Component {
  state = {
    date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weather: { fxLink: '', icon: '100', text: '未知', temp: 0 },
  }
  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({ date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss') })
    }, 1000)
    this.weatherInfo()
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  weatherInfo = async () => {
    let result = await getWeather()
    // 从请求返回的天气信息拿到需要的值，放入state里
    if(result.code === '200'){
      let weather = {
        fxLink: result.fxLink,
        icon: result.now.icon,
        text: result.now.text,
        temp: result.now.temp,
      }
      this.setState({ weather })
    }else{
      message.error('和风天气api出错,请检查配置')
    }    
  }
  render() {
    let { date, weather } = this.state
    let { fxLink, icon, temp, text } = weather
    return (
      <div className="content-header-right">
        <span className="currentTime">{date}</span>
        <a href={fxLink} target="_blank" rel="noreferrer">
          <img
            src={WEATHER_IMG_URL + icon + '.png'}
            alt="天气图标"
            className="weather-icon"
          />
        </a>
        {text}&nbsp;&nbsp;&nbsp;{temp}°C
      </div>
    )
  }
}
