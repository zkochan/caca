#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
const openStory = require('../lib/open-story')
const currentStory = require('current-story')
const Configstore = require('configstore')
const inquirer = require('inquirer')
const conf = new Configstore('ca')
const promtForArtifactId = require('../lib/promt-for-artifact-id')
const updateArtifact = require('../lib/update-artifact')
const getBacklogItemUrl = require('../lib/get-backlog-item-url')
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
  .command('settings')
  .description('Sets the CA API key and current project')
  .action(apiKey => {
    inquirer.prompt({
      type: 'input',
      name: 'apiKey',
      message: 'Your CA API key:',
      default: conf.get('apiKey') || '',
      validate: value => {
        return value.trim() ? true : 'Please enter a valid API key'
      }
    }).then(answer => {
      conf.set('apiKey', answer.apiKey)
      return getArtifact({
        type: 'Project'
      })
    }).then(projects => {
      return inquirer.prompt({
        type: 'list',
        name: 'project',
        message: 'Select your project:',
        choices: projects.Results.map(p => {
          return {
            name: p._refObjectName,
            value: p._ref
          }
        })
      })
    }).then((answer) => {
      conf.set('project', answer.project)
      console.log('Thank you. Settings were successfully updated')
    })
  })

program
  .command('open')
  .description('Opens the specified defect or story')
  .option('-i, --interactive', 'Enables UI to enter custom item ID')
  .action((cmd) => {
    const action = cmd.interactive
      ? inquirer.prompt([promtForArtifactId()]).then(answers => answers.id)
      : currentStory()
    action.then(id => openStory(id))
  })

program
    .command('skype')
    .description('Prepares skype message for you')
    .option('-i, --interactive', 'Enables UI to enter custom item ID')
    .action(cmd => {
      let artifact
      let isDefect
      let intent
      const action = cmd.interactive
        ? inquirer.prompt([promtForArtifactId()]).then(answers => answers.id)
        : currentStory()

      action.then(id => {
        isDefect = id.substr(0, 2).toUpperCase() === 'DE'
        return getArtifact({
          type: isDefect ? 'defect' : 'hierarchicalrequirement',
          query: queryUtils.where('FormattedID', '=', id),
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
          const url = getBacklogItemUrl(artifact)
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
      let currentStoryFormattedId
      let iteration
      let iterationArtifacts
      const date = new Date().toISOString()
      const project = conf.get('project')
      if (!project) {
        const errMsg = `Please run ${chalk.bgGreen('ca settings')} and select the project`
        console.log(`${chalk.bgRed(errMsg)}`)
        process.exit(1)
      }

      Promise.all([
        currentStory(),
        getArtifact({
          type: 'Iteration',
          query: queryUtils
                  .where('StartDate', '<=', date)
                  .and('EndDate', '>=', date)
                  .and('Project', '=', project)
        })
      ]).then(values => {
        iteration = values[1].Results[0]
        currentStoryFormattedId = values[0]
        console.log(`${iteration.Project.Name} ${chalk.bgGreen(iteration.Name)}`)
        return getArtifact({
          type: 'SchedulableArtifact',
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
        const defaultItem = iterationArtifacts.find(a => { return a.FormattedID === currentStoryFormattedId })
        return inquirer.prompt([
          {
            type: 'list',
            name: 'ref',
            message: 'Item:',
            default: defaultItem ? defaultItem._ref : '',
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

program
  .command('grab')
  .description('Puts the story into the current iteration')
  .option('-i, --interactive', 'Enables UI to enter custom item ID')
  .action((cmd) => {
    const project = conf.get('project')
    let backlogItem
    let iteration
    if (!project) {
      const errMsg = `Please run ${chalk.bgGreen('ca settings')} and select the project`
      console.log(`${chalk.bgRed(errMsg)}`)
      process.exit(1)
    }

    const action = cmd.interactive
      ? inquirer.prompt([promtForArtifactId()]).then(answers => answers.id)
      : currentStory()

    action.then(id => {
      const isDefect = id.substr(0, 2).toUpperCase() === 'DE'
      return getArtifact({
        type: isDefect ? 'defect' : 'hierarchicalrequirement',
        query: queryUtils.where('FormattedID', '=', id),
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
    }).then(_backlogItems => {
      backlogItem = _backlogItems.Results[0]
      const date = new Date().toISOString()

      return getArtifact({
        type: 'Iteration',
        query: queryUtils
                .where('StartDate', '<=', date)
                .and('EndDate', '>=', date)
                .and('Project', '=', project)
      })
    }).then(iterationRes => {
      iteration = iterationRes.Results[0]
      return updateArtifact({
        ref: backlogItem._ref,
        data: {
          Iteration: iteration._ref
        }
      })
    }).then(data => {
      const url = getBacklogItemUrl(backlogItem)
      console.log(`${chalk.bgGreen(data.Object.FormattedID, '.', data.Object.Name)} added to the ${chalk.bgBlue(iteration.Name)}. \nDetails: ${url}`)
    })
  })

program.parse(process.argv)
