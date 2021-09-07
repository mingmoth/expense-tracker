const express = require('express')
const router = express.Router()
// 引用 Todo model
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const moment = require('moment')
const { getAccountingFormat, getTotalAmount, getIconClassName } = require('../../tools/helpers')



// 定義首頁路由
router.get('/', (req, res) => {

  Promise.all([Expense.find().lean().sort('-date'), Category.find().lean()])
    .then(results => {
      const [expenses, categories] = results
      // const totalCost = getAccountingFormat(getTotalAmount(expenses))
      let totalCost = 0
      const defaultStartDate = '2021-01-01'
      const today = moment().format('YYYY-MM-DD')
      expenses.forEach(expense => {
        // console.log(expense)
        expense.categoryIcon = getIconClassName(expense.category, categories)
        expense.date = moment(expense.date).format('YYYY-MM-DD')
        totalCost += expense.cost
      })
      res.render('index', { expenses, categories, totalCost, startDate: defaultStartDate, endDate: today })
    })
    .catch(err => console.log(err))
  // try {
  //   const categories = await Category.find().lean()
  //   const categoryData = {}
  //   categories.forEach((category) => {
  //     categoryData[category.name] = category.icon
  //   })

  //   const expenses = await Expense.find().sort({ date: 'asc' }).lean()

  //   let totalCost = 0

  //   expenses.forEach((expense) => {
  //     expense.categoryIcon = categoryData[expense.category]
  //     totalCost += expense.cost
  //   })
  //   return res.render('index', { expenses, categories, totalCost })
  // } catch (err) { console.log(err) }
})

//特定類別支出
router.get('/search', (req, res) => {
  const categorySearch = req.query.categorySearch
  let { startDate, endDate } = req.query
  startDate = startDate || '2021-01-01' // default start date
  endDate = endDate || moment().format('YYYY-MM-DD') // today as default end date
  if ((new Date(startDate)).valueOf() > new Date(endDate).valueOf()) {
    [startDate, endDate] = [endDate, startDate]
  }

  Promise.all([Expense.find({ category: { $regex: categorySearch }, date: { $gte: startDate, $lt: endDate } }).lean().sort('-date'), Category.find().lean()])
    .then(results => {
      const [filteredRecords, categories] = results
      // const totalCost = getAccountingFormat(getTotalAmount(filteredRecords))
      let totalCost = 0
      filteredRecords.forEach(expense => {
        expense.categoryIcon = getIconClassName(expense.category, categories)
        expense.date = moment(expense.date).format('YYYY-MM-DD')
        totalCost += expense.cost
      })
      res.render('index', { expenses: filteredRecords, totalCost, categorySearch, startDate, endDate })
    })
    .catch(err => console.log(err))

  // try {
  //   const categorySearch = req.query.categorySearch
  //   const categories = await Category.find().lean()

  //   const filterQuery = {}
  //   categorySearch ? filterQuery.category = categorySearch : ''
  //   const expenses = await Expense.aggregate([
  //     { $project: { name: 1, category: 1, date: 1, cost: 1, comment: 1 } },
  //     { $match: filterQuery }
  //   ])

  //   const categoryData = {}
  //   categories.forEach((category) => {
  //     categoryData[category.name] = category.icon
  //   })

  //   let totalCost = 0

  //   expenses.forEach((expense) => {
  //     expense.categoryIcon = categoryData[expense.category]
  //     totalCost += expense.cost
  //   })
  //   return res.render('index', {
  //     expenses, categories, totalCost, categorySearch
  //   })

  // } catch (err) { console.log(err) }

})

module.exports = router