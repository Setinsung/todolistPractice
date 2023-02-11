const express = require('express')
const router = express.Router()
const staff_handler = require('@/controller/staff/staff')
const verifyAdmin = require('@/middleware/verifyadmin.js')

router.get('/staffs', verifyAdmin, staff_handler.getStaffs)
router.get('/staffs/:id', verifyAdmin, staff_handler.getStaffById)
router.post('/staffs', verifyAdmin, staff_handler.addStaffs)
router.put('/staffs/:id', verifyAdmin, staff_handler.editStaffById)
router.delete('/staffs/:id', verifyAdmin, staff_handler.deleteStaffById)

module.exports = router
