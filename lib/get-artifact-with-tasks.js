'use strict'
const getBacklogItem = require('./get-backlog-item')
const getArtifact = require('./get-artifact')

module.exports = (formattedId) => {
  let artifact
  return getBacklogItem(formattedId)
    .then(_artifact => {
      artifact = _artifact
      return getArtifact({
        ref: artifact.Tasks._ref,
        order: 'DragAndDropRank',
        fetch: [
          'FormattedID',
          'Name',
          'Owner',
          'UserName',
          'DisplayName',
          'Estimate',
          'Actuals',
          'State',
          'DragAndDropRank'
        ]
      })
      .then(tasksInfo => {
        return Object.assign({tasks: tasksInfo.Results}, artifact)
      })
    })
}
