// components/calendar/calendar.js.js
var dateUtil= require('../../utils/date.js')
var util = require('../../utils/util.js')

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showCalendar: Boolean,
		fullYearDays: Array,
		currentMonth: Number,
		curerntFullYear: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		viewPortHeight: 0,
		clientHeight: 0,
		showCalendar: true,
		monthToString: "",
		isLeapYear: false,
		initDay: -1,
		monthDays: -1,
		currentYear: -1,
		currentOffsetY: 0,
		offsetY: 0,
		initialOffsetY: 0,
		currentMonth: -1,
		view_port_start_x: 0,
		view_port_start_y: 0,
		view_port_move_x: 0,
		view_port_move_x: 0,
		view_port_end_x: 0,
		view_port_end_x: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		renderCalendar: function(arr, index, year) {

			// 寻找第x月份的第一天在数组中出现的位置
			
			// 判断是否为闰年
			this.setData({
				isLeapYear: (year%4==0&&year%100!=0||year%400==0) ? true : false,
				currentMonth: index,
				monthToString: dateUtil.getMonthAsString(index)
			})
			var [start, end] = this.findDate(arr,index)

			var days = dateUtil.getMonthDays(this.properties.currentMonth,this.data.isLeapYear)
			this.setData({
			  initDay: start,
			  monthDays: days,
			  currentYear: year,
			})
			// 判断第一天和最后一天所在行
			var rowStart = parseInt(start / 7)
			var rowEnd = parseInt(end / 7)
			if(rowEnd-rowStart == 4) {
				this.setData({
					viewPortHeight: 30,
				})
			}else{
				this.setData({
					viewPortHeight: 36,
				})
			}

			// 使日历向上移动 x/7 行
			this.setData({
			  offsetY: parseInt(-1 * rowStart * 6),
			  initialOffsetY: parseInt(-1 * rowStart * 6),
			})

		  },
		
		  findDate: function(arr, index) {
			var count = 0
			var cur = 0 // 当前月第一天所在位置
			for ( var i = 0 ; i < arr.length ; i++ ) {
			  if(arr[i] == 1) {
				count++
				if (count == index) {
					if(index==12){
						return [i,i+30] // 第一天和最后一天所在位置
					}else{
						cur = i
					}
				}else if (count == index + 1) {
					return [cur, i - 1] // 第一天和最后一天所在位置
				}
				
			  }
			}
			return -1
		  },

		  onPlus: function () {
			  var m = this.data.currentMonth + 1
			  m = (m==13) ? 1 : m
			this.setData({
				currentMonth: m
			})
			// 再次渲染日历
			this.renderCalendar(this.properties.fullYearDays,this.data.currentMonth,this.data.currentYear)
			
		  },

		  onMinus: function () {
			var m = this.data.currentMonth - 1
			m = (m==0) ? 12 : m

		  this.setData({
			  currentMonth: m
		  })
		  // 再次渲染日历
		  this.renderCalendar(this.properties.fullYearDays,this.data.currentMonth,this.data.currentYear)
		},


		  onClickDate: function (e) {
			  
		  },

		  onViewPortStart: function (e) {
			this.data.view_port_start_x = e.touches[0].pageX
			this.data.view_port_start_y = e.touches[0].pageY
			this.data.view_port_move_x = -1
			this.data.view_port_move_y = -1
		  },
		  onViewPortMove: function (e) {
			this.data.view_port_move_x = e.touches[0].pageX
			this.data.view_port_move_y = e.touches[0].pageY
			// 拖拽效果: 相对移动距离（单位: px) 
			// var diffY = this.data.view_port_move_y - this.data.view_port_start_y
			// diffY = diffY / this.data.clientHeight * 100
			// this.setData({
			// 	offsetY: this.data.initialOffsetY+diffY
			// })
			// console.log(this.data.offsetY)
			console.log(this.data.view_port_move_x,this.data.view_port_move_y)
		},
		onViewPortEnd: function (e) {
			if(this.data.view_port_move_x == -1 && this.data.view_port_move_y == -1) {
				return
			}else {
				this.data.view_port_end_x = this.data.view_port_move_x
				this.data.view_port_end_y = this.data.view_port_move_y
			}
			
			var turn = util.getTouchData(this.data.view_port_start_x,this.data.view_port_start_y,this.data.view_port_end_x,this.data.view_port_end_y,35)
			console.log(turn)
			if(turn=="up"){
				this.onPlus()
			}else if(turn=="down"){
				this.onMinus()
			}else {
				this.setData({
					offsetY: this.data.initialOffsetY
				})
			}
		},

	},

	lifetimes: {

		attached: function(){
			
		},

		ready: function() {
			var that = this
			wx.getSystemInfo({
				success: function (res) {
				  // 获取可使用窗口宽度
				  let clientHeight = res.windowHeight;
				that.setData({
					clientHeight: clientHeight
				})
				}
			  });
		},
		
	  },
})
