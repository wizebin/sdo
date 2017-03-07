var LoginView = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'loginView', style: {} });
  this.errorContainer = spawn('div', this.view, { style: { marginBottom: '10px' } });
  this.username = spawn('input', this.view, { placeholder: 'username', type: 'username' }, getCookie('credname') || getLocal('credname'));
  this.password = spawn('input', this.view, { placeholder: 'password', type: 'password' }, getCookie('credpass') || getLocal('credpass'));
  this.submit = spawn('button', this.view, { onclick: function(){that.login(false);} }, 'Login');
  addButtonCallback(this.username, function(){that.password.focus();});
  addButtonCallback(this.password, function(){that.login(false);});

  this.login(true);
}

LoginView.prototype.login = function(noLoginError) {
  var that = this;
  var username = this.username.value;
  var password = this.password.value;

  setCookie('credname', username);setLocal('credname', username);
  setCookie('credpass', password);setLocal('credpass', password);

  getPage('app.php', username, password).then(function(data) {
    if (data.SUCCESS) {
      settings.username = username;
      settings.password = password;
      settings.organizationID = data.AUTH.org;
      settings.userID = data.AUTH.id;
      settings.securityLevel = data.AUTH.seclevel;

      window.dataFeed.loadBasicData();

      that.errorContainer.innerHTML = '';
      setElementContentWithScripts(document.getElementById('app'), data['RESULTS']);
    } else {
      if (!noLoginError) that.errorContainer.innerHTML = data.ERROR;
    }
  });

}
