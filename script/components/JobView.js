var JobView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'jobView' });
  this.topWrapper = spawn('div', this.view, { style: { display: 'flex', justifyContent: 'space-between' } });
  this.customerNoteWrapper = spawn('div', this.topWrapper, { className: 'jobCustomerNoteWrapper' });
  this.customerWrapper = spawn('div', this.customerNoteWrapper, { className: 'jobCustomerWrapper' });
  this.scheduleWrapper = spawn('div', this.topWrapper, { className: 'jobScheduleWrapper' });
  this.extraNavWrapper = spawn('div', this.scheduleWrapper, { className: 'jobExtraWrapper' });

  this.customer = new CustomerView(this.customerWrapper, {});
  this.location = new CustomerView(this.customerWrapper, {});

  this.note = new NoteView(this.customerNoteWrapper, { style: { minHeight: '400px'}, disabled: true });

  this.schedule = new ScheduleView(this.scheduleWrapper, { onSchedule: function(){} });

  this.addNoteButton = spawn('button', this.extraNavWrapper, { onclick: function(){
    new Promise(function(resolve, reject) {
      that.navPush(new NoteView(null, { navPush: that.navPush, navPop: that.navPop, resolve }));
    }).then(function(data){data && data.length > 0 && that.note.addFormattedValue(data);});
  } }, 'Add Note');

  this.pvrButton = spawn('button', this.extraNavWrapper, { onclick: function(){} }, 'Report On Job');
}

JobView.prototype.startLoading = function() {

}

JobView.prototype.stopLoading = function() {

}

JobView.prototype.loadJob = function(jobId) {
  var that = this;
  this.startLoading();
  return new Promise(function(resolve, reject){
    get('Wip', jobId, 'Inv', jobLinks).then(function(data){
      if (data.SUCCESS) {
        var jobData = data.RESULTS[0];
        var passData = translateJobFromRW(jobData);
        that.setState(passData);
        that.stopLoading();
        resolve(jobData);
      } else {
        that.stopLoading();
        resolve(false);
      }
    });
  });
}

JobView.prototype.getTitle = function() {
  return 'job';
}