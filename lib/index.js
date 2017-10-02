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
      var filename = path.resolve(compiler.context, 'config.xml');
      var xml = parseXml(filename);
      if (options) {
        Object.keys(options).forEach(function (tag) {
          if (_typeof(options[tag]) !== 'object') {
            throw new Error('Not config options defined correctly!! See: https://github.com/michogar/CordovaConfigWebpackPlugin/blob/master/README.md');
          } else {
            var FIRST = 0;
            var attr = Object.keys(options[tag])[FIRST];
            var value = options[tag][attr];
            var toFind = tag + '[@' + attr + ']';
            if (tag === 'widget') {
              xml.getroot().attrib[attr] = value;
            } else {
              var contentTag = xml.find(toFind);
              console.log(contentTag);
              if (contentTag) {
                contentTag.attrib[attr] = value;
              } else {
                throw new Error('No tag: ' + tag + ' found!!');
              }
            }
          }
        });
      } else {
        throw new Error('Not config options defined!!');
      }
      fs.writeFileSync(filename, xml.write({
        indent: 4
      }), 'utf-8');
    });
  };
  return {
    apply: apply
  };
}

module.exports = CordovaConfigWebpackPlugin;