// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	var id = ''
	
	try {
		return await db.collection('teams').doc(event.info.toProfile._id).update({
			data: {
				memberList: _.push(event.info.fromProfile._id)
			}
		}).then(res=>{
			console.log(res)
			return res
		})
	  } catch (e) {
		console.error(e)
	  }

}
