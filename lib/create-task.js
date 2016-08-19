'use strict'
const rally = require('rally')
const Configstore = require('configstore')
const conf = new Configstore('ca')

module.exports = (options) => {
  if (!(options.name && options.projectRef && options.artifactRef)) {
    throw new Error('Name, projectRef and artifactRef are required to create a task')
  }

  const data = {
    Name: options.name,
    Project: options.projectRef,
    WorkProduct: options.artifactRef,
    State: options.state || 'Defined'
  }

  if (options.userRef) {
    data.Owner = options.userRef
  }

  if (options.estimate) {
    data.Estimate = options.estimate
  }

  if (options.actuals) {
    data.Actuals = options.actuals
  }

  return rally({
    apiKey: conf.get('apiKey')
  })
  .create({
    type: 'task',
    data,
    fetch: options.fetch || ['FormattedID', 'Name'],
    requestOptions: {}
  })
}
