'use strict'
const expect = require('chai').expect
const caca = require('..')

describe('caca', function() {
  it('should say hello', function(done) {
    expect(caca()).to.equal('Hello, world')
    done()
  })
})
