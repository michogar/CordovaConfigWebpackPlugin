/**
 This file is part of CordovaConfigWebpackPlugin.

 CordovaConfigWebpackPlugin is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 CordovaConfigWebpackPlugin is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with CordovaConfigWebpackPlugin.  If not, see <http://www.gnu.org/licenses/>.
 */
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
