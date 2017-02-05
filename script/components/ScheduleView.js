var ScheduleView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'scheduleView' });

  this.scheduleButton = spawn('button', this.view, { onclick: this.onSchedule, style: { marginBottom: '10px' } }, 'Schedule');

  this.statusDropdown = spawn('select', this.view, { style: { marginBottom: '10px' } },
    JobStatStrings.map(function(stat){
      return spawn('option', null, {}, stat);
    })
  );

  spawn('span', this.view, { style: { alignSelf: 'center' } }, 'Appointments');

  this.apptWrapper = spawn('div', this.view, { className: 'scheduleApptWrapper' } );
  this.apptView = spawn('div', this.apptWrapper, { className: 'scheduleAppts' })

  this.displayAppointments();
}

ScheduleView.prototype.getTitle = function() {
  return 'Schedule';
}

ScheduleView.prototype.displayAppointments = function() {
  var that = this;
  removeAllChildren(this.apptView);
  (this.appts || []).forEach(function(apptData) {
    var appt = spawn('div', that.apptView, { className: 'apptButton' }, [
      spawn('span', null, {}, apptData.time),
      spawn('span', null, {}, apptData.tech),
    ]);
  }, this);
}

ScheduleView.prototype.customStateCallback = function(obj, state, key){
  console.log('custom state callback schedule', key);
  if (key == 'statusDropdown') {
    this.statusDropdown.value = state[key];
  } else if (key == 'appts') {
    this.appts = state[key];
    this.displayAppointments();
  }
}