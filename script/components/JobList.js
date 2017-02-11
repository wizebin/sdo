var JobList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getJobs, limit: 20 });
}

JobList.prototype.getJobs = function(limit, page) {
  var that = this;
  return new Promise(function(resolve, reject){
    list('Wip', limit, page, jobLinks, [{ col: 'INV', direction: 'DESC' }]).then(function(data){
      var children = data.RESULTS.map(function(job){
        var passData = translateJobFromRW(job);
        console.log('passdata', passData);
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

        return spawn('div', null, { className: 'jobLineItem', style: { height: '80px', marginBottom: '5px', borderLeft: '5px solid ' + borderColor }, onclick: function(){that.showJob(passData);}}, [
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
  job.loadJob(jobData.id);
}

JobList.prototype.getTitle = function() {
  return 'job list';
}