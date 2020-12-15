const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate




Page({

	/**
	 * 页面的初始数据
	 */
	data: {
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
		invitation_code_num: 1,
		invitation_code_list: [],
		new_code_list: [],
		activeNames: ['0'],
		activeTeamNames: ['0'],
		activeRequestNames: ['0'],
		code_input: '',
		team_list: [],
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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		var id = wx.getStorageSync('team_id')
		// 查看我的通知消息
		console.log(app.globalData.profile)
		if(app.globalData.profile.request_list) this.readAcknowledge()

		this.setData({
			team_list: wx.getStorageSync('team_list'),
			request_list: [],
			acknowledge_list: [],
			activeNames: ['0'],
			activeTeamNames: ['0'],
			activeRequestNames: ['0'],

		})
		if (id) {
			this.setData({
				current_team_id: id,
				new_team_id: id
			})
			db.collection('teams').doc(that.data.current_team_id).get()
				.then(res => {
					console.log(res.data)
					this.setData({
						name: res.data.name,
						invitation_code_list: res.data.invitation_code
					})
					app.globalData.team_profile = res.data
					console.log(app.globalData.team_profile)
					// 判断读取请求
					this.readRequests()

				}).catch(err => console.log(err))
		}else {
			db.collection('teams').where({
				member_list: app.globalData.profile._id
			}).get().then(res=>{
				console.log(res.data)
				this.setData({
					current_team_id: res.data[0]._id,
					new_team_id: res.data[0]._id,
				})
				wx.setStorage({
				  data: res.data[0]._id,
				  key: 'team_id',
				})
			}).catch(err=>console.log(err))
		}
	},



	onShow: function () {

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
			db.collection('teams').doc(this.data.current_team_id).get()
				.then(res => {
					console.log(res)
					var new_team = {
						_id: res.data._id,
						name: res.data.name
					}
					var team_list = wx.getStorageSync('team_list')
					console.log(team_list)
					that.setData({
						name: res.data.name,
						invitation_code_list: res.data.invitation_code
					})


					team_list[team_list.length] = new_team

					that.setData({
						team_list: team_list
					})
					console.log(team_list)
					wx.setStorageSync('team_list', team_list)

					app.globalData.team_profile = res.data
				}).catch(err => console.log(err))

		}



	},

	onTeamCreation: function () {
		wx.navigateTo({
			url: 'newTeam/newTeam',
		})
	},

	onMemberInvited: function () {
		this.setData({
			show: true
		});
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
		if(this.data.confirm_btn_enbaled) {
			this.data.confirm_btn_enbaled = false
			Toast({
				type: 'loading',
				message: '正在提交',
			})
			db.collection('teams').where({
				invitation_code: code
			}).get().then(res => {
					console.log(res)
					if (res.data.length > 0) {
						// 判断是否命中
						var [team_id, e_id, name] = that.findTargetTeam(res.data)
						// 判断是否已经在团队中
						// team_id = that.validateTeamId(team_id)
						if (team_id != -1) {
							// 发送加入请求
							that.sendRequest('join', team_id, e_id, name )
	
						
						} else {
							console.log('没有找到团队')
							Toast({
								type: 'failure',
								message: '邀请码错误！',
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

		return [list[0]._id,list[0].establisher_id,list[0].name]
		// return -1
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
		list = list.length>0 ? this.data.invitation_code_list.concat(list):this.data.invitation_code_list

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

	onViewCode: function () {

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
		var list = app.globalData.profile.team_list
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
		}).then(res=>{
			console.log(res)
		}).catch(err=>console.log(err))
	},
	// 读取回应
	readAcknowledge: function() {
		var that = this
		var request_list = app.globalData.profile.request_list
		console.log(request_list)
		if(request_list.length > 0) {
			db.collection('acknowledge').where({
					request: {
						from_id: _.eq(app.globalData.profile._id)
					}
			}).get().then(res=>{
				console.log(res)
				// 判断回应是否已经处理过
				if(res.data.length>0 && app.globalData.profile.processed_acknowledge.length>0 ) {
					var arr = that.filterArray(res.data, app.globalData.profile.processed_acknowledge)
					this.setData({
						acknowledge_list: arr
					})
				}else{
					this.setData({
						acknowledge_list: res.data
					})
				}
				// 对每一条回应进行处理
				this.processAcknowledge(that.data.acknowledge_list)
				
				
			}).catch(err=>console.log(err))
		}
	},

	processAcknowledge: function(acknowledge_list) {
		var that = this
		console.log(acknowledge_list)
		for( var i = 0 ; i < acknowledge_list.length ; i++ ) {
			var acknowledge = acknowledge_list[i]
			if(acknowledge.type=="denial") {
				// 请求被拒绝，删除请求数据
				db.collection('request').doc(acknowledge.request._id).remove().then(res=>{
					console.log(res)
				}).catch(err=>console.log(err))
			}else{
				// 请求被接受，更新个人数据库
				db.collection('users').doc(app.globalData.profile._id).update({
					data: {
						team_list: _.push(acknowledge.request.team_id)
					}
				}).then(res=>{
					// 更新本地
					var list = app.globalData.profile.team_list
					list[list.length] = acknowledge.request.team_id
					app.globalData.profile.team_list = list
					that.setData({
						team_list: list
					})
					console.log(res)
					// 更新request数据库
					db.collection('requests').doc(acknowledge.request._id).remove().then(res=>{
						console.log(res)
					}).catch(err=>console.log(err))
				}).catch(err=>console.log(err))
			}
		}
		
	},

	// 发送请求
	sendRequest: function (type, team_id, e_id, name) {
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
			}).then(res=>{
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
					if(res.data.length>0 && app.globalData.profile.processed_request.length>0 ) {
						var arr = that.filterArray(res.data, app.globalData.profile.processed_request)
						this.setData({
							request_list: arr
						})
					}else{
						this.setData({
							request_list: res.data
						})
					}
					
					
				}).catch(err => console.log(err))
		// }
	},

	filterArray: function(arrToFilter, arrToCompare) {
		var arr = []
		console.log(arrToFilter)
		console.log(arrToCompare)
		for( var i = 0 ; i < arrToFilter.length ; i++ ) {
			var flag = false
			for(var j = 0; j < arrToCompare.length; j++ ) {
				if(arrToFilter[i]._id==arrToCompare[j]){
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
		}).then(res=>{
			console.log(res)
			// 更新本地
			var l = app.globalData.profile.processed_acknowledge.length
			app.globalData.profile.processed_acknowledge[l] = acknowledge._id
		}).catch(err=>console.log(err))
	},


	onRequestDenial: function (e) {
		console.log(e.target.dataset.item)
		var request = e.target.dataset.item
		// 发送拒绝回应
		this.sendAcknowledge('denial',request)
		// 添加进已处理的请求列表
		db.collection('users').doc(app.globalData.profile._id).update({
			data: {
				processed_request: _.push(request._id)
			}
		}).then(res=>{
			console.log(res)
			// 更新本地
			var l = app.globalData.profile.processed_request.length
			app.globalData.profile.processed_request[l] = request._id
		}).catch(err=>console.log(err))
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
		}).then(res=>{
			// 更新本地
			var l = app.globalData.profile.request_list.length
			app.globalData.profile.request_list[l] = request.detail
			console.log(res)
			// 添加进已处理的请求列表
			db.collection('users').doc(app.globalData.profile._id).update({
			data: {
				processed_request: _.push(request._id)
			}
			}).then(res=>{
				console.log(res)
				// 更新本地
			var l = app.globalData.profile.processed_request.length
			app.globalData.profile.processed_request[l] = request._id
			}).catch(err=>console.log(err))
		}).catch(err=>console.log(err))

	}

})