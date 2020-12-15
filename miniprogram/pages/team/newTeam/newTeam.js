const app = getApp()
const db = wx.cloud.database();
import Toast from '../../../miniprogram_npm/@vant/dist/toast/toast';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: '',
		description: '',
		schedule_list: [],
		member_id: [],
		establisher_id: '',
		invitation_code: [],
		current_team_id: '',
		name_input: '',
		description_input: '',
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

	onCreation: function () {
		var that = this
		var current_id = app.globalData.profile._id
		var member_list = []
		// var new_team = []
		var new_member = {
			_id: current_id,
			avatarUrl: app.globalData.profile.avatarUrl,
			nickName: app.globalData.profile.nickName
		}
		member_list.push(new_member)
		var team = {
			name: this.data.name_input,
			description: this.data.description_input,
			schedule_list: [],
			member_list: member_list,
			establisher_id: current_id,
			invitation_code: [],
		}
		console.log(team)
		// 添加新的团队数据
		// // 调用云函数
		// wx.cloud.callFunction({
		// 	name: 'newTeam',
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
		
		// }).catch(err=>console.log(err))




		db.collection('teams').add({
			data: {
				name: that.data.name_input,
				description: that.data.description_input,
				schedule_list: [],
				member_list: member_list,
				establisher_id: current_id,
				invitation_code: [],
			}
		}).then(res=>{
			console.log(res)
			// new_team = [res.data._id,res.data.name]
			that.data.current_team_id = res._id
			const _ = db.command
			db.collection('users').doc(current_id).update({
				data: {
					own_team: _.push(res._id),
					team_list: _.push(res._id)
				}
			}).then(res=>{
				console.log(res)
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1];   //当前页面
				var prevPage = pages[pages.length - 2];  //上一个页面
				wx.setStorageSync('team_id', that.data.current_team_id)
				
				prevPage.setData({
					new_team_id: that.data.current_team_id
				  })
				Toast({
					type: 'success',
					message: '创建成功',
					onClose: () => {
					  wx.navigateBack({
						  delta: 1
					  })
					},
				  });
			}).catch(err=>{
				console.log(err)
			})
		}).catch(err=>{
			console.log(err)
		})
	}
})