var GenericList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'genericListView' });
  this.table = spawn('select', this.view, { className: 'genericTableSelect', onchange: function(){that.list.getData();} });

  this.list = new ListView(this.view, { getDataCallback: this.loadList, getCountCallback: this.countList, limit: 20 });
  if (!this.tablesLoaded) this.loadTables();
}

GenericList.prototype.loadTables = function() {
  var that = this;
  tables().then(function(data){
    removeAllChildren(that.table);
    if (data.SUCCESS) {
      var tables = data.RESULTS;
      tables.forEach(function(table){
        spawn('option', that.table, {}, table.TABLE_NAME);
      },this);
    }
    that.tablesLoaded = true;
    that.list.getData();
  });
}

GenericList.prototype.loadList = function(limit, page) {
  var that = this;
  return new Promise(function(resolve, reject){
    list(that.table.value, limit || 20, page || 0).then(function(data){
      console.log('list returned', data);
      if (!data.SUCCESS || !data.RESULTS){
        resolve([]);
        return;
      }
      var children = data.RESULTS.map(function(passData){
        var keys = getObjectKeys(passData);
        var columns = [];
        for(var a = 0; a < keys.length && a < 10; a++) {
          columns.push(spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', marginLeft: '5px', marginRight: '5px', wordWrap: 'break-word', maxHeight: '100%', overflow: 'hidden' } }, passData[keys[a]]));
        }
        return spawn('div', null, { className: 'genericLineItem', style: { marginBottom: '5px' }, onclick: function(){that.showGeneric(passData);}}, [
          spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch', maxWidth: '100%', maxHeight: '100px' } }, columns),
        ]);
      }) || [];
      resolve(children);
    });
  });
}

GenericList.prototype.countList = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    count(that.table.value).then(function(data){
      if (data.SUCCESS) {
        resolve(data.RESULTS[0].count);
      } else {
        resolve(false);
      }
    });
  });
}

GenericList.prototype.showGeneric = function(genericData) {
  var generic = new GenericView();
  generic.setState(genericData);
  generic.navPush = this.navPush;
  generic.navPop = this.navPop;
  this.navPush(generic);
  // generic.load(this.table.value, genericData.id);
}

GenericList.prototype.getTitle = function() {
  return 'generic list';
}