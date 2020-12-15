const compareArray = (arr1, arr2, ) => {
	var res = []

	for ( var i = 0 ; i < arr1.length ; i++ ) {
		for ( var j = 0 ; j < arr2.length ; j++ ) {
			if ( arr1[i].month == arr2[j].month && arr1[i].day == arr2[j].day ) {
				arr2[j] = arr1[i]
			}
		}
	}
	return arr2
}

const sortByDate = (a, b) => {
	if (a.month == b.month) {
		return a.day - b.day
	} else {
		return a.month - b.month
	}
}

module.exports = {
	compareArray: compareArray,
	sortByDate: sortByDate
}