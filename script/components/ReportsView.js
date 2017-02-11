var ReportsView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'reportsView' });

  this.reportWrapper = spawn('div', this.view, {});
  this.countWrapper = spawn('div', this.reportWrapper, { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' } });

  this.getCounts();
}

ReportsView.prototype.getCounts = function() {
  var that = this;
  tables().then(function(data){
    if (data.SUCCESS) {
      removeAllChildren(that.countWrapper);

      var currentTable = null;
      var counter = 0;

      data.RESULTS.forEach(function(table){
        count(table.TABLE_NAME).then(function(data){
          if (data.SUCCESS) {
            if (data.RESULTS[0].count){
              if (counter++ % 10 === 0) {
                currentTable = spawn('table', that.countWrapper, { className: 'reportCountTable' });
                spawn('tr', currentTable, { style: { marginTop: '10px' } }, `<th>Table</td><td>Record Quantity</td>`);
              }
              spawn('tr', currentTable, {}, `<td>${table.TABLE_NAME}</td><td style="text-align:right">${data.RESULTS[0].count}</td>`);
            }
          }
        });
      },this);
    }
  });
}


ReportsView.prototype.getTitle = function() {
  return 'report view';
}