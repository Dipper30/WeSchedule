const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import Notify from '../../../miniprogram_npm/@vant/dist/notify/notify'
import Toast from '../../../miniprogram_npm/@vant/dist/toast/toast'
import {
	Team
} from '../../../utils/obj/Team'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: '',
		descriptions: '',
		isPermanent: true,
		schedule_list: [],
		member_id: [],
		establisher_id: '',
		invitation_code: [],
		current_team_id: '',
		name_input: '',
		description_input: '',
		showLoading: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	bindNameInput: function (e) {
		this.setData({
		  name_input: e.detail.value
		})
	  },

	  bindDescriptionInput: function (e) {
		this.setData({
		  description_input: e.detail.value
		})
	  },


	onNameChange: function(e) {
		console.log(e.detail)
		this.setData({
			name: e.detail
		})
	},

	onDescriptionChange: function(e) {
		this.setData({
			description: e.detail
		})
	},

	onPermanent: function () {
		if (this.data.isPermanent == false) {
			this.setData({isPermanent: true})
		}
	},

	onTemporary: function () {
		if (this.data.isPermanent == true) {
			this.setData({isPermanent: false})
		}
	},

	onCreation: function () {
		this.setData({showLoading: true})
		let that = this
		let l = []
		l[0] = app.globalData.profile._id
		// name, avatarUrl, type, ownerOpenID, expireDateTS, memberList, descriptions, codeList
		let newTeam = new Team(this.data.name, '', this.data.isPermanent, app.globalData.profile._openid, '', l, this.data.descriptions, [])
		console.log(newTeam)
		// 添加新的团队数据
		// 调用云函数
		// wx.cloud.callFunction({
		// 	name: 'newTeam',
		// 	data: {
		// 		newTeam
		// 	}
		// })
		db.collection('teams').add({
			data: {
				...newTeam
			}
		})
		.then(res=>{
			console.log(res)
			this.setData({showLoading: false})
			var pages = getCurrentPages();
				var currPage = pages[pages.length - 1];   //当前页面
				var prevPage = pages[pages.length - 2];  //上一个页面
				
				prevPage.setData({
					new_team_id: res._id,
					hasTeam: true
				  })
				  db.collection('users').doc(app.globalData.profile._id).update({
					  data: {
						  team_list: _.push(res._id)
					  }
				  }).then(res=>{
					Notify({
						type: 'success',
					  message: '创建成功',
					  duration: 1000,
					  selector: '#custom-selector',
					  onClose: () => {
						  wx.navigateBack({
												delta: 1
						  })
					  }
					})
				  }).catch(err=>console.log(err))
		}).catch(err=>{
			console.log(err)
			this.setData({showLoading: false})
		})

		// db.collection('teams').add({
		// 	data: {
		// 		name: that.data.name_input,
		// 		description: that.data.description_input,
		// 		schedule_list: [],
		// 		member_list: member_list,
		// 		establisher_id: current_id,
		// 		invitation_code: [],
		// 	}
		// }).then(res=>{
		// 	console.log(res)
		// 	// new_team = [res.data._id,res.data.name]
		// 	that.data.current_team_id = res._id
		// 	const _ = db.command
		// 	db.collection('users').doc(current_id).update({
		// 		data: {
		// 			own_team: _.push(res._id),
		// 			team_list: _.push(res._id)
		// 		}
		// 	}).then(res=>{
		// 		console.log(res)
		// 		var pages = getCurrentPages();
		// 		var currPage = pages[pages.length - 1];   //当前页面
		// 		var prevPage = pages[pages.length - 2];  //上一个页面
		// 		wx.setStorageSync('team_id', that.data.current_team_id)
				
		// 		prevPage.setData({
		// 			new_team_id: that.data.current_team_id
		// 		  })
		// 		Toast({
		// 			type: 'success',
		// 			message: '创建成功',
		// 			onClose: () => {
		// 			  wx.navigateBack({
		// 				  delta: 1
		// 			  })
		// 			},
		// 		  });
		// 	}).catch(err=>{
		// 		console.log(err)
		// 	})
		// }).catch(err=>{
		// 	console.log(err)
		// })
	}
})