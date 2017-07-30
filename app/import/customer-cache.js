'use strict'

const redis = require('../redis-client')
const debug = require('debug')('localz:customer-cache')

const CUSTOMER_TTL_SEC = 60

module.exports = {
  setInternalId,
  getInternalId
}

/**
 *
 * Returns customer internal id from cache if any
 *
 * @param {String} customerId
 * @return {Promise.<Number|null>}
 *
 */
function getInternalId(customerId) {
  debug('getInternalId', 'query', customerId)

  return redis.get(_key(customerId)).then(val => {
    debug('getInternalId', 'result', val)

    if (val) {
      return Number(val)
    }

    return null
  })
}

/**
 *
 * Set customer internal id in cache
 * @param {String} customerId
 * @param {Number} internalId
 */
function setInternalId(customerId, internalId) {
  debug('setInternalId', customerId, internalId)

  return redis.set(_key(customerId), internalId, 'EX', CUSTOMER_TTL_SEC)
}

function _key(customerId) {
  return `customer:${customerId}`
}
