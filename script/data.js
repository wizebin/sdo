/// crud create update delete

function list(type, limit, page) {
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'list', type, limit, page })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function createOrUpdate(data) {
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'upsert', data })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function get(type, id, idlabel) {
  return new Promise(function(resolve, reject){
    httpVERB((API_LOCATION || '') + 'request/', 'POST', JSON.stringify({ verb: 'get', type, id, idlabel })).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}