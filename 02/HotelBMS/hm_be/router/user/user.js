const express = require('express')
const router = express.Router()

const user_handler = require('@/controller/user/user')


// 登录
router.post('/login', user_handler.login)
router.get('/user',user_handler.getUser)
router.put('/user',user_handler.updateUser)


module.exports = router
