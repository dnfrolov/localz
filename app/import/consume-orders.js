'use strict'

const logger = require('../logger')
const client = require('../rabbitmq-client')

let channel

function assertChannel() {
  return channel ? Promise.resolve(channel) : client.createChannel().then(ch => channel = ch)
}

module.exports = {
  consumeOrders
}

function consumeOrders(queueName, prefetch, orderHandler) {

  return assertChannel()
    .then(() => {
      channel.prefetch(Number(prefetch))
      channel.consume(queueName, function (message) {

        let orderInput
        try {
          orderInput = JSON.parse(message.content)
        } catch (err) {
          return logger.error('not able to parse message', message.content, err)
        }

        orderHandler(orderInput).then(() => channel.ack(message))
      })
    })
}
