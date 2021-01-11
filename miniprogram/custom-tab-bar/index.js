// custom-tab-bar/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		selected: 0,
		tabList: [
			{
				"pagePath": "pages/schedule/schedule",
				"text": "日程",
				"iconPath": "/images/tab/schedule-grey.png",
				"selectedIconPath": "/images/tab/schedule-hl.png"
			  },
			  {
				"pagePath": "pages/news/news",
				"text": "动态",
				"iconPath": "/images/tab/ciwei.png",
				"selectedIconPath": "/images/tab/ciwei-hl.png"
			  },
			 
			  {
				"pagePath": "pages/team/team",
				"text": "团队",
				"iconPath": "/images/tab/schedule-grey.png",
				"selectedIconPath": "/images/tab/schedule-hl.png"
			  },
			  {
				"pagePath": "pages/me/me",
				"text": "我的",
				"iconPath": "/images/tab/ciwei.png",
				"selectedIconPath": "/images/tab/ciwei-hl.png"
			  }
		]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

		onSwitch (e) {
			let key = Number(e.currentTarget.dataset.index)
			let tabList = this.data.tabList
			console.log(key)
			if(key != this.data.selected) {
				wx.switchTab({
					url: `/${tabList[key].pagePath}`,
				})
			}
			
		},
	

	}
})
