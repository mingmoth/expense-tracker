const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expenseSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  date: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  cost: {
    type: Number,
    require: true
  },
  comment: {
    type: String,
  }
})

module.exports = mongoose.model('Expense', expenseSchema)