// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	
	if ( event.type == 'all' ) {
		try {
			return await db.collection('teams').where({
				_id: _.in(event.teamList)
			}).get().then(res=>{
				return res.data
			})
		  } catch (e) {
			console.error(e)
			return e
		  }
	} else {
		const flag = ( event.type == 'permanent' ) ? true : false
		try {
			return await db.collection('teams').where({
				_id: _.in(event.teamList),
				type: flag
			}).get().then(res=>{
				return res.data
			})
		  } catch (e) {
			console.error(e)
		  }
	}
		

	

}
