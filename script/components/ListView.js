var ListView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'listViewView' });

  this.navheader = spawn('div', this.view, { className: 'listViewNavHeader' }, [
    spawn('button', null, {}, 'filter'),
    that.status = spawn('span', null, {}),
    spawn('div', null, {}, [
      that.firstButton = spawn('button', null, { className: 'paginateButton', onclick: that.firstPage }, 'first'),
      that.lastButton = spawn('button', null, { className: 'paginateButton', onclick: that.lastPage }, 'last'),
      that.curPage = spawn('span', null, { style: { display: 'inline-block', padding: '5px' } }, ''),
      that.prevButton = spawn('button', null, { className: 'paginateButton', onclick: that.prevPage }, 'prev page'),
      that.nextButton = spawn('button', null, { className: 'paginateButton', onclick: that.nextPage }, 'next page'),
    ]),
  ]);

  this.list = spawn('div', this.view, { className: 'listContent', style: { display: 'flex', flexDirection: 'column' } } );

  if (!this.page) this.page = 0;
  if (!this.limit) this.limit = 20;
  this.loading = 0;
  this.totalCount = null;

  this.getData();
}

ListView.prototype.firstPage = function() {
  this.page = 0;
  this.getData();
}

ListView.prototype.lastPage = function() {
  var that = this;
  if (this.limit) {
    this.getTotalCount().then(function(count){
      that.page = (Math.floor(count / that.limit));
      that.getData();
    });
  }
}

ListView.prototype.prevPage = function() {
  this.page--;
  if (this.page < 0) this.page = 0;
  this.getData();
}

ListView.prototype.nextPage = function() {
  this.page++;
  this.getData();
}

ListView.prototype.clearList = function() {
  removeAllChildren(this.list);
}

ListView.prototype.addLoad = function() {
  this.loading++;
  this.status.innerHTML = 'loading' + ( this.loading > 1 ? ` (${this.loading})` : '');
}

ListView.prototype.subLoad = function() {
  this.loading--;
  if (this.loading <= 0) {
    this.loading = 0;
    this.status.innerHTML = '';
  }
}

ListView.prototype.getTotalCount = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    that.addLoad();
    if (that.getCountCallback) {
      that.getCountCallback(that.limit, that.page).then(function(count){
        console.log('gettotalcount', count);
        that.subLoad();
        that.totalCount = count;
        resolve(count);
      });
    } else {
      resolve(false);
    }
  });

}

ListView.prototype.getData = function() {
  var that = this;
  console.log('list get data', this.limit, this.page);
  that.curPage.innerHTML = that.page;
  that.addLoad();
  if (this.getDataCallback) {
    this.getDataCallback(this.limit, this.page).then(function(children){
      console.log('getdatacallback', children);
      that.subLoad();
      that.clearList();
      that.curPage.innerHTML = that.page;
      children.forEach(function(child){
        adopt(child, that.list);
      });
    });
  } else {

  }
}

ListView.prototype.getTitle = function() {
  return 'generic list';
}