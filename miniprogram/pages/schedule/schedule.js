const app = getApp()
const db = wx.cloud.database();
const util= require('../../utils/util.js')
const dateUtil= require('../../utils/date.js')
const yearUtil= require('../../utils/year.js')
// const scheduleWatcher = require('../../utils/watcher/scheduleWatcher')

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
    fullYearDays: [],
    // currentDate: this.getDate(),
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var x = 1
    // var obj = {x: 2}
    // obj.fn = (function(x) {
    //   console.log(x)
    //   this.x *= x++
    //   console.log(x)
    //   console.log(window.x)
    //   console.log(this.x)
    //   return function(y) {
    //     x+=y
    //     this.x *= ++x
    //   }
    // })(obj.x)

    // var fn = obj.fn
    // obj.fn(2)
    // fn(1)
    // console.log(obj.x,x)


    let date = new Date()
    const year = date.getFullYear()
	  const month = date.getMonth() + 1
    const day = date.getDate()
    const isLeapYear = (year%4==0&&year%100!=0||year%400==0) ? true : false
    this.setData({
      currentYear: year,
      currentDay: day,
      currentMonth: month,
      isLeapYear: (year%4==0&&year%100!=0||year%400==0) ? true : false,
    })
    this.setData({
      fullYearDays: app.globalData.fullYearDays,
      weekList: app.globalData.weekList
    })
    // 监听新日程
    const scheduleWatcher = db.collection('schedules')
// 按 progress 降序
// .orderBy('progress', 'desc')
// 取按 orderBy 排序之后的前 10 个
.limit(10)
.where({
  uploadTime: 111
})
.watch({
  onChange: function(snapshot) {
	  console.log(snapshot)
	console.log('docs\'s changed events', snapshot.docChanges)
	console.log('query result snapshot after the event', snapshot.docs)
  console.log('is init data', snapshot.type === 'init')
    if(snapshot.type !== 'init' && snapshot.docChanges.length > 0) {
      console.log('new event!')
    }
  },
  onError: function(err) {
	console.error('the watch closed because of error', err)
  }
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

