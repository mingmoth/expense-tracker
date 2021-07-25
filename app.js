const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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

//首頁
app.get('/', (req, res) => {
  const categories = {
    家居物業: '<i class="fas fa-laptop-house"></i>',
    交通出行: '<i class="fas fa-bus-alt"></i>',
    休閒娛樂: '<i class="fas fa-icons"></i>',
    餐飲食品: '<i class="fas fa-hotdog"></i>',
    其他: '<i class="fas fa-paste"></i>'
  }
  let totalCost = 0
  Expense.find()
    .lean()
    .sort({ _id: 'asc' })
    .then((expenses) => {
      expenses.forEach((expense) => totalCost += expense.cost),
        res.render('index', { expenses, categories, totalCost })
    })
    .catch(error => console.log(error))
})

//特定類別支出
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  // console.log(keyword)

  const categories = {
    家居物業: '<i class="fas fa-laptop-house"></i>',
    交通出行: '<i class="fas fa-bus-alt"></i>',
    休閒娛樂: '<i class="fas fa-icons"></i>',
    餐飲食品: '<i class="fas fa-hotdog"></i>',
    其他: '<i class="fas fa-paste"></i>'
  }

  let totalCost = 0

  Expense.find()
    .lean()
    .then((expenses) => {
      if (keyword === '全部') {
        expenses = expenses
      } else {
        expenses = expenses.filter((expense) => expense.category.includes(keyword))
      }
      // console.log(expenses)
      expenses.forEach((expense) => totalCost += expense.cost)
      res.render('index', { expenses, categories, totalCost, keyword })
    })
})


//新增支出
app.get('/expenses/new', (req, res) => {
  return res.render('new')
})

app.post('/expenses', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const cost = req.body.cost
  const comment = req.body.comment
  return Expense.create({ name, date, category, cost, comment })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯支出
app.get('/expenses/:id/edit', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .lean()
    .then((expense) => res.render('edit', { expense }))
    .catch(error => console.log(error))
})

app.put('/expenses/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const cost = req.body.cost
  const comment = req.body.comment
  return Expense.findById(id)
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.category = category
      expense.cost = cost
      expense.comment = comment
      return expense.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//刪除支出
app.delete('/expenses/:id', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})