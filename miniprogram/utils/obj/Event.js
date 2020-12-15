// import {AccommodationEvent} from './AccommodationEvent'
class Event {
	typeList = []
	constructor(type, name, startTime, endTime, location, uploadTime) {
		// 属性
		this.type = type
		this.name = name
		this.startTime = startTime
		this.endTime = endTime
		this.location = location
		this.uploadTime = uploadTime
	}
}

class EventFactory {
	constructor() {
		
	}
	createEvent(type, name, startTime, endTime, location, uploadTime) {
		switch (type) {
			case 0:
				return new AccommodationEvent(type, name, startTime, endTime, location, uploadTime)
				break
			case 1:
				return new MealEvent(type, name, startTime, endTime, location, uploadTime)
				break
			case 2:
				return new PerformanceEvent(type, name, startTime, endTime, location, uploadTime)
				break
			case 3:
				return new TripEvent(type, name, startTime, endTime, location, uploadTime)
				break
			default:
				throw new Error('参数错误！')
		}
	}
}

class EmptyEvent extends Event {

	constructor () {
		super()
		this.type = -1
		this.name = ""
		this.startTime = "09:00"
		this.endTime = "21:00"
		this.location = ""
		this.uploadTime = new Date().getTime()
	}
}

class AccommodationEvent extends Event {
	constructor (type, name, startTime, endTime, location, uploadTime) {
		super(type, name, startTime, endTime, location, uploadTime)
	}
}

class TripEvent extends Event {
	constructor (type, name, startTime, endTime, location, uploadTime) {
		super(type, name, startTime, endTime, location, uploadTime)
	}
}
class MealEvent extends Event {
	constructor (type, name, startTime, endTime, location, uploadTime) {
		super(type, name, startTime, endTime, location, uploadTime)
	}
}
class PerformanceEvent extends Event {
	constructor (type, name, startTime, endTime, location, uploadTime) {
		super(type, name, startTime, endTime, location, uploadTime)
	}
}

export {
	Event,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent,
	EmptyEvent
}