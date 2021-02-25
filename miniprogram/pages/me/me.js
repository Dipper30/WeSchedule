// pages/me/me.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
import Toast from '../../miniprogram_npm/@vant/dist/toast/toast'
import Dialog from '../../miniprogram_npm/@vant/dist/dialog/dialog'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navigationBarHeight: 0,
		profile: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight,
			profile: app.globalData.profile
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
