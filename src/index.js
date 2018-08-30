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
    compiler.plugin('done', () => {
      const filename = path.resolve(compiler.context, 'config.xml')
      let xml = parseXml(filename)
      if (options) {
        Object.keys(options).forEach((tag) => {
          const FIRST = 0
          const attr = Object.keys(options[tag])[FIRST]
          if (['string', 'number', 'boolean'].includes(typeof options[tag])) {
            xml.find(tag).text = options[tag]
          } else if (typeof options[tag] === 'object') {
            if (tag === 'widget') {
              xml.getroot().attrib[attr] = options[tag][attr]
            } else {
              Object.keys(options[tag]).forEach((childTag) => {
                const isInnerTextReplacement = childTag === '_'
                const toFind = isInnerTextReplacement ? `${tag}` : `${tag}[@${childTag}]`
                let contentTag = xml.find(toFind)
                if (contentTag) {
                  if (isInnerTextReplacement) {
                    contentTag.text = options[tag][childTag]
                  }
                  contentTag.attrib[childTag] = options[tag][childTag]
                } else {
                  throw new Error(`No tag named '${childTag}' found!!`)
                }
              })
            }
          }
        })
      } else {
        throw new Error(`Not config options defined!!`)
      }
      fs.writeFileSync(filename, xml.write({
        indent: 4
      }), 'utf-8')
    })
  }
  return {
    apply
  }
}

module.exports = CordovaConfigWebpackPlugin
