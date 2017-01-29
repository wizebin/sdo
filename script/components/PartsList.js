var PartsList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'partsListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getParts, limit: 100 });
}

PartsList.prototype.getParts = function(limit, page) {
  var that = this;
  console.log('get parts', limit, page);
  return new Promise(function(resolve, reject){
    list('Parts', limit, page).then(function(data){
      if (data.SUCCESS) {
        var children = data.RESULTS.map(function(idata){
          var passData = idata;
          return spawn('div', null, { className: 'lineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showPart(passData);}}, [
            spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, JSON.stringify(passData)),
          ]);
        }) || [];
        resolve(children);
      }
      resolve([]);
    });
  });
}

PartsList.prototype.showPart = function(jobData) {
  // var job = new JobView();
  // job.setState(jobData);
  // job.navPush = this.navPush;
  // job.navPop = this.navPop;
  // this.navPush(job);
}

PartsList.prototype.getTitle = function() {
  return 'parts list';
}