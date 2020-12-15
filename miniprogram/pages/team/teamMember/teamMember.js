const app = getApp()
const db = wx.cloud.database();


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		establisher_id: '',
		member_list: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		db.collection('teams').doc(options.id).get()
		.then(res=>{
			this.setData({
				member_list: res.data.member_list,
				establisher_id: res.data.establisher_id
			})
		}).catch(err=>console.log(err))
	},


})