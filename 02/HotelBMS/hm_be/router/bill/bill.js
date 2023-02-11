const express = require('express')
const router = express.Router()

const bill_handler = require('@/controller/bill/bill')



router.get('/bills', bill_handler.getBills)


module.exports = router
