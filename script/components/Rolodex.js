var Rolodex = function(parent, props) {
  var that = me(this);
  this.view = spawn('div', parent, { className: 'rolodexView' });

  this.list = new ListView(this.view, { getDataCallback: this.loadData, limit: 10 });
}

var companyLinks = [
  {table: 'phones', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  {table: 'emails', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  {table: 'addresses', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  {table: 'credentials', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
];

Rolodex.prototype.loadData = function(limit, page) {
  var that = this;
  return new Promise(function(resolve, reject){
    list('companies', limit, page, companyLinks).then(function(data) {
      if (data && data.RESULTS && data.SUCCESS) {
        var children = data.RESULTS.map(function(company) {
          var passData = company;// translateCompanyFromRW(company);
          return spawn('div', null, { className: 'rolodexLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showcompany(passData);}}, [
            spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.id),
            spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.name),
            spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left' } }, passData.vendor),
          ]);
        }) || [];
        resolve(children);
      } else {
        resolve([]);
      }
    });
  });
}

Rolodex.prototype.showcompany = function(data) {
  var company = new CompanyView();
  company.setState(data);
  company.navPush = this.navPush;
  company.navPop = this.navPop;
  this.navPush(company);
}

Rolodex.prototype.getTitle = function() {
  return 'rolodex';
}