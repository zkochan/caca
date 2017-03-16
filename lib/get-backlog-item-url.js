'use strict'

module.exports = artifact => {
  const typeSlug = artifact._type === 'Defect' ? 'defect' : 'userstory'
  return `https://rally1.rallydev.com/#/${artifact.Project.ObjectID}/detail/${typeSlug}/${artifact.ObjectID}`
}
