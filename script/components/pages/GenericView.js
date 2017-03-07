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
  leftMargin = undefined;
  if (depth > 0) leftMargin = '' + (depth * 20) + 'px';
  var nextLeftMargin = '' + (((depth || 1)+1) * 20) + 'px';

  if (isArray(data)) {
    spawn('div', this.view, { style: { marginTop: '20px', marginLeft: nextLeftMargin } }, isArray(state) ? '' : key);
    data.forEach(function(datum, dex){this.customStateCallback(obj, data, dex, depth ? depth + 1 : 1);},this);
  } else if (isObject(data)){
    var keys = getObjectKeys(data);
    spawn('div', this.view, { style: { marginTop: '20px', marginLeft: nextLeftMargin } }, isArray(state) ? '' : key);
    keys.forEach(function(datum){
      this.customStateCallback(obj, data, datum, depth ? depth + 1 : 1);
    },this);
  } else {
    spawn('div', this.view, { style: { display: 'flex', flexDirection: 'row', marginBottom: '5px', backgroundColor: '#fdfdfd', padding: '10px', marginLeft: leftMargin } }, [
      spawn('div', null, { style: { marginRight: '10px', minWidth: '120px' } }, key),
      spawn('div', null, { style: { flex: '1' } }, data),
    ]);
  }
}

GenericView.prototype.startLoading = function(){}
GenericView.prototype.stopLoading = function(){}

GenericView.prototype.loadData = function(type, idcol, id){
  var that = this;
  this.startLoading();
  return new Promise(function(resolve, reject){
    get(type, id, idcol).then(function(passData){
      that.stopLoading();
      var data = passData.RESULTS;
      if (passData.SUCCESS) {
        that.setState(data);
        resolve(data);
      } else {
        that.stopLoading();
        resolve(false);
      }
    });
  });
}