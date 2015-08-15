# Molecular
Micro-library to make http request simply in the browser or with a NodeJs server.

## Usage

### With nodejs :
```javascript
// First require the library
// COMING SOON ON NPM
var Molecular = require('./molecular')();

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
<!-- COMING SOON ON BOWER -->
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

## API
More doc coming soon...
-  .connections
-  .get()
-  .post()
-  .put()
-  .delete()
-  .setMethod()
-  .setOptions()
-  .sendRequest()


## Advanced
You can simply add some methods to your connections

For example if I want to get the last commit from a specific repo (SailsJs)
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
