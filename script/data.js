/// crud create update delete

function list(type, limit, page, joins, links, sortby, filters) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'list', type, limit, page, links, username, password, sortby, filters, joins })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function count(type, filters) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'count', type, username, password, filters })).then(function(data){
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

function get(type, id, idlabel, links) {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'get', type, id, idlabel, username, password, links })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function tables() {
  var username = settings.username;
  var password = settings.password;
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'tables', username, password })).then(function(data){
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
  {table: 'IList', tableColumn: 'Inv', parentColumn: 'Inv'},
  {table: 'Fnds', tableColumn: 'Inv', parentColumn: 'Inv'},
  {table: 'Sls', tableColumn: 'Inv', parentColumn: 'Inv'},
];

var apptLinks = [
  {table: 'Wip', tableColumn: 'Inv', parentColumn: 'Inv'},
];
