const express = require('express')
const router = express.Router()
// 引用 Todo model
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const moment = require('moment')
const { getIconClassName, monthPick } = require('../../tools/helpers')


// 定義首頁路由
router.get('/', (req, res) => {

  Promise.all([Expense.find().lean().sort('-date'), Category.find().lean()])
    .then(results => {
      const [expenses, categories] = results
      let totalCost = 0
      const monthGroup = []

      expenses.forEach(expense => {
        // console.log()
        monthGroup.push(moment(expense.date).format('YYYY-MM'))
        expense.categoryIcon = getIconClassName(expense.category, categories)
        expense.date = moment(expense.date).format('YYYY-MM-DD')
        totalCost += expense.cost
      })
      const monthCollect = monthPick(monthGroup)
      res.render('index', { expenses, categories, totalCost, monthCollect })
    })
    .catch(err => console.log(err))

})

//特定類別支出
router.get('/search', (req, res) => {

  const { monthSearch, categorySearch } = req.query

  Promise.all([Expense.find({ category: { $regex: categorySearch } }).lean().sort('-date'), Category.find().lean()])
    .then(results => {
      const [filteredRecords, categories] = results
      let totalCost = 0
      filteredRecords.forEach(expense => {
        console.log(expense)
        expense.categoryIcon = getIconClassName(expense.category, categories)
        expense.date = moment(expense.date).format('YYYY-MM-DD')
        totalCost += expense.cost
      })
      res.render('index', { expenses: filteredRecords, totalCost, categorySearch })
    })
    .catch(err => console.log(err))

})

module.exports = router