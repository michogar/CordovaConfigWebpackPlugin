/* globals describe, it, describe, afterEach */
import { expect } from 'chai'
import et from 'elementtree'
const fs = require('fs')
const path = require('path')

const CordovaConfigWebpackPlugin = require('./../lib/index')

const MockCompiler = {
  plugin: (signal, cb) => {
    'use strict'
    cb()
  },
  context: './test/helper'
}

const parseXml = (filename) => {
  return new et.ElementTree(et.XML(fs.readFileSync(filename, 'utf-8').replace(/^\uFEFF/, '')))
}

const readXML = () => {
  'use strict'
  const filename = path.resolve(MockCompiler.context, 'config.xml')
  let configXml = parseXml(filename)
  return configXml.find('content[@src]')
}

describe('CordovaConfigWebpackPlugin', () => {
  'use strict'
  afterEach(() => {
    const START_PAGE = 'index.html'
    const filename = path.resolve(MockCompiler.context, 'config.xml')
    let configXml = parseXml(filename)
    let contentTag = configXml.find('content[@src]')
    if (contentTag) {
      contentTag.attrib.src = START_PAGE
    }
    fs.writeFileSync(filename, configXml.write({
      indent: 4
    }), 'utf-8')
  })
  it('Should modify content field in config.xml', () => {
    const fakeOptions = {
      page: 'fake.html'
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(fakeOptions)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(readXML().attrib.src).to.equal(fakeOptions.page)
  })
  it('Should run without options set', () => {
    const fakeOptions = {
      page: 'fake.html'
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin()
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(readXML().attrib.src).to.equal(fakeOptions.page)
  })
})
