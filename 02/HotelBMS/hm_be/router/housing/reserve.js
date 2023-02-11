const express = require('express')
const router = express.Router()

const movein_handler = require('@/controller/housing/reserve')



router.get('/reserves', movein_handler.getReserves)
router.put('/reserves',movein_handler.reservesToHistory)
router.delete('/reserves/:id',movein_handler.deleteReserveById)

module.exports = router
