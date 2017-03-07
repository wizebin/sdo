var ListView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'listViewView' });

  if (!props.hideHeader) {
    this.navheader = spawn('div', this.view, { className: 'listViewNavHeader' }, [
      // spawn('button', null, {}, 'filter'),
      // spawn(Button, null, {}, [spawn(FilterSvg), spawn('span', null, {}, 'Filter')]),
      spawn(Button, null, { onclick: that.getData }, [spawn(RefreshSvg), spawn('span', null, {}, 'Refresh')]),
      // spawn(Button, null, {}, [spawn(PlusSvg), spawn('span', null, {}, 'Add Item')]),
      that.status = spawn('span', null, {}),
      spawn('div', null, {}, [
        that.firstButton = spawn('button', null, { className: 'paginateButton', onclick: that.firstPage }, 'first'),
        that.lastButton = spawn('button', null, { className: 'paginateButton', onclick: that.lastPage }, 'last'),
        that.curPage = spawn('span', null, { style: { display: 'inline-block', padding: '5px' } }, ''),
        that.prevButton = spawn('button', null, { className: 'paginateButton', onclick: that.prevPage }, 'prev page'),
        that.nextButton = spawn('button', null, { className: 'paginateButton', onclick: that.nextPage }, 'next page'),
      ]),
    ]);
  }

  this.list = spawn('div', this.view, { className: 'listContent', style: { display: 'flex', flexDirection: 'column' } } );

  if (!this.page) this.page = 0;
  if (!this.limit) this.limit = 20;
  this.loading = 0;
  this.totalCount = null;

  this.filters = [];
  this.sorts = [];

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
      console.log('countty', count, that.limit, count / that.limit);
      that.page = (Math.ceil(count / that.limit))-1;
      if (that.page < 0) that.page = 0;
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
  if (!this.hideHeader) this.status.innerHTML = 'loading' + ( this.loading > 1 ? ` (${this.loading})` : '');
}

ListView.prototype.subLoad = function() {
  this.loading--;
  if (this.loading <= 0) {
    this.loading = 0;
    if (!this.hideHeader) this.status.innerHTML = '';
  }
}

ListView.prototype.getTotalCount = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    that.addLoad();
    if (that.getCountCallback) {
      that.getCountCallback(that.filters).then(function(count){
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
  if (!this.hideHeader) that.curPage.innerHTML = this.page;
  that.addLoad();
  if (this.getDataCallback) {
    this.getDataCallback(this.limit, this.page || 0, this.filters, this.sorts).then(function(children){
      that.subLoad();
      that.clearList();
      if (!that.hideHeader) that.curPage.innerHTML = that.page;
      children.forEach(function(child){
        adopt(that.list, child);
      });
    });
  } else {

  }
}

ListView.prototype.getTitle = function() {
  return 'generic list';
}