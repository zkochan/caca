'use strict'
const open = require('open')
const getBacklogItem = require('./get-backlog-item')

module.exports = (id) => {
  getBacklogItem(id)
    .then(artifact => {
      let isDefect = id.substr(0, 2).toUpperCase() === 'DE'
      let url = 'https://rally1.rallydev.com/#/' + artifact.Project.ObjectID +
        '/detail/' + (isDefect ? 'defect' : 'userstory') +
        '/' + artifact.ObjectID

      console.log('opening: ' + url)
      open(url)
    })
    .catch(err => console.log(err))
}
