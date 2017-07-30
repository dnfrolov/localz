'use strict'

const client = require('../mysql-client')

const PROCESS = 'localz-batch-order-import'

module.exports = {
  insertOrder,
  queryCustomerInternalId
}

function queryCustomerInternalId(customerId) {
  return client('customer')
    .where({customer_id: customerId})
    .first()
    .then(customer => {
      if (customer) {
        return customer.id
      }

      return null
    })
}

function insertOrder(orderInput, customerInternalId) {

  const values = {
    order_id: orderInput.orderId,
    customer_id: customerInternalId,
    item: orderInput.item,
    quantity: orderInput.quantity,
    inserted: new Date(),
    inserted_by: PROCESS
  }

  return client('order').insert(values)
}
