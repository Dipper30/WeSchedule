// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let result
	try {
		return await db.collection('orders').aggregate()
		.lookup({
		  from: 'books',
		  localField: 'book',
		  foreignField: 'title',
		  as: 'bookList',
		})
		.end()
		.then(res => console.log(res))
		.catch(err => console.error(err))
	} catch (e) {
		console.log(e)
	}
	return {
		result
	}
}