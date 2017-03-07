var JobList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getJobs, getCountCallback: this.countJobs, limit: 20 });

  document.addEventListener("Wip.UPDATE", function(e) {
    var item = e.detail;
    // that.requestJob(item);
    if (item.tableID in that.jobMap) {
      that.jobMap[item.tableID].style.backgroundColor = '#f00';
      that.list.getData();
    }
  });
  this.jobMap = {};
}

JobList.prototype.getJobs = function(limit, page) {
  var that = this;
  return new Promise(function(resolve, reject){
    list('Wip', limit, page, null, jobLinks, [{ col: 'INV', direction: 'DESC' }]).then(function(data){
      that.jobMap = {};
      var children = data.RESULTS.map(function(job){
        var passData = translateJobFromRW(job);
        var borderColor = borderColorForStatus(passData.status);
        var apptString = '';
        var techString = '';
        if (passData.schedule.appts.length === 0) {
          apptString = '<span style="color: red">No Appts</span>';
          techString = '--';
        } else if (passData.schedule.appts.length === 1) {
          apptString = passData.schedule.appts[0].time;
          techString = passData.schedule.appts[0].tech;
        } else {
          apptString = passData.schedule.appts[0].time + " +" + (passData.schedule.appts.length-1);
          techString = passData.schedule.appts[0].tech;
        }
        // passData.schedule.appts.length

        var ret = spawn('div', null, { className: 'jobLineItem', style: { height: '80px', marginBottom: '5px', borderLeft: '5px solid ' + borderColor }, onclick: function(){that.showJob(passData);}}, [
          spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch' } }, [
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
              spawn('span', null, { style: { flex: '4', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.location.name || passData.customer.name),
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left', color: '#999' } }, passData.status),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, apptString),
            ]),
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
              spawn('span', null, { style: { flex: '4', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.location.address || passData.customer.address),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, techString),
            ]),
            spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '.6em' }}, [
              spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.description),
              spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.id),
            ]),
          ]),
        ]);
        that.jobMap[passData.id]=ret;
        return ret;
      }) || [];
      resolve(children);
    });
  });
}

JobList.prototype.countJobs = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    count('Wip').then(function(data){
      if (data.SUCCESS) {
        resolve(data.RESULTS[0].count);
      } else {
        resolve(false);
      }
    });
  });
}

JobList.prototype.showJob = function(jobData) {
  // var job = new JobView();
  // job.setState(jobData);
  // job.navPush = this.navPush;
  // job.navPop = this.navPop;
  // this.navPush(job);
  // job.loadData(jobData.id);
  location.hash = "Job/" + jobData.id;
}

JobList.prototype.getTitle = function() {
  return 'job list';
}