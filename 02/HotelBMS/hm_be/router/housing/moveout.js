const express = require('express')
const router = express.Router()

const moveout_handler = require('@/controller/housing/moveout')



router.get('/moveouts', moveout_handler.getMoveouts)
router.put('/moveouts',moveout_handler.moveoutsToHistory)


module.exports = router
