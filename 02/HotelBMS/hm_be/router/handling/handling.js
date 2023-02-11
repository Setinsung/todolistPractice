const express = require('express')
const router = express.Router()
const handling_handler = require('@/controller/handling/handling')
const verifyAdmin = require('@/middleware/verifyadmin.js')


router.get('/handlings', verifyAdmin, handling_handler.getHandlings)


module.exports = router
