# CordovaConfigWebpackPlugin

## A plugin to modify config.xml from Webpack

### Getting Started

Install the plugin:

    npm i -D cordova-webpack-config-plugin
    
CordovaConfigWebpackPlugin will look for `config.xml` into the `context` path from `webpack`.

Replace values passed as object into `config.xml` values. Launchs exception if tag passed isn't 
into the `config.xml`
  
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
    
    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                autor: {
                    email: "fake@fake.invalid",
                    href: "http://fake.invalid"
                }           
            })
        ]
    }
    
    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                name: "fake name"          
            })
        ]
    }
    
### RoadMap
* Add manage of `preferences`
                
![](https://www.gnu.org/graphics/gplv3-88x31.png)
