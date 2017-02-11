var SidePanel = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'sideView' });
  this.navDiv = spawn('div', this.view, { className: 'sideNav' }, [
    this.jobListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new JobList()) } }, 'Jobs'),
    this.apptListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new ScheduleList()) } }, 'Appts'),
    this.mapButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new MapView()) } }, 'Map'),
    this.partsListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new PartsList()) } }, 'Parts'),
    this.rolodexButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new Rolodex()) } }, 'Rolodex'),
    this.reportsButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new ReportsView()) } }, 'Reports'),
    this.GenericListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new GenericList()) } }, 'Debug List'),
  ]);
}
