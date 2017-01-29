var CustomerView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'customerView' });

  this.name = spawn('input', this.view, { className: 'customerName', placeholder: 'name' });
  this.address = spawn('input', this.view, { className: 'customerAddress', placeholder: 'address' });
  this.address2 = spawn('input', this.view, { className: 'customerAddress2', placeholder: 'address2' });

  this.phoneWrapper = spawn('div', this.view, { className: 'customerPhoneWrapper', style: { display: 'flex' } }, [
    this.phone1 = spawn('input', null, { className: 'customerPhone', placeholder: 'phone1' }),
    this.phone2 = spawn('input', null, { className: 'customerPhone', placeholder: 'phone2' }),
    this.phone3 = spawn('input', null, { className: 'customerPhone', placeholder: 'phone3' }),
  ]);

  this.phoneLabelWrapper = spawn('div', this.view, { className: 'customerPhoneWrapper', style: { display: 'flex' } }, [
    this.phoneLabel1 = spawn('input', null, { className: 'customerPhoneLabel', placeholder: 'phoneLabel1' }),
    this.phoneLabel2 = spawn('input', null, { className: 'customerPhoneLabel', placeholder: 'phoneLabel2' }),
    this.phoneLabel3 = spawn('input', null, { className: 'customerPhoneLabel', placeholder: 'phoneLabel3' }),
  ]);

  this.email = spawn('input', this.view, { className: 'customerEmail', placeholder: 'email' });
}

CustomerView.prototype.getTitle = function() {
  return 'Customer';
}