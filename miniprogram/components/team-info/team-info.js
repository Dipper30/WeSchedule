// components/team-info/team-info.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		teamProfile: Object
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		typeIconColor: 'green',
	},

	lifetimes: {
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		attached: function () { 
			if ( !this.data.teamProfile.type ) {
				this.setData({
					typeIconColor: 'yellow'
				})
			}
		},
		
	  },

	/**
	 * 组件的方法列表
	 */
	methods: {
		onSwitch: function () {
			this.triggerEvent('onswitchteam', {
				params: this.properties.teamProfile
			}, {})
		}
	}
})
