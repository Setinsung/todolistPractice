const express = require('express')
const router = express.Router()
const stafftype_handler = require('@/controller/staff/stafftype')
const verifyAdmin = require('@/middleware/verifyadmin.js')

router.get('/stafftypes', verifyAdmin, stafftype_handler.getTypes)
router.get('/stafftypes/:id', verifyAdmin, stafftype_handler.getTypesById)
router.post('/stafftypes', verifyAdmin, stafftype_handler.addTypes)
router.put('/stafftypes/:id', verifyAdmin, stafftype_handler.editTypeById)
router.delete('/stafftypes/:id', verifyAdmin, stafftype_handler.deleteTypeById)

module.exports = router
