function HomeView(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { style: { display: 'flex', height: '100%' } });

  this.firstView = spawn('div', this.view, { style: { flex: '1', height: '100%', overflow: 'auto', backgroundColor: '#fff' } }, [
    spawn('div', null, { style: { padding: '5px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333' }}, [
      spawn('span', null, {}, "Today's appointment list"),
      this.techSelect = spawn('select', null, { onchange: function(){that.triggerTechChange()} }),
    ]),
    this.scheduleList = new ScheduleList(null, { prefilters: this.makeFiltersForSchedule(), limit: 20 }),
  ]);
  this.secondView = spawn('div', this.view, { style: { flex: '0 0 200px', fontSize: '12px', height: '100%', overflow: 'auto', backgroundColor: '#fff', marginLeft: '4px' } }, [
    new LiveFeedView(),
  ]);

  this.loadData();
  this.techs = [];
}

HomeView.prototype.getSelectedTech = function() {
  if (this.techSelect.selectedIndex < 0) return undefined;
  return this.techs[this.techSelect.selectedIndex];
}

HomeView.prototype.triggerTechChange = function() {
  this.scheduleList.prefilters = this.makeFiltersForSchedule();
  this.scheduleList.reload();
}

HomeView.prototype.getTodayFilterString = function() {
  var date = new Date();
  return '' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + ['MON','TUE','WED','THU','FRI','SAT','SUN'][date.getDay()-1];
}

HomeView.prototype.makeFiltersForSchedule = function() {
  var ret = [{ sub: 'DtTm', verb: 'start', obj: this.getTodayFilterString() }];
  var tech = this.getSelectedTech();
  if (tech) {
    ret.push({ sub: 'AssndTch', verb: 'eq', obj: tech.TwoLttrCd });
  }
  return ret;
}

HomeView.prototype.displayTechs = function() {
  var that = this;
  removeAllChildren(this.techSelect);
  (this.techs || []).forEach(function(tech) {
    spawn('option', that.techSelect, {}, tech ? tech.TechName : 'All');
  });
}

HomeView.prototype.loadData = function() {
  var that = this;
  list('Techs').then(function(data){
    if (data.SUCCESS) {
      that.techs = [undefined].concat(data.RESULTS.sort(function(a,b){
        if (a.TechName < b.TechName) return -1;
        else if (a.TechName > b.TechName) return 1;
        return 0;
      }));
      that.displayTechs();
    }
  });
}