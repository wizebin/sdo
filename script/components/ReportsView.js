var ReportsView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'reportsView' });

  this.reportWrapper = spawn('div', this.view, {});

  this.getJobCount();
}

ReportsView.prototype.getJobCount = function() {
  var that = this;
  count('Wip').then(function(data){
    if (data.SUCCESS) {
      if (data.RESULTS[0].count)
        that.reportWrapper.innerHTML = `JOB COUNT ${data.RESULTS[0].count}`;
    }
  });
}

ReportsView.prototype.getApptCount = function() {

}

ReportsView.prototype.getTitle = function() {
  return 'report view';
}