var Molecular = require('./molecular');

Molecular.connect({
  'Github': 'api.github.com'
});

// Set a new method to the api
Molecular.to('Github').setMethod('lasCommit', function(owner, repo, callback) {
  this.get('/repos/'+owner+'/'+repo+'/commits')
    .success(function(data) {
      callback.apply(this, [false, JSON.parse(data)[0]]);
    })
    .error(function(err) {
      callback.apply(this, [true, undefined]);
    });
});

// Set options
Molecular.to('Github').setOptions({
  headers: {
    'user-agent': 'ArthurMialon'
  }
});

// Get the last commit
Molecular.to('Github').lasCommit('balderdashy', 'sails', function(err, commit) {
  if (err)
    return console.error(err);
    
  console.log(commit);
});

// Make a request
Molecular.to('Github').get('/users/arthurmialon/events')
  .progress(function(req) {
    console.log("progress");
  })
  .success(function(data, req) {
    console.log(data);
  })
  .error(function(err, req) {
    console.log(err);
  });
