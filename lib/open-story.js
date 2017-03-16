'use strict'
const open = require('open')
const getBacklogItem = require('./get-backlog-item')
const getBacklogItemUrl = require('./get-backlog-item-url')

module.exports = (id) => {
  getBacklogItem(id)
    .then(artifact => {
      const url = getBacklogItemUrl(artifact)

      console.log('opening: ' + url)
      open(url)
    })
    .catch(err => console.log(err))
}
