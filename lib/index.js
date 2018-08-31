'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var et = require('elementtree');
var fs = require('fs');
var path = require('path');

var parseXml = function parseXml(filename) {
  return new et.ElementTree(et.XML(fs.readFileSync(filename, 'utf-8').replace(/^\uFEFF/, '')));
};

function CordovaConfigWebpackPlugin(options) {
  'use strict';

  var apply = function apply(compiler) {
    compiler.plugin('done', function () {
      if (options) {
        var inputFileName = path.resolve(compiler.context, options._ && options._.inputPath ? options._.inputPath : 'config.xml');
        var xml = parseXml(inputFileName);
        var xmlRoot = xml.getroot();
        Object.keys(options).forEach(function (tag) {
          if (tag !== '_') {
            if (['string', 'number', 'boolean'].includes(_typeof(options[tag]))) {
              xml.find(tag).text = options[tag];
            } else if (_typeof(options[tag]) === 'object') {
              Object.keys(options[tag]).forEach(function (childTag) {
                var isInnerTextReplacement = childTag === '_';
                var toFind = isInnerTextReplacement ? '' + tag : tag + '[@' + childTag + ']';
                var contentTag = xmlRoot.tag === tag ? xmlRoot : xml.find(toFind);
                if (contentTag) {
                  if (isInnerTextReplacement) {
                    contentTag.text = options[tag][childTag];
                  }
                  contentTag.attrib[childTag] = options[tag][childTag];
                } else {
                  throw new Error('No tag named \'' + childTag + '\' found!!');
                }
              });
            }
          }
        });
        var outputFileName = options._ && options._.outputPath ? path.resolve(compiler.context, options._.outputPath) : inputFileName;
        fs.writeFileSync(outputFileName, xml.write({
          indent: 4
        }), 'utf-8');
      } else {
        throw new Error('No config options defined!!');
      }
    });
  };
  return {
    apply: apply
  };
}

module.exports = CordovaConfigWebpackPlugin;