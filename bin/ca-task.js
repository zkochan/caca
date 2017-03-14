'use strict'
const program = require('commander')
const currentStory = require('current-story')
const getEmail = require('git-user-email')
const printTasks = require('../lib/print-tasks')
const getBacklogItem = require('../lib/get-backlog-item')
const createTask = require('../lib/create-task')
const updateTask = require('../lib/update-task')
const getArtifact = require('../lib/get-artifact')
const promtForArtifactId = require('../lib/promt-for-artifact-id')
const promtForTaskInfo = require('../lib/promt-for-task-info')
const getArtifactWithTasks = require('../lib/get-artifact-with-tasks')
const inquirer = require('inquirer')
require('loud-rejection')()

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
      return inquirer.prompt(promtForTaskInfo({users: usersData.Results, email: email}))
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
  .command('update')
  .description('Updates status and actuals of the task')
  .action(() => {
    let email
    let artifact
    let users
    let task
    Promise.all([currentStory(), getEmail()]).then((values) => {
      email = values[1]
      return inquirer.prompt([promtForArtifactId(values[0])])
    }).then(answers => {
      return getArtifactWithTasks(answers.id)
    }).then(artifactWithTasks => {
      artifact = artifactWithTasks
      return getArtifact({
        type: 'TeamMembers',
        ref: artifact.Project.TeamMembers._ref,
        fetch: ['UserName', 'FirstName', 'MiddleName', 'LastName', 'DisplayName', 'EmailAddress']
      })
    }).then(usersData => {
      users = usersData.Results
      return inquirer.prompt([{
        type: 'list',
        name: '_ref',
        message: 'Select a task:',
        default: artifact.tasks[0],
        choices: artifact.tasks.map(t => {
          return {
            name: `${t.FormattedID}. ${t.Name} - ${t.Owner.DisplayName}`,
            value: t._ref
          }
        })
      }])
    }).then(taskChoice => {
      task = artifact.tasks.find(t => { return t._ref === taskChoice._ref })
      return inquirer.prompt(promtForTaskInfo({
        users: users,
        email: email,
        name: task.Name,
        owner: users.indexOf(users.find(u => u.EmailAddress === task.Owner.UserName)),
        stateIndex: ['Defined', 'In-Progress', 'Completed'].indexOf(task.State),
        estimate: task.Estimate,
        actuals: task.Actuals
      }))
    }).then(answers => {
      return updateTask({
        ref: task._ref,
        userRef: answers.owner,
        state: answers.state,
        estimate: answers.estimate,
        actuals: answers.actuals
      })
    }).then(info => {
      printTasks(artifact.FormattedID)
    })
  })

program.parse(process.argv)
