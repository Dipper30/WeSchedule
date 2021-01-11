//app.js


App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  teamMessageWatcher (that,options) {
    wx.cloud.database().collection('messages')
		// 按 progress 降序
		// .orderBy('progress', 'desc')
		// 取按 orderBy 排序之后的前 10 个
		.limit(20)
		.where({
		  toOpenId: getApp().globalData.profile._openid,
		  isProcessed: false
		})
		.watch({
		  onChange: function(snapshot) {
			  console.log(snapshot)
      console.log('messages\' changed events', snapshot.docChanges)
      getApp().globalData.teamMessageList = snapshot.docs
			console.log('query result snapshot after the event', snapshot.docs)
		  console.log('is init data', snapshot.type === 'init')
			if(snapshot.type !== 'init' && snapshot.docChanges.length > 0) {
        console.log('new event! and, ', snapshot.docs)
        // that.test(snapshot.docChanges, snapshot.docs)
			}
		  },
		  onError: function(err) {
			console.error('the watch closed because of error', err)
		  }
		})
  },

  globalData: {
    isTeamLeader: false,
    userInfo: {},
    profile_set: [],
    openid: "",
    profile: {},
    team_profile: {},
    haveauth: false,
    fullYearDays: [],
    weekList: [],
    themeColor: 'normal',
    teamMessageList: [],
  }

})
