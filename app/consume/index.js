'use strict'

const request = require('request')
const readline = require('readline')

const logger = require('../logger')
const {publishOrder} = require('./publish-order')
const {createOrderInput} = require('./create-order-input')

let firstLineSkipped = false

module.exports = {
  consume
}

function consume() {
  const fileUrl = process.env.ORDERS_FILE_URL
  logger.info('start fetching file..', fileUrl)

  const rl = readline.createInterface({
    input: request.get(fileUrl)
  })

  rl.on('line', (line) => {
    if (!firstLineSkipped) {
      firstLineSkipped = true
      return
    }

    logger.info('received new line', line)

    let orderInput

    try {
      logger.info('parsing new line..', line)
      orderInput = createOrderInput(line, process.env.DELIMITER)
    } catch (err) {
      logger.error('parsing error', err)
      return
    }

    logger.info('publishing new order input', orderInput)
    publishOrder(process.env.ORDERS_QUEUE, orderInput)
  })

  rl.on('close', () => {
    logger.info('finished fetching file', fileUrl)
  })
}
