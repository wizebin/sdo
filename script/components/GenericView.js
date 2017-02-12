var GenericView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'genericView', style: this.style });
}

GenericView.prototype.getTitle = function() {
  return 'generic';
}

GenericView.prototype.customStateCallback = function(obj, state, key, depth){
  console.log('custom generic callback schedule', key);
  var data = state[key];
  if (isArray(data)) {
    spawn('div', this.view, { style: { marginTop: '20px' } }, key);
    data.forEach(function(datum, dex){this.customStateCallback(obj, data, dex, depth ? depth + 1 : 1);},this);
  } else if (isObject(data)){
    var keys = getObjectKeys(data);
    spawn('div', this.view, { style: { marginTop: '20px' } }, JSON.stringify(key));
    keys.forEach(function(datum){
      this.customStateCallback(obj, data, datum, depth ? depth + 1 : 1);
    },this);
  } else {
    leftMargin = 0;
    if (depth > 0) leftMargin = depth * 20;
    spawn('div', this.view, { style: { display: 'flex', flexDirection: 'row', marginBottom: '5px', backgroundColor: '#fdfdfd', padding: '10px', marginLeft: '' + leftMargin + 'px' } }, [
      spawn('div', null, { style: { marginRight: '10px', minWidth: '120px' } }, key),
      spawn('div', null, { style: { flex: '1' } }, data),
    ]);
  }

}