'use strict'

module.exports = function (options) {
  const defaults = options || {}
  return [
    {
      type: 'input',
      name: 'name',
      message: 'Task name:',
      default: defaults.name || 'Dev',
      validate: value => {
        return value.trim() ? true : 'Please enter a valid task name'
      }
    },
    {
      type: 'list',
      name: 'owner',
      message: 'Task owner:',
      default: defaults.owner || defaults.users.indexOf(defaults.users.find(u => u.EmailAddress === defaults.email)),
      choices: defaults.users.map(u => {
        return {
          name: u._refObjectName,
          value: u._ref,
          checked: u.EmailAddress === defaults.email
        }
      })
    },
    {
      type: 'list',
      name: 'state',
      message: 'Task state:',
      choices: ['Defined', 'In-Progress', 'Completed'],
      default: defaults.stateIndex || 0
    },
    {
      type: 'input',
      name: 'estimate',
      message: 'Task estimate:',
      default: defaults.estimate || 0.5,
      filter: function (value) {
        return parseFloat(value) || 0
      }
    },
    {
      type: 'input',
      name: 'actuals',
      message: 'Task actuals:',
      default: defaults.actuals || 0,
      filter: function (value) {
        return parseFloat(value) || 0
      }
    }
  ]
}
