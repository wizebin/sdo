var SidePanel = function(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { className: 'sideView', style: { overflow: 'auto', height: '100%' } });
  this.navDiv = spawn('div', this.view, { className: 'sideNav' }, [
    spawn('div', null, { className: 'sideSvgButton', style: { display: 'flex', flexDirection: 'row' } }, [
      this.homeButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Home') } }, [new HomeSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Home')]),
      this.jobListButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Jobs') } }, [new WrenchSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Job List')]),
    ]),
    spawn('div', null, { className: 'sideSvgButton', style: { display: 'flex', flexDirection: 'row' } }, [
      this.callsheetButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Callsheets') } }, [new CallsheetSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Callsheets')]),
      this.mapButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Map') } }, [new MapPinSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Map')]),
    ]),
    spawn('div', null, { className: 'sideSvgButton', style: { display: 'flex', flexDirection: 'row' } }, [
      this.rolodexButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Rolodex') } }, [new RolodexSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Rolodex')]),
      this.partsListButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Parts') } }, [new TruckSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Parts')]),
    ]),
    spawn('div', null, { className: 'sideSvgButton', style: { display: 'flex', flexDirection: 'row' } }, [
      this.accountingButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Accounting') } }, [new CalculatorSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Accounting')]),
      this.reportsButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Reports') } }, [new GraphSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Reports')]),
    ]),
    spawn('div', null, { className: 'sideSvgButton', style: { display: 'flex', flexDirection: 'row' } }, [
      this.GenericListButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Debug List') } }, [new SettingsSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'List')]),
      this.apptListButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav( 'Appts') } }, [new AppointmentSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Appts')]),
    ]),
    // this.messagesButton = spawn('div', null, { className: 'navButton', onclick: function(){ that.nav('Messages') } }, [new MessageSvg(), spawn('span', null, { style: { marginTop: '5px' } }, 'Messages')]),
  ]);
}
