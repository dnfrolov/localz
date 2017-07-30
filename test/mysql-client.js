'use strict'

const knex = require('knex')
const parseDatabaseUrl = require('parse-database-url')

const urlParams = parseDatabaseUrl(process.env.MYSQL_BRANDY)

module.exports = knex({
  client: 'mysql2',
  connection: urlParams,
  pool: {
    min: 1,
    max: 1
  }
})
