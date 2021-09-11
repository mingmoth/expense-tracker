const express = require('express')
const router = express.Router()
// 引用 Todo model
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const moment = require('moment')
const { getIconClassName, monthPick } = require('../../tools/helpers')


// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id

  const categoryIcon = ''
  Promise.all([Expense.find({ userId }).lean().sort('-date'), Category.find().lean()])
    .then(results => {
      const [expenses, categories] = results
      let totalCost = 0
      const monthGroup = []

      expenses.forEach(expense => {
        monthGroup.push(moment(expense.date).format('YYYY-MM'))
        expense.categoryIcon = getIconClassName(expense.category, categories)
        expense.date = moment(expense.date).format('YYYY-MM-DD')
        totalCost += expense.cost
      })
      const monthCollect = monthPick(monthGroup)
      res.render('index', { expenses, categories, totalCost, categoryIcon, monthCollect })
    })
    .catch(err => console.log(err))

})

//特定類別支出
router.get('/search', async (req, res) => {
  try {
    const userId = req.user._id
    const { timeSearch, categorySearch } = req.query
    const filterQuery = { userId: userId }
    let yearSearch = Number(moment(timeSearch).format('YYYY'))
    let monthSearch = Number(moment(timeSearch).format('MM'))
    // console.log(moment(timeSearch))
    // console.log(yearSearch)
    // console.log(monthSearch)
    categorySearch ? filterQuery.category = categorySearch : ''
    timeSearch ? filterQuery.year = yearSearch : ''
    timeSearch ? filterQuery.month = monthSearch : ''
    // console.log(filterQuery)

    const monthGroup = []
    const totalExpense = await Expense.find({ userId }).lean().sort('-date')

    totalExpense.forEach((expense) => {
      monthGroup.push(moment(expense.date).format('YYYY-MM'))
    })

    const monthCollect = monthPick(monthGroup)

    const categories = await Category.find().lean().sort()

    let totalCost = 0
    const categoryIcon = ''
    const filterExpenses = await Expense.aggregate([{ $project: { name: 1, category: 1, date: 1, cost: 1, comment: 1, userId: 1, year: { $year: '$date' }, month: { $month: '$date' } } },
    { $match: filterQuery }])

    filterExpenses.forEach((expense => {
      expense.categoryIcon = getIconClassName(expense.category, categories)
      expense.date = moment(expense.date).format('YYYY-MM')
      totalCost += expense.cost
    }))
    res.render('index', { expenses: filterExpenses, categories, totalCost, categoryIcon, monthCollect, timeSearch, categorySearch })

  } catch (err) { console.log(err) }


})

module.exports = router