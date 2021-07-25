const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker',
  //MongoDB 的 3.1.0 版之前，向資料庫連線時不一定要加上 port，但在 3.1.0 版本後，連線資料庫時一定要加上 port。
  //連線 MongoDB 時傳入 { useNewUrlParser: true } 的設定
  //連線 MongoDB 時傳入 { useUnifiedTopology: true } 的設定
  { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

const Expense = require('./models/expense');


app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    categoryIcon: function (icon, category) {
      return category[icon]
    }
  }
}))

app.set('view engine', 'hbs')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 將 request 導入路由器
app.use(routes)


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})