var NoteView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);

  this.view = spawn('div', parent, { className: 'noteView' });
  this.noteWrapper = spawn('div', this.view, { style: { flex: '1', width: '100%' } });

  this.note = spawn('textarea', this.noteWrapper, { className: 'noteText' });

  if (props.disabled) this.note.disabled = true;

  if (props.navPop) {
    this.accept = spawn('button', this.view, { onclick: function(){
      that.resolve && that.resolve(that.note.value);
      that.navPop(that.getState());
    } }, 'accept');
  }
}

NoteView.prototype.getTitle = function() {
  return 'Note';
}

NoteView.prototype.getValue = function() {
  return this.note.value;
}

NoteView.prototype.setValue = function(val) {
  this.note.value = val;
}

NoteView.prototype.addFormattedValue = function(val) {
  var cur = this.note.value;
  if (cur.length > 0) {
    if (cur[cur.length-1] != "\n" && cur[cur.length-1] != "\r") cur += "\r\n";
  }
  cur += formatDateTime(new Date());
  cur += ': ';
  cur += val;
  this.note.value = cur;
}