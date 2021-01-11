const db = wx.cloud.database()

class Message {
	constructor (type, fromProfile, toProfile,toOpenId, body, isProcessed) {
		this.type = type
		this.fromProfile = fromProfile
		this.toProfile = toProfile
		this.toOpenId = toOpenId
		this.body = body
		this.isProcessed = isProcessed
	}
	release () {
		db.collection('messages').add({
			data: this
		}).then(res=>{
			console.log(res)
			return [1, res]
		})
		.catch(err=>{
			console.log(err)
			return [0, err]	
		})
	}	
}

// class Request extends Message {
	
// 	constructor (type, fromId, toId, body) {
// 		this.type = type
// 		this.fromId = fromId
// 		this.toId = toId
// 		this.body = body
// 	}
	
// }


export {
	Message,
	// Request,
	// Acknowledge
}