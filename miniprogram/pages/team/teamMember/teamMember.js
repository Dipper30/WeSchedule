const app = getApp()
const db = wx.cloud.database();
const _ = db.command;


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navigationBarHeight: 0,
		establisher_id: '',
		memberList: [],
		teamProfile: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(app.globalData.team_profile)
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight,
			teamProfile: app.globalData.team_profile
		})
		db.collection('users').where({
			_id: _.in(app.globalData.team_profile.memberList)
		}).get().then(res=>{
			console.log(res.data)
			this.setData({
				memberList: res.data
			})
		}).catch(err=>console.log(err))
	},


})