'use strict'

const logger = require('../logger')
const storage = require('./storage')
const customerCache = require('./customer-cache')

module.exports = {
  insertOrder
}

function insertOrder(orderInput) {

  return customerCache.getInternalId(orderInput.customerId)
    .then(customerInternalId => {
      if (customerInternalId === null) {
        return storage.queryCustomerInternalId(orderInput.customerId)
          .then(id => {
            if (id) {
              customerCache.setInternalId(orderInput.customerId, id)
            }
            return id
          })
      }

      return customerInternalId
    })
    .then(customerInternalId => {
      if (!customerInternalId) {
        const line = JSON.stringify(orderInput)
        logger.info('Failed to insert order as customer doesn\'t exist', line)
        return false
      }

      return storage.insertOrder(orderInput, customerInternalId).then(() => true)
    })
}
