#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
const openStory = require('../lib/open-story')
const printTasks = require('../lib/print-tasks')
const currentStory = require('current-story')
const Configstore = require('configstore')
const conf = new Configstore('ca')

updateNotifier({ pkg }).notify({ defer: false })

program
  .version(pkg.version)

program
  .command('api [apiKey]')
  .usage('[options]')
  .description('Sets the CA API key')
  .action(apiKey => {
    conf.set('apiKey', apiKey)
  })

program
  .command('open [id]')
  .description('Opens the specified defect or story')
  .action(id => {
    if (!id) {
      currentStory().then(openStory)
      return
    }

    openStory(id)
  })

program
  .command('get-tasks [formattedId]')
  .description('Prints the list of tasks of the story/defect')
  .action(formattedId => printTasks(formattedId))

program
  .command('new-task [artifactId] [taskName] [state] [estimate] [actuals]')
  .description('Adds a new task to a story/defect')
  .action((artifactId, taskName, state, estimate, actuals) => {
      const getBacklogItem = require('../lib/get-backlog-item');
      const createTask = require('../lib/create-task');
      const getState = require('../lib/task-state-mapper');
      let create = function(artifact, user){
          let data = {
              name: taskName,
              projectRef: artifact.Project._ref,
              artifactRef: artifact._ref,
              fetch: ['FormattedID', 'Name']
          }
          if (user && user._ref) {
              data.userRef = user._ref
          }
          if (state && typeof(state) == 'string') {
              data.state = getState(state)
          }
          if (estimate){
              data.estimate = parseFloat(estimate);
          }
          if (actuals){
              data.actuals = parseFloat(actuals);
          }
          createTask(data).then((taskInfo)=>{
              console.log('New task:');
              console.log(taskInfo.Object.FormattedID + '. ' + taskInfo.Object.Name);
          }).catch(err => console.log)
      }
      
      getBacklogItem(artifactId).then((artifact) => {
          const getUserByEmail = require('../lib/get-user-by-email');
          const getEmail = require('git-user-email');
          let email;
          try {
              email = getEmail();
          }
          catch (err) {
              console.log('Failed to get current user email. Create a task without the owner')
              create(artifact)
          }
          
          getUserByEmail(email).then((user)=>{
              create(artifact, user)
          })
      })
  })

program
    .command('new-mergetask [taskPrefix]')
    .description('Adds a new merge task to a story/defect')
    .action(taskPrefix => {
        const getArtifact = require('../lib/get-artifact')
        const getBacklogItem = require('../lib/get-backlog-item')
        const getUserByEmail = require('../lib/get-user-by-email')
        const printTasks = require('../lib/print-tasks')
        const repoName = require('git-repo-name')
        const createTask = require('../lib/create-task')
        const email = require('git-user-email')()
        
        const _ = require('lodash')
        const object = require('lodash/fp/object')

      
        let createMergeTask = (artifact, name) => {
            getUserByEmail(email).then((user)=>{
                return createTask({
                    name: name,
                    projectRef: artifact.Project._ref,
                    artifactRef: artifact._ref,
                    userRef: user._ref,
                    fetch: ['FormattedID', 'Name']
                })
            }).then((taskInfo)=>{
                console.log('Merge Task created for you to not forget:')
                console.log(taskInfo.Object.FormattedID + '. ' + taskInfo.Object.Name)
            })
        }
      
        let taskName = taskPrefix + ' ' + repoName.sync()
      
        currentStory().then((itemId) => {
            if (!itemId) {
                console.log('item not found. terminating');
                return;
            }
            return getBacklogItem(itemId).then((artifact) => {
                printTasks().then(tasks => {
                    if (_.find(tasks, ['Name', taskName])) {
                        console.log('Merge task already exists. Lucky you!')
                        return;
                    }
                    createMergeTask(artifact, taskName)
                });
            })
        })
  })
  
program
    .command('task-update [formattedId] [status] [actuals]')
    .description('Updates status and actuals of the task')
    .action((formattedId, state, actuals) => {
        const getArtifact = require('../lib/get-artifact')
        const rally = require('rally')
        const queryUtils = rally.util.query
        const getState = require('../lib/task-state-mapper')
        const updateTask = require('../lib/update-task')

        getArtifact({
            type: 'task',
            query: queryUtils.where('FormattedID', '=', formattedId)
        }).then(tasks => {
            let data = {
                ref: tasks.Results[0]._ref
            };
            if (state && typeof(state) == 'string') {
                data.state = getState(state)
            }
            if (actuals){
                data.actuals = parseFloat(actuals)
            }
            updateTask(data)
        })
    })

program.parse(process.argv)
