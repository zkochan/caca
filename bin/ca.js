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

program.parse(process.argv)
