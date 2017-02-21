function LiveFeedView(parent, props) {
  var that = me(this);
  this.view = spawn('div', parent, { style: { height: '100%' } });

  this.liveFeed = spawn('div', this.view, { style: { height: '100%', overflow: 'auto' } });

  document.addEventListener("dataChange", function(e) {
    var item = e.detail;
    that.addItem(item);
  });

  var curFeed = window.dataFeed ? window.dataFeed.getFeed() : [];
  curFeed.forEach(function(item){that.addItem(item);});
}

LiveFeedView.prototype.addItem = function(item) {
  var that = this;
  var relevantSvg = null;
  if (item.verb === 'UPDATE') {
    relevantSvg = new ArrowSvg(null, { style: { flex: '0 0 16px', width: '16px', height: '16px', color: '#00a8ff' } });
  } else if (item.verb === 'INSERT') {
    relevantSvg = new PlusSvg(null, { style: { flex: '0 0 16px', width: '16px', height: '16px', color: '#00aa00' } });
  } else if (item.verb === 'DELETE') {
    relevantSvg = new MinusSvg(null, { style: { flex: '0 0 16px', width: '16px', height: '16px', color: '#ffaaaa' } });
  }
  var el = spawn('div', null, { className: 'liveFeedLineItem', style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch', height: '42px', padding: '5px' }, onclick:function(){that.clickedItem(item)} }, [
    spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
      relevantSvg,
      spawn('div', null, { style: { flex: '1', display: 'flex' } }, [
        spawn('span', null, { style: { flex: '0 0 60px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '15px', marginRight: '5px', textAlign: 'left' } }, item.tableName),
        spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', color: '#999' } }, item.tableID),
        spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right', color: '#999' } }, formatDateSane(new Date(item.updated_at))),
      ]),
    ]),
  ]);
  prependElement(that.liveFeed, el);
}

LiveFeedView.prototype.clickedItem = function(item) {
  location.hash = "Generic/" + item.tableName + '/' + item.tableIDField + '/' + item.tableID;
}
