function make24Hours(startTime, endTime) {
  if (startTime >= endTime) {
    endTime += 12;
  } else if (startTime < 6) {
    startTime += 12;
    endTime += 12;
  }
  return {start: startTime, duration: endTime - startTime};
}

function translateTimeframe(timeframe) {
  if (timeframe.length === 0) return undefined;
  if (timeframe[0] === '!') return {start: 8, duration: 12};
  var components = timeframe.split('-');
  if (components.length === 1) {
    if (components[0]=='AM') return {start: 6, duration: 6};
    if (components[0]=='PM') return {start: 12, duration: 6};

    if (!isNaN(Number(components[0]))) {
      return {start: Number(components[0]), duration: 4};
    } else {
      return {start: 6, duration: 14};
    }
  } else {
    var start = Number(components[0]);
    var end = Number(components[1].split(' ')[0]);
    if (!isNaN(start) && !isNaN(end)) {
      return make24Hours(start, end);
    }
  }
  return undefined;
}

function translateDate(appt, jobCreateYear) {
  if (appt === undefined || appt === null) return undefined;
  if (jobCreateYear === undefined){jobCreateYear = new Date().getFullYear();}

  var dateComponents = appt.split(' ');
  if (dateComponents.length < 3) return undefined;

  var monthDay = dateComponents[0].split('/');
  if (monthDay.length < 2) return undefined;

  var month = monthDay[0];
  var day = monthDay[1];
  var weekday = dateComponents[1];

  var correctYearDate = undefined;

  for(var testYear = jobCreateYear; testYear < jobCreateYear+10; testYear++) {
    var date = new Date();
    date.setFullYear(testYear);
    date.setMonth(month-1);
    date.setDate(day);

    var weekdayIndex = date.getDay();
    var testWeekday = ['MON','TUE','WED','THU','FRI','SAT','SUN'][weekdayIndex-1];
    if (testWeekday === weekday) {
      correctYearDate = date;
      break;
    }
  }

  if (correctYearDate !== undefined) {
    var timeframe = translateTimeframe(dateComponents[2]);
    if (timeframe) {
      correctYearDate.setHours(timeframe.start);
    }
    correctYearDate.setMinutes(0);
    correctYearDate.setSeconds(0);
    correctYearDate.setMilliseconds(0);
  }
  return correctYearDate;
}


function translateApptFromRW(data) {
  var jobs = (data.Wip || []).map(function(wip) {
    return translateJobFromRW(wip);
  });

  var date = translateDate(data.DtTm);

  return {
    id: data.SdmID,
    jobID: data.Inv,
    name: data.Nm,
    phone: data.Tel,
    city: data.City,
    time: formatDateSane(date),
    tech: data.AssndTch,
    original: data,
    job: jobs[0] || {},
  };
}

// Inv
// Nm
// Tel
// City
// DtTm
// AssndTch
// DefOrTent
// GrdPg
// GrdLttr
// GrdNmbr
// Chckd
// Zone
// Dept
// JbCnt
// IsTechLate
// NeedsUploaded
// SdmID
// GrdRefSspct
// ShpJb
// Fake
// Dummy
// organizationID

var JobStatStrings = [
 'Working to Schedule',
 'Currently Scheduled',
 'Dispatched to Tech',
 'Tech Reported',
 'Waiting for Parts',
 'Pending Authorization',
 'Completed',
 'Recorded to SlsJrnl',
 'Marked for Deletion',
 'Other',];

 var JobStatColors = {
 'Working to Schedule': '#afa',
 'Currently Scheduled': '#00a8ff',
 'Dispatched to Tech': '#28b333',
 'Tech Reported': '#ffa800',
 'Waiting for Parts': '#ccc',
 'Pending Authorization': '#faa',
 'Completed': '#faf',
 'Recorded to SlsJrnl': '#555',
 'Marked for Deletion': '#f66',
 'Other': '#eee'};

 function borderColorForStatus(status) {
  return JobStatColors[status] || '#eee';
 }

function stringStatus(statusNumber) {
  var statusIndex = Number(statusNumber);
  return JobStatStrings[statusIndex-1];
}

function translateName(incoming) {
  if (!incoming) return incoming;
  return upperAllFirst(incoming.split(',').reverse().join(' '));
}

function translateAddressLine(incoming) {
  if (!incoming) return incoming;
  return upperAllFirst(incoming).split('[')[0];
}

function translateJobFromRW(data) {
  if (!data) data = {};
  var appts = (data.Schd || []).map(function(schd) {
    return translateApptFromRW(schd);
  });

  return {
    customer: {
      name: translateName(data.CstmrNm),
      address: translateAddressLine(data.CstmrAddrs),
      address2: translateAddressLine(data.CstmrCty),
      phone1: data.CstmrTel1,
      phone2: data.CstmrTel2,
      phone3: data.CstmrTel3,
      phoneLabel1: data.CTelSffx1,
      phoneLabel2: data.CTelSffx2,
      phoneLabel3: data.CTelSffx3,
      email: data.CstmrEmail,
    },
    location: {
      name: translateName(data.LctnNm),
      address: translateAddressLine(data.LctnAddrs),
      address2: translateAddressLine(data.LctnCty),
      phone1: data.LctnTel1,
      phone2: data.LctnTel2,
      phone3: data.LctnTel3,
      phoneLabel1: data.LTelSffx1,
      phoneLabel2: data.LTelSffx2,
      phoneLabel3: data.LTelSffx3,
      email: data.LctnEmail,
    },
    schedule: { statusDropdown: stringStatus(data.Status), appts },
    note: { note: data.History },
    id: data.Inv,
    description: data.Dscrptn,
    status: stringStatus(data.Status),
    original: data,
  };
}

// AftrNtRcrdLoc:"0"
// ApplMk:"667"
// ApplTp:"something"
// Appmnt:"10/29 SAT !"
// AttnNts:""
// CTelSffx1:""
// CTelSffx2:""
// CTelSffx3:""
// Criteria:""
// CstmrAddrs:""
// CstmrCty:""
// CstmrEmail:""
// CstmrNm:"Updated Name"
// CstmrTel1:""
// CstmrTel2:""
// CstmrTel3:""
// Dscrptn:"Updated"
// EmailOptOut:""
// ExtraNotes:""
// History:"bloop"
// Inv:"120"
// LTelSffx1:""
// LTelSffx2:""
// LTelSffx3:""
// LctnAddrs:"222 ADDRESS ST."
// LctnCty:"FAKEVILLE, PA 66243 []"
// LctnEmail:"email@address.com"
// LctnNm:"NOWYOU, SEEME"
// LctnTel1:"222-333-4444"
// LctnTel2:""
// LctnTel3:""
// MoreInfo:""
// NeedsUploaded:"-1"
// OriginDate:"42672.2"
// OriginDesk:"SA "
// PreScreened:""
// ShopJob:"0"
// Status:"5"
// TxSchmItmID:"0"
// WantsSooner:"0"
// organizationID:"2"
