const db = wx.cloud.database()

class User {
	constructor (nickName, avatarUrl, gender, own_team, team_list, history_message) {
		this.nickName = nickName
		this.avatarUrl = avatarUrl
		this.gender = gender
		this.own_team = own_team
		this.team_list = team_list
		this.history_message = history_message
	}
	
}

export {
	User
}