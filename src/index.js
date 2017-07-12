const et = require('elementtree')
const fs = require('fs')
const path = require('path')

const parseXml = (filename) => {
  return new et.ElementTree(et.XML(fs.readFileSync(filename, 'utf-8').replace(/^\uFEFF/, '')))
}

function CordovaConfigWebpackPlugin (options) {
  'use strict'

  const apply = (compiler) => {
    const START_PAGE = 'index.html'
    compiler.plugin('done', () => {
      const filename = path.resolve(compiler.context, 'config.xml')
      let configXml = parseXml(filename)
      let contentTag = configXml.find('content[@src]')
      if (contentTag) {
        contentTag.attrib.src = (options.page) ? options.page : START_PAGE
      }
      fs.writeFileSync(filename, configXml.write({
        indent: 4
      }), 'utf-8')
    })
  }
  return {
    apply
  }
}

module.exports = CordovaConfigWebpackPlugin
