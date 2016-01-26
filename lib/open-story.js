'use strict'
const rally = require('rally')
const queryUtils = rally.util.query
const open = require('open')
const Configstore = require('configstore')
const conf = new Configstore('ca')

function getArtifact(formattedId) {
  let restApi = rally({
    apiKey: conf.get('apiKey'),
  })
  let isDefect = formattedId.substr(0, 2).toUpperCase() === 'DE'

  return restApi
    .query({
      type: isDefect ? 'defect' : 'hierarchicalrequirement',
      fetch: ['Name', 'ObjectID', 'Project'],
      query: queryUtils.where('FormattedID', '=', formattedId),
    })
    .then(result => {
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

module.exports = (id) => {
  getArtifact(id)
    .then(artifact => {
      let isDefect = id.substr(0, 2).toUpperCase() === 'DE'
      let url = 'https://rally1.rallydev.com/#/' + artifact.Project.ObjectID +
        '/detail/' + (isDefect ? 'defect' : 'userstory') +
        '/' + artifact.ObjectID

      console.log('opening: ' + url)
      open(url)
    })
    .catch(err => console.log(err))
}
