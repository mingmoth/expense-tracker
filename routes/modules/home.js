const express = require('express')
const router = express.Router()
// 引用 Todo model
const Expense = require('../../models/expense')

// 定義首頁路由
router.get('/', (req, res) => {
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
router.get('/search', (req, res) => {
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

module.exports = router