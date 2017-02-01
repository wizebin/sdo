var LoginView = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'loginView', style: {} });
  this.errorContainer = spawn('div', this.view);
  this.username = spawn('input', this.view, { placeholder: 'username', type: 'username' });
  this.password = spawn('input', this.view, { placeholder: 'password', type: 'password' });
  this.submit = spawn('button', this.view, { onclick: this.login }, 'Login');
  addButtonCallback(this.username, function(){that.password.focus();});
  addButtonCallback(this.password, this.login);
}

LoginView.prototype.login = function() {
  var username = this.username.value;
  var password = this.password.value;

  if (username === 'test' && password === 'test') {
    this.errorContainer.innerHTML = '';
    getPage('app.php', username, password).then(function(data) {
      setElementContentWithScripts(document.getElementById('app'), data['RESULTS']);
    });
  } else {
    this.errorContainer.innerHTML = 'Invalid Credentials';
  }
}