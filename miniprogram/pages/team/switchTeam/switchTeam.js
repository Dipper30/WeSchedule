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
		teamList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		db.collection('teams').where({
			data: {
				_id: _.in(app.globalData.profile.team_list)
			}
		}).get().then(res=>{
			console.log(res.data)
			this.setData({
				teamList: res.data
			})
		}).catch(err=>console.log(err))
	},

	onTeamSelected: function (e) {
		console.log(e)
		const id = e.currentTarget.dataset.id
		db.collection('teams').doc(id).get()
		.then(res=>{
			console.log(res.data)
			app.globalData.team_profile = res.data
			wx.setStorageSync('team_profile', res.data)
			let pages = getCurrentPages();
				let currPage = pages[pages.length - 1];   //当前页面
				let prevPage = pages[pages.length - 2];  //上一个页面
				
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
		}).catch(err=>console.log(err))
	}

})