function CallsheetList(parent, props) {
  var that = me(this, props);
  this.view = spawn('div', parent, { style: { width: '100%', height: '100%' } });

  this.layoutView = spawn('div', this.view, { style: { display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' } }, [
    this.row1 = spawn('div', null, { style: { flex: '1', display: 'flex' } }, [
      this.row1Col1 = spawn('div', null, { style: { flex: '1' } }, [
        new JobView(),
      ]),
      this.row1Col2 = spawn('div', null, { style: { flex: '1' } }, [
        new JobView(),
      ]),
    ]),
    this.row1 = spawn('div', null, { style: { flex: '1', display: 'flex' } }, [
      this.row1Col1 = spawn('div', null, { style: { flex: '1' } }, [
        new JobView(),
      ]),
      this.row1Col2 = spawn('div', null, { style: { flex: '1' } }, [
        new JobView(),
      ]),
    ]),
  ]);

}