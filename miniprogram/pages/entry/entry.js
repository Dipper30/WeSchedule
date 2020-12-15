const app = getApp()
const db = wx.cloud.database();
const _ = db.command


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: null,
    profile_ids: [],
    current_id: "",
  },




  //事件处理函数
  bindAvatarTap: function () {
    app.globalData.user_avater = this.data.userInfo.user_avater;

    // 判断是否为第一次进入app，为每一个新用户创建一个永久身份
    var registered = wx.getStorageSync('registered')

    // console.log(typeof registered)
    console.log(registered)
    if (registered) {
      // 老用户

    } else {
      // 新用户初始化
      console.log('new member!')
    }
  },

  onLoad: function () {
    var that = this
    this.getOpenid()
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
              // 判断是否为新用户
              wx.getStorage({
                key: 'registered',
                success: function (res) {
                  // 根据openid读取个人信息
                  db.collection('users').where({
              
                    _openid: that.data.openid
              
                  }).get()
                  .then(res => {
                    console.log(res.data)
                    app.globalData.profile = res.data[0];
                    console.log('profile',app.globalData.profile)
                    wx.switchTab({
                      url: '../schedule/schedule',
                    })
                  }).catch(err => console.log(err))
                  // this.setData({
                  //   current_id: wx.getStorageSync('id')
                  // })

                },
                fail: function (res) {
                  console.log('not registered')
                  db.collection('users').where({
               
                    _openid: that.data.openid
              
                  }).get().then(res => {
                    if(res.data.length == 0){
                      that.initializePersonalInformation()
                    }else{
                      app.globalData.profile = res.data[0];
                      wx.switchTab({
                        url: '../schedule/schedule',
                      })
                    console.log('profile', app.globalData.profile)
                    }
                    
                  }).catch(err => {
                    console.log(err)
                    that.initializePersonalInformation()})
                  
                },
              })
            }
          })
        } else {
          console.log('未登录')
        }
      }
    })
  },

  onReady: function () {

  },

  getByOpenId: function (openid) {
   

  },

  getOpenid() {
    let page = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('openid--', res.result)
        var openid = res.result.openid
        page.setData({
          openid: openid
        })
        app.globalData.openid = openid
      }
    })

  },

  initializePersonalInformation: function () {
    db.collection('users').add({
      data: {
        nickName: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl,
        gender: this.data.userInfo.gender,
        team_list: [],
        own_team: [],
        request_list: [],
        processed_request: [],
        processed_acknowledge: []
      }
    }).then(res => {
      this.setData({
        current_id: res._id
      })
      wx.setStorageSync('id', res._id)
      db.collection('users').doc(res._id).get()
        .then(res => {
          app.globalData.profile = res.data
          wx.setStorageSync('registered', true)
          wx.setStorage({
            data: '',
            key: 'team_id',
          })
          wx.setStorage({
            data: [],
            key: 'team_list',
          })
          console.log(res)
          wx.switchTab({
            url: '../schedule/schedule',
          })
        }).catch(err => console.log(err))
    }).catch(err => {
      console.log(err)
    })

  },

  //   getUserInfo: function(e) {
  //     console.log(e.detail.userInfo)
  //     app.globalData.userInfo = e.detail.userInfo
  //     this.setData({
  //       userInfo: e.detail.userInfo,
  //       hasUserInfo: true
  // 	})
  //   },

})

// // this.getUserInfo()
// if (app.globalData.userInfo) {
//   this.setData({
//     userInfo: app.globalData.userInfo,
//     hasUserInfo: true
//   })
// } else if (this.data.canIUse){
//   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//   // 所以此处加入 callback 以防止这种情况
//   app.userInfoReadyCallback = res => {
//     this.setData({
//       userInfo: res.userInfo,
//       hasUserInfo: true
//     })
//     app.globalData.userInfo = res.userInfo
//     console.log(res.userInfo)
//   }
// } else {
//   // 在没有 open-type=getUserInfo 版本的兼容处理
//   wx.getUserInfo({
//     success: res => {
//       console('useInfo',res.userInfo)
//       app.globalData.userInfo = res.userInfo
//       this.setData({
//         userInfo: res.userInfo,
//         hasUserInfo: true
//       })
//     }
//   })
// }