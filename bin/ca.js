#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
const openStory = require('../lib/open-story')
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
  .command('new task [artifactId] [taskName]')
  .description('Adds a new task to a story/defect')
  .action((artifactId, taskName) => {
  })

program.parse(process.argv)
