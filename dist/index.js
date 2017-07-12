'use strict';

var et = require('elementtree');
var fs = require('fs');
var path = require('path');

var parseXml = function parseXml(filename) {
  return new et.ElementTree(et.XML(fs.readFileSync(filename, 'utf-8').replace(/^\uFEFF/, '')));
};

function CordovaConfigWebpackPlugin(options) {
  'use strict';

  var apply = function apply(compiler) {
    var START_PAGE = 'index.html';
    compiler.plugin('done', function () {
      var filename = path.resolve(compiler.context, 'config.xml');
      var configXml = parseXml(filename);
      var contentTag = configXml.find('content[@src]');
      if (contentTag) {
        contentTag.attrib.src = options.page ? options.page : START_PAGE;
      }
      fs.writeFileSync(filename, configXml.write({
        indent: 4
      }), 'utf-8');
    });
  };
  return {
    apply: apply
  };
}

module.exports = CordovaConfigWebpackPlugin;