'use strict'

require('dotenv').config({path: '.testenv'})

require('should')
const Promise = require('bluebird')
const knex = require('./mysql-client')
const redis = require('./redis-client')
const {imports} = require('../app/import')
const rabbitmq = require('./rabbitmq-client')

const EXECUTION_DELAY = 100

describe('localz', () => {

  describe('import', () => {

    let channel
    const queueName = process.env.ORDERS_QUEUE

    before(() => {
      return rabbitmq.connect().then(ch => channel = ch)
    })

    beforeEach(() => {
      return Promise.all([
        redis.flushall(),
        channel.purgeQueue(queueName),
        knex('order').delete().then(() => knex('customer').delete())
      ])
    })

    it('should consume message from queue and create order', () => {
      const customer = {customer_id: 'customer-1', inserted: new Date(), inserted_by: 'integration-tests'}
      const orderInput = {customerId: 'customer-1', orderId: 'order-1', item: 'item-1', quantity: 5}
      const expected = {order_id: 'order-1', item: 'item-1', quantity: 5}

      imports()

      return knex('customer').insert(customer)
        .then(() => publishMessage(orderInput))
        .then(() => Promise.delay(EXECUTION_DELAY))
        .then(() => {
          return knex('order').select('order_id', 'item', 'quantity')
        })
        .then(orders => {
          orders.should.have.length(1)
          orders[0].should.eql(expected)
        })
    })

    function publishMessage(orderInput) {
      const bf = Buffer.from(JSON.stringify(orderInput))
      channel.sendToQueue(queueName, bf, {persistent: true})
    }
  })
})
