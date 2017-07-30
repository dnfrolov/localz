'use strict'

const Redis = require('ioredis')
const logger = require('./logger')
const parseDatabaseUrl = require('parse-database-url')
const debug = require('debug')('localz:redis-client')

const client = _connect(process.env.REDIS_URL, process.env.REDIS_AUTH, process.env.REDIS_NAMESPACE)
module.exports = client

function _connect(url, auth, namespace) {

  debug('connecting redis...')
  const parsed = parseDatabaseUrl(url)

  const redis = new Redis({
    host: parsed.host,
    port: parsed.port,
    password: auth,
    keyPrefix: namespace
  })

  redis.on('error', err => {
    logger.error(err)
    process.emit('terminate', 'REDIS_ERROR')
  })

  redis.on('connect', () => {
    debug(`connected to redis ${url}`)
  })

  redis.on('close', () => {
    debug(`connection to redis ${url} has been closed!`)
    process.emit('terminate', 'REDIS_CLOSED')
  })

  return redis
}
