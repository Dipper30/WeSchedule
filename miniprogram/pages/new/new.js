// pages/new/new.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [
			{
				name: 'a',
				status: 1,
			},
			{
				name: 'b',
				status: 0,
			},
			{
				name: 'c',
				status: 0,
			},

		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// const res = cal([100, 202, 180, 60, 120, 123, 298, 108])
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	switch: function ( e ) {
		console.log(e)

	},

	login: function () {
		wx.login().then(res=>{
			console.log(res.code)
		})
	}
})