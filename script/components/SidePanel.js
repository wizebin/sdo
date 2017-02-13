var SidePanel = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'sideView' });
  this.navDiv = spawn('div', this.view, { className: 'sideNav' }, [
    this.jobListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Jobs'),
    this.apptListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav( this.value) } }, 'Appts'),
    this.mapButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Map'),
    this.partsListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Parts'),
    this.rolodexButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Rolodex'),
    this.reportsButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Reports'),
    this.GenericListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(this.value) } }, 'Debug List'),
  ]);
}
