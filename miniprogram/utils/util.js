const formatTime = date => {
  const year = date.getFullYear()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  // return [day + " days " + hour + " hours "].map(formatNumber)
  return [year+" "+month+" "+ day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

const getTouchData = (startX, startY, endX, endY, distance) => {
  let turn = "";
  if (endX - startX > distance && Math.abs(endY - startY) < distance) {      //右滑
    turn = "right";
  } else if (endX - startX < -distance && Math.abs(endY - startY) < distance) {   //左滑
    turn = "left";
  }else if (endY - startY > distance && Math.abs(endX - startX) < 2*distance) {      //下滑
    turn = "down";
  } else if (endY - startY < -distance && Math.abs(endX - startX) < 2*distance) {   //上滑
    turn = "up";
  }
  return turn;
}

const createEmptyArr = (length) => {
	var arr = []
		for(var i = 0 ; i < length ; i++ ){
			arr.push(" ")
		}
	return arr
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getTouchData: getTouchData,
  mkArr: createEmptyArr,
}
