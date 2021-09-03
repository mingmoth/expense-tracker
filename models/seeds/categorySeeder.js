// const mongoose = require('mongoose')
const Category = require('../category')//載入Expense model
const db = require('../../config/mongoose')

const categories = [
  {
    "name": "家居物業",
    "name_en": "household",
    "icon": "fas fa-laptop-house"
  },
  {
    "name": "交通出行",
    "name_en": "transport",
    "icon": "fas fa-bus-alt"
  },
  {
    "name": "休閒娛樂",
    "name_en": "entertain",
    "icon": "fas fa-icons"
  },
  {
    "name": "餐飲食品",
    "name_en": "food",
    "icon": "fas fa-hotdog"
  },
  {
    "name": "其他",
    "name_en": "others",
    "icon": "fas fa-paste"
  }
]

db.once('open', () => {
  Category.create(categories)
    .then(() => {
      console.log('category seed done')
      return db.close()
    })
    .catch(err => console.log(err))
})
