#!/usr/bin/env node
'use strict'
const program = require('commander')
const pkg = require('../package')
const updateNotifier = require('update-notifier')
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

program.parse(process.argv)
