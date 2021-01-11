const db = wx.cloud.database()

class Team {
	constructor (name, avatarUrl, type, ownerOpenID, expireDateTS, memberList, descriptions, invitationCodeList) {
		this.name = name
		this.avatarUrl = avatarUrl
		this.type = type
		this.ownerOpenID = ownerOpenID
		this.expireDateTS = expireDateTS
		this.memberList = memberList
		this.descriptions = descriptions
		this.invitationCodeList = invitationCodeList
	}
}

export {
	Team
}