'use strict'

const {insertOrder} = require('./insert-order')
const {consumeOrders} = require('./consume-orders')

module.exports = {
  imports
}

function imports() {
  consumeOrders(process.env.ORDERS_QUEUE, process.env.ORDERS_QUEUE_PREFETCH, insertOrder)
}
