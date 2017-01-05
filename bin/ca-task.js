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
const promtForArtifactId = require('../lib/promt-for-artifact-id')
const inquirer = require('inquirer')

program
  .command('list')
  .alias('ls')
  .description('Prints the list of tasks of the story/defect')
  .action(() => {
    currentStory().then(defaultId => {
      return inquirer.prompt([promtForArtifactId(defaultId)])
    }).then(answers => {
      answers.id && printTasks(answers.id)
    }).catch(e => {
      console.log(e)
    })
  })

program
  .command('new')
  .description('Adds a new task to a story/defect')
  .action(() => {
    let artifact
    let email

    Promise.all([currentStory(), getEmail()]).then((values) => {
      email = values[1]
      return inquirer.prompt([promtForArtifactId(values[0])])
    }).then(answers => {
      return getBacklogItem(answers.id)
    }).then(_artifact => {
      artifact = _artifact
      return getArtifact({
        type: 'TeamMembers',
        ref: artifact.Project.TeamMembers._ref,
        fetch: ['UserName', 'FirstName', 'MiddleName', 'LastName', 'DisplayName', 'EmailAddress']
      })
    }).then(usersData => {
      var users = usersData.Results
      return inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Task name:',
          default: 'Dev',
          validate: value => {
            return value.trim() ? true : 'Please enter a valid task name'
          }
        },
        {
          type: 'list',
          name: 'owner',
          message: 'Task owner:',
          default: users.indexOf(users.find(u => u.EmailAddress === email)),
          choices: users.map(u => {
            return {
              name: u._refObjectName,
              value: u._ref,
              checked: u.EmailAddress === email
            }
          })
        },
        {
          type: 'list',
          name: 'state',
          message: 'Task state:',
          choices: ['Defined', 'In-Progress', 'Completed'],
          default: 0
        },
        {
          type: 'input',
          name: 'estimate',
          message: 'Task estimate:',
          default: 0.5,
          filter: function (value) {
            return parseFloat(value) || 0
          }
        },
        {
          type: 'input',
          name: 'actuals',
          message: 'Task actuals:',
          default: 0,
          filter: function (value) {
            return parseFloat(value) || 0
          }
        }
      ])
    }).then(answers => {
      return createTask({
        name: answers.name,
        projectRef: artifact.Project._ref,
        artifactRef: artifact._ref,
        fetch: ['FormattedID', 'Name', 'WorkProduct'],
        userRef: answers.owner,
        state: answers.state,
        estimate: answers.estimate,
        actuals: answers.actuals
      })
    }).then((taskInfo) => {
      printTasks(taskInfo.Object.WorkProduct.FormattedID)
    }).catch(e => {
      console.log(e)
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
