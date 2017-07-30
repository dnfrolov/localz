'use strict'

const amqplib = require('amqplib')
const Promise = require('bluebird')
const logger = require('./logger')
const debug = require('debug')('localz:rabbitmq-client')

let connection

module.exports = {
  createChannel() {

    return _connect(process.env.RABBIT_MQ_URL, process.env.ORDERS_QUEUE)
      .then(connection => connection.createChannel())
      .then(channel => {
        channel.on('close', function () {
          errorHandler(new Error('mq connection has been closed'))
        })
        channel.on('error', errorHandler)

        return channel
      })
      .catch(errorHandler)
  }
}

function _connect(url, queueName) {

  if (connection) {
    return Promise.resolve(connection)
  }

  return amqplib
    .connect(url)
    .then(conn => {
      connection = conn

      conn.on('error', errorHandler)
      return conn.createChannel()
    }, errorHandler)
    .then(channel => {
      debug('connected to mq')

      channel.on('error', errorHandler)
      channel.assertQueue(queueName, {durable: true}).then(() => channel.close())

      return connection
    })
    .then(null, errorHandler)
}

function errorHandler(err) {
  logger.error(err || {})
  process.emit('terminate', 'RABBIT_MQ_ERROR')
}
