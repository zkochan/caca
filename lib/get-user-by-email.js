'use strict'
const rally = require('rally')
const queryUtils = rally.util.query
const getArtifact = require('./get-artifact')

module.exports = (email) => {
  return getArtifact({
    type: 'user',
    query: queryUtils.where('EmailAddress', '=', email)
  })
  .then((result) => {
    if (result.Results.length > 1) {
      console.log('More than 1 result has been found by your request')
      return
    }

    if (result.Results.length === 0) {
      console.log('No user has been found by your request')
      return
    }

    return Promise.resolve(result.Results[0])
  })
}
