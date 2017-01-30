var JobList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getJobs, limit: 10 });
}

JobList.prototype.getJobs = function(limit, page) {
  var that = this;
  console.log('getjobs', limit, page);
  return new Promise(function(resolve, reject){
    list('Wip', limit, page).then(function(data){
      var children = data.RESULTS.map(function(job){
        var passData = translateJobFromRW(job);
        return spawn('div', null, { className: 'jobLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showJob(passData);}}, [
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.customer.name),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.description),
          spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left' } }, passData.status),
          spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.id),
        ]);
      }) || [];
      resolve(children);
    });
  });
}

JobList.prototype.showJob = function(jobData) {
  var job = new JobView();
  job.setState(jobData);
  job.navPush = this.navPush;
  job.navPop = this.navPop;
  this.navPush(job);
}

JobList.prototype.getTitle = function() {
  return 'job list';
}