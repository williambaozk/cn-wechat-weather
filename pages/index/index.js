const weatherMap={
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  data: {
    nowTemp: 14,
    nowWeather: "多云",
    nowWeatherBackground: "",
    forecast: []
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow()
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '杭州市'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        this.setNow(result)//调用自己的函数一定要加this
        this.setForecast(result)
        this.setToday(result)//设置函数是需要参数的需要首先传入参数
      },
      complete:()=>{
        callback&& callback()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setForecast(result){
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()//获取当前时间
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconPath: "/images/" + forecast[i].weather + "-icon.png",
        temp: forecast[i].temp + "°"
      })
    }
    forecast[0].time = "现在"
    this.setData({
      forecast: hourlyWeather//setData是一个函数，里面传入的是json对象
    })
  },
  //设置当前时间
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
    wx.showToast()//展示一个toast
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})