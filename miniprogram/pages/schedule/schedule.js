const app = getApp()
const db = wx.cloud.database();
var util= require('../../utils/util.js')
var dateUtil= require('../../utils/date.js')
var yearUtil= require('../../utils/year.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readyList: [],
    currentDay: null,
    open: false,
    activeKey: 0,
    currentYear: null,
    currentMonth: null,
    showCalendar: true,
    weekList: [],
    // currentDate: this.getDate(),
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    const year = date.getFullYear()
	  const month = date.getMonth() + 1
    const day = date.getDate()
  
    this.setData({
      currentYear: year,
      currentDay: day,
      currentMonth: month,
      isLeapYear: (year%4==0&&year%100!=0||year%400==0) ? true : false,
    })
    console.log(Date.parse(date)) // 时间戳
    console.log(new Date().getDate())


  
    // 获取当前年份的1月1日时间对象
    var dateStart = new Date()
    dateStart.setDate(1)
    dateStart.setMonth(0)
    dateStart.setFullYear(year)
    // 获取当前星期
    var dayStart = dateStart.getDay()
    // 创建空数组
    var arrStart = util.mkArr(dayStart == 7 ? 0 : dayStart)
    // 获取当前年份的12月31日时对象
    var dateEnd = new Date()
    dateEnd.setDate(31)
    dateEnd.setMonth(11)
    dateEnd.setFullYear(year)
    // 获取当前星期
    var dayEnd = dateEnd.getDay()
    var arrEnd = util.mkArr(dayEnd == 7 ? 0 : dayEnd)
   
    this.setData({
      fullYearDays: arrStart.concat(yearUtil.getFullYearDays(year)).concat(arrEnd)
    })

    // 设置weeklist
    var timestamp = Date.parse(date)
    var weekList = []
    for( var i = 0 ; i < 7 ; i++ ) {
        if(i>0) timestamp += 1000*60*60*24
        var res = dateUtil.getDateByTimestamp(timestamp)
        var val = [res[2],res[6]]
        weekList[i] = val
        console.log(weekList[i])
    }
    this.setData({
      weekList: weekList
    })
    

    
  },


  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.tabBar();
    // 初次渲染日历
    this.selectComponent('#sechedule-calendar').renderCalendar(this.data.fullYearDays, this.data.currentMonth, this.data.currentYear)
    // 渲染日程表
    db.collection('news').where({
      team_id: app.globalData.team_id
    }).get().then(res=>{
      console.log(res)
      // 处理返回数据
      if(res.data.length>0) var list = this.processNewsList(res.data)
      this.setData({
        readyList: list
      })
    }).catch(err=>console.log(err))
  },

  tabBar() {
    if(typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onSideBar: function() {
    this.setData({
      open: !this.data.open
    })
  },

  ontoggle: function () {
    this.setData({
      showCalendar: !this.data.showCalendar
    })
  },

  processNewsList: function(list) {
    
    for( var i = 0 ; i < list.length ; i++ ) {
      list[i].upload_time = util.formatTime(new Date(list[i].upload_time))
    }
return list
  },

    

})

