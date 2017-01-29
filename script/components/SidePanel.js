var SidePanel = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'sideView' });
  this.navDiv = spawn('div', this.view, { className: 'sideNav' }, [
    this.jobListButton = spawn('button', null, { className: 'navButton', onclick: function(){ that.nav(new JobList()) } }, 'Jobs'),
  ]);
}
