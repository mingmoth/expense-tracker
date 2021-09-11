const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/expense-tracker',
//   //MongoDB 的 3.1.0 版之前，向資料庫連線時不一定要加上 port，但在 3.1.0 版本後，連線資料庫時一定要加上 port。
//   //連線 MongoDB 時傳入 { useNewUrlParser: true } 的設定
//   //連線 MongoDB 時傳入 { useUnifiedTopology: true } 的設定
//   { useNewUrlParser: true, useUnifiedTopology: true })

// 否則為本地環境，使用 mongodb://localhost/todo-list
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

module.exports = db