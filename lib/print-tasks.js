'use strict'
const Table = require('cli-table2')
const currentStory = require('current-story')
const getArtifactWithTasks = require('./get-artifact-with-tasks')
const _ = require('lodash')
const TASK_NAME_MAX_LENGTH = 15

module.exports = (formattedId) => {
  return currentStory()
    .then(itemId => getArtifactWithTasks(formattedId || itemId))
    .then(artifactWithTasks => {
      const fields = ['FormattedID', 'Name', 'State', 'Actuals', 'Owner']
      let table = new Table({head: fields})
      artifactWithTasks.tasks.forEach((task) => {
        const simplifiedTask = _.pick(task, fields)
        simplifiedTask.Owner = simplifiedTask.Owner ? simplifiedTask.Owner._refObjectName : simplifiedTask.Owner.DisplayName || ''
        simplifiedTask.Actuals = simplifiedTask.Actuals || ''
        simplifiedTask.Name = simplifiedTask.Name.length > TASK_NAME_MAX_LENGTH ? (simplifiedTask.Name.substring(0, TASK_NAME_MAX_LENGTH) + '...') : simplifiedTask.Name
        table.push(Object.keys(simplifiedTask).map(key => simplifiedTask[key]))
      })

      console.log(table.toString())
      return artifactWithTasks
    })
    .catch(e => console.log(e))
}
