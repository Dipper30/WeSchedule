class Schedule {
	constructor (name, uploadTime, dayList) {
		this.name = name
		this.uploadTime = uploadTime
		this.dayList = dayList
	}
	addEvent(event) {
		alert('add ', event)
	}

	getSingleDay(month, day) {
		for (var i = 0; i < this.dayList.length; i++) {
			if(this.dayList[i].month == month && this.dayList[i].day == day) {
				return this.dayList[i]
			}
		}
		return this.dayList[0]
	}

	compareArray(arr) {
		for (var i = 0; i < this.dayList.length; i++) {
			for (var j = 0; j < arr.length; j++) {
				if (this.dayList[i].month == arr[j].month && this.dayList[i].day == arr[j].day) {
					arr[j] = this.dayList[i]
				}
			}
		}
		this.dayList = arr
	}

	sortDayList() {
		this.dayList.sort(function (a, b) {
			if (a.month == b.month) {
				return a.day - b.day
			} else {
				return a.month - b.month
			}
		})
	}

	
}

export {
	Schedule
}