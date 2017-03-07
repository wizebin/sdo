function Button(parent, props) {
  var that = me(this, props);
  if (!this.className && !this.style) {
    this.className = 'basicButton';
  }
  this.view = spawn('div', parent, { className: this.className, style: this.style, onclick: this.onclick });
}