'use strict'

const amqplib = require('amqplib')

module.exports = {
  connect
}

function connect() {
  if (connect.promise) {
    return connect.promise
  }

  return connect.promise = amqplib
    .connect(process.env.RABBIT_MQ_URL)
    .then(conn => conn.createChannel())
    .then(ch => {
      return ch.assertQueue(process.env.ORDERS_QUEUE).then(() => ch)
    })
}
