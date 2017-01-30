var MapView = function(parent, props) {
  var that = me(this, props);
  mixinAutoState(that);
  this.view = spawn('div', parent, { className: 'mapView' });
  this.mapWrapper = spawn('div', this.view, { style: { width: '100%', height: '100%' } } );

  if (document.getElementById('gmapscript')==null){
    var script = document.createElement('script');
    script.id='gmapscript';
    script.src = "https://maps.googleapis.com/maps/api/js" + (GMAPS_API_KEY ? '?key=' + GMAPS_API_KEY : '*** SET YOUR GMAPS_API_KEY in config.js ***');
    script.onload = function () {
      that.loadMap();
    };

    document.head.appendChild(script);
  }
  else{
    that.loadMap();
  }
}

MapView.prototype.loadMap = function() {
  var that = this;
  if (!this.map) {
    this.map = new google.maps.Map(this.mapWrapper, {
      center: new google.maps.LatLng(40, -100),
      zoom: 4,
      mapTypeId: 'roadmap',
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });
    google.maps.event.addListenerOnce(this.map, 'idle', function() {
      google.maps.event.trigger(that.map, 'resize');
    });
  }
  return this.map;
}

// MapView.prototype.getJobs = function(limit, page) {
//   var that = this;
//   console.log('getjobs', limit, page);
//   return new Promise(function(resolve, reject){
//     list('Wip', limit, page).then(function(data){
//       var children = data.RESULTS.map(function(job){
//         var passData = translateJobFromRW(job);
//         return spawn('div', null, { className: 'jobLineItem', style: { height: '40px', marginBottom: '5px' }, onclick: function(){that.showJob(passData);}}, [
//           spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.customer.name),
//           spawn('span', null, { style: { flex: '2', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px' } }, passData.description),
//           spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'left' } }, passData.status),
//           spawn('span', null, { style: { flex: '1', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px', marginRight: '5px', textAlign: 'right' } }, passData.id),
//         ]);
//       }) || [];
//       resolve(children);
//     });
//   });
// }

// MapView.prototype.showJob = function(jobData) {
//   var job = new JobView();
//   job.setState(jobData);
//   job.navPush = this.navPush;
//   job.navPop = this.navPop;
//   this.navPush(job);
// }

MapView.prototype.getTitle = function() {
  return 'map view';
}