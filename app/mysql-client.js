'use strict'

const knex = require('knex')
const logger = require('./logger')
const parseDatabaseUrl = require('parse-database-url')

const client = _connect(process.env.MYSQL_BRANDY)
module.exports = client

function _connect(dbUrl) {
  const urlParams = parseDatabaseUrl(dbUrl)
  const loggableUrl = `${urlParams.user}@${urlParams.host}:${urlParams.port}/${urlParams.database}`

  const _knex = knex({
    client: 'mysql2',
    connection: urlParams,
    pool: {
      min: 2,
      max: 10
    }
  })

  _knex.raw('SELECT VERSION()')
    .then(() => logger.info('connected to mysql', loggableUrl))

  return _knex
}
