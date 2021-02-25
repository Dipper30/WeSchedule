const app = getApp()
const db = wx.cloud.database()
const _ = db.command

const quitTeam = ( team_profile , profile ) => {
	let resTeamProfile = team_profile
	let resProfile = profile

	// 将个人id从team中删除
	let member_list = team_profile.memberList
	let index = -1
	for ( var i = 0; i < member_list.length; i++ ) {
		if ( member_list[i] == profile._id ) {
			index = i
			break
		}
	}
	if ( index != -1 ) {
		member_list.splice(index, 1)
	}
	resTeamProfile.memberList = member_list
	console.log(member_list)

	// 将团队id从个人team_list中删除
	let team_list = profile.team_list
	let index2 = -1
	for ( var j = 0; j < team_list.length; j++ ) {
		if ( team_list[j] == team_profile._id ) {
			index2 = j
			break
		}
	}
	if ( index2 != -1 ) {
		team_list.splice(index2, 1)
	}
	console.log(team_list)
	resProfile.team_list = team_list

	// 更新user
	db.collection('users').doc(resProfile._id).update({
		data: {
			team_list: resProfile.team_list
		}
	}).then(res=>{
		console.log(res)
	}).catch(err=>console.log(err))

	// 更新team
	db.collection('teams').doc(resTeamProfile._id).update({
		data: {
			memberList: resTeamProfile.memberList
		}
	}).then(res=>{
		console.log(res)
	}).catch(err=>console.log(err))


	return [resTeamProfile, resProfile]
}

const dismissTeam = ( team_profile , profile ) => {
	let [resTeamProfile, resProfile] = [-1,-1]
	let originalProfile = app.globalData.profile
	wx.cloud.callFunction({
		// 云函数名称
		name: 'dismissTeam',
		// 传给云函数的参数
		data: {
		  teamProfile: team_profile,
		  profile: originalProfile
		},
	  }).then(res=>{
		console.log(res)
	  }).catch(err=>console.log(err))
	    // 更新本地profile
			  
		let team_list = originalProfile.team_list
		let index = -1
		for ( let j = 0 ; j < team_list.length ; j++ ) {
			if ( team_list[j] == team_profile._id ) {
				index = j
				break
			}
		}
		if ( index != -1 ) {
			team_list.splice(index,1)
		}
		app.globalData.profile.team_list = team_list
		resTeamProfile = team_profile
		resProfile = app.globalData.profile
		return [resTeamProfile, resProfile]
}

module.exports = {
	quitTeam: quitTeam,
	dismissTeam: dismissTeam,
}