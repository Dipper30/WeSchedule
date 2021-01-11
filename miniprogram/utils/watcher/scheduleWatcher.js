const db = wx.cloud.database()

// export const scheduleWatcher = db.collection('schedules')
// // 按 progress 降序
// // .orderBy('progress', 'desc')
// // 取按 orderBy 排序之后的前 10 个
// .limit(10)
// .where({
//   uploadTime: 111
// })
// .watch({
//   onChange: function(snapshot) {
// 	  console.log(snapshot)
// 	console.log('docs\'s changed events', snapshot.docChanges)
// 	console.log('query result snapshot after the event', snapshot.docs)
// 	console.log('is init data', snapshot.type === 'init')
//   },
//   onError: function(err) {
// 	console.error('the watch closed because of error', err)
//   }
// })
// ...
// 等到需要关闭监听的时候调用 close() 方法
// watcher.close()