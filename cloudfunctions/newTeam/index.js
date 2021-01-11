// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	var id = ''
	
	try {
		return await db.collection('teams').add({
			data: event.newTeam
		}).then(res=>{
			console.log(res)
			id = res._id
			return id
		})
	  } catch (e) {
		console.error(e)
	  }

}
