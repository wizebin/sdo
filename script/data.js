/// crud create update delete

function list(type, limit, page) {
  return new Promise(function(resolve, reject){
    httpVERB('http://nonsoftware.us/sdo/request/', 'POST', JSON.stringify({verb: 'list', type, limit, page})).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function createOrUpdate(data) {
  return new Promise(function(resolve, reject){
    httpVERB('http://nonsoftware.us/sdo/request/', 'POST', JSON.stringify({verb: 'upsert', data})).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}

function get(type, id) {
  return new Promise(function(resolve, reject){
    httpVERB('http://nonsoftware.us/sdo/request/', 'POST', JSON.stringify({verb: 'list', type, limit, page})).then(function(data){
      resolve(JSON.parse(data));
    });
  });
}