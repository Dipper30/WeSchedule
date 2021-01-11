const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
import Toast from '../../miniprogram_npm/@vant/dist/toast/toast'
import {
	Message
} from '../../utils/obj/Message'




Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		teamProfile: {
			imgSrc: '',
			name: 'name',
			brief: '长期团队'
		},
		info: [{
				num: 2,
				text: '团队人数'
			},
			{
				num: 3,
				text: '当前日程'
			},
			{
				num: 4,
				text: '历史日程'
			},
			{
				num: 100,
				text: '消息'
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
		profile: app.globalData.profile,
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
		const that = this
		app.teamMessageWatcher(this, options);
		
		if(app.globalData.profile.team_list.length == 0) {
			that.setData({hasTeam: false})
		} else {
			that.initializeTeamData()
		}
		
		// 监听新消息
		
	},

	refreshMessage: function (docChanges, docs) {
		console.log('s')
		app.globalData.teamMessageList = docs
		this.setData({teamMessageList: app.globalData.teamMessageList})
	},

	

	initializeTeamData: function () {
		const that = this
		let id = app.globalData.team_profile._id
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
		// this.tabBar()
		var that = this
		if (this.data.current_team_id != this.data.new_team_id) {
			console.log('!!!!!!!!!!!!!!!!!')
			this.setData({
				current_team_id: this.data.new_team_id
			})
			// this.setData({
			// 	team_list: app.globalData.profile.team_list
			// })
			// 当前团队更新，重新拉取数据
			db.collection('teams').doc(that.data.current_team_id).get()
				.then(res => {
					console.log(res)
					// 渲染团队数据
					let teamProfile = this.data.teamProfile
					teamProfile.name = res.data.name
					this.setData({
						teamProfile: teamProfile,
					})
					app.globalData.team_profile = res.data
					wx.setStorageSync('team_profile', res.data)
					console.log(app.globalData.team_profile)
				}).catch(err => console.log(err))

		}



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
		console.log(e.currentTarget.dataset.id)
		switch (id) {
			case 0:
				// 查看成员
				console.log("info")
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
				console.log("dismiss")
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
				wx.navigateTo({
					url: './switchTeam/switchTeam',
				})
				break
			case 3:
				// 退出团队
				this.onQuitTeam()
				break
			default:
				console.log('grid2 default')
		}
	},


	onCreateTeam: function () {
		wx.navigateTo({
			url: 'newTeam/newTeam',
		})
	},

	onSwitchTeam: function () {
		console.log('switch')
	},

	onQuitTeam: function () {
		console.log('quit')
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

		// console.log(invitation_code_list)
		if (this.data.confirm_btn_enbaled) {
			this.data.confirm_btn_enbaled = false
			Toast({
				type: 'loading',
				message: '正在提交',
			})
			db.collection('teams').where({
				invitationCodeList: code
			}).get().then(res => {
				console.log(res)
				if (res.data.length > 0) {
					// 判断是否命中
					var [team_id, owner_open_id, name] = that.findTargetTeam(res.data)
					// 判断是否已经在团队中
					team_id = that.validateTeamId(team_id)
					if (team_id != -1) {
						// 发送加入请求
						let req = new Message('req_join', app.globalData.profile, app.globalData.team_profile, app.globalData.team_profile.ownerOpenID, {
							invitation_code: code
						}, false)
						console.log(req)
						// let res = that.release(req)
						db.collection('messages').add({
							data: req
						}).then(res => {
							console.log(res)
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
		return [list[0]._id, list[0].ownerOpenID, list[0].name]
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
		console.log(this.data.invitation_code_num)
		var list = []
		list = this.getCode(n)
		console.log(list)
		list = list.length > 0 ? this.data.invitation_code_list.concat(list) : this.data.invitation_code_list

		db.collection('teams').doc(this.data.current_team_id).update({
			data: {
				invitation_code: list
			}
		}).then(res => {
			console.log(res)
			this.setData({
				show: false,
				invitation_code_list: list
			})
		}).catch(err => console.log(err))
	},

	onInfoClick: function (param) {
		console.log(param)
		let id = param.detail.params[0]
		console.log('222', id)
		switch(id) {
			case 0: break
			case 1: break
			case 2: break
			case 3: wx.navigateTo({
			  url: './teamMessage/teamMessage',
			})
			break
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
			console.log('switch to' + id)
			db.collection('teams').doc(id).get()
				.then(res => {
					console.log(res.data)
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
		// for (var i = 0; i < list.length; i++) {
		// 	if (list[i] == team_id) return -1
		// }
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
	// 读取回应
	readAcknowledge: function () {
		var that = this
		var request_list = app.globalData.profile.request_list
		console.log(request_list)
		if (request_list.length > 0) {
			db.collection('acknowledge').where({
				request: {
					from_id: _.eq(app.globalData.profile._id)
				}
			}).get().then(res => {
				console.log(res)
				// 判断回应是否已经处理过
				if (res.data.length > 0 && app.globalData.profile.processed_acknowledge.length > 0) {
					var arr = that.filterArray(res.data, app.globalData.profile.processed_acknowledge)
					this.setData({
						acknowledge_list: arr
					})
				} else {
					this.setData({
						acknowledge_list: res.data
					})
				}
				// 对每一条回应进行处理
				this.processAcknowledge(that.data.acknowledge_list)


			}).catch(err => console.log(err))
		}
	},

	processAcknowledge: function (acknowledge_list) {
		var that = this
		console.log(acknowledge_list)
		for (var i = 0; i < acknowledge_list.length; i++) {
			var acknowledge = acknowledge_list[i]
			if (acknowledge.type == "denial") {
				// 请求被拒绝，删除请求数据
				db.collection('request').doc(acknowledge.request._id).remove().then(res => {
					console.log(res)
				}).catch(err => console.log(err))
			} else {
				// 请求被接受，更新个人数据库
				db.collection('users').doc(app.globalData.profile._id).update({
					data: {
						team_list: _.push(acknowledge.request.team_id)
					}
				}).then(res => {
					// 更新本地
					var list = app.globalData.profile.team_list
					list[list.length] = acknowledge.request.team_id
					app.globalData.profile.team_list = list
					that.setData({
						team_list: list
					})
					console.log(res)
					// 更新request数据库
					db.collection('requests').doc(acknowledge.request._id).remove().then(res => {
						console.log(res)
					}).catch(err => console.log(err))
				}).catch(err => console.log(err))
			}
		}

	},

	// 发送请求
	sendRequest: function (type, team_id, e_id, name) {
		let req = new Message()
		var that = this
		var code = this.data.code_input
		var new_request_id = ''
		var team_profile = app.globalData.team_profile
		var new_member = {
			_id: app.globalData.profile._id,
			avatarUrl: app.globalData.profile.avatarUrl,
			nickName: app.globalData.profile.nickName
		}
		db.collection('requests').add({
			data: {
				type: type,
				team_id: team_id,
				to_id: e_id,
				from_id: app.globalData.profile._id,
				invitation_code: code,
				detail: new_member,
				team_name: name
			}
		}).then(res => {
			console.log(res)
			new_request_id = res._id
			// 将该条申请添加进个人信息
			db.collection('users').doc(app.globalData.profile._id).update({
				data: {
					request_list: _.push(res._id)
				}
			}).then(res => {
				console.log(res)
				// 更新本地
				var list = app.globalData.profile.request_list
				list[list.length] = new_request_id
				app.globalData.profile.request_list = list

				Toast({
					type: 'success',
					message: '申请已提交！',
				})
				that.setData({
					join_team_show: false,
					confirm_btn_enbaled: true
				})
			}).catch(err => console.log(err))
		}).catch(err => console.log(err))
	},

	// 读取请求
	readRequests: function () {
		var that = this
		// 如果是团队创建者，则读取是否存在申请请求
		// var flag = app.globalData.team_profile.establisher_id == app.globalData.profile._id ? true : false
		// 	this.setData({
		// 		is_establisher: flag
		// 	})
		// if (flag) {

		console.log('reading requests')
		db.collection('requests')
			.where({

				to_id: app.globalData.profile._id,

			})
			.get().then(res => {
				console.log(res)
				// 判断请求是否已经处理过
				if (res.data.length > 0 && app.globalData.profile.processed_request.length > 0) {
					var arr = that.filterArray(res.data, app.globalData.profile.processed_request)
					this.setData({
						request_list: arr
					})
				} else {
					this.setData({
						request_list: res.data
					})
				}


			}).catch(err => console.log(err))
		// }
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

	onCheckRequest: function (e) {
		console.log(e.target.dataset.item)
	},


	onClickRight: function () {
		this.onLoad()
		this.onShow()
	},

	onAcknowledgeConfirmed: function (e) {
		var acknowledge = e.target.dataset.item
		console.log(acknowledge)
		// 添加进已处理的回应列表
		db.collection('users').doc(app.globalData.profile._id).update({
			data: {
				processed_acknowledge: _.push(acknowledge._id)
			}
		}).then(res => {
			console.log(res)
			// 更新本地
			var l = app.globalData.profile.processed_acknowledge.length
			app.globalData.profile.processed_acknowledge[l] = acknowledge._id
		}).catch(err => console.log(err))
	},


	onRequestDenial: function (e) {
		console.log(e.target.dataset.item)
		var request = e.target.dataset.item
		// 发送拒绝回应
		this.sendAcknowledge('denial', request)
		// 添加进已处理的请求列表
		db.collection('users').doc(app.globalData.profile._id).update({
			data: {
				processed_request: _.push(request._id)
			}
		}).then(res => {
			console.log(res)
			// 更新本地
			var l = app.globalData.profile.processed_request.length
			app.globalData.profile.processed_request[l] = request._id
		}).catch(err => console.log(err))
	},

	onRequestAccepted: function (e) {
		console.log(e.target.dataset.item)
		var request = e.target.dataset.item
		// 发送接受回应
		this.sendAcknowledge('confirmation', request)

		// 更新数据库
		// 添加member_list并删除对应邀请码
		db.collection('teams').doc(this.data.current_team_id).update({
			data: {
				member_list: _.push(request.detail),
				invitation_code: _.pull(request.invitation_code)
			}
		}).then(res => {
			// 更新本地
			var l = app.globalData.profile.request_list.length
			app.globalData.profile.request_list[l] = request.detail
			console.log(res)
			// 添加进已处理的请求列表
			db.collection('users').doc(app.globalData.profile._id).update({
				data: {
					processed_request: _.push(request._id)
				}
			}).then(res => {
				console.log(res)
				// 更新本地
				var l = app.globalData.profile.processed_request.length
				app.globalData.profile.processed_request[l] = request._id
			}).catch(err => console.log(err))
		}).catch(err => console.log(err))

	}

})