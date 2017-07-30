'use strict'

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
const ValidationError = require('./validation-error')

module.exports = {
  createOrderInput
}

const schema = {
  type: 'object',
  properties: {
    orderId: {
      type: 'string',
      minLength: 1
    },
    customerId: {
      type: 'string',
      minLength: 1
    },
    item: {
      type: 'string',
      minLength: 1
    },
    quantity: {
      type: 'number',
      minimum: 1
    }
  },
  required: ['orderId', 'customerId', 'item', 'quantity']
}

const validate = ajv.compile(schema)

/**
 *
 * @typedef {Object} OrderInput
 * @property {String} orderId
 * @property {String} customerId
 * @property {String} item
 * @property {Number} quantity
 *
 */

/**
 * Parses concatenated line of order properties and validates
 *
 * @param {String} line
 * @param {String} delimiter
 * @returns OrderInput
 */
function createOrderInput(line, delimiter) {
  const args = line.split(delimiter)
  if (args.length !== 4) {
    throw new Error('line contains less then 4 sections')
  }

  const [orderId, customerId, item, quantity] = args
  const orderInput = {orderId, customerId, item, quantity}

  const valid = validate(orderInput)
  if (!valid) {
    throw new ValidationError(validate.errors)
  }

  return orderInput
}
