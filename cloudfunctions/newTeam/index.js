// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let id = ''

	try {
		return await db.collection('teams').add({
			data: {
					name: event.name,
					description: event.description,
					schedule_list: [],
					member_list: event.member_list,
					establisher_id: event.establisher_id,
					invitation_code: [],
			}
		}).then(res=>{
			console.log(res)
		})
	  } catch (e) {
		console.error(e)
	  }

}