// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const team_id = event.teamProfile._id
	try {
		return await db.collection('teams').doc(team_id).update({
			data: {
				// 表示将 done 字段置为 true
				memberList: event.teamProfile.memberList
			  },
		}).then(res=>{
			console.log(res)
			id = res._id
			return id
		})
	  } catch (e) {
		console.error(e)
	  }

}