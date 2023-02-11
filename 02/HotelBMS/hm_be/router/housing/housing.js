const express = require('express')
const router = express.Router()

const housing_handler = require('@/controller/housing/housing.js')


router.post('/housing', housing_handler.doHousing)

module.exports = router
