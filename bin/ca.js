#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
const openStory = require('../lib/open-story')
const currentStory = require('current-story')
const Configstore = require('configstore')
const conf = new Configstore('ca')
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
  .command('open [id]')
  .description('Opens the specified defect or story')
  .action(id => {
    if (!id) {
      currentStory().then(id => {
        if (!id) {
          console.log('Failed to identify the story ID from branch name')
          return
        }
        openStory(id)
      })
      return
    }

    openStory(id)
  })

program.parse(process.argv)
