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

function forceStringSize(str, size, padding, before) {
  if (str.length > size) return str.slice(4);
  else if (str.length === size) return str;
  else if (before) {
    return padding.repeat(size - str.length) + str;
  } else {
    return str + padding.repeat(size - str.length);
  }
}
function zeroAlign(num, size) {
  return forceStringSize(''+num, size, '0', true);
}
function formatDate9075(date) {
  return zeroAlign(date.getFullYear(), 4) + "-" + zeroAlign(date.getMonth() + 1, 2) + "-" + zeroAlign(date.getDate(), 2) + ' ' + zeroAlign(date.getHours(), 2) + ':' + zeroAlign(date.getMinutes(), 2) + ':' + zeroAlign(date.getSeconds(), 2);
}

function Data() {
  var that = me(this);
  this.feed = [];
  this.lastUpdate = new Date();
  this.lastUpdate.setHours(0);
  this.lastUpdate.setMinutes(0);
  this.lastUpdate.setSeconds(0);
  this.timeoutTime = 5000;
  this.loadFeed();
}

Data.prototype.makeSyncFilters = function() {
  return [{sub: 'updated_at', verb: 'gteq', obj: formatDate9075(this.lastUpdate)}];
}

Data.prototype.loadFeed = function() {
  var that = this;
  if(window.settings && window.settings.username) {
    list('sync', null, null, null, null, null, this.makeSyncFilters()).then(function(data){
      if (data.SUCCESS && data.RESULTS) {
        var list = data.RESULTS;
        list.forEach(function(item){
          var event = new CustomEvent('dataChange', { 'detail': item });
          document.dispatchEvent(event);
          var specificEvent = new CustomEvent(item.tableName + '.' + item.verb, { 'detail': item });
          document.dispatchEvent(specificEvent);
          that.feed.push(item);
        });
      }
      that.timeoutHandle = setTimeout(that.loadFeed, that.timeoutTime);
    });
    this.lastUpdate = new Date();
  } else {
    that.timeoutHandle = setTimeout(that.loadFeed, 50);
  }
}

Data.prototype.getFeed = function() {
  return this.feed;
}

window.dataFeed = window.dataFeed ? window.dataFeed : new Data();
