// pages/team/switchTeam/switchTeam.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import Notify from '../../../miniprogram_npm/@vant/dist/notify/notify'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navigationBarHeight: 0,
		teamList: [],
		ifRefresh: false,
		showOverlay: false,
		switchLoading: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight
		})
		this.queryTeam('all')
	},

	queryTeam: function (type) {
		const that = this
		let tempList = that.data.teamList
		this.setData({
			switchLoading: true,
			teamList: [],
		})
		wx.cloud.callFunction({
			name: 'queryTeam',
			data: { //传递
				type: type,
				teamList: app.globalData.profile.team_list
			},

			complete: res => {
				console.log('teamlist', res.result)
				that.setData({
					switchLoading: false,
					teamList: res.result
				})
			}
		})
	},

	onSwitchTeam: function (e) {
		this.setData({
			showOverlay: true
		})
		const team = e.detail.params
		console.log(team)
		app.globalData.team_profile = team
		wx.setStorageSync('team_profile', team)
		this.setData({
			showOverlay: false
		})
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1]; //当前页面
		let prevPage = pages[pages.length - 2]; //上一个页面
		Notify({
			type: 'success',
			message: '切换成功',
			duration: 1000,
			selector: '#custom-selector',
			onClose: () => {
				wx.navigateBack({
					delta: 1
				}).then(res => {
					prevPage.onLoad() // 执行前一个页面的onLoad方法
				})
			}
		})
	},

	onTeamSelected: function (e) {
		console.log(e)
		const id = e.currentTarget.dataset.id
		db.collection('teams').doc(id).get()
			.then(res => {
				console.log(res.data)
				app.globalData.team_profile = res.data
				wx.setStorageSync('team_profile', res.data)
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面

				prevPage.setData({
					teamProfile: res.data
				})
				Notify({
					type: 'success',
					message: '切换成功',
					duration: 1000,
					selector: '#custom-selector',
					onClose: () => {
						wx.navigateBack({
							delta: 1
						})
					}
				})
			}).catch(err => console.log(err))
	},

	onChange: function (e) {
		console.log(e.detail.index)
		const id = e.detail.index
		let type = 'all'
		if (id == 1) type = 'permanent'
		else if (id == 2) type = 'temprary'
		this.queryTeam(type)
	}

})