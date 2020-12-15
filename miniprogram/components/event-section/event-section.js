// components/event-section/event-section.js
import {SingleDayEvents} from '../../utils/obj/SingleDayEvents'
import {Event,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent} from '../../utils/obj/Event'

const ef = new EventFactory()

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		eventid: Number,
		event: Object,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		
		collapse: false,
		ifEdit: true,
		filter(type, options) {
			if (type === 'minute') {
				return options.filter((option) => option % 15 === 0);
			}
			return options;
		},
		showTimeSlot: false,
		endTime: "21:00",
		startTime: "09:00",
		typeList: [
			"住宿",
			"餐饮",
			"演出",
			"出行"
		],
		type: -1,
		showTypeMenu: false,
		location: "",
		name: "",

	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () { 
			
		},
		moved: function () { },
		detached: function () { },
	  },

	/**
	 * 组件的方法列表
	 */
	methods: {
		onTimeSlotShow: function () {
			this.setData({
				showTimeSlot: true
			});
		},

		onTimeSlotClose: function () {
			this.setData({
				showTimeSlot: false
			});
		},

		bindEndTimeChange: function (e) {
			this.setData({
				endTime: e.detail.value,
				startTimeEnd: e.detail.value,
			})
		},
		bindStartTimeChange: function (e) {
			this.setData({
				startTime: e.detail.value,
				endTimeStart: e.detail.value
			})
		},
		toggleTypeMenu: function () {
			this.setData({
				showTypeMenu: !this.data.showTypeMenu
			})
		},
		onTypeSelected: function (e) {
			this.setData({
				type: e.currentTarget.dataset.id
			})
			this.toggleTypeMenu()
		},
		onNameInput: function (e) {
			this.setData({
				name: e.detail
			})
		},
		onLocationInput: function (e) {
			this.setData({
				location: e.detail
			})
		},

		onEventUpdated: function (e) {
			console.log('ss')
			this.setData({
				ifEdit: false
			})

			let newEvent = ef.createEvent(
				this.data.type,
				this.data.name,
				this.data.startTime,
				this.data.endTime,
				this.data.location,
				new Date().getTime()
			)
			// 自定义一个事件，并且传值
			this.triggerEvent('oneventupdated' ,{params: [newEvent, this.properties.eventid]},
			{})
		},

		onEventEdit: function (e) {
			console.log(e.detail)
			this.setData({
				ifEdit: true,
				endTime: this.properties.event.endTime,
				startTime: this.properties.event.startTime,
				type: this.properties.event.type,
			location: this.properties.event.location,
			name: this.properties.event.name,

			})
		},
		onToggleCollapse: function () {
			if (this.data.collapse == false) {
				// 读取节点，获取高度

				// const query = wx.createSelectorQuery()
				// setTimeout(function(){
				// 	query.select('.col').boundingClientRect(function (res) {
				// 		console.log(res)
				// 	}).exec()
				// },1000)
				
			}
			this.setData({
				collapse: !this.data.collapse
			})
		},

	}
})