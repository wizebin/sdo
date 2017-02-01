var CompanyView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'companyView' });

  this.name = spawn('input', this.view, { className: 'companyName', placeholder: 'name' });
  this.address = spawn('input', this.view, { className: 'companyAddress', placeholder: 'address' });
  this.address2 = spawn('input', this.view, { className: 'companyAddress2', placeholder: 'address2' });

  this.phoneWrapper = spawn('div', this.view, { className: 'companyPhoneWrapper', style: { display: 'flex' } }, [
    this.phone1 = spawn('input', null, { className: 'companyPhone', placeholder: 'phone1' }),
    this.phone2 = spawn('input', null, { className: 'companyPhone', placeholder: 'phone2' }),
    this.phone3 = spawn('input', null, { className: 'companyPhone', placeholder: 'phone3' }),
  ]);

  this.phoneLabelWrapper = spawn('div', this.view, { className: 'companyPhoneWrapper', style: { display: 'flex' } }, [
    this.phoneLabel1 = spawn('input', null, { className: 'companyPhoneLabel', placeholder: 'phoneLabel1' }),
    this.phoneLabel2 = spawn('input', null, { className: 'companyPhoneLabel', placeholder: 'phoneLabel2' }),
    this.phoneLabel3 = spawn('input', null, { className: 'companyPhoneLabel', placeholder: 'phoneLabel3' }),
  ]);

  this.email = spawn('input', this.view, { className: 'companyEmail', placeholder: 'email' });
}

CompanyView.prototype.getTitle = function() {
  return 'Company';
}