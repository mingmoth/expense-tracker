const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../../models/expense')


//新增支出
router.get('/new', (req, res) => {
  const today = moment().format('YYY-MM-DD')
  return res.render('new', { date: today })
})

router.post('/', (req, res) => {
  const { name, date, category, cost, comment } = req.body
  return Expense.create({ name, date, category, cost, comment })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯支出
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .lean()
    .then((expense) => {
      console.log(expense)
      res.render('edit', { expense })
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, cost, comment } = req.body
  return Expense.findById(id)
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.category = category
      expense.cost = cost
      expense.comment = comment
      return expense.save()
      console.log(expense)
    })
    // .then(console.log(req.body))
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//刪除支出
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router