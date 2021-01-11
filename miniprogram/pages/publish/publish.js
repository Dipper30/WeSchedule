// pages/publish/publish.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/util.js')
const dateUtil = require('../../utils/date.js')
const yearUtil = require('../../utils/year.js')
const scheduleUtil = require('../../utils/scheduleUtil.js')
const scheduleWatcher = require('../../utils/watcher/scheduleWatcher')
import {Schedule} from '../../utils/obj/Schedule'
import {SingleDayEvents} from '../../utils/obj/SingleDayEvents'
import {Event,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent} from '../../utils/obj/Event'
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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		
	},


	onNewSchedule: function (e) {
		this.setData({showSchedule: 1})
	},

	initNewSchedule: function () {
		this.setData({showSchedule: 2})
		var newSchedule = new Schedule(
			this.data.scheduleName,
			111,
			[]
		)
		this.setData({schedule: newSchedule})
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


})