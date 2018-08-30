/* globals describe, it, describe, afterEach */
import { expect } from 'chai'
import et from 'elementtree'
const fs = require('fs')
const path = require('path')
const separator = path.sep

const CordovaConfigWebpackPlugin = require('./../lib/index')

const MockCompiler = {
  plugin: (signal, cb) => {
    'use strict'
    cb()
  },
  context: './test/helper'
}

const parseFile = (filepath = path.resolve(MockCompiler.context, 'config.xml')) => {
  return new et.ElementTree(et.XML(fs.readFileSync(filepath, 'utf-8').replace(/^\uFEFF/, '')))
}

const copyFileToTest = (filepath = `${MockCompiler.context}${separator}config.xml`) => {
  const data = fs.readFileSync(`${MockCompiler.context}${separator}test-config.xml`, 'utf-8')
  fs.writeFileSync(filepath, data)
}

const removeFileToTest = (filepath = `${MockCompiler.context}${separator}config.xml`) => {
  fs.unlinkSync(filepath)
}

describe('CordovaConfigWebpackPlugin specs: ', () => {
  'use strict'
  afterEach(() => {
    removeFileToTest()
  })
  beforeEach(() => {
    copyFileToTest()
  })
  it('Should modify content field in config.xml', () => {
    const fakeOptions = {
      content: {
        src: 'fake.html'
      },
      widget: {
        version: '1.0.0'
      },
      author: {
        email: 'fake@fake.com'
      },
      access: {
        origin: 'fakeorigin'
      }
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(fakeOptions)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(parseFile().getroot().attrib.version).to.equal(fakeOptions.widget.version)
    expect(parseFile().find('content[@src]').attrib.src).to.equal(fakeOptions.content.src)
    expect(parseFile().find('author[@email]').attrib.email).to.equal(fakeOptions.author.email)
    expect(parseFile().find('access[@origin]').attrib.origin).to.equal(fakeOptions.access.origin)
  })

  it('Should launch error if field not found in config.xml', () => {
    const fakeOptions = {
      fake: {
        origin: 'fakeorigin'
      }
    }
    let err = false
    try {
      const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(fakeOptions)
      cordovaConfigWebpackPlugin.apply(MockCompiler)
    } catch (e) {
      err = true
    }
    expect(err).to.equal(true)
  })

  it('Should replace text-only elements using element\'s name', () => {
    const multiple = {
      name: 'Custom Content',
      description: 'Custom Content',
      a_number: 999
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(multiple)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(parseFile().find('name').text).to.equal(multiple.description)
    expect(parseFile().find('description').text).to.equal(multiple.description)
    expect(parseFile().find('a_number').text).to.equal(`${multiple.a_number}`)
  })

  it('Should change multiple elements', () => {
    const author = {
      email: 'fake@fake.invalid',
      repo: 'https://fake.com/fake'
    }
    const fakeOptions = {
      author: {
        email: author.email,
        href: author.repo
      }
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(fakeOptions)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(parseFile().find('author[@email]').attrib.email).to.equal(fakeOptions.author.email)
    expect(parseFile().find('author[@href]').attrib.href).to.equal(fakeOptions.author.href)
  })

  it('Should change inner text of complex element', () => {
    const author = {
      innerText: 'Fake Team',
      email: 'fake@fake.invalid',
      repo: 'https://fake.com/fake'
    }
    const fakeOptions = {
      author: {
        _: author.innerText,
        email: author.email,
        href: author.repo
      }
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(fakeOptions)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(parseFile().find('author').text).to.equal(fakeOptions.author._)
    expect(parseFile().find('author[@email]').attrib.email).to.equal(fakeOptions.author.email)
    expect(parseFile().find('author[@href]').attrib.href).to.equal(fakeOptions.author.href)
  })

  it('Should read from the input file specified relative to webpack config context path', () => {
    const inputFolder = 'in'
    const inputFile = 'template-config.xml'
    const filepath = `${MockCompiler.context}${separator}${inputFolder}${separator}${inputFile}`
    const folderpath = path.resolve(MockCompiler.context, inputFolder)
    // Make a copy of the usual test input file using a different path/name
    if (!fs.existsSync(folderpath)) {
      fs.mkdirSync(folderpath)
    }
    copyFileToTest(filepath)
    const options = {
      _: {
        inputPath: `${inputFolder}${separator}${inputFile}`
      }
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(options)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    // File contents should be equal since nothing was configured to be changed
    expect(fs.readFileSync(filepath, 'utf-8')).to.equal(fs.readFileSync(`${MockCompiler.context}${separator}config.xml`, 'utf-8'))
    // Clean up copied file and folder
    removeFileToTest(filepath)
    fs.rmdirSync(folderpath)
  })

  it('Should write to the output file specified relative to webpack config context path', () => {
    const outputFolder = 'out'
    const outputFile = 'cordova-config.xml'
    const filepath = `${MockCompiler.context}${separator}${outputFolder}${separator}${outputFile}`
    const folderpath = path.resolve(MockCompiler.context, outputFolder)
    if (!fs.existsSync(folderpath)) {
      fs.mkdirSync(folderpath)
    }
    const options = {
      _: {
        outputPath: `${outputFolder}${separator}${outputFile}`
      }
    }
    const cordovaConfigWebpackPlugin = CordovaConfigWebpackPlugin(options)
    cordovaConfigWebpackPlugin.apply(MockCompiler)
    expect(parseFile(filepath).find('name').text).to.equal('HelloWorld')
    // Clean up output file and folder
    removeFileToTest(filepath)
    fs.rmdirSync(folderpath)
  })
})
