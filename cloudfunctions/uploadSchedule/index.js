// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	console.log(event)
	try {
		return await db.collection('schedules').add({
		data: event.schedule
	}).then(res=>{
		console.log(res)
	}).catch(err=>console.log(err))
	} catch (e) {
		console.log(e)
	}
	return {
	
	}
}