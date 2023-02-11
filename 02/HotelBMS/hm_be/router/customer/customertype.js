const express = require('express')
const router = express.Router()
const customertype_handler = require('@/controller/customer/customertype')
const verifyAdmin = require('@/middleware/verifyadmin.js')

router.get('/customertypes', customertype_handler.getTypes)
router.get('/customertypes/:id', customertype_handler.getTypesById)
router.post('/customertypes', verifyAdmin, customertype_handler.addTypes)
router.put('/customertypes/:id', verifyAdmin, customertype_handler.editTypeById)
router.delete('/customertypes/:id', verifyAdmin, customertype_handler.deleteTypeById)

module.exports = router
