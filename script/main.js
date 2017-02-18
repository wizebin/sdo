var App = function(parent) {
  var that = me(this);
  this.view = spawn('div', parent, { className: 'app', style: {} });
  this.topView = spawn('div', this.view, { className: 'topView', style: { flex: '0 0 60px', display: 'flex', zIndex: '1', justifyContent: 'space-between', alignItems: 'stretch' } });
  this.mainView = spawn('div', this.view, { className: 'mainWrapper', style: { flex: '1', display: 'flex' } });
  this.leftView = spawn('div', this.mainView, { className: 'leftWrapper' });
  this.leftWrapper = spawn('div', this.leftView, { className: 'leftWrapperWrapper' });
  this.rightView = spawn('div', this.mainView, { className: 'rightWrapper', style: { height: '100%', flex: '1', overflow: 'auto' } });
  this.content = new NavigatePanel(this.rightView);
  this.nav = new SidePanel(this.leftWrapper, { navPush: this.content.pushView, navPop: this.content.popView, nav: this.navHash });
  this.navButton = spawn('div', this.topView, { className: 'navSlideButton', onclick: this.toggleNav, style: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', width: '45px', padding: '10px' } }, new SlideSvg());

  this.navControls = spawn('div', this.topView, { style: { margin: '10px', alignSelf: 'center' } }, [
    spawn('div', null, { className: 'logoutButton', style: { display: 'flex', flexDirection: 'row', alignItems: 'center' }, onclick: function(){
      setCookie('creduser', '');
      setCookie('credpass', '');
      setLocal('credname', '');
      setLocal('credpass', '');
      var appview = document.getElementById('app');
      appview.innerHTML = '';
      new LoginView(appview);

    } }, [
      new LogoutSvg(null, { style: { width: '25px', marginRight: '10px' } }),
      spawn('span', null, { style: { flex: '1', fontSize: '12px' } }, 'Logout'),
    ]),
  ]);

  this.onOpenPage();
  window.addEventListener("hashchange", function(naver){
    that.navString(location.hash);
  }, false);

  that.navString(location.hash);
}

App.prototype.showComponent = function(component) {
  this.content.navigate(component);
}

App.prototype.toggleNav = function() {
  if (this.leftView.style.maxWidth === '0px') {
    this.leftView.style.removeProperty('display');
    this.leftView.style.removeProperty('max-width');
  } else {
    this.leftView.style.maxWidth = '0px';
  }
}

App.prototype.onOpenPage = function() {
  this.showComponent(new JobList(this.view, { onLogin: this.onLogin }));
}

App.prototype.getPrimaryHashPage = function() {
  var hashed = location.hash;
  var loco = '';
  if (hashed[0] === "#") loco = hashed.substr(1);
  else loco = hashed;
  return loco.split("/")[0];
}

App.prototype.navHash = function(destination) {
  location.hash = destination;
}

App.prototype.navString = function(hashed) {
  var that = this;
  var newView = null;
  var loco = '';

  if (hashed[0] === "#") loco = hashed.substr(1);
  else loco = hashed;

  var parts = loco.split("/");
  if (parts.length === 1){
    if (parts[0] === 'Home') this.content.replaceView(new HomeView());
    if (parts[0] === 'Jobs') this.content.replaceView(new JobList());
    if (parts[0] === 'Callsheets') this.content.replaceView(new CallsheetList());
    if (parts[0] === 'Appts') this.content.replaceView(new ScheduleList());
    if (parts[0] === 'Map') this.content.replaceView(new MapView());
    if (parts[0] === 'Parts') this.content.replaceView(new PartsList());
    if (parts[0] === 'Rolodex') this.content.replaceView(new Rolodex());
    if (parts[0] === 'Reports') this.content.replaceView(new ReportsView());
    if (parts[0] === 'Messages') this.content.replaceView(new MessageList());
    if (parts[0] === 'Debug List') this.content.replaceView(new GenericList());
  } else if (parts.length >= 2){
    var display = this.content.activeChild;
    if (parts[0] === 'Job') display = new JobView();
    else if (parts[0] === 'Company') display = new CompanyView();
    else display = new GenericView();
    display.loadData(parts[1], parts[2], parts[3]);
    this.content.replaceView(display);
  }


}

var app = new App(document.getElementById('main'));
