function LiveFeedView(parent, props) {
  var that = me(this);
  this.view = spawn('div', parent, { style: { height: '100%' } });

  this.liveFeed = spawn('div', this.view, { style: { height: '100%', overflow: 'auto' } });

  document.addEventListener("dataChange", function(e) {
    var item = e.detail;

    var relevantSvg = null;
    if (item.verb === 'UPDATE') {
      relevantSvg = new ArrowSvg(null, { style: { width: '16px', height: '16px', color: '#00a8ff' } });
    } else if (item.verb === 'INSERT') {
      relevantSvg = new PlusSvg(null, { style: { width: '16px', height: '16px', color: '#00aa00' } });
    } else if (item.verb === 'DELETE') {
      relevantSvg = new MinusSvg(null, { style: { width: '16px', height: '16px', color: '#ffaaaa' } });
    }

    var el = spawn('div', null, { className: 'liveFeedLineItem', style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch', height: '42px' }, onclick:function(){that.clickedItem(item)} }, [
      spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
        relevantSvg,
        spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left', color: '#999' } }, item.tableName),
        spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, item.tableID),
      ]),
    ]);
    prependElement(that.liveFeed, el);
  });
}

LiveFeedView.prototype.clickedItem = function(item) {
  location.hash = "Generic/" + item.tableName + '/' + item.tableIDField + '/' + item.tableID;
}