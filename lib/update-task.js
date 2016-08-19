'use strict'
const rally = require('rally')
const Configstore = require('configstore')
const conf = new Configstore('ca')

module.exports = (options) => {
  if (!options.ref) {
    throw new Error('Ref are required to create a task')
  }

  const data = {
    State: options.state || 'Defined'
  }

  if (options.actuals) {
    data.actuals = options.actuals
  }

  return rally({
    apiKey: conf.get('apiKey')
  })
  .update({
    ref: options.ref,
    data,
    fetch: options.fetch || ['FormattedID', 'Name', 'State', 'Actuals'],
    requestOptions: {}
  })
}
