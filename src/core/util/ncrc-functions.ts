export const getNcrcNigerianContentCalculations = (data: any) => {
  const pointMapping = {
    nigerianEquityPercent: {
      'below-9.9': 0,
      'between-10-20': 30,
      'between-21-50': 30,
      'between-51-100': 30,
    },
    procuredNigMaterials: {
      'less-than-70': 0,
      'more-than-70': 10,
    },
    nigPersonnelCrew: {
      'less-than-70': 0,
      'more-than-70': 10,
    },
    valueOfLogistics: {
      'less-than-70': 0,
      'more-than-70': 10,
    },
    maintenanceServices: {
      'less-than-70': 0,
      'more-than-70': 10,
    },
    specialisedServices: {
      'less-than-60': 0,
      'more-than-60': 10,
    },
    nigPersonnelSenior: {
      'less-than-60': 0,
      'more-than-60': 10,
    },
    totalSubcontract: {
      'less-than-60': 0,
      'above-60': 30,
    },
    agreementNigCompany: {
      yes: 10,
      no: 0,
    },
    evidenceEqApproval: {
      yes: 10,
      no: 0,
    },
    workOverAsset: {
      yes: 30,
      no: 0,
    },
    periodRigNigeria: {
      'less-than-5-years': 0,
      'more-than-5-years': 10,
    },
    proceedsNigBank: {
      'less-than-51': 0,
      'between-51-89': 10,
      '90-100': 10,
    },
    manufacturedNigMaterials: {
      'less-than-30': 0,
      'more-than-30': 10,
    },
    cateringServices: {
      'less-than-99': 0,
      'exactly-100': 10,
    },
    housekeepingServices: {
      'less-than-99': 0,
      'exactly-100': 10,
    },
    wasteManagement: {
      'less-than-99': 0,
      'exactly-100': 10,
    },
    securityServices: {
      'less-than-99': 0,
      'exactly-100': 10,
    },
  };

  let point = 0; // Initialize total points to 0

  for (const property in pointMapping) {
    if (
      data.hasOwnProperty(property) &&
      pointMapping[property][data[property]] !== undefined
    ) {
      point += pointMapping[property][data[property]];
    }
  }

  return point; // Return the total points
};
