// const mongoose = require('mongoose')
const Expense = require('../expense')//載入Expense model
const db = require('../../config/mongoose')

const expenseList = require('../../expense.json')
const expenseData = expenseList.results


db.once('open', () => {
  console.log('mongodb connected')
  expenseData.forEach((expenses) => {
    Expense.create({
      id: expenses.id,
      name: expenses.name,
      date: expenses.date,
      category: expenses.category,
      cost: expenses.cost,
      comment: expenses.comment
    })
  })
  console.log('Seed done')
})
