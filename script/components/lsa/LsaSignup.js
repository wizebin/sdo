function LsaSignupView(parent, props) {
  var that = me(this);
  this.view = spawn('div', parent, this.style);

  spawn('div', this.view, {}, [
    spawn('span', null, {}, 'Local Servicer Signup')
  ]);

  spawn('div', this.view, { className: 'signupBlock', style: { borderBottom: '1px solid #979797', marginTop: '8px', padding: '20px', display: 'flex', backgroundColor: '#F5F4F4' } }, [
    spawn('span', null, { style: { marginRight: '20px' } }, 'Company Name'),
    spawn('input', null, { style: { flex: '1' } }),
  ]);

  spawn('div', this.view, { className: 'signupBlock', style: { borderBottom: '1px solid #979797', padding: '20px', display: 'flex', backgroundColor: '#EFECEC', flexDirection: 'column' } }, [
    spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
      spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'Address'),
      spawn('input', null, { style: { flex: '1' } }),
    ]),
    spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
      spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'Address 2'),
      spawn('input', null, { style: { flex: '1' } }),
    ]),
    spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
      spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'City'),
      spawn('input', null, { style: { flex: '1' } }),
    ]),
    spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
      spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'State'),
      spawn('input', null, { style: { flex: '1' } }),
    ]),
    spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
      spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'Zip'),
      spawn('input', null, { style: { flex: '1' } }),
    ]),
  ]);

  spawn('div', this.view, { className: 'signupBlock', style: { borderBottom: '1px solid #979797', display: 'flex', backgroundColor: '#E8E8E8', flexDirection: 'column' } }, [
    spawn('div', null, { style: { display: 'flex', padding: '20px', borderBottom: '1px solid #aaa' } }, [
      spawn('span', null, { style: { marginRight: '10px' } }, 'Types of work'),
      spawn('span', null, { style: { color: '#666464' } }, '(you can pick multiple)'),
    ]),
    spawn('div', null, { style: { padding: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } }, [
      spawn('div', null, { className: 'workTypeBox' }, new CarSvg(null, { style: { flex: '1' } })),
      spawn('div', null, { className: 'workTypeBox' }, new BikeSvg(null, { style: { flex: '1' } })),
      spawn('div', null, { className: 'workTypeBox' }, new ScooterSvg(null, { style: { flex: '1' } })),
    ])
  ]);

  spawn('div', this.view, { className: 'signupBlock', style: { borderBottom: '1px solid #979797', display: 'flex', backgroundColor: '#E8E8E8', flexDirection: 'row' } }, [

    spawn('div', null, { style: { flex: '1' }}, [
      spawn('div', null, { style: { display: 'flex', padding: '20px', borderBottom: '1px solid #aaa' } }, [
        spawn('span', null, { style: { marginRight: '10px' } }, 'Communication methods'),
      ]),
      spawn('div', null, { style: { padding: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } }, [
        spawn(PhoneSvg, null, { style: { flex: '1' } }),
        spawn(MessageSvg, null, { style: { flex: '1' } }),
        spawn(SmsSvg, null, { style: { flex: '1' } }),
      ]),
    ]),

    spawn('div', null, { style: { flex: '1', borderLeft: '1px solid #aaa' }}, [
      spawn('div', null, { style: { display: 'flex', padding: '20px', borderBottom: '1px solid #aaa' } }, [
        spawn('span', null, { style: { marginRight: '10px' } }, 'Login Credentials'),
      ]),
      spawn('div', null, { style: { padding: '20px', display: 'flex', flexDirection: 'column' } }, [
        spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
          spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'Username'),
          spawn('input', null, { style: { flex: '1' } }),
        ]),
        spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
          spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 80px' } }, 'Password'),
          spawn('input', null, { style: { flex: '1' } }),
        ]),
      ]),
    ]),

  ]);

  spawn('div', this.view, { className: 'signupBlock', style: { borderBottom: '1px solid #979797', display: 'flex', backgroundColor: '#E8E8E8', flexDirection: 'row' } }, [
    spawn('div', null, { style: { flex: '0 0 275px' }}, [
      spawn('div', null, { style: { display: 'flex', padding: '20px', borderBottom: '1px solid #aaa' } }, [
        spawn('span', null, { style: { marginRight: '10px' } }, 'Payment Method'),
      ]),
      spawn('div', null, { style: { padding: '20px 0px 20px 20px', display: 'flex', flexDirection: 'column' } }, [
        spawn('div', null, { className: 'paymentOptionDiv' }, 'Electronic Funds Transfer (EFT)'),
        spawn('div', null, { className: 'paymentOptionDiv' }, 'Credit Card (via Phone Call)'),
        spawn('div', null, { className: 'paymentOptionDiv' }, 'Check'),
      ]),
    ]),

    spawn('div', null, { style: { flex: '3', borderLeft: '1px solid #aaa' }}, [
      spawn('div', null, { style: { padding: '20px', display: 'flex', flexDirection: 'column' } }, [
        spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
          spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 140px' } }, 'Bank Name'),
          spawn('input', null, { style: { flex: '1' } }),
        ]),
        spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
          spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 140px' } }, 'Account Number'),
          spawn('input', null, { style: { flex: '1' } }),
        ]),
        spawn('div', null, { style: { display: 'flex', height: '32px', marginBottom: '4px' } }, [
          spawn('span', null, { style: { alignSelf: 'center', flex: '0 0 140px' } }, 'Routing Number'),
          spawn('input', null, { style: { flex: '1' } }),
        ]),
      ]),
    ]),
  ]);
}