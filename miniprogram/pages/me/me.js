// pages/me/me.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		info: [
			{
				num: 2,
				text: '团队'
			},
			{
				num: 3,
				text: '当前日程'
			},
			{
				num: 4,
				text: '收藏日程'
			},
			{
				num: 100,
				text: '最近浏览'
			}
		],
		grid1: [
			{iconUrl: '',
			text: '日历'
		},
		{iconUrl: '',
		text: '月历'
	},
	{iconUrl: '',
			text: '日历'
		},
		{iconUrl: '',
			text: '日历'
		}
		],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
	  },
	
	  tabBar() {
		if(typeof this.getTabBar === 'function' && this.getTabBar()) {
		  this.getTabBar().setData({
			selected: 3
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

	onTeamCreation: function () {
		wx.navigateTo({
		  url: '../newTeam/newTeam',
		})
	}
})
