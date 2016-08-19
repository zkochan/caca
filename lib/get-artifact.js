'use strict'
const rally = require('rally')
const Configstore = require('configstore')
const conf = new Configstore('ca')

module.exports = (options) => {
  const restApi = rally({
    apiKey: conf.get('apiKey')
  })

  let queryParams = {
    fetch: options.fetch || ['Name', 'ObjectID', 'FormattedID', 'Project', 'Tasks'],
    pageSize: options.PageSize || 200
  }

  if (options.type) {
    queryParams.type = options.type
  }

  if (options.query) {
    queryParams.query = options.query
  }

  if (options.ref) {
    queryParams.ref = options.ref
  }

  return restApi.query(queryParams)
}
