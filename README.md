# CordovaConfigWebpackPlugin

## A plugin to modify config.xml from Webpack

### Getting Started

Install the plugin:

    npm i -D cordova-webpack-config-plugin
    
CordovaConfigWebpackPlugin will look for `config.xml` into the `context` path from `webpack`
  
### Usage

    new CordovaConfigWebpackPlugin({
        page: '<Value which will be replaced config.xml'
    })

| Name | Required | Default | Details |
| ---- | -------- | ------- | ------- |
| **page** | Optional | "index.html" | "http://localhost:8080" | 

### Examples

    var CordovaConfigWebpackPlugin = require('cordova-webpack-config-plugin');
    var path = require('path');
    
    module.exports = {
        context: path.join(__dirname, 'app'),
        plugins: [
            new CordovaConfigWebpackPlugin({
                page: "http://localhost:8080"           
            })
        ]
    }
                
![](https://www.gnu.org/graphics/gplv3-88x31.png)
