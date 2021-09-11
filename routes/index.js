const express = require('express')
const router = express.Router()
// 引入 home 模組程式碼
const home = require('./modules/home')
const expenses = require('./modules/expenses')
const users = require('./modules/users')
// 掛載 middleware
const {authenticator} = require('../middleware/auth')


// 引入 todos 模組程式碼
router.use('/expenses', authenticator, expenses)
router.use('/users', users)
// 將網址結構符合 / 字串的 request 導向 home 模組
// 原因是因為按照「由上而下」的執行順序時，每當 request 重新導向 /users/login，由於符合 / 格式，就會優先被 home 路由器攔截，形成無限循環：
router.use('/', authenticator, home)
module.exports = router