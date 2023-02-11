const express = require('express')
const router = express.Router()

const customer_handler = require('@/controller/customer/customer')

router.get('/customers', customer_handler.getCustomers)
router.get('/customers/:id', customer_handler.getCustomerById)
router.post('/customers', customer_handler.addCustomers)
router.put('/customers/:id', customer_handler.editCustomerById)
router.delete('/customers/:id', customer_handler.deleteCustomerById)

module.exports = router
