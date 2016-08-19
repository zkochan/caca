'use strict'
const console = require('better-console')
const getBacklogItem = require('./get-backlog-item')
const getArtifact = require('./get-artifact')
const currentStory = require('current-story')
const _ = require('lodash')

module.exports = (formattedId) => {
  return currentStory()
    .then(itemId => getBacklogItem(formattedId || itemId))
    .then(artifact => {
      console.log(artifact.FormattedID + '. ' + artifact.Name)
      return getArtifact({
        ref: artifact.Tasks._ref,
        order: 'DragAndDropRank',
        fetch: ['FormattedID', 'Name', 'Owner', 'UserName', 'DisplayName', 'Actuals', 'State', 'DragAndDropRank']
      })
    })
    .then(tasksInfo => {
      const tasksLog = tasksInfo.Results.map((task) => {
        const simplifiedTask = _.pick(task, ['FormattedID', 'Name', 'State', 'Actuals', 'Owner'])
        simplifiedTask.Owner = simplifiedTask.Owner ? simplifiedTask.Owner.DisplayName : ''
        simplifiedTask.Actuals = simplifiedTask.Actuals || ''
        return simplifiedTask
      })
      console.table(tasksLog)
      return tasksInfo.Results
    })
    .catch(e => console.log(e))
}
