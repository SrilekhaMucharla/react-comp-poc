
const submission = {
    quotes: [
        {
            baseData: {
                accountHolder: { dateOfBirth: null },
                periodStatus: 'Draft',
                producerCode: 'Default',
                termType: 'Annual',
                isPostalDocument: false,
                marketingContacts: {
                    allowSMS: false,
                    allowPost: false,
                    allowEmail: false,
                    allowTelephone: false
                },
                isExistingCustomer: false,
                jobType: 'Submission',
                productCode: 'PrivateCar_Ext',
                policyAddress: {},
                productName: 'Private Car'
            },
            lobData: {
                privateCar: {
                    preQualQuestionSets: [],
                    coverables: {
                        drivers: [{
                            dateOfBirth: { year: 1987, month: 3, day: 1 },
                            residingInUKSince: null,
                            licenceObtainedDate: null,
                            previousPoliciesInformation: {},
                            claimsAndConvictions: {
                                claimsDetailsCollection: [],
                                convictionsCollection: []
                            },
                            person: {
                                prefix: {}
                            },
                            // fixed tempID to avoid any collision in snapshots
                            tempID: 'dd309e0e-8153-423c-aaa5-9930481060ad'
                        }],
                        vehicleDrivers: [{}],
                        addInterestTypeCategory: 'PAVhcleAddlInterest',
                        vehicles: [
                            {
                                license: 'AV1BGE',
                                vehicleWorth: '',
                                vehicleModifications: [],
                                isCarModified: '',
                                tracker: '',
                                ncdProtection: {
                                    drivingExperience: {}
                                }
                            }
                        ]
                    }
                }
            }
        },
        {
            baseData: {
                accountHolder: { dateOfBirth: null },
                periodStatus: 'Draft',
                producerCode: 'Default',
                termType: 'Annual',
                isPostalDocument: false,
                marketingContacts: {
                    allowSMS: false,
                    allowPost: false,
                    allowEmail: false,
                    allowTelephone: false
                },
                isExistingCustomer: false,
                jobType: 'Submission',
                productCode: 'PrivateCar_Ext',
                policyAddress: {},
                productName: 'Private Car'
            },
            lobData: {
                privateCar: {
                    preQualQuestionSets: [],
                    coverables: {
                        drivers: [{
                            dateOfBirth: { year: 1987, month: 3, day: 1 },
                            residingInUKSince: null,
                            licenceObtainedDate: null,
                            previousPoliciesInformation: {},
                            claimsAndConvictions: {
                                claimsDetailsCollection: [],
                                convictionsCollection: []
                            },
                            person: {
                                prefix: {}
                            },
                            // fixed tempID to avoid any collision in snapshots
                            tempID: 'dd309e0e-8153-423c-aaa5-9930481060ad'
                        }],
                        vehicleDrivers: [{}],
                        addInterestTypeCategory: 'PAVhcleAddlInterest',
                        vehicles: [
                            {
                                license: 'S6TAY',
                                vehicleWorth: '',
                                vehicleModifications: [],
                                isCarModified: '',
                                tracker: '',
                                ncdProtection: {
                                    drivingExperience: {}
                                }
                            }
                        ]
                    }
                }
            }
        }
    ]
};

export default submission;
