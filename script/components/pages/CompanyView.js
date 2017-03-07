var CompanyView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'companyView' });

  this.generic = new GenericView(this.view, { style: { flex: '1' } });
}

CompanyView.prototype.startLoading = function(){};
CompanyView.prototype.stopLoading = function(){};

CompanyView.prototype.loadData = function(id) {
  var that = this;
  this.startLoading();
  return new Promise(function(resolve, reject){
    get('Companies', id, "ItemID", companyLinks).then(function(data){
      that.stopLoading()
      if (data.SUCCESS) {
        var company = data.RESULTS[0];
        that.generic.setState(company);
        resolve(company);
      } else {
        resolve(false);
      }
    });
  });
}

CompanyView.prototype.getTitle = function() {
  return 'Company';
}