#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
const openStory = require('../lib/open-story')
const currentStory = require('current-story')
const getBacklogItem = require('../lib/get-backlog-item')
const Configstore = require('configstore')
const inquirer = require('inquirer')
const conf = new Configstore('ca')
const promtForArtifactId = require('../lib/promt-for-artifact-id')
const rally = require('rally')
const getArtifact = require('../lib/get-artifact')
const chalk = require('chalk')
const ncp = require('copy-paste')
const queryUtils = rally.util.query
require('loud-rejection')()

updateNotifier({ pkg }).notify({ defer: false })

program
  .version(pkg.version)
  .command('task', 'do something with tasks')

program
  .command('api [apiKey]')
  .usage('[options]')
  .description('Sets the CA API key')
  .action(apiKey => {
    conf.set('apiKey', apiKey)
  })

program
  .command('open')
  .description('Opens the specified defect or story')
  .action(() => {
    currentStory().then(id => {
      return inquirer.prompt([promtForArtifactId(id)])
    }).then(answers => {
      answers.id && openStory(answers.id)
    })
  })

program
    .command('skype')
    .description('Prepares skype message for you')
    .action(() => {
      let artifact
      let isDefect
      let intent
      currentStory().then((id) => {
        return inquirer.prompt([promtForArtifactId(id)])
      }).then(answers => {
        isDefect = answers.id.substr(0, 2).toUpperCase() === 'DE'
        return getArtifact({
          type: isDefect ? 'defect' : 'hierarchicalrequirement',
          query: queryUtils.where('FormattedID', '=', answers.id),
          fetch: [
            'Name',
            'FormattedID',
            'Project',
            'ObjectID',
            'Iteration',
            'FormattedID',
            'c_BranchName'
          ]
        })
      }).then(_artifact => {
        artifact = _artifact.Results[0]
        return inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Intent:',
            default: 'CR',
            choices: [{
              name: 'Ready for CR',
              value: 'CR'
            },
            {
              name: 'Ready for QA',
              value: 'QA'
            },
            {
              name: 'Added to the iteration',
              value: 'Iteration'
            }]
          }
        ]).then(choice => {
          intent = choice.action
          if (intent !== 'QA') {
            return
          }
          return inquirer.prompt([
            {
              type: 'text',
              name: 'server',
              message: 'Server:',
              default: 'SEO1'
            }])
        }).then(serverChoice => {
          const url = 'https://rally1.rallydev.com/#/' + artifact.Project.ObjectID +
                '/detail/' + (isDefect ? 'defect' : 'userstory') +
                '/' + artifact.ObjectID
          let message = `(*) ${artifact.FormattedID}. ${artifact.Name} \n`
          switch (intent) {
            case 'CR':
              let CR = (/<a.*>(.*)<\/a>/gi).exec(artifact.c_BranchName)
              message += `is ready for CR: ${CR[1]} (*)\nDetails: ${url}`
              break
            case 'QA':
              message += `is ready for QA on ${serverChoice.server}.(*)\nDetails: ${url}`
              break
            case 'Iteration':
              message += `added to ${artifact.Iteration.Name}.(*)\nDetails: ${url}`
              break
          }
          ncp.copy(message, function () {
            console.log(`This message was copied to the clipboard: \n${message}`)
          })
        })
      })
    })

program
    .command('iteration')
    .description('Opens the list of stories in current iteration')
    .action(() => {
      let artifact
      let iteration
      let iterationArtifacts
      var date = new Date().toISOString()

      Promise.all([currentStory()]).then((values) => {
        return inquirer.prompt([promtForArtifactId(values[0])])
      }).then(answers => {
        return getBacklogItem(answers.id)
      }).then(_artifact => {
        artifact = _artifact
        return getArtifact({
          type: 'Iteration',
          query: queryUtils
                .where('StartDate', '<=', date)
                .and('EndDate', '>=', date)
                .and('Project', '=', artifact.Project)
        })
      }).then(iterationResults => {
        iteration = iterationResults.Results[0]
        console.log(`${iteration.Project.Name} ${chalk.bgGreen(iteration.Name)}`)
        return getArtifact({
          type: 'hierarchicalrequirement',
          query: queryUtils.where('Iteration.ObjectID', '=', iteration.ObjectID),
          fetch: [
            'Name',
            'FormattedID',
            'ObjectID',
            'FormattedID',
            'Project',
            'Tasks',
            'ScheduleState'
          ]
        })
      }).then(res => {
        iterationArtifacts = res.Results
        return inquirer.prompt([
          {
            type: 'list',
            name: 'ref',
            message: 'Item:',
            default: iterationArtifacts.find(a => { return a.FormattedID === artifact.FormattedID }),
            choices: iterationArtifacts.map(a => {
              return {
                name: `${a.FormattedID}. ${a.Name}`,
                value: a._ref
              }
            })
          }])
      }).then(choice => {
        const item = iterationArtifacts.find(i => { return i._ref === choice.ref })
        openStory(item.FormattedID)
      })
    })

program.parse(process.argv)
