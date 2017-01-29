var JobList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobListView' });

  this.list = spawn('div', this.view, { className: 'listListList', style: { display: 'flex', flexDirection: 'column' } } );

  this.page = 0;
  this.limit = 10;

  this.getJobs();
}

JobList.prototype.getJobs = function() {
  var that = this;
  list('Wip', this.limit, this.page).then(function(data){
    data.RESULTS.forEach(function(job){
      var passData = translateJobFromRW(job);
      var lineItem = spawn('div', that.list, { className: 'jobLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showJob(passData);}}, [
        spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.customer.name),
        spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.description),
        spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.id),
      ]);
    },this);
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