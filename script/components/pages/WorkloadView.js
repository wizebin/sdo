function WorkloadView(parent, props) {
  var that = me(this, props);

  this.date = new Date();

  this.view = spawn('div', parent, { style: { width: '100%', height: '100%' } });
  this.headerView = spawn('div', this.view, { style: { height: '30px', width: '100%', display: 'flex', justifyContent: 'center', margin: '20px' } }, [
    this.backDate = spawn('button', null, { onclick: function(){that.addDays(-1);} }, 'prev day'),
    this.dateView = spawn('div', null, { style: { margin: '5px' } }, formatDateSane(that.date)),
    this.forwardDate = spawn('button', null, { onclick: function(){that.addDays(1);} }, 'next day'),
  ]);
  this.subHeaderView = spawn('div', this.view, { style: { height: '30px', width: '100%', display: 'flex', justifyContent: 'center', margin: '10px' } }, [
    spawn('div', null, { style: { margin: '5px' } }, 'Total Appointments: '),
    this.totalView = spawn('div', null, { style: { margin: '5px' } }, '?'),
  ]);
  this.table = spawn('table', this.view, { style: { width: '100%' }});

  this.techViews = {};
  this.techCount = {};
  this.techCountViews = {};

  this.maxCount = 0;

  this.requestAndInitialize();
}

WorkloadView.prototype.addDays = function(quantity) {
  this.date.setDate(this.date.getDate() + quantity);
  this.dateView.innerHTML = formatDateSane(this.date);
  this.loadData();
}

WorkloadView.prototype.requestAndInitialize = function() {
  var that = this;
  this.techs = window.dataFeed.data.techs;
  if (this.techs) {
    this.initializeTechs();
  } else {
    window.dataFeed.request('Techs').then(function(data){
      if (data !== false) {
        that.techs = data;
        that.initializeTechs();
      }
    });
  }
}

WorkloadView.prototype.initializeTechs = function() {
  var that = this;
  if (this.techs) {
    this.techs.forEach(function(tech) {
      spawn('tr', that.table, {}, [
        spawn('td', null, { style: { whiteSpace: 'nowrap' } }, tech.TechName),
        that.techCountViews[tech._ORDINAL] = spawn('td', null, { style: { whiteSpace: 'nowrap' } }, ''),
        spawn('td', null, { style: { width: '100%', position: 'relative' } }, [
          spawn('div', null, { style: { position: 'absolute', left: '0px', bottom: '0px', right: '0px', top: '0px' } }, [
            that.techViews[tech._ORDINAL] = spawn('div', null, { className: 'barGraphDiv', style: { height: '100%' } }),
          ]),
        ]),
      ])
    });
    this.loadData();
  }
}

WorkloadView.prototype.makeFilters = function(tech) {
  var ret = [{ sub: 'DtTm', verb: 'start', obj: getFilterStringForDate(this.date) }];
  if (tech) {
    ret.push({ sub: 'AssndTch', verb: 'eq', obj: tech.TwoLttrCd });
  }
  return ret;
}

WorkloadView.prototype.redistributeGraph = function() {
  var that = this;
  var max = 0;
  var total = 0;
  this.techs.forEach(function(tech) {
    total += Number(that.techCount[tech._ORDINAL] || 0);
    that.totalView.innerHTML = total;
    if (Number(that.techCount[tech._ORDINAL]) > max) max = Number(that.techCount[tech._ORDINAL]);
  });
  if (max == 0) max = 1;
  this.techs.forEach(function(tech) {
    var percentage = Number(that.techCount[tech._ORDINAL] || 0) / max * 100;
    that.techCountViews[tech._ORDINAL].innerHTML = Number(that.techCount[tech._ORDINAL] || 0);
    that.techViews[tech._ORDINAL].style.width = '' + percentage + '%';
    that.techViews[tech._ORDINAL].style.opacity = '' + (percentage/100);
    that.techViews[tech._ORDINAL].style.backgroundColor = '#f00';
  });
}

WorkloadView.prototype.loadData = function() {
  var that = this;
  this.techCount = {};

  this.techs.forEach(function(tech) {
    count('Schd', that.makeFilters(tech)).then(function(data) {
      that.techCount[tech._ORDINAL] = data.SUCCESS && data.RESULTS && data.RESULTS[0].count;
      that.redistributeGraph();
    });
  });

}
