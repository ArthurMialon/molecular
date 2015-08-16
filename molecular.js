(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory()); // RequireJs
  } else if (typeof exports === 'object') {
    module.exports = factory(); // NodeJs
  } else {
    root.Molecular = factory(); // Browser
  }
})(this, function () {

  /* ===================================================
  /**
  * Private methods & properties
  */

  /**
  * Parse the response text to Json
  * @param {object} request
  * @return {arry} [result, request]
  */
  var parse = function(req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
    }catch(e) {
      result = req.responseText;
    }

    return [result, req];
  }

  /**
  * Get an Xhr Object
  * @return {object} new Xhr object
  */
  var getXhr = function() {
    try {
      return new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    } catch (e) {
      return false;
    }
  }

  /**
  * Get an hostname and a path from an url
  * @return {object} url infos
  */
  var extractPath = function (url) {
    var host = (url.indexOf("://") > -1)   ? url.split('/')[2].split(':')[0] : url.split('/')[0].split(':')[0];
    var path = (url.indexOf("://") === -1) ? url : url.split("://"+host)[1]

    return {
      host: host,
      path  : path
    }
  };

  /**
  * Format url parameters into string
  * @param {object} query params object
  * @return {string} formatted string
  */
  var formatQuery = function(params){
    if (typeof params !== "object") {
      return "";
    }

    return "?" + Object
      .keys(params)
      .map(function(key){
        return key+"="+params[key]
      })
      .join("&");
  };

  /**
  * Sending a request with an xhr object
  * @param {string} http method
  * @param {string} path
  * @param {object} data
  * @param {objet}  the api information
  * @return {object} callbacks with success, error, progress
  */
  var callWithXhr = function(method, path, data, api) {
    // Methods that will be returns when request end
    var methods = {
      success: function() {},
      error: function() {},
      progress: function() {},
    };

    // Xhr Object
    var xhr = getXhr();

    var url = (api.base) ? api.base + path : path

    // Add Query string to the url
    url += formatQuery(data);

    // Be sure that the method is uppercase
    method = method.toUpperCase();

    // Open the request
    xhr.open(method, url, true)

    // Set headers
    if (api.headers) {
      for (header in api.headers) {
        if (api.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, api.headers[header]);
        }
      }
    }

    xhr.onprogress = function() {
      methods.progress.apply(methods, parse(xhr))
    }

    // Watching data
    xhr.onreadystatechange = function() {
      // On end
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          methods.success.apply(methods, parse(xhr));
        }
        else {
          methods.error.apply(methods, parse(xhr));
        }
      }
    };

    // Sending data
    if(data && ["POST", "PUT"].indexOf(method) !== -1) {
      xhr.send(data);
    }

    // Return callbacks
    return {
      success: function(callback) {
        methods.success = callback;
        return this;
      },
      error: function(callback) {
        methods.error = callback;
        return this;
      },
      progress: function(callback) {
        methods.progress = callback;
        return this;
      }
    }
  };

  /**
  * Sending a request with the nodejs http module object
  * @param {string} http method
  * @param {string} path
  * @param {object} data
  * @param {objet}  the api information
  * @return {object} callbacks with success, error, progress
  */
  var callWithHttpModule = function(method, path, data, api) {

    // Methods that will be returns when request end
    var methods = {
      success: function() {},
      error: function() {},
      progress: function() {},
    };

    var base = (api.base) ? api.base : extractPath(path).host;
    path = (api.base) ? path : extractPath(path).path;

    // Add Query string to the path
    path += formatQuery(data);

    // Construction of an options object based on the Http module Doc
    var options = {
      method        : method,
      hostname      : base,
      path          : path,
      port          : api.port           || false,
      headers       : api.headers        || false,
      localAddress  : api.localAddress   || false,
      socketPath    : api.socketPath     || false,
      auth          : api.auth           || false,
      agent         : api.agent          || false,
      keepAlive     : api.keepAlive      || false,
      keepAliveMsecs: api.keepAliveMsecs || false,
    };

    // Sending the request
    var req = http.request(options, function(res) {
      // Data base
      var body = '';

      // Set ut8 encode to the response
      res.setEncoding('utf8');

      // Watch data
      res.on('data', function (data) {
        body += data;

        // Call a progress callback
        methods.progress.apply(api, [body, req]);
      });

      // Watch the end of the request
      res.on('end', function() {
        // Call a success callback
        methods.success.apply(api, [body, req]);
      });

    });

    // Watch errors
    req.on('error', function(e) {
      // Call an error callback
      methods.error.apply(api, [e, req]);
    });

    // Write data to request body
    if(data && ["POST", "PUT"].indexOf(method) != -1) {
      req.write(data);
    }

    // Finishes sending the request
    req.end();

    // Return callbacks
    return {
      success: function(callback) {
        methods.success = callback;
        return this;
      },
      error: function(callback) {
        methods.error = callback;
        return this;
      },
      progress: function(callback) {
        methods.progress = callback;
        return this;
      }
    }
  };

  /* CHECKING ENVIRONMENT */
  /* ============================== */

  // Check the current environment
  var env = (this.window) ? env = "browser" : "node";

  // If nodeJs then require Http module
  if(env === "node") {
    var http = require('https');
  }

  // If browser then get an XMLHttpRequest object
  if(env === "browser") {
    var xhr = getXhr();
  }

  /* END CHECKING ENVIRONMENT */
  /* ============================== */


  /* ======================================= */
  /* ENDING PRIVATE METHODS & PROPETIES */
  /* ======================================= */

  /* ======================================= */

  /**
  * API Class
  *
  * Methods :
  * sendRequest
  * setOptions
  * get
  * post
  * put
  * delete
  * setBase
  * setMethod
  */
  var API = function() {

    /**
    * Send a request to an API
    */
    this.sendRequest = function(method, path, data, options) {

      // Format method and passing 'GET' by default
      method = (method) ? method.toUpperCase() : 'GET';

      if (!path) {
        return console.error('Missing url with your request to this API ');
      }

      // Check environment global to use the right object XHR or Http
      return (env === "node") ? callWithHttpModule(method, path, data, options) : callWithXhr(method, path, data, options);
    };

    this.setOptions = function(obj) {
      if (typeof obj !== "object") {
        return false;
      }

      for (var opt in obj) {
        if (obj.hasOwnProperty(opt)) {
          this[opt] = obj[opt];
        }
      }
      return this;
    };

    /**
    * Do a GET request
    * @param {string} url
    * @return {function} request
    */
    this.get = function (url, params) {
      return this.sendRequest('GET', url, params, this);
    };

    /**
    * Do a PUT request
    * @param {string} url
    * @param {object} data
    * @return {function} request
    */
    this.put = function (url, data) {
      return this.sendRequest('PUT', url, data, this);
    };

    /**
    * Do a POST request
    * @param {string} url
    * @param {object} data
    * @return {function} request
    */
    this.post = function (url, data) {
      return this.sendRequest('POST', url, data, this);
    };

    /**
    * Do a DELETE request
    * @param {string} url
    * @return {function} request
    */
    this.delete = function (url) {
      return this.sendRequest('DELETE', url, false, this);
    };

    /**
    * Set the base URL to an API
    * @param {string} hostname api
    * @return {object} this
    */
    this.setBase = function(host) {
      if (typeof host !== "string") {
        return false;
      }

      this.base = host;
      return this;
    };

    /**
    * Set a new method to the API object
    * @param {string} method name
    * @param {function} callback
    * @return {object} this
    */
    this.setMethod = function(name, callback) {
      this[name] = callback;
      return this;
    };

    return this;
  }

  /* ======================================= */
  /* ENDING API CLASS */
  /* ======================================= */

  /* ======================================= */

  /**
  * Exporting Library
  *
  * @API public
  *
  * connection  : {property}
  * base        : {property}
  * options     : {property}
  * to          : {function}
  * connect     : {function}
  * setMethod   : {function}
  * setBase     : {function}
  * get         : {function}
  * post        : {function}
  * put         : {function}
  * delete      : {function}
  * setOptions  : {function}
  * sendRequest : {function}
  */

  // Instantiate a new API for the base module
  var library = new API();

  // Literal object that contains all connections
  library.connections = {};

  /**
  * Connection to a particular api
  * @param {string} api name
  * @return {object} connection to the api
  */
  library.to = function(api) {
    if (this.connections[api]) {
      return this.connections[api];
    }

    console.error('API : ""%s" is not set in Molecule.connections, please use .connect({object}) method', api);

    return false;
  };

  /**
  * Connecting APIs
  * @param {object} apis
  * @return {object} this
  */
  library.connect = function(apis){
    if (typeof apis !== 'object') {
      return false;
    }

    for (index in apis) {
      if (typeof apis[index] === "string") {
        this.connections[index] = new API().setBase(apis[index]);
      }
      else {
        return false;
      }
    }

    return this;
  };

  // Return the library
  return library;

});
