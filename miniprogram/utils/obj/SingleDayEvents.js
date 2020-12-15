import {Schedule} from '../../utils/obj/Schedule'
import {Event,
	EmptyEvent,
	EventFactory,
	AccommodationEvent,
	TripEvent,
	MealEvent,
	PerformanceEvent} from '../../utils/obj/Event'

class SingleDayEvents {
	constructor (date, month, day, eventList) {
	// 属性
	this.date = date
	this.month = month
	this.day = day
	this.eventList = eventList
	}

	initNewEvent () {
		let emptyEvent = new EmptyEvent()
		this.eventList.push(emptyEvent)
		return this.eventList
	}

	updateEvent (event, id) {
		this.eventList[id] = event
		this.sortEvents()
		return this.eventList
	}

	deleteEvent (id) {
		this.eventList.splice(id, 1)
		return this.eventList
	}

	addEvent (event) {
		alert('add ', event)
	}
	sortEvents () {
		if(this.eventList.length>1) {
			this.eventList.sort(function (a, b) {
				let [hrA, minA] = a.startTime.split(":")
				let [hrB, minB] = b.startTime.split(":")
				if (hrA == hrB) {
					return parseInt(minA) - parseInt(minB)
				} else {
					return parseInt(hrA) - parseInt(hrB)
				}
			})
		} 
		// else {
		// 	return this.eventList
		// }	
	}
}

export {SingleDayEvents}