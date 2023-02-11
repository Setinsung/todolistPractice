const express = require('express')
const router = express.Router()

const menu_handler = require('@/controller/menu/menu')



router.get('/menus', menu_handler.getMenus)


module.exports = router
