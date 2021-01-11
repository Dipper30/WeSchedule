const util= require('../../utils/util.js')
const dateUtil= require('../../utils/date.js')
const yearUtil= require('../../utils/year.js')
const { User } = require("../../utils/obj/User");
const app = getApp()
const db = wx.cloud.database();
const _ = db.command
let timer

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    profile_ids: [],
    current_id: "",
    showButton: false,
    canSwitch: false,
  },

  onLoad: function () {
    timer = setTimeout(() => {
      clearTimeout(timer)
      if(this.data.canSwitch == true) this.redirect()
      else {
        setTimeout(() => {
          this.redirect()
        }, 2500)
      }
    }, 2500)


  },

  onReady: function () {

  },

  onShow: function () {
    const that = this
    this.renderCalender()
    let promise = new Promise(function(resolve, reject){
    // 获取openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('openid--', res.result)
        let openid = res.result.openid
        that.setData({
          openid: openid
        })
        app.globalData.openid = openid
        that.login()
      }
    })
  })

  
  },

  getByOpenId: function (openid) {

  },

  renderUserInfo () {
    const that = this
    // 判断是否为新用户
    wx.getStorage({
      key: 'registered',
      // 存在本地登录信息
      success: function (res) {
        // 根据openid读取个人信息
        db.collection('users').where({
            _openid: that.data.openid
          }).get()
          .then(res => {
            console.log(res.data)
            app.globalData.profile = res.data[0];
            console.log('profile', app.globalData.profile)
            // 当用户有团队时，获取团队信息
            if (app.globalData.profile.team_list.length != 0) {
              app.globalData.team_profile = wx.getStorageSync('team_profile')
            } else {}
            that.data.canSwitch = true
          }).catch(err => console.log(err))
      },
      // 没有本地登录信息
      fail: function (res) {
        console.log('not registered')
        // 判断数据库是否存在用户信息
        db.collection('users').where({
          _openid: that.data.openid
        }).get().then(res => {
          console.log(res)
          if (res.data.length == 0) {
            that.initializePersonalInformation()
          } else {
            // 此时用户已存在，但没有本地存储信息
            app.globalData.profile = res.data[0]
            wx.setStorageSync('registered', true)
            wx.setStorageSync('id', res.data[0]._id)
            // 判断用户是否存在团队信息
            if (app.globalData.profile.team_list.length != 0) {
              db.collection('teams').doc(app.globalData.profile.team_list[0]).get()
              .then(res => {
                console.log(res.data)
                wx.setStorageSync('team_profile', res.data)
              }).catch(err => console.log(err))
            } else {
              wx.setStorageSync('team_profile', {})
            }
            console.log('profile', app.globalData.profile)
            // 跳转页面
            that.data.canSwitch = true
          }
        }).catch(err => {
          console.log(err)
          that.initializePersonalInformation()
        })
      },
    })
  },

  getOpenid() {
    console.log(1)
  
  },

  login: function () {
    const that = this
    console.log('ss')
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) //此处判断是否登录
        {
          wx.getUserInfo({
            //箭头调用法
            success: (data) => {
              that.setData({
                userInfo: data.userInfo
              })
              app.globalData.userInfo = data.userInfo //全局变量赋值
              app.globalData.haveauth = true
              console.log('userinfo', that.data.userInfo);
              // 读取用户信息
              that.renderUserInfo()
            }
          })
        } else {
          console.log('未授权')
          // 显示授权按钮
          this.setData({showButton: true})
          
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
        showButton: false
    })
    this.renderUserInfo()
  },


  initializePersonalInformation: function () {
    let newUser = new User(this.data.userInfo.nickName, this.data.userInfo.avatarUrl, this.data.userInfo.gender, [], [], [])
    db.collection('users').add({
      data: {
        ...newUser
      }
    }).then(res => {
      this.setData({
        current_id: res._id
      })
      wx.setStorageSync('id', res._id)
      app.globalData.profile = {
        _id: res._id,
        ...newUser
      }
      wx.setStorageSync('registered', true)
      wx.setStorage({
        key: 'team_profile',
        data: {},
      })
      console.log(app.globalData.profile)
      // 跳转页面
      this.data.canSwitch = true
    }).catch(err => {
      console.log(err)
    })

  },

  redirect: function () {
    // 跳转页面
    if(timer) clearTimeout(timer)
    wx.switchTab({
      url: '../schedule/schedule',
    })
  },

  renderCalender: function () {
    let date = new Date()
    const year = date.getFullYear()
    // 获取当前年份的1月1日时间对象
    let dateStart = new Date()
    dateStart.setDate(1)
    dateStart.setMonth(0)
    dateStart.setFullYear(year)
    // 获取当前星期
    let dayStart = dateStart.getDay()
    // 创建空数组
    let arrStart = util.mkArr(dayStart == 7 ? 0 : dayStart)
    // 获取当前年份的12月31日时对象
    let dateEnd = new Date()
    dateEnd.setDate(31)
    dateEnd.setMonth(11)
    dateEnd.setFullYear(year)
    // 获取当前星期
    let dayEnd = dateEnd.getDay()
    let arrEnd = util.mkArr(dayEnd == 7 ? 0 : dayEnd)
    app.globalData.fullYearDays = arrStart.concat(yearUtil.getFullYearDays(year)).concat(arrEnd)
    this.setData({
      fullYearDays: arrStart.concat(yearUtil.getFullYearDays(year)).concat(arrEnd)
    })
    // 设置weeklist
    let timestamp = Date.parse(date)
    let weekList = []
    for( let i = 0 ; i < 7 ; i++ ) {
        if(i>0) timestamp += 1000*60*60*24
        let res = dateUtil.getDateByTimestamp(timestamp)
        let val = [res[2],res[6]]
        weekList[i] = val
    }
    app.globalData.weekList = weekList
  },

})