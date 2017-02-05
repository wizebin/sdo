/// crud create update delete

function list(type, limit, page, links, sortby) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'list', type, limit, page, links, username, password, sortby })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function count(type) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'count', type, username, password })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function createOrUpdate(data) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'upsert', data, username, password })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function get(type, id, idlabel) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'get', type, id, idlabel, username, password })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function getPage(page, username, password) {
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'getpage', username, password, page })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function auth(username, password) {
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'auth', username, password })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

var jobLinks = [
  {table: 'Schd', tableColumn: 'Inv', parentColumn: 'Inv'},
];