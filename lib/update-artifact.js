'use strict'
const rally = require('rally')
const Configstore = require('configstore')
const conf = new Configstore('ca')

module.exports = (options) => {
  if (!options.ref) {
    throw new Error('Ref is required to update an artifact')
  }
  if (!options.data) {
    throw new Error('Data is required to update an artifact')
  }

  return rally({
    apiKey: conf.get('apiKey')
  })
  .update({
    ref: options.ref,
    data: options.data,
    fetch: options.fetch || ['FormattedID', 'Name', 'State', 'Actuals', 'Iteration'],
    requestOptions: {}
  })
}
