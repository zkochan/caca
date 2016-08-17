'use strict'

const console = require('better-console')
const getBacklogItem = require('./get-backlog-item')
const getArtifact = require('./get-artifact')
const currentStory = require('current-story')
const _ = require('lodash')
const object = require('lodash/fp/object')
const rally = require('rally')
const queryUtils = rally.util.query

module.exports = (formattedId) => {
    return currentStory().then(itemId => getBacklogItem(formattedId || itemId))
        .catch( e => console.log(e))
        .then( artifact => {
            console.log(artifact.FormattedID + '. ' + artifact.Name);
            return getArtifact({
                ref: artifact.Tasks._ref,
                order: 'DragAndDropRank',
                fetch: ['FormattedID', 'Name', 'Owner', 'UserName', 'DisplayName', 'Actuals', 'State', 'DragAndDropRank'],
            })
        })
        .catch( e => console.log(e))
        .then( tasksInfo => {
            let tasksLog = tasksInfo.Results.map((task) => {
                let simplifiedTask = _.pick(task, ['FormattedID', 'Name', 'State', 'Actuals','Owner']);
                simplifiedTask.Owner = simplifiedTask.Owner ? simplifiedTask.Owner.DisplayName : '';
                simplifiedTask.Actuals = simplifiedTask.Actuals || '';
                return simplifiedTask;
            })
            console.table(tasksLog)
            return tasksInfo.Results;
        })
        .catch( e => console.log(e))
}