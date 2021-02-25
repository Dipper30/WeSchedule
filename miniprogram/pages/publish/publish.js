// pages/publish/publish.js
const app = getApp()
const db = wx.cloud.database()


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		
		navigationBarHeight: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight
		})
	},


	onNewSchedule: function (e) {
		wx.navigateTo({
		  url: './newSchedule/newSchedule',
		})
		
	},

	

})