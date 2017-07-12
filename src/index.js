function CordovaConfigWebpackPlugin () {

}

CordovaConfigWebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function() {
    console.log('Hello World!');
  });
}
