function SvgButton(parent, props, svg, title) {
  var that = me(this, props);
  this.view = spawn('div', parent, { style: objectAssign({ display: 'flex', flexDirection: 'row' }, this.style), onclick: this.onclick }, [
    svg,
    spawn('span', null, { flex: '1' }, title),
  ]);
}