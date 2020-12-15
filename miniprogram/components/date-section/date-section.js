// components/date-section/date-section.js
import {SingleDayEvents} from '../../utils/obj/SingleDayEvents'
import {Event,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent, 
	EmptyEvent} from '../../utils/obj/Event'

const ef = new EventFactory()

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		date: Object,
		dateIndex: Number,
		singleDay: Object,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		event_sequence: [],
		event_list: [],
		newEvent: false,
	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () { 
			console.log(this.properties.singleDay)
		},
		moved: function () { },
		detached: function () { },
	  },

	/**
	 * 组件的方法列表
	 */
	methods: {
		myevent(e) {
			// 这里就是子组件传过来的内容了
			console.log(e.detail.params)
			var e_l = this.data.event_list
			// 更新列表所在项，然后按时间进行重排序
			e_l[e.detail.params[1]] = e.detail.params[0]
			console.log(e_l)
			console.log(parseInt(e_l[0].startTime),parseInt(e_l[1].startTime))
			e_l = e_l.sort(function(a,b){
				return parseInt(b.startTime) - parseInt(a.startTime)
			})
			this.setData({
				event_list: e_l,
				newEvent: false,
			})
			console.log(e_l)
			this.triggerEvent('renew', {
				params: this.data.event_list
			}, {})

		},

		// initNewEvent: function (e) {
		// 	console.log(e,this.properties.singleDay.month, this.properties.singleDay.day)
		// 	this.setData({newEvent: true})
			// this.triggerEvent('initnewevent', {
			// 	params: [this.properties.singleDay.month, this.properties.singleDay.day]
			// }, {})
		// },

		onNewEvent: function (e) {
			this.triggerEvent('onnewevent', {
				params: [this.properties.singleDay.month, this.properties.singleDay.day] // month, day
			}, {})
		},

		onEventUpdated: function (params) {
			console.log(params)
			let newEvent = params.detail.params[0]
			this.setData({newEvent: false})
			this.triggerEvent('oneventupdated', {
				params: [this.properties.singleDay.month, this.properties.singleDay.day, newEvent, params.detail.params[1]] // month, day, object, id
			}, {})
		},


		onEventDeleted: function (e) {
			console.log(e.currentTarget.dataset.id, 'event delete')
			this.triggerEvent('oneventdeleted', {
				params: [this.properties.singleDay.month, this.properties.singleDay.day, e.currentTarget.dataset.id] // month, day, id
			}, {})
		}
	}
})
