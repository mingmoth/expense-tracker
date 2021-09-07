// const mongoose = require('mongoose')
const Expense = require('../expense')//載入Expense model
const db = require('../../config/mongoose')

const expenses = [
  {
    "id": 1,
    "name": "午餐",
    "date": "2021-07-22",
    "category": "餐飲食品",
    "cost": 120,
    "comment": "麥當勞"
  },
  {
    "id": 2,
    "name": "電影",
    "date": "2021-07-22",
    "category": "休閒娛樂",
    "cost": 230,
    "comment": "黑寡婦"
  },
  {
    "id": 3,
    "name": "Uber",
    "date": "2021-07-22",
    "category": "交通出行",
    "cost": 192,
    "comment": ""
  },
  {
    "id": 4,
    "name": "電費",
    "date": "2021-07-22",
    "category": "家居物業",
    "cost": 790,
    "comment": "2021/05-2021/06"
  },
  {
    "id": 5,
    "name": "Alpha Camp 學費",
    "date": "2021-07-22",
    "category": "其他",
    "cost": 3600,
    "comment": "學期一"
  }
]


db.once('open', () => {
  Expense.create(expenses)
    .then(() => {
      console.log('expense seed done')
      return db.close()
    })
    .catch(err => console.log(err))
})
