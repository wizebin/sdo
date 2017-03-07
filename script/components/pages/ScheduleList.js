var ScheduleList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'scheduleListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getAppts, getCountCallback: this.countList, hideHeader: this.hideHeader, prefilters: this.prefilters, limit: this.limit || 20 });
}

ScheduleList.prototype.reload = function() {
  this.list.getData();
}

ScheduleList.prototype.getAppts = function(limit, page, filters, sorts) {
  var that = this;
  if (!sorts || sorts.length < 1) {
    sorts = [{ col: 'INV', direction: 'DESC' }];
  }
  console.log('get appts', limit, page);
  var endSorts = (this.presorts || []).concat(sorts || []);
  var endFilters = (this.prefilters || []).concat(filters || []);
  return new Promise(function(resolve, reject){
    list('Schd', limit, page, null, apptLinks, endSorts, endFilters).then(function(data){
      var children = data.RESULTS.map(function(appt){
        var passData = translateApptFromRW(appt);
        var location = {};
        if (passData.job && passData.job.location) {
          if (isString(passData.job.location.name) && passData.job.location.name.length > 0) {
            location = passData.job.location;
          } else if (isString(passData.job.customer.name) && passData.job.customer.name.length > 0) {
            location = passData.job.customer;
          }
        }
        return spawn('div', null, { className: 'apptLineItem', style: { }, onclick: function(){that.showJob(passData.jobID);}}, [
          spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch' } }, [
            spawn('div', null, { style: { display: 'flex', justifyContent: 'space-between' } }, [
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', } }, [
                spawn('span', null, { style: { fontWeight: 'bold' } }, passData.time),
                spawn('span', null, { style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, location.name),
              ]),
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right', color: '#999' } }, passData.jobID),
            ]),
            spawn('div', null, { style: { display: 'flex', justifyContent: 'space-between' } }, [
              spawn('span', null, { style: { flex: '6', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, location.address + ', ' + location.address2 ),
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.job.status),
              spawn('span', null, { style: { flex: '0 0 15px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right', fontWeight: 'normal' } }, passData.tech),
            ]),
          ]),
        ]);
      }) || [];
      resolve(children);
    });
  });
}

ScheduleList.prototype.countList = function(filters) {
  var that = this;
  var endFilters = (this.prefilters || []).concat(filters || []);
  return new Promise(function(resolve, reject){
    count('Schd', endFilters).then(function(data){
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
