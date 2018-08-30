# CordovaConfigWebpackPlugin

## A plugin to modify config.xml from Webpack

### Getting Started

Install the plugin:

    npm i -D cordova-webpack-config-plugin

CordovaConfigWebpackPlugin will look for `config.xml` relative to the `context` path from `webpack` configuration.

Replace values passed as an object in `config.xml` values. Throws exception if tag passed isn't
present in the `config.xml` file.

### Usage

    new CordovaConfigWebpackPlugin({
        content: {
            src: "index.html"
        },
        widget: {
            version: "2.0.0"
        }
        ...
    })


### Examples

Given the config.xml sample file:

    <?xml version='1.0' encoding='utf-8'?>
    <widget id="com.example.hello" version="1.0.0">
        <name>HelloWorld</name>
        <description>
            A sample Apache Cordova application that responds to the deviceready event.
        </description>
        <author email="developer@apache.cordova.com" href="http://cordova.io">
            Apache Cordova Team
        </author>
        <content src="index.html" />
        <access origin="*" />
        <a_number>666</a_number>
    </widget>

Replace the `src` attribute of the  `content` element.

    var CordovaConfigWebpackPlugin = require('cordova-webpack-config-plugin');
    var path = require('path');

    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                content: {
                    src: "http://localhost:8080"
                }           
            })
        ]
    }

Replace the `email` and `href` attributes of the `author` element, and replace the `author` element's inner text using "_".

    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                author: {
                    _: "Fake Team",
                    email: "fake@fake.invalid",
                    href: "http://fake.invalid"
                }           
            })
        ]
    }

Replace the inner text of the `name` element which has no attributes.

    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                name: "fake name"          
            })
        ]
    }

### RoadMap
