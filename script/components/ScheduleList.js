var ScheduleList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'scheduleListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getAppts, getCountCallback: this.countList });
}

ScheduleList.prototype.getAppts = function(limit, page) {
  var that = this;
  console.log('get appts', limit, page);
  return new Promise(function(resolve, reject){
    list('Schd', limit, page, null, null, [{ col: 'INV', direction: 'DESC' }]).then(function(data){
      var children = data.RESULTS.map(function(appt){
        var passData = translateApptFromRW(appt);
        return spawn('div', null, { className: 'apptLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showJob(passData.jobID);}}, [
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.jobID),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.name),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.phone),
          spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.city),
          spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.time),
          spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.tech),
        ]);
      }) || [];
      resolve(children);
    });
  });
}

ScheduleList.prototype.countList = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    count('Schd').then(function(data){
      if (data.SUCCESS) {
        resolve(data.RESULTS[0].count);
      } else {
        resolve(false);
      }
    });
  });
}

ScheduleList.prototype.showJob = function(jobID) {
  // var job = new JobView();
  // job.loadData(jobID);
  // job.navPush = this.navPush;
  // job.navPop = this.navPop;
  // this.navPush(job);
  location.hash = "Job/" + jobID;
}

ScheduleList.prototype.getTitle = function() {
  return 'appt list';
}