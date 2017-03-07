var Rolodex = function(parent, props) {
  var that = me(this);
  this.view = spawn('div', parent, { className: 'rolodexView' });

  this.list = new ListView(this.view, { getDataCallback: this.loadData, getCountCallback: this.countList, limit: 20 });
}

var companyLinks = [
  {table: 'TelNmbrs', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  {table: 'Emails', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  {table: 'Addresses', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
  // {table: 'Credentials', tableColumn: 'CompanyLink', parentColumn: 'ItemID'},
];

Rolodex.prototype.loadData = function(limit, page) {
  var that = this;
  return new Promise(function(resolve, reject){
    list('Companies', limit, page, null, companyLinks).then(function(data) {
      if (data && data.RESULTS && data.SUCCESS) {
        var children = data.RESULTS.map(function(company) {
          var passData = company;// translateCompanyFromRW(company);
          var addressText = '';
          if (passData.Addresses && passData.Addresses.length > 0) {
            var mainAddy = passData.Addresses[0];
            addressText = mainAddy.Address1 + ", " + mainAddy.City + ", " + mainAddy.State + " " + mainAddy.Zip;
          }
          return spawn('div', null, { className: 'genericLineItem', style: { height: '80px', marginBottom: '5px' }, onclick: function(){that.showcompany(passData);}}, [
            spawn('div', null, { style: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignSelf: 'stretch', maxWidth: '100%', overflow: 'hidden' } }, [
              spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
                spawn('span', null, { style: { flex: '4', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.Name),
                spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left', color: '#999' } }, passData.VndrAbbrv),
                // spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, apptString),
              ]),
              spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}, [
                spawn('span', null, { style: { flex: '4', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, addressText),
                // spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, techString),
              ]),
              spawn('div', null, {style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '.6em' }}, [
                spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.Notes),
                spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.ItemID),
              ])
            ]),
          ]);
        }) || [];
        resolve(children);
      } else {
        resolve([]);
      }
    });
  });
}

Rolodex.prototype.countList = function() {
  var that = this;
  return new Promise(function(resolve, reject){
    count('Companies').then(function(data){
      if (data.SUCCESS) {
        resolve(data.RESULTS[0].count);
      } else {
        resolve(false);
      }
    });
  });
}

Rolodex.prototype.showcompany = function(data) {
  // var company = new CompanyView();
  // company.setState(data);
  // company.navPush = this.navPush;
  // company.navPop = this.navPop;
  // this.navPush(company);
  location.hash = "Company/" + data.ItemID;
}

Rolodex.prototype.getTitle = function() {
  return 'rolodex';
}