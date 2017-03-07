var PartsList = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'partsListView' });

  this.list = new ListView(this.view, { getDataCallback: this.getParts, getCountCallback: this.countList, limit: 100 });
}

PartsList.prototype.getParts = function(limit, page) {
  var that = this;
  console.log('get parts', limit, page);
  return new Promise(function(resolve, reject){
    list('IList', limit, page).then(function(data){
      if (data.SUCCESS) {
        var children = data.RESULTS.map(function(passData){
          return spawn('div', null, { className: 'lineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showPart(passData);}}, [
            spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch', maxWidth: '100%', overflow: 'hidden' } }, [
              spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
                spawn('span', null, { style: { flex: '3', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.Nmbr),
                spawn('span', null, { style: { flex: '4', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.Descr),
                spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right', color: '#999' } }, passData.Inv),
              ]),
            ]),
          ]);
        }) || [];
        resolve(children);
      }
      resolve([]);
    });
  });
}

PartsList.prototype.showPart = function(partData) {
  // var generic = new GenericView();
  // generic.setState(partData);
  // generic.navPush = this.navPush;
  // generic.navPop = this.navPop;
  // this.navPush(generic);
  location.hash = "Generic/IList/_ORDINAL/" + partData._ORDINAL;
}

PartsList.prototype.countList = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    count('IList').then(function(data){
      if (data.SUCCESS) {
        resolve(data.RESULTS[0].count);
      } else {
        resolve(false);
      }
    });
  });
}

PartsList.prototype.getTitle = function() {
  return 'parts list';
}