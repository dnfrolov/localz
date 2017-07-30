'use strict'

const sinon = require('sinon')
const should = require('should')
require('should-sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.sandbox.create()

//mocks
const customerCache = {
  getInternalId() {
  },
  setInternalId() {
  }
}
const storage = {
  insertOrder() {
  },
  queryCustomerInternalId() {
  }
}

const {insertOrder} = proxyquire('./insert-order', {
  './storage': storage,
  './customer-cache': customerCache
})

describe('import', () => {

  describe('insert-order', () => {

    afterEach(function () {
      sandbox.restore()
    })

    it('should not insert when customer does not exist', () => {

      const orderInput = {
        orderId: 'order-1',
        customerId: 'customer-2',
        item: 'item-3',
        quantity: 2
      }

      sandbox.stub(customerCache, 'getInternalId').resolves(null)
      const setInternalIdSpy = sandbox.spy(customerCache, 'setInternalId')

      sandbox.stub(storage, 'queryCustomerInternalId').resolves(null)
      const insertOrderSpy = sandbox.spy(storage, 'insertOrder')

      return insertOrder(orderInput).then(inserted => {
        should(inserted).be.false()

        setInternalIdSpy.should.not.be.called()
        insertOrderSpy.should.not.be.called()
      })
    })
  })
})
