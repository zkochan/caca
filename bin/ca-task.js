'use strict'
const program = require('commander')
const currentStory = require('current-story')
const getEmail = require('git-user-email')
const _ = require('lodash')
const repoName = require('git-repo-name')
const rally = require('rally')
const printTasks = require('../lib/print-tasks')
const getBacklogItem = require('../lib/get-backlog-item')
const createTask = require('../lib/create-task')
const getState = require('../lib/task-state-mapper')
const getUserByEmail = require('../lib/get-user-by-email')
const updateTask = require('../lib/update-task')
const getArtifact = require('../lib/get-artifact')

program
  .command('list [formattedId]')
  .alias('ls')
  .description('Prints the list of tasks of the story/defect')
  .action(formattedId => printTasks(formattedId))

program
  .command('new [artifactId] [taskName] [state] [estimate] [actuals]')
  .description('Adds a new task to a story/defect')
  .action((artifactId, taskName, state, estimate, actuals) => {
    const create = function (artifact, user) {
      const data = {
        name: taskName,
        projectRef: artifact.Project._ref,
        artifactRef: artifact._ref,
        fetch: ['FormattedID', 'Name']
      }
      if (user && user._ref) {
        data.userRef = user._ref
      }
      if (state && typeof state === 'string') {
        data.state = getState(state)
      }
      if (estimate) {
        data.estimate = parseFloat(estimate)
      }
      if (actuals) {
        data.actuals = parseFloat(actuals)
      }
      createTask(data).then((taskInfo) => {
        console.log('New task:')
        console.log(taskInfo.Object.FormattedID + '. ' + taskInfo.Object.Name)
      })
      .catch(err => console.log(err))
    }

    getBacklogItem(artifactId).then((artifact) => {
      let email
      try {
        email = getEmail()
      } catch (err) {
        console.log('Failed to get current user email. Create a task without the owner')
        create(artifact)
      }

      getUserByEmail(email).then((user) => {
        create(artifact, user)
      })
    })
  })

program
  .command('new-merge [taskPrefix]')
  .description('Adds a new merge task to a story/defect')
  .action(taskPrefix => {
    const email = getEmail()

    function createMergeTask (artifact, name) {
      getUserByEmail(email).then((user) => {
        return createTask({
          name: name,
          projectRef: artifact.Project._ref,
          artifactRef: artifact._ref,
          userRef: user._ref,
          fetch: ['FormattedID', 'Name']
        })
      }).then((taskInfo) => {
        console.log('Merge Task created for you to not forget:')
        console.log(taskInfo.Object.FormattedID + '. ' + taskInfo.Object.Name)
      })
    }

    const taskName = taskPrefix + ' ' + repoName.sync()

    currentStory().then((itemId) => {
      if (!itemId) {
        console.log('item not found. terminating')
        return
      }
      return getBacklogItem(itemId).then((artifact) => {
        printTasks().then(tasks => {
          if (_.find(tasks, ['Name', taskName])) {
            console.log('Merge task already exists. Lucky you!')
            return
          }
          createMergeTask(artifact, taskName)
        })
      })
    })
  })

program
  .command('update [formattedId] [status] [actuals]')
  .description('Updates status and actuals of the task')
  .action((formattedId, state, actuals) => {
    const queryUtils = rally.util.query

    getArtifact({
      type: 'task',
      query: queryUtils.where('FormattedID', '=', formattedId)
    }).then(tasks => {
      let data = {
        ref: tasks.Results[0]._ref
      }
      if (state && typeof state === 'string') {
        data.state = getState(state)
      }
      if (actuals) {
        data.actuals = parseFloat(actuals)
      }
      updateTask(data)
    })
  })

program.parse(process.argv)
