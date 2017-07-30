'use strict'

class ValidationError extends Error {

  constructor(errors) {

    const msg = errors.map(e => `${e.dataPath} ${e.message}`).join(';')
    super(`validation failed with message: ${msg}`)

    this.errors = errors

    Error.captureStackTrace(this, ValidationError)
  }
}

module.exports = ValidationError
