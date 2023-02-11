const express = require('express')
const router = express.Router()
const room_handler = require('@/controller/room/room')
const verifyAdmin = require('@/middleware/verifyadmin.js')


router.get('/rooms', room_handler.getRooms)
router.get('/rooms/:id', room_handler.getRoomById)
router.post('/rooms', verifyAdmin, room_handler.addRooms)
router.put('/rooms/:id', verifyAdmin, room_handler.editRoomById)
router.delete('/rooms/:id', verifyAdmin, room_handler.deleteRoomById)


module.exports = router
