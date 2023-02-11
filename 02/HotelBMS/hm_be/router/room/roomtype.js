const express = require('express')
const router = express.Router()
const roomtype_handler = require('@/controller/room/roomtype')
const verifyAdmin = require('@/middleware/verifyadmin.js')

router.get('/roomtypes', roomtype_handler.getTypes)
router.get('/roomtypes/:id', roomtype_handler.getTypesById)
router.post('/roomtypes', verifyAdmin, roomtype_handler.addTypes)
router.put('/roomtypes/:id', verifyAdmin, roomtype_handler.editTypeById)
router.delete('/roomtypes/:id', verifyAdmin, roomtype_handler.deleteTypeById)

module.exports = router
