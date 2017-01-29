var NavigatePanel = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'navView' });
  this.header = spawn('div', this.view, { className: 'navHeader' });
  this.content = spawn('div', this.view, { className: 'navContent' });
  this.backButton = spawn('button', this.header, { className: 'navBack', onclick: this.onBack, style: { display: 'none' } }, 'back');
  spawn('div', this.header, { className: 'navTitleWrapper' }, [
    this.headerTitle = spawn('h3', this.header, { className: 'navTitle' }),
  ]);
  this.viewStack = [];
}

NavigatePanel.prototype.refreshView = function() {
  if (this.viewStack.length > 0) {
    this.backButton.style.display = 'block';
  } else {
    this.backButton.style.display = 'none';
  }
  this.headerTitle.innerHTML = this.title;
}

NavigatePanel.prototype.navigate = function(child, passData) {
  if (this.activeChild !== child) {
    this.activeChild && abandon(getView(this.activeChild));
    this.activeChild = child;
    this.activeChild.navPush = this.pushView;
    this.activeChild.navPop = this.popView;
    adopt(getView(child), this.content);
    if (child.getTitle) this.title = child.getTitle();
    this.refreshView();
    if (passData) this.activeChild.callbackData && this.activeChild.callbackData(passData);
  }
  return this.activeChild;
}

NavigatePanel.prototype.pushView = function(child, passData) {
  if (this.activeChild) this.viewStack.push(this.activeChild);
  return this.navigate(child, passData);
}

NavigatePanel.prototype.popView = function(passData) {
  return this.navigate(this.viewStack.pop(), passData);
}

NavigatePanel.prototype.replaceView = function(child, passData) {
  this.viewStack = [];
  return this.navigate(child, passData);
}

NavigatePanel.prototype.onBack = function() {
  return this.popView();
}