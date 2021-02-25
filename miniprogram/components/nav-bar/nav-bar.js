// components/nav-bar/nav-bar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		title: String,
		refresh: Boolean,
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () { 
			
		},
		
	  },

	/**
	 * 组件的方法列表
	 */
	methods: {
		onBackward: function () {
			const pages = getCurrentPages() //当前页面
			const prev = pages[pages.length - 2] //前一页
			wx.navigateBack().then(res=>{
				if ( this.properties.refresh == true ) prev.onLoad() // 执行前一个页面的onLoad方法
			})
		}
	}
})
