const express = require('express')
const router = express.Router()
// 引入 home 模組程式碼
const home = require('./modules/home')
const expenses = require('./modules/expenses')

// 將網址結構符合 / 字串的 request 導向 home 模組
router.use('/', home)
// 引入 todos 模組程式碼
router.use('/expenses', expenses)

module.exports = router