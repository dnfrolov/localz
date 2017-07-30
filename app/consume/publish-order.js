'use strict'

const client = require('../rabbitmq-client')

let channel

function assertChannel() {
  return channel ? Promise.resolve(channel) : client.createChannel().then(ch => channel = ch)
}

module.exports = {
  publishOrder
}

function publishOrder(queueName, message) {

  return assertChannel()
    .then(() => {
      const bf = Buffer.from(JSON.stringify(message))
      channel.sendToQueue(queueName, bf, {persistent: true})
    })
}
