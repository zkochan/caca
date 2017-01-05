'use strict'
const Table = require('cli-table2')
const getBacklogItem = require('./get-backlog-item')
const getArtifact = require('./get-artifact')
const currentStory = require('current-story')
const _ = require('lodash')
const TASK_NAME_MAX_LENGTH = 15

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
      const fields = ['FormattedID', 'Name', 'State', 'Actuals', 'Owner']
      let table = new Table({head: fields})
      tasksInfo.Results.forEach((task) => {
        const simplifiedTask = _.pick(task, fields)
        simplifiedTask.Owner = simplifiedTask.Owner ? simplifiedTask.Owner._refObjectName : simplifiedTask.Owner.DisplayName || ''
        simplifiedTask.Actuals = simplifiedTask.Actuals || ''
        simplifiedTask.Name = simplifiedTask.Name.length > TASK_NAME_MAX_LENGTH ? (simplifiedTask.Name.substring(0, TASK_NAME_MAX_LENGTH) + '...') : simplifiedTask.Name
        table.push(Object.keys(simplifiedTask).map(key => simplifiedTask[key]))
      })

      console.log(table.toString())
      return tasksInfo.Results
    })
    .catch(e => console.log(e))
}
