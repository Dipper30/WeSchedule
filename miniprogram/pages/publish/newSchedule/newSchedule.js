// pages/publish/publish.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const util = require('../../../utils/util.js')
const dateUtil = require('../../../utils/date.js')
const yearUtil = require('../../../utils/year.js')
const scheduleUtil = require('../../../utils/scheduleUtil.js')

import {Schedule} from '../../../utils/obj/Schedule'
import {SingleDayEvents} from '../../../utils/obj/SingleDayEvents'
import {Event,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent} from '../../../utils/obj/Event'
const ef = new EventFactory()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		text: '',
		show: false,
		showSchedule: 0,
		dateList: [],
		scheduleName: '',
		schedule: {},
		navigationBarHeight: 0,
		showOKBtn: false,
		showTeamSelector: false,
		teamOptions: [],
		defaultTeam: 0,
		teamProfileList: [],
		selectedTeamProfile: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			navigationBarHeight: app.globalData.navigationBarHeight
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},
	initNewSchedule: function () {
		this.setData({showSchedule: 2})
		var newSchedule = new Schedule(
			this.data.scheduleName,
			111,
			[],
			{}
		)
		this.setData({
			schedule: newSchedule,
		})
		// 读取所有团队信息
		this.readTeamData()
	},

	onNewEvent: function (params) {
		const p = params.detail.params
		this.data.schedule.getSingleDay(p[0], p[1]).initNewEvent()
		this.setData({schedule: this.data.schedule})
	},

	onEventUpdated: function (params) {
		console.log(params.detail.params)
		const p = params.detail.params
		this.data.schedule.getSingleDay(p[0], p[1]).updateEvent(p[2], p[3])
		this.setData({schedule: this.data.schedule})
	},

	onEventDeleted: function (params) {
		console.log(params.detail.params)
		const p = params.detail.params
		this.data.schedule.getSingleDay(p[0], p[1]).deleteEvent(p[2])
		this.setData({schedule: this.data.schedule})
	},

	onNewEventUpload: function (e) {
		console.log(app.globalData.team_profile._id)
		db.collection('news').add({
			data: {
				message: '这是一个新事件',
				team_id: app.globalData.team_profile._id,
				upload_time: new Date().getTime(),
			}
		}).then(res => {
			console.log(res)
			wx.showToast({
				type: 'success',
				title: '上传成功',
				duration: 1500,
			})
		}).catch(err => console.log(err))
		console.log('新事件上传了')

	},

	readTeamData: function () {
		const that = this
		db.collection('teams').where({
			_id: _.in(app.globalData.profile.team_list)	
		}).get().then(res=>{
			console.log(res.data)
			that.data.teamProfileList = res.data
			let index = 0
			res.data.forEach(item=>{
				let data = {
					text: item.name,
					value: index++
				}
				// 如果团队id与当前团队id一致，将其设置为默认团队
				if ( item._id == app.globalData.team_profile._id ) {
					// that.data.defaultTeam = {
					// 	name: item.name,
					// 	value: index - 1
					// }
					that.setData({
						defaultTeam: index - 1,
						selectedTeamProfile: that.data.teamProfileList[index-1],
					})
					// that.data.defaultTeam = index-1
				}
				that.data.teamOptions.push(data)
			})
			that.setData({
				teamOptions: that.data.teamOptions,
				showTeamSelector: true,
			})

		}).catch(err=>console.log(err))
	},

	onDisplay() {
		this.setData({
			show: true
		});
	},
	onClose() {
		this.setData({
			show: false
		});
	},
	onConfirm(event) {
		this.setData({
			show: false,
			date: `选择了 ${event.detail.length} 个日期`,
		});
		var arr = []
		for (var i = 0; i < event.detail.length; i++) {
			console.log(event.detail[i])
			var singleDayEvents = new SingleDayEvents(
				event.detail[i],
				event.detail[i].getMonth() + 1,
				event.detail[i].getDate(),
				[]
			)
			arr.push(singleDayEvents)
		}
		this.data.schedule.compareArray(arr)
		this.data.schedule.sortDayList()
		this.setData({
			schedule: this.data.schedule,
			showSchedule: 3
		})
	},

	onNewDate: function () {

	},

	

	renewdayevent: function (e) {
		console.log('renew', e.detail.params, e.currentTarget.dataset.id, e.currentTarget.dataset.date)
		var s = this.data.schedule
		console.log(s)
		if(!s[e.detail.params[1]]){
			s[e.detail.params[1]] = {}
		}
		s[e.detail.params[1]].date = e.currentTarget.dataset.date
		s[e.detail.params[1]].events = e.detail.params[0]
		this.setData({
			schedule: s
		})
		console.log(this.data.schedule)
	},

	onTeamSelected: function (e) {
		let selectedTeamProfile = this.data.teamProfileList[e.detail]
		console.log(selectedTeamProfile)
		this.data.selectedTeamProfile = selectedTeamProfilea
	},

	onUpLoad: function () {
		console.log(this.data.schedule)
		let s = this.data.schedule
		wx.cloud.callFunction({
			// 云函数名称
			name: 'uploadSchedule',
			// 传给云函数的参数
			data: {
			  schedule: s
			},
		  })
		  .then(res => {
			console.log(res) // 3
		  })
		  .catch(console.error)
	},

	uploadSchedule: function () {
		const that = this
		let schedule = that.data.schedule
		let team = that.data.selectedTeamProfile
		schedule.team = team
		console.log(this.data.schedule)
		console.log(this.data.selectedTeamProfile)
		// 添加到团队
		db.collection('schedules').add({
			data: schedule
		}).then(res=>{
			db.collection('teams').doc(team._id).update({
				data: {
					scheduleList: _.push(res._id)
				}
			}).then(res=>{
				console.log(res)
				wx.showToast({
				  title: 'success!',
				  duration: 1500,
				})
			}).catch(err=>console.log(err))
		}).catch(err=>console.log(err))
	},

})