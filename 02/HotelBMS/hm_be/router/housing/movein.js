const express = require('express')
const router = express.Router()

const movein_handler = require('@/controller/housing/movein')



router.get('/moveins', movein_handler.getMoveins)
router.put('/moveins',movein_handler.moveinsToHistory)


module.exports = router
