var ScheduleList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'scheduleListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getAppts });
}

ScheduleList.prototype.getAppts = function(limit, page) {
  var that = this;
  console.log('get appts', limit, page);
  return new Promise(function(resolve, reject){
    list('Schd', limit, page).then(function(data){
      var children = data.RESULTS.map(function(appt){
        var passData = translateApptFromRW(appt);
        return spawn('div', null, { className: 'apptLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showJob(passData.jobID);}}, [
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.jobID),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.time),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.name),
          spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.tech),
        ]);
      }) || [];
      resolve(children);
    });
  });
}

ScheduleList.prototype.showJob = function(jobID) {
  var job = new JobView();
  get('Wip', jobID, 'Inv').then(function(data){
    var jobData = translateJobFromRW(data.RESULTS[0]);
    job.setState(jobData);
  });
  job.navPush = this.navPush;
  job.navPop = this.navPop;
  this.navPush(job);
}

ScheduleList.prototype.getTitle = function() {
  return 'appt list';
}