function translateApptFromRW(data) {
  return {
    id: data.SdmID,
    jobID: data.Inv,
    name: data.name,
    time: data.DtTm,
    tech: data.AssndTch,
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

function translateJobFromRW(data) {
  return {
    customer: {
      name: data.CstmrNm,
      address: data.CstmrAddrs,
      address2: data.CstmrCty,
      phone1: data.CstmrTel1,
      phone2: data.CstmrTel2,
      phone3: data.CstmrTel3,
      phoneLabel1: data.CTelSffx1,
      phoneLabel2: data.CTelSffx2,
      phoneLabel3: data.CTelSffx3,
      email: data.CstmrEmail,
    },
    location: {
      name: data.LctnNm,
      address: data.LctnAddrs,
      address2: data.LctnCty,
      phone1: data.LctnTel1,
      phone2: data.LctnTel2,
      phone3: data.LctnTel3,
      phoneLabel1: data.LTelSffx1,
      phoneLabel2: data.LTelSffx2,
      phoneLabel3: data.LTelSffx3,
      email: data.LctnEmail,
    },
    schedule: { statusDropdown: data.Status},
    note: { note: data.History },
    id: data.Inv,
    description: data.Dscrptn,
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