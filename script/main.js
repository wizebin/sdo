var App = function(parent) {
  var that = me(this);
  this.view = spawn('div', parent, { className: 'app', style: {} });
  this.topView = spawn('div', this.view, { className: 'topView', style: { flex: '0 0 60px', display: 'flex', zIndex: '1', justifyContent: 'space-between', alignItems: 'stretch' } });
  this.mainView = spawn('div', this.view, { className: 'mainWrapper', style: { flex: '1', display: 'flex' } });
  this.leftView = spawn('div', this.mainView, { className: 'leftWrapper' });
  this.leftWrapper = spawn('div', this.leftView, { className: 'leftWrapperWrapper' });
  this.rightView = spawn('div', this.mainView, { className: 'rightWrapper', style: { height: '100%', flex: '1', overflow: 'auto' } });
  this.content = new NavigatePanel(this.rightView);
  this.nav = new SidePanel(this.leftWrapper, { navPush: this.content.pushView, navPop: this.content.popView, nav: this.content.replaceView });
  this.navButton = spawn('div', this.topView, { className: 'navSlideButton', onclick: this.toggleNav, style: { display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', flexDirection: 'column', width: '45px', padding: '10px' } }, [
    spawn('div', null, { style: { backgroundColor: '#333', flex: '0 0 3px' } }),
    spawn('div', null, { style: { backgroundColor: '#333', flex: '0 0 3px' } }),
    spawn('div', null, { style: { backgroundColor: '#333', flex: '0 0 3px' } }),
  ]);

  this.navControls = spawn('div', this.topView, { style: { margin: '10px', alignSelf: 'center' } }, [
    spawn('button', null, { onclick: function(){
      setCookie('creduser', '');
      setCookie('credpass', '');
      var appview = document.getElementById('app');
      appview.innerHTML = '';
      new LoginView(appview);

    } }, 'logout' ),
  ]);

  this.onOpenPage();
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

var app = new App(document.getElementById('main'));
