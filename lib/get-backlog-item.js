'use strict'
const rally = require('rally')
const queryUtils = rally.util.query
const getArtifact = require('./get-artifact')

module.exports = (formattedId) => {
  const isDefect = formattedId.substr(0, 2).toUpperCase() === 'DE'

  return getArtifact({
    type: isDefect ? 'defect' : 'hierarchicalrequirement',
    fetch: ['Name', 'ObjectID', 'FormattedID', 'Project', 'Tasks', 'TeamMembers'],
    query: queryUtils.where('FormattedID', '=', formattedId)
  })
  .then((result) => {
    if (result.Results.length > 1) {
      console.log('More than 1 result has been found by your request')
      return
    }

    if (result.Results.length === 0) {
      console.log('No story/defect has been found by your request')
      return
    }

    return Promise.resolve(result.Results[0])
  })
}
