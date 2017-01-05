'use strict'

module.exports = function (defaultId) {
  return {
    type: 'input',
    name: 'id',
    message: 'Please enter story/defect ID:',
    default: defaultId,
    validate: value => {
      return value.trim() ? true : 'Please enter a valid story/defect ID'
    }
  }
}
