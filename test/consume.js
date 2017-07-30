'use strict'

require('dotenv').config({path: '.testenv'})

require('should')
const {URL} = require('url')
const nock = require('nock')
const Promise = require('bluebird')

const {consume} = require('../app/consume')
const rabbitmq = require('./rabbitmq-client')

const EXECUTION_DELAY = 100

describe('localz', () => {

  describe('consume', () => {

    let channel
    const queueName = process.env.ORDERS_QUEUE
    const url = new URL(process.env.ORDERS_FILE_URL)

    before(() => {
      return rabbitmq.connect().then(ch => channel = ch)
    })

    beforeEach(() => {
      return channel.purgeQueue(queueName)
    })

    it('should retrieve file and publish orders to message queue', () => {

      const response = 'orderId,customerId,item,quantity\nsample-123,customer-321,Flowers,2'
      const expected = {orderId: 'sample-123', customerId: 'customer-321', item: 'Flowers', quantity: 2}

      nock(url.origin)
        .get(url.pathname)
        .reply(200, response)

      consume()

      return Promise.delay(EXECUTION_DELAY)
        .then(() => {
          return Promise.all([
            channel.assertQueue(queueName).then(info => info.should.have.property('messageCount', 1)),
            channel.get(queueName).then(msg => JSON.parse(msg.content).should.eql(expected))
          ])
        })
    })
  })
})
