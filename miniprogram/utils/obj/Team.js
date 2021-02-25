const db = wx.cloud.database()

class Team {
	constructor (name, avatarUrl, type, ownerOpenID, expireDateTS, memberList, descriptions, invitationCodeList, scheduleList) {
		this.name = name
		this.avatarUrl = avatarUrl
		this.type = type
		this.ownerOpenID = ownerOpenID
		this.expireDateTS = expireDateTS
		this.memberList = memberList
		this.descriptions = descriptions
		this.invitationCodeList = invitationCodeList
		this.scheduleList = scheduleList
	}
}

export {
	Team
}