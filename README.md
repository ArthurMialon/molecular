# Molecular !['travis build'](https://travis-ci.org/ArthurMialon/molecular.svg?branch=master) [![npm version](https://badge.fury.io/js/molecularjs.svg)](http://badge.fury.io/js/molecularjs) [![Bower version](https://badge.fury.io/bo/molecularjs.svg)](http://badge.fury.io/bo/molecularjs)
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
var Molecular = require('molecular')();

// Connect to your favorites APIs
Molecular.connect({
  'Github': 'api.github.com',
  'Slack' : 'api.slack.com'
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
```html
<!-- Import it to your website -->
<script src="molecular.js"></script>
```
Use it almost like in nodejs :
```javascript

// Connect to your favorites APIs
Molecular.connect({
  'Github': 'https://api.github.com',
  'Slack' : 'https://api.slack.com'
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

### .get(url)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
@return       | Callback Object
#### Example :
```javascript
Molecular.get('http://your/api/endpoints');
```

### .post(url, data)
#### Parameters :
Name          | Type
------------- | -------------
url           | String
data          | Data
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
data          | Data
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
Molecular.post('http://your/api/endpoints', {});
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
  'headers': {
    "ContentType": "Application/json"
  }
});
```

### .sendRequest(method, path, data, options)
#### Parameters :
Name          | Type
------------- | -------------
method        | string
path          | string
data          | object || boolean
options       | object
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
