'use strict'
module.exports = (state) => {
  switch (state.toLowerCase()) {
    case 'p':
      return 'In-Progress'
    case 'c':
      return 'Completed'
    case 'd':
    default:
      return 'Defined'
  }
}
