# Molecular !['travis build'](https://travis-ci.org/ArthurMialon/molecular.svg?branch=master) [![npm version](https://badge.fury.io/js/molecularjs.svg)](http://badge.fury.io/js/molecularjs) [![Codacy Badge](https://www.codacy.com/project/badge/c3515cb71b954ee0940ad79f57cc9872)](https://www.codacy.com/app/arthurmialon/molecular)
Micro-library to make http request simply in the browser or with a NodeJs server.

## Install
### On nodejs
```shell
$ npm install molecularjs
```

### On Bower
```shell
$ bower install molecularjs
```

## Usage

### With nodejs :
```javascript
// First require the library
var Molecular = require('molecular');
```

Use Molecular like that
```javascript
// Connect to your favorites APIs
Molecular.connect({
  'Github': 'https://api.github.com',
  'Slack' : 'http://api.slack.com'
});

// Set some options
// There are all options from the basic nodejs https module
Molecular.to('Github').setOptions({
  headers: {
    'user-agent': 'ArthurMialon'
  }
});

// Make a simply request to get some events
Molecular.to('Github').get('/users/arthurmialon/events')
  .progress(function(req) {
    console.log("request progress");
  })
  .success(function(data, req) {
    console.log(data, req);
  })
  .error(function(err, req) {
    console.log(err);
  });

```
### In a browser :
Use it almost like in nodejs :
You just have to import the file to your website

```html
<!-- Import it to your website -->
<script src="molecular.js"></script>
```



## Molecular API
More doc coming soon...

### .connections
See all your connections to APIs

### .connect(apis)
#### Parameters :
Name          | Type
------------- | -------------
APIs          | Object
#### Example :
```javascript
Molecular.connect({
  'Github': 'https://api.github.com',
  'Slack' : 'https://api.slack.com'
});
```

### .to(apiName)
#### Parameters :
Name          | Type
------------- | -------------
apiName       | String
@return       | Object
#### Example :
```javascript
Molecular.to('ApiName')
```

### .get(url, params)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
params        | Object
@return       | Callback Object
#### Example :
```javascript
Molecular.get('http://your/api/endpoints', {limit: 2, orderby: "id", sort: "desc"});
```

### .post(url, data)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
data          | Object
@return       | Callback Object
#### Example :
```javascript
Molecular.post('http://your/api/endpoints', {});
```

### .put(url, data)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
data          | Object
@return       | Callback Object
#### Example :
```javascript
Molecular.put('http://your/api/endpoints', {});
```

### .delete(url)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
@return       | Callback Object
#### Example :
```javascript
Molecular.delete('http://your/api/endpoints');
```

### .setMethod(name callback)
#### Parameters :
Name          | Type
------------- | -------------
name          | String
callback      | Function
#### Example :
```javascript
Molecular.setMethod('methodName', function(arguments, callback) {
  // Do stuff and apply the callback
});
```

### .setOptions(options)
#### Parameters :
Name          | Type
------------- | -------------
options       | Object
#### Example :
```javascript
Molecular.setOptions({
  headers: {
    "ContentType": "Application/json"
  }
});
```

### .sendRequest(method, path, data, options)
#### Parameters :
Name          | Type
------------- | -------------
method        | String
path          | String
data          | Object / Boolean
options       | Object
@return       | Callback Object
#### Example :
```javascript
Molecular.sendRequest('GET', 'http://your/api/endpoint', false, {});
```

## Advanced
You can simply add some methods to your connections

For example if I want to get the last commit from a specific repo (i.e: SailsJs)
```javascript

// Set a new method to the api
Molecular.to('Github').setMethod('lasCommit', function(owner, repo, callback) {
  this.get('/repos/'+owner+'/'+repo+'/commits')
    .success(function(data) {
      // Add JSON.parse(data) in nodejs to data instead of data[0]
      callback.apply(this, [false, data[0]]);
    })
    .error(function(err) {
      callback.apply(this, [true, undefined]);
    });
});

// Get the last commit from sailsJs
Molecular.to('Github').lasCommit('balderdashy', 'sails', function(err, commit) {
  (err) ? console.error(err) : console.log(commit);
});

```

## Next version 1.1
- Support http & https
- Better options management (JSON and default options etc...)
- Call en error if status code >= 200 & < 300 for http module nodejs
- Get the body response on error
- Fixes on POST/PUT request
- Fixes on options with xhr
- Minified version for bower
- Automatic JSON.parse on data
