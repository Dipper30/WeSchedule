const formatTime = date => {
 
	const day = date.getDate()
	const hour = date.getHours()
	return [day + " days " + hour + " hours "].map(formatNumber)
	// return [year+" "+month+" "+ day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  const getMonthAsString = num => {
	  switch(num) {
		  case(1) : return "壹月";
		  case(2) : return "贰月";
		  case(3) : return "叁月";
		  case(4) : return "肆月";
		  case(5) : return "伍月";
		  case(6) : return "陆月";
		  case(7) : return "柒月";
		  case(8) : return "捌月";
		  case(9) : return "玖月";
		  case(10) : return "拾月";
		  case(11) : return "拾壹月";
		  case(12) : return "拾贰月";
	  }
  }

  const getMonthDays = (month, isLeapYear) => {
	switch(month) {
		case(1) : return 31;
		case(2) : return isLeapYear?29:28;
		case(3) : return 31;
		case(4) : return 30;
		case(5) : return 31;
		case(6) : return 30;
		case(7) : return 31;
		case(8) : return 31;
		case(9) : return 30;
		case(10) : return 31;
		case(11) : return 30;
		case(12) : return 31;
	}
}

  const getDateByTimestamp = timestamp => {
	 
	  
	  
	var timestr = new Date(parseInt(timestamp));

    　　var year = timestr.getFullYear();

    　　var month = timestr.getMonth()+1;

    　　var date = timestr.getDate();

    　　var hour = timestr.getHours();

    　　var minute = timestr.getMinutes();

	　　var second = timestr.getSeconds();
		var weekDay = getWeekOfDate(timestr.getDay())

	return [year,month,date,hour,minute,second,weekDay]
	}
  
  const formatDate = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return [year + "-" + month + "-" + day].map(formatNumber)
  }
  
  const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
  }
  
  const getTouchData = (endX, endY, startX, startY) => {
	let turn = "";
	console.log('start');
	if (endX - startX > 75 && Math.abs(endY - startY) < 75) {      //右滑
	  turn = "right";
	} else if (endX - startX < -75 && Math.abs(endY - startY) < 75) {   //左滑
	  turn = "left";
	}
	return turn;
  }

  const getWeekOfDate = (num) => {
	var weekDays = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
	return weekDays[num];
}
  
  module.exports = {
	formatTime: formatTime,
	formatDate: formatDate,
	getTouchData: getTouchData,
	getMonthAsString: getMonthAsString,
	getMonthDays: getMonthDays,
	getDateByTimestamp: getDateByTimestamp,
  }
  