// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const team_id = event.teamProfile._id
	const member_list = event.teamProfile.memberList

	for ( let i = 0 ; i < member_list.length ; i++ ) {
		try {
			await db.collection('users').doc(member_list[i]).get()
			.then(res=>{
				let team_list = res.data.team_list
				let index = -1
				for ( let j = 0 ; j < team_list.length ; j++ ) {
					if ( team_list[j] == team_id ) {
						index = j
						break
					}
				}
				if ( index != -1 ) {
					team_list.splice(index,1)
				}
				db.collection('users').doc(member_list[i]).update({
					data: {
						team_list: team_list
					}
				})
			})
		} catch (error) {
			console.log(error)
		}
	}
	try {
		return await db.collection('teams').doc(team_id).remove()
		.then(res=>{
			console.log(res)
			return res
		})
	} catch (error) {
		console.log(error)
	}
	

}