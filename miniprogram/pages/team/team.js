const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
import Toast from '../../miniprogram_npm/@vant/dist/toast/toast'
import Dialog from '../../miniprogram_npm/@vant/dist/dialog/dialog'

import {
	Message
} from '../../utils/obj/Message'
import {
	quitTeam,
	dismissTeam
} from '../../utils/quitTeam'




Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navigationBarHeight: 0,
		teamProfile: {
			imgSrc: '',
			name: 'name',
			brief: '长期团队'
		},
		info: [{
				num: 0,
				text: '团队人数'
			},
			{
				num: 0,
				text: '当前日程'
			},
			{
				num: 0,
				text: '历史日程'
			},
			{
				num: 0,
				text: '团队通知'
			}
		],

		grid1: [{
				iconUrl: '',
				text: '查看成员'
			},
			{
				iconUrl: '',
				text: '邀请成员'
			},
			{
				iconUrl: '',
				text: '会员'
			},
			{
				iconUrl: '',
				text: '解散团队'
			}
		],

		grid2: [{
				iconUrl: '',
				text: '创建团队'
			},
			{
				iconUrl: '',
				text: '加入团队'
			},
			{
				iconUrl: '',
				text: '切换团队'
			},
			{
				iconUrl: '',
				text: '退出团队'
			}
		],

		styleMode: app.globalData.themeColor,
		profile: {},
		is_establisher: false,
		request_list: [],
		acknowledge_list: [],

		// join team section
		join_team_show: false,
		confirm_btn_enbaled: true,

		name: '暂无团队',
		right_text: '刷新',
		new_team_id: '',
		current_team_id: '',
		show: false,

		activeNames: ['0'],
		activeTeamNames: ['0'],
		activeRequestNames: ['0'],
		code_input: '',
		team_list: [],
		// 消息栏
		teamMessageList: [],
		// 判断是否有团队
		hasTeam: true,
	},



	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let hasTeam = app.globalData.profile.team_list.length == 0 ? false : true
		let info = this.data.info
		info
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight,
			hasTeam: hasTeam,
			profile: app.globalData.profile,
		})
		const that = this
		app.teamMessageWatcher(this, options)
		console.log('current team', app.globalData.team_profile)
		this.setData({
			teamProfile: app.globalData.team_profile
		})
		// if(app.globalData.profile.team_list.length == 0) {
		// 	that.setData({hasTeam: false})
		// } else {
		// 	that.initializeTeamData()
		// }

		// 监听新消息

	},

	refreshMessage: function (docChanges, docs) {
		console.log('s')
		app.globalData.teamMessageList = docs
		this.setData({
			teamMessageList: app.globalData.teamMessageList
		})
	},



	initializeTeamData: function () {
		const that = this
		var id = app.globalData.team_profile._id
		console.log(id)
		if (id && id.length > 0) {
			this.setData({
				current_team_id: id,
				new_team_id: id
			})
			db.collection('teams').doc(that.data.current_team_id).get()
				.then(res => {
					console.log(res.data)
					// 渲染团队数据
					let teamProfile = this.data.teamProfile
					teamProfile = res.data
					this.setData({
						teamProfile: teamProfile,
					})
					app.globalData.team_profile = res.data
					console.log(app.globalData.team_profile)
					// 判断读取请求
					// this.readRequests()

				}).catch(err => console.log(err))
		} else {
			db.collection('teams').where({
				memberList: app.globalData.profile._id
			}).get().then(res => {
				console.log(res.data)
				this.setData({
					teamProfile: res.data[0],
					current_team_id: res.data[0]._id,
					new_team_id: res.data[0]._id,
				})
				wx.setStorage({
					data: res.data[0],
					key: 'team_profile',
				})
			}).catch(err => console.log(err))
		}
	},



	onShow: function () {
		this.tabBar()
		var that = this


	},

	tabBar() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2
			})
		}
	},

	onGrid1: function (e) {
		const id = e.currentTarget.dataset.id
		switch (id) {
			case 0:
				// 查看成员
				this.onCheckMember()
				break
			case 1:
				// 邀请成员
				wx.navigateTo({
					url: './inviteMember/inviteMember',
				})
				break
			case 2:
				// 会员
				console.log("VIP")
				break
			case 3:
				// 解散团队
				this.onDismiss()
				break
			default:
				console.log('grid1 default')
		}
	},

	onGrid2: function (e) {
		const id = e.currentTarget.dataset.id
		switch (id) {
			case 0:
				// 创建团队
				this.onCreateTeam()
				break
			case 1:
				// 加入团队
				this.onJoinTeam()
				break
			case 2:
				// 切换团队
				this.onSwitchTeam()
				break
			case 3:
				// 退出团队
				this.onQuitTeam()
				break
			default:
				console.log('grid2 default')
		}
	},

	onCheckMember: function () {
		wx.navigateTo({
			url: './teamMember/teamMember',
		})
	},

	onDismiss: function () {
		const that = this
		if (app.globalData.team_profile.ownerOpenID != app.globalData.profile._openid) return
		Dialog.confirm({
			title: '确认解散团队吗？',
			message: '一旦解散则无法修改',
		}).then(() => {
			// on confirm
			const res = dismissTeam(app.globalData.team_profile, app.globalData.profile)
			console.log('!!!',res)
			let [resTeamProfile, resProfile] = res
			if (resTeamProfile == -1 || resProfile == -1) {
				console.log('dismiss error')
			} else {
				// 重置团队状态
				that.initTeamStat(resTeamProfile, resProfile)
			}

		}).catch(() => {
			// on cancel
		})

	},

	onCreateTeam: function () {
		wx.navigateTo({
			url: 'newTeam/newTeam',
		})
	},

	onSwitchTeam: function () {
		wx.navigateTo({
			url: './switchTeam/switchTeam',
		})
	},

	onQuitTeam: function () {
		const that = this
		Dialog.confirm({
			title: '确认退出团队吗？',
			message: '一旦退出则无法修改',
		}).then(() => {

			if (app.globalData.profile._openid == app.globalData.team_profile.ownerOpenID) {
				dismissTeam(app.globalData.team_profile, app.globalData.profile)
				return
			}

			// on confirm
			const [resTeamProfile, resProfile] = quitTeam(app.globalData.team_profile, app.globalData.profile)

			// 重置团队状态
			that.initTeamStat(resTeamProfile, resProfile)
		}).catch(() => {
			// on cancel
		})
	},

	onCloseCodeList: function () {
		this.setData({
			activeNames: ['0']
		})
	},

	onOpenCodeList: function () {
		this.setData({
			activeNames: ['1']
		})
	},

	onCloseTeamList: function () {
		this.setData({
			activeTeamNames: ['0']
		})
	},

	onOpenTeamList: function () {
		this.setData({
			activeTeamNames: ['1']
		})
	},

	onCloseRequestList: function () {
		this.setData({
			activeRequestNames: ['0']
		})
	},

	onOpenRequestList: function () {
		this.setData({
			activeRequestNames: ['1']
		})
	},

	onMemberInvited: function () {
		this.setData({
			show: true
		})
	},

	onClose() {
		this.setData({
			show: false
		});
	},

	onCodeChange(e) {
		var input = e.detail
		this.data.code_input = input
	},

	onJoinTeam: function () {
		this.setData({
			join_team_show: true
		})
	},

	onJoinTeamClose: function () {
		this.setData({
			join_team_show: false
		})
	},


	onJoinTeamConfirm: function () {
		var that = this
		var code = this.data.code_input
		if (this.data.confirm_btn_enbaled) {
			this.data.confirm_btn_enbaled = false
			Toast({
				type: 'loading',
				message: '正在提交',
			})
			db.collection('teams').where({
				invitationCodeList: code
			}).get().then(res => {
				if (res.data.length > 0) {
					// 判断是否命中
					let [code, team, team_id] = that.findTargetTeam(res.data)
					// 判断是否已经在团队中
					code = that.validateTeamId(team_id)
					if (code != -1) {
						// 发送加入请求
						// type, fromProfile, toProfile, toOpenId, body, isProcessed
						let req = new Message('req_join', app.globalData.profile, team, team.ownerOpenID, {
							invitation_code: code
						}, false)
						// let res = that.release(req)
						db.collection('messages').add({
								data: req
							}).then(res => {
								Toast({
									type: 'success',
									message: '申请已提交！',
								})
								that.setData({
									join_team_show: false,
									confirm_btn_enbaled: true
								})
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						console.log('已加入该团队！')
						Toast({
							type: 'failure',
							message: '已加入该团队！',
						});
					}
				} else {
					console.log('没有找到团队')
					Toast({
						type: 'failure',
						message: '邀请码错误！',
					});
				}

			}).catch(err => {
				console.log(err)
				Toast({
					type: 'failure',
					message: '邀请码错误！',
				});

			})
		}

	},

	findTargetTeam: function (list) {
		return [1, list[0], list[0]._id]
		// return -1
	},

	release: function (req) {
		db.collection('messages').add({
				data: this
			}).then(res => {
				console.log(res)
				return [1, res]
			})
			.catch(err => {
				console.log(err)
				return [0, err]
			})

	},

	onNumberChange(e) {

		var n = parseInt(e.detail)
		this.data.invitation_code_num = n
	},

	onGeneratingCode: function () {
		var that = this
		var n = this.data.invitation_code_num
		var list = []
		list = this.getCode(n)
		list = list.length > 0 ? this.data.invitation_code_list.concat(list) : this.data.invitation_code_list

		db.collection('teams').doc(this.data.current_team_id).update({
			data: {
				invitation_code: list
			}
		}).then(res => {
			this.setData({
				show: false,
				invitation_code_list: list
			})
		}).catch(err => console.log(err))
	},

	onInfoClick: function (param) {
		var id = param.detail.params[0]
		switch (id) {
			case 0:
				// 查看成员
				this.onCheckMember()
				break
			case 1:
				break
			case 2:
				break
			case 3:
				wx.navigateTo({
					url: './teamMessage/teamMessage',
				})
				break
		}
	},

	// 重置团队状态
	initTeamStat: function (resTeamProfile, resProfile) {
		const that = this
		if (resProfile.team_list.length == 0) {
			that.setData({
				hasTeam: false
			})
		} else if (resTeamProfile._id == app.globalData.team_profile._id) {
			// 退出团队后随机获取一个已有团队进入
			db.collection('teams').doc(resProfile.team_list[0]).get()
				.then(res => {
					app.globalData.team_profile = res.data
					wx.setStorageSync('team_profile', res.data)
					that.onLoad()
				}).catch(err => console.log(err))
		}
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



	onTeamSelected: function (e) {
		var that = this
		var id = e.target.dataset.id
		Toast({
			type: 'loading',
			message: '正在切换',
		})
		if (this.data.current_team_id != id) {
			// 切换到新团队
			db.collection('teams').doc(id).get()
				.then(res => {
					this.setData({
						name: res.data.name,
						current_team_id: res.data._id,
						new_team_id: res.data._id,
						invitation_code_list: res.data.invitation_code
					})
					app.globalData.team_profile = res.data
					that.setData({
						request_list: [],
					})
					that.readRequests()
					wx.setStorage({
						data: res.data._id,
						key: 'team_id',
					})
					Toast({
						type: 'succ',
						message: '切换成功！',
					})

				}).catch(err => {
					console.log(err)
					Toast.clear()
				})
		}
	},


	onTeamInformation: function () {
		wx.navigateTo({
			url: 'teamMember/teamMember?id=' + this.data.current_team_id,
		})
	},

	validateTeamId: function (team_id) {
		const list = app.globalData.profile.team_list
		for (var i = 0; i < list.length; i++) {
			if (list[i] == team_id) return -1
		}
		return team_id
	},

	// 发送回应
	sendAcknowledge: function (type, request) {
		db.collection('acknowledge').add({
			data: {
				type: type,
				request: request
			}
		}).then(res => {
			console.log(res)
		}).catch(err => console.log(err))
	},
	


	filterArray: function (arrToFilter, arrToCompare) {
		var arr = []
		console.log(arrToFilter)
		console.log(arrToCompare)
		for (var i = 0; i < arrToFilter.length; i++) {
			var flag = false
			for (var j = 0; j < arrToCompare.length; j++) {
				if (arrToFilter[i]._id == arrToCompare[j]) {
					flag = true
				}
			}
			if (flag == false) {
				arr.push(arrToFilter[i])
			}
		}
		// arrToFilter.forEach(item1=>{
		// 	var flag = false;
		// 	arrToCompare.forEach(item2=>{
		// 		if(item1._id == item2){
		// 			flag == true
		// 		}

		// 	})
		// 	if(!flag) {
		// 		arr.push(item1)
		// 	}
		// })
		console.log(arr)
		return arr
	},


})