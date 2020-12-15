const getFullYearDays = (year) => {
	// 判断是否为闰年
	
		　　if(year%4==0&&year%100!=0||year%400==0){
			// 闰年
				return  concatArr(31,29,31,30,31,30,31,31,30,31,30,31)
		　　}else{
			// 平年
			　　 return  concatArr(31,28,31,30,31,30,31,31,30,31,30,31)
		}
	return []
  }

  // 制造数组
	
const concatArr = (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec) => {
	var JanArr = createArr(Jan)
	var FebArr = createArr(Feb) 
	var MarArr = createArr(Mar) 
	var AprArr = createArr(Apr) 
	var MayArr = createArr(May) 
	var JunArr = createArr(Jun) 
	var JulArr = createArr(Jul) 
	var AugArr = createArr(Aug) 
	var SepArr = createArr(Sep) 
	var OctArr = createArr(Oct) 
	var NovArr = createArr(Nov) 
	var DecArr = createArr(Dec) 
	return JanArr.concat(FebArr).concat(MarArr).concat(AprArr).concat(MayArr).concat(JunArr).concat(JulArr).concat(AugArr).concat(SepArr).concat(OctArr).concat(NovArr).concat(DecArr)
	
}

const createArr = (days) => {
	var arr = []
		for(var i = 0 ; i < days ; i++ ){
			arr.push(i+1)
		}
	return arr
}



  module.exports = {
	getFullYearDays: getFullYearDays,
  }