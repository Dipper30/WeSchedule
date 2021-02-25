const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import Notify from '../../../miniprogram_npm/@vant/dist/notify/notify'
import Toast from '../../miniprogram_npm/@vant/dist/toast/toast'
import {
	Message
} from '../../../utils/obj/Message'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navigationBarHeight: 0,
		teamMessageList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight
		})
		this.setData({teamMessageList: app.globalData.teamMessageList})
	},

	onProcessMessage: function (e) {
		console.log(e)
	},

	onAccepted: function (e) {
		const that = this
		Toast.loading({
			message: '正在处理...',
			forbidClick: true,
		  })
		let info = e.currentTarget.dataset.info
		switch(info.type) {
			case 'req_join': 
			wx.cloud.callFunction({
				// 云函数名称
				name: 'addTeamMember',
				// 传给云函数的参数
				data: {
				  info: info
				},
			  })
			  .then(res => {
				console.log(res) // 3
				// 更新消息状态
				db.collection('messages').doc(info._id).update({
					data: {
						isProcessed: true
					}
				}).then(res=>{
					console.log(res)
					that.setData({teamMessageList: app.globalData.teamMessageList})
				})
				.catch(err=>console.log(err))
				let response = new Message('res_join_ok', info.toProfile, info.fromProfile, info.fromProfile._openid, info, false)
				db.collection('messages').add({
					data: response
				})
				.then(res=>{
					console.log(res)
					Toast.clear()
					Notify({
						type: 'success',
					  message: '消息已处理！',
					  duration: 1000,
					  selector: '#custom-selector',
					  onClose: () => {
						  	if ( app.globalData.team_profile._id == info.toProfile._id ) {
							  	console.log('refresh')
								app.globalData.team_profile.memberList = [...app.globalData.team_profile.memberList, info.fromProfile._id]
						  	}
						//   wx.navigateBack({
						// 		delta: 1
						//   })
						
					  }
					})
				}).catch(err=>{
					Toast.clear()
				  	console.error
				})
			  }).catch(err=>{
					Toast.clear()
				  	console.error
				})
			break
			default: console.log('err')
			break
		}
	},

	onTeamConfirm: function (e) {
		const that = this
		console.log(e.currentTarget.dataset.info)
		let info = e.currentTarget.dataset.info
		db.collection('users').doc(app.globalData.profile._id).update({
			data: {
				team_list: _.push(info.fromProfile._id)
			}
		}).then(res=>{
			console.log(res)
			//更新消息状态
			db.collection('messages').doc(info._id).update({
				data: {
					isProcessed: true
				}
			}).then(res=>{
				console.log(res)
				that.setData({teamMessageList: app.globalData.teamMessageList})
			})
			.catch(err=>console.log(err))
		}).catch(err=>console.log(err))
	},
})