var App = function(parent) {
  var that = me(this);
  this.view = spawn('div', parent, { className: 'app', style: {} });
  this.topView = spawn('div', this.view, { className: 'topView', style: { flex: '0 0 60px', display: 'flex', zIndex: '1' } });
  this.mainView = spawn('div', this.view, { className: 'mainWrapper', style: { flex: '1', display: 'flex' } });
  this.leftView = spawn('div', this.mainView, { className: 'leftWrapper', style: { height: '100%', padding: '5px 5px', flex: '0 0 200px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', backgroundColor: '#eee', marginRight: '10px', boxShadow: '0px 0px 5px #777' } });
  this.rightView = spawn('div', this.mainView, { className: 'rightWrapper', style: { height: '100%', flex: '1', overflow: 'auto' } });
  this.content = new NavigatePanel(this.rightView);
  this.nav = new SidePanel(this.leftView, { navPush: this.content.pushView, navPop: this.content.popView, nav: this.content.replaceView });
}

App.prototype.showComponent = function(component) {
  this.content.navigate(component);
}

var app = new App(document.getElementById('main'));

app.showComponent(new JobList());