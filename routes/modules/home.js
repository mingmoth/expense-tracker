const express = require('express')
const router = express.Router()
// 引用 Todo model
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const moment = require('moment')
const { getIcon, dateToString } = require('../../tools/helpers')
const expense = require('../../models/expense')


// 定義首頁路由
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean()
    const categoryData = {}
    categories.forEach((category) => {
      categoryData[category.name] = category.icon
    })

    const expenses = await Expense.find().sort({ date: 'asc' }).lean()

    let totalCost = 0

    expenses.forEach((expense) => {
      expense.categoryIcon = categoryData[expense.category]
      totalCost += expense.cost
    })
    return res.render('index', { expenses, categories, totalCost })
  } catch (err) { console.log(err) }
})

//特定類別支出
router.get('/search', async (req, res) => {
  // const categorySearch = req.query.categorySearch
  // let { startDate, endDate } = req.query
  // startDate = startDate || '2021-01-01' // default start date
  // endDate = endDate || moment().format('YYYY-MM-DD') // today as default end date

  // Promise.all([Expense.find({ category: { $regex: categorySearch }, date: { $gte: startDate, $lt: endDate } }).lean().sort({ date: 'asc' }), Category.find().lean()])
  //   .then(results => {
  //     const [expenses, categories] = results
  //     let totalCost = 0
  //     expenses.forEach(expense => {
  //       expense.categoryIcon = getIcon(expense.category, categories)
  //       expense.date = moment(expense.date).format('YYYY-MM-DD')
  //       totalCost += expense.cost
  //     })
  //     res.render('index', { expenses, categorySearch, totalCost, startDate, endDate })
  //   })
  //   .catch(err => console.log(err))

  try {
    const categorySearch = req.query.categorySearch
    const categories = await Category.find().lean()

    const filterQuery = {}
    categorySearch ? filterQuery.category = categorySearch : ''

    const expenses = await Expense.aggregate([
      { $project: { name: 1, category: 1, date: 1, cost: 1, comment: 1 } },
      { $match: filterQuery }
    ])

    const categoryData = {}
    categories.forEach((category) => {
      categoryData[category.name] = category.icon
    })

    let totalCost = 0

    expenses.forEach((expense) => {
      expense.categoryIcon = categoryData[expense.category]
      totalCost += expense.cost
    })
    return res.render('index', {
      expenses, categories, totalCost, categorySearch
    })

  } catch (err) { console.log(err) }



})

module.exports = router