var JobList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getJobs, limit: 20 });
}

var jobLinks = [
  {table: 'Schd', tableColumn: 'Inv', parentColumn: 'Inv'},
];

JobList.prototype.getJobs = function(limit, page) {
  var that = this;
  console.log('getjobs', limit, page);
  return new Promise(function(resolve, reject){
    list('Wip', limit, page, jobLinks).then(function(data){
      var children = data.RESULTS.map(function(job){
        var passData = translateJobFromRW(job);
        return spawn('div', null, { className: 'jobLineItem', style: { height: '80px', marginBottom: '5px' }, onclick: function(){that.showJob(passData);}}, [
          spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch' } }, [
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.location.name || passData.customer.name),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.tech),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left' } }, passData.status),
            ]),
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.location.address || passData.customer.address),
            ]),
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '.6em' }}, [
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.description),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.id),
            ]),
          ]),
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