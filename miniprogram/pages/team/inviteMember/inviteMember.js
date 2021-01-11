// pages/team/inviteMember/inviteMember.js
import Notify from '../../../miniprogram_npm/@vant/dist/notify/notify'

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		codeList: [],
		show: false,
		num: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({codeList: app.globalData.team_profile.invitationCodeList})

		// wx.cloud.callFunction({
		// 	// 云函数名称
		// 	name: 'getInvitationCodeList',
		// 	// 传给云函数的参数
		// 	data: {
		// 	  id: app.globalData.team_profile._id
		// 	},
		//   })
		//   .then(res => {
		// 	console.log(res) // 3
		//   })
		//   .catch(console.error)
	},

	onShowNewCode: function () {
		this.setData({
			show: true
		})
	},

	onCloseNewCode: function () {
		this.setData({
			show: false
		})
	},

	onNumberChange: function (e) {
		var n = parseInt(e.detail)
		this.data.num = n
	},

	// 生成新的邀请码
	onNewCode: function () {
		var that = this
		var n = this.data.num
		var list = []
		list = this.getCode(n)
		list = app.globalData.team_profile.invitationCodeList.concat(list)
		console.log(app.globalData.team_profile._id, '   ', list)
		db.collection('teams').doc(app.globalData.team_profile._id).update({
			data: {
				invitationCodeList: list
			}
		}).then(res => {
			console.log(res)
			this.setData({
				show: false,
				codeList: list
			})
		}).catch(err => console.log(err))
	},

	// 生成邀请码
	getCode: function (n) {
		var random = function () {
			// 生成10-12位不等的字符串
			return Number(Math.random().toString().substr(10)).toString(36); // 转换成十六进制
		}
		var arr = [];

		function createId() {
			var num = random();
			var _bool = false;
			arr.forEach(v => {
				if (v === num) _bool = true;
			});
			if (_bool) {
				createId();
			} else {
				arr.push(num);
			}
		}
		var i = 0;
		while (i < n) {
			createId();
			i++;
		}
		return arr;
	},

	// 复制邀请码
	onCopyCode: function (e) {
		console.log(e.currentTarget.dataset.code)
		const code = e.currentTarget.dataset.code
		wx.setClipboardData({
			//准备复制的数据
			data: code,
			success: function (res) {
				Notify({
					type: 'success',
					message: '已复制到剪切板',
					duration: 1500,
					selector: '#copy-notify',
				  })
			}
		})
	},

})