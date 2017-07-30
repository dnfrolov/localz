'use strict'

const Redis = require('ioredis')
const parseDatabaseUrl = require('parse-database-url')

const parsed = parseDatabaseUrl(process.env.REDIS_URL)

module.exports = new Redis({
  host: parsed.host,
  port: parsed.port,
  password: process.env.REDIS_AUTH,
  keyPrefix: process.env.REDIS_NAMESPACE
})
