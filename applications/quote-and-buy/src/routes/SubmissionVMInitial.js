const submission = {
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
};

export default submission;
