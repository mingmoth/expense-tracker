const mongoose = require('mongoose')
const Expense = require('./expense')//載入Expense model

const expenseList = require('../../expense.json')
const expenseData = expenseList.results

mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected')
  expenseData.forEach((expenses) => {
    Expense.create({
      id: expenses.id,
      name: expenses.name,
      category: expenses.category,
      cost: expenses.cost,
      comment: expenses.comment
    })
  })
  console.log('Seed done')
})
