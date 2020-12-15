function User(
	_id,
	_openid,
	avatarUrl,
	gender,
	nickName,
	own_team,
	processed_acknowledge,
	processed_request,
	request_list,
	team_list
){
	this.name = name;
	if(Person.prototype.say == undefined){
		   Person.prototype.say = function(){
				  	alert("I am "+this.name);
				  	}
		   }
	}
	var p1 = new Person("wang");
	var p2 = new Person("li");
	p1.say();
	p2.say();
	alert(p1.say==p2.say); //true