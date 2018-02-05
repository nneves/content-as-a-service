/**
 * Module dependencies.
 */

var request = require('request');
var hget = require('hget');
const textract = require('textract');

/**
 * Content service.
 *
 * The service starts, kills or restarts content server
 *
 * The constructor expects a configuration object as parameter, with these properties:
 *   command: Command to start a phantomjs process
 *   path: Destination of temporary images
 *
 * @param {Object} Server configuration
 * @api public
 */
var ContentService = function(config) {
  this.config = config;
}

ContentService.prototype.startService = function() {
  return this;
}

ContentService.prototype.fetchData = function(url, callback) {
  request({
    uri: url,
    timeout: 150000,
    encoding: null
  }, function(error, res, body) {
    if (error) {
      callback(error.code, null);
    } else {
      var contentType = res.headers['content-type'];
      if(contentType === "application/pdf") {
        textract.fromBufferWithMime(contentType, body, function( error, text ) {
          callback(null, text);
        });
        /*
        textract.fromUrl(url, function( error, text ) {
          console.log("ERROR: ", error);
          //console.log(text);
          callback(null, text);
        });
        */
      } else {
        //html = body.replace(/<script(.*?)<\/script>/g, ' ');
        var text = hget(body, {});
        callback(null, text);
      }
    }
  });

}

module.exports = ContentService;
