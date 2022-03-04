const bindAndIssueResponse = {
    result: {
        sessionUUID: 'd88f8868-cdc0-4126-8d0f-2eb59a2bfb80',
        quoteID: '0000000700',
        baseData: {
            periodStatus: 'Binding',
            accountHolder: {
                emailAddress1: 'autoTest150221122803@automation.com',
                publicID: 'csdt2:10479',
                displayName: 'Dan Fan',
                primaryPhoneType: 'home',
                homeNumber: '1234567890',
                subtype: 'Person',
                primaryAddress: {
                    linkedID: 'csdt2:27070',
                    publicID: 'csdt2:7128',
                    displayName: '8 Eastwood Road, BEXHILL-ON-SEA, TN393PS',
                    addressLine1: '8 Eastwood Road',
                    city: 'BEXHILL-ON-SEA',
                    county: 'East Sussex',
                    postalCode: 'TN393PS',
                    country: 'GB',
                    addressType: 'home'
                },
                additionalAddresses: [],
                accountHolder: true,
                cellNumber: '1234567890',
                dateOfBirth: {
                    year: 1979,
                    month: 0,
                    day: 1
                },
                gender: 'M',
                firstName: 'Dan',
                lastName: 'Fan',
                prefix: '003_Mr',
                licenseState: 'GB',
                maritalStatus: 'S'
            },
            termType: 'Annual',
            trackingCode: [{
                codeValue: 'DefaultDefaultCampaign'
            }],
            numberOfCarsOnHousehold: 2,
            producerCode: 'Default',
            brandCode: 'YD',
            insurer: '437',
            isPostalDocument: false,
            marketingContacts: {
                allowEmail: true,
                allowTelephone: true,
                allowSMS: true,
                allowPost: true
            },
            isExistingCustomer: false,
            accountNumber: '10000000589',
            productCode: 'PrivateCar_Ext',
            policyAddress: {
                linkedID: 'csdt2:27070',
                publicID: 'csdt2:7128',
                displayName: '8 Eastwood Road, BEXHILL-ON-SEA, TN393PS',
                addressLine1: '8 Eastwood Road',
                city: 'BEXHILL-ON-SEA',
                county: 'East Sussex',
                postalCode: 'TN393PS',
                country: 'GB',
                addressType: 'home'
            },
            periodStartDate: {
                year: 2022,
                month: 2,
                day: 12
            },
            periodEndDate: {
                year: 2023,
                month: 2,
                day: 12
            },
            productName: 'Private Car',
            jobType: 'Submission'
        },
        lobData: {
            privateCar: {
                preQualQuestionSets: [],
                coverables: {
                    drivers: [{
                        fixedId: 103959,
                        publicID: 'csdt2:104212',
                        person: {
                            publicID: 'csdt2:17366',
                            displayName: 'Add Fan',
                            firstName: 'Add',
                            lastName: 'Fan',
                            prefix: '003_Mr',
                            maritalStatus: 'S',
                            dateOfBirth: {
                                year: 1985,
                                month: 3,
                                day: 12
                            }
                        },
                        displayName: 'Add Fan',
                        licenseState: 'GB',
                        dateOfBirth: {
                            year: 1985,
                            month: 3,
                            day: 12
                        },
                        gender: 'M',
                        isPolicyHolder: false,
                        isPolicyOwner: false,
                        licenceHeldFor: '3',
                        licenceObtainedDate: {
                            year: 2019,
                            month: 2,
                            day: 11
                        },
                        licenceType: 'F_FM',
                        maritalStatus: 'S',
                        resUKSinceBirth: true,
                        residingInUKSince: {
                            year: 1985,
                            month: 3,
                            day: 12
                        },
                        accessToOtherVehicles: 'named_driver',
                        dvlaReportedMedCond: '99_NO',
                        relationToProposer: 'A',
                        fullEmpStatus: 'R',
                        occupationFull: 'R09',
                        businessTypeFull: '947',
                        isTemporaryDriver: false,
                        claimsAndConvictions: {
                            anyClaims: false,
                            anyConvictions: false,
                            unspentNonMotorConvictions: false,
                            claimsDetailsCollection: [],
                            convictionsCollection: []
                        },
                        previousPoliciesInformation: {
                            hadInsurancePolicyDeclinedCancelledVoidedOrSpecialTerms: false,
                            hadInsurancePolicyCancelledOrDeclined: false,
                            hadInsurancePolicyVoided: false,
                            hadInsurancePolicyWithSpecialTerms: false
                        },
                        hasPartTimeEmp: false
                    }, {
                        fixedId: 12187,
                        publicID: 'csdt2:104211',
                        person: {
                            publicID: 'csdt2:10479',
                            displayName: 'Dan Fan',
                            firstName: 'Dan',
                            lastName: 'Fan',
                            prefix: '003_Mr',
                            primaryPhoneType: 'home',
                            homeNumber: '1234567890',
                            cellNumber: '1234567890',
                            maritalStatus: 'S',
                            dateOfBirth: {
                                year: 1979,
                                month: 0,
                                day: 1
                            }
                        },
                        displayName: 'Dan Fan',
                        licenseState: 'GB',
                        dateOfBirth: {
                            year: 1979,
                            month: 0,
                            day: 1
                        },
                        gender: 'M',
                        isPolicyHolder: true,
                        isPolicyOwner: true,
                        licenceHeldFor: '3',
                        licenceObtainedDate: {
                            year: 2019,
                            month: 1,
                            day: 15
                        },
                        licenceType: 'F_FM',
                        maritalStatus: 'S',
                        resUKSinceBirth: true,
                        residingInUKSince: {
                            year: 1979,
                            month: 0,
                            day: 1
                        },
                        accessToOtherVehicles: 'no',
                        dvlaReportedMedCond: '99_NO',
                        fullEmpStatus: 'F',
                        occupationFull: 'S48',
                        businessTypeFull: '950',
                        isTemporaryDriver: false,
                        claimsAndConvictions: {
                            anyClaims: false,
                            anyConvictions: false,
                            unspentNonMotorConvictions: false,
                            claimsDetailsCollection: [],
                            convictionsCollection: []
                        },
                        previousPoliciesInformation: {
                            hadInsurancePolicyDeclinedCancelledVoidedOrSpecialTerms: false,
                            hadInsurancePolicyCancelledOrDeclined: false,
                            hadInsurancePolicyVoided: false,
                            hadInsurancePolicyWithSpecialTerms: false
                        },
                        hasPartTimeEmp: false,
                        ownYourHome: true,
                        yearsLivedAtCurrentAddress: '4',
                        anyChildrenUnder16: false
                    }],
                    vehicles: [{
                        fixedId: 9018,
                        publicID: 'csdt2:62904',
                        license: 'ST1',
                        vehicleNumber: 1,
                        registrationsNumber: 'ST1',
                        year: 2012,
                        make: 'FORD',
                        model: 'FIESTA FREESTYLE',
                        annualMileage: 5000,
                        displayName: 'FORD FIESTA FREESTYLE (2002) ST1',
                        body: 'HATCHBACK',
                        yearManufactured: 2002,
                        transmission: '002',
                        engineSize: 1242,
                        importType: 'no',
                        numberOfSeats: 5,
                        alarmImmobilizer: '93',
                        drivingSide: 'R',
                        purchaseDate: '2021-02-01T00:00:00Z',
                        vehicleWorth: 40000.00,
                        typeOfUse: '04',
                        overnightParkingArrangements: '1',
                        isCarModified: false,
                        bodyCode: '13',
                        isOvernightLocationHome: true,
                        isVehicleBought: false,
                        coverType: 'tpft',
                        overnightLocationPostcode: 'TN393PS',
                        registeredKeeper: '1_PR',
                        legalOwner: '1_PR',
                        isRegisteredKeeperAndLegalOwner: true,
                        vehicleModifications: [],
                        tracker: false,
                        voluntaryExcess: '0',
                        changeEffectiveDate: '2022-03-12T00:01:00Z',
                        ncdProtection: {
                            ncdearnedInUkFlag: true,
                            ncdgrantedYears: '4',
                            ncdsource: '11',
                            drivingExperience: {
                                protectNCD: false
                            }
                        },
                        abiCode: '17537602',
                        insurancePaymentType: '3',
                        numberOfDoors: 5
                    }],
                    vehicleDrivers: [{
                        driverID: 103959,
                        vehicleID: 9018
                    }, {
                        driverID: 12187,
                        vehicleID: 9018
                    }],
                    addInterestTypeCategory: 'PAVhcleAddlInterest'
                },
                offerings: [{
                    branchName: 'YouDrive',
                    branchCode: 'YD',
                    coverages: {
                        vehicleCoverages: [{
                            publicID: 'csdt2:62904',
                            fixedId: 9018,
                            vehicleName: '2002 FORD FIESTA FREESTYLE (ST1/ST1)',
                            coverages: [{
                                name: 'Driving Other Cars',
                                updated: false,
                                terms: [],
                                selected: false,
                                required: false,
                                publicID: 'PCDrivingOtherCarsCov_Ext',
                                description: 'Driving Other Cars',
                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                hasTerms: true,
                                isValid: true
                            }, {
                                name: 'Liability to third parties',
                                updated: false,
                                terms: [{
                                    publicID: 'PCLiabilitiesTPLimitLgExpCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Limit - Legal Expenses',
                                    coveragePublicID: 'PCLiabilityThirdPartiesCov_Ext',
                                    patternCode: 'PCLiabilitiesTPLimitLgExpCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '5000000.0000',
                                    chosenTermValue: '5,000,000',
                                    directValue: 5000000.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }, {
                                    publicID: 'PCLiabilitiesTPLimitPropDmgCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Limit - Property Damage',
                                    coveragePublicID: 'PCLiabilityThirdPartiesCov_Ext',
                                    patternCode: 'PCLiabilitiesTPLimitPropDmgCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '20000000.0000',
                                    chosenTermValue: '20,000,000',
                                    directValue: 20000000.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }],
                                selected: true,
                                required: true,
                                publicID: 'PCLiabilityThirdPartiesCov_Ext',
                                description: 'Liability to third parties',
                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                hasTerms: true,
                                isValid: true
                            }, {
                                name: 'Loss by Fire and Theft',
                                updated: false,
                                terms: [{
                                    publicID: 'PCLossFireTheftCompExcessCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Compulsory Fire and Theft Excess',
                                    coveragePublicID: 'PCLossFireTheftCov_Ext',
                                    patternCode: 'PCLossFireTheftCompExcessCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '95.0000',
                                    chosenTermValue: '95',
                                    directValue: 95.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }, {
                                    publicID: 'PCLossFireTheftVolExcessCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Voluntary Excess',
                                    coveragePublicID: 'PCLossFireTheftCov_Ext',
                                    patternCode: 'PCLossFireTheftVolExcessCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '0.0000',
                                    chosenTermValue: '0',
                                    directValue: 0.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }],
                                selected: true,
                                required: true,
                                publicID: 'PCLossFireTheftCov_Ext',
                                description: 'Loss by Fire and Theft',
                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                hasTerms: true,
                                isValid: true
                            }, {
                                name: 'Theft of Keys/Transmitter',
                                updated: false,
                                terms: [{
                                    publicID: 'PCTheftKeyTransCompFnTheftCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Compulsory Fire and Theft Excess',
                                    coveragePublicID: 'PCTheftKeysTransmitterCov_Ext',
                                    patternCode: 'PCTheftKeyTransCompFnTheftCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '95.0000',
                                    chosenTermValue: '95',
                                    directValue: 95.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }, {
                                    publicID: 'PCTheftKeyTransVolExcessCT_Ext',
                                    type: 'DirectCovTerm',
                                    name: 'Voluntary Excess',
                                    coveragePublicID: 'PCTheftKeysTransmitterCov_Ext',
                                    patternCode: 'PCTheftKeyTransVolExcessCT_Ext',
                                    options: [{
                                        name: 'None Selected'
                                    }],
                                    chosenTerm: '0.0000',
                                    chosenTermValue: '0',
                                    directValue: 0.0000,
                                    isAscendingBetter: true,
                                    updated: false,
                                    valueType: 'Money',
                                    required: false
                                }],
                                selected: true,
                                required: true,
                                publicID: 'PCTheftKeysTransmitterCov_Ext',
                                description: 'Theft of Keys/Transmitter',
                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                hasTerms: true,
                                isValid: true
                            }]
                        }],
                        ancillaryCoverages: [{
                            publicID: 'csdt2:62904',
                            fixedId: 9018,
                            vehicleName: '2002 FORD FIESTA FREESTYLE (ST1/ST1)',
                            coverages: [{
                                name: 'Breakdown',
                                updated: false,
                                terms: [],
                                selected: false,
                                required: false,
                                publicID: 'ANCBreakdownCov_Ext',
                                description: 'Breakdown',
                                amount: {
                                    amount: 34.99,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                hasTerms: true,
                                isValid: true
                            }, {
                                name: 'Motor Legal Expenses',
                                updated: false,
                                terms: [],
                                selected: true,
                                required: false,
                                publicID: 'ANCMotorLegalExpensesCov_Ext',
                                description: 'Motor Legal Expenses',
                                amount: {
                                    amount: 29.99,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                hasTerms: false,
                                isValid: true
                            }, {
                                name: 'Motor Personal Accident',
                                updated: false,
                                terms: [],
                                selected: true,
                                required: false,
                                publicID: 'ANCMotorPersonalAccidentCov_Ext',
                                description: 'Motor Personal Accident',
                                amount: {
                                    amount: 29.99,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                hasTerms: false,
                                isValid: true
                            }, {
                                name: 'Substitute Vehicle',
                                updated: false,
                                terms: [],
                                selected: false,
                                required: false,
                                publicID: 'ANCSubstituteVehicleCov_Ext',
                                description: 'Substitute Vehicle',
                                amount: {
                                    amount: 27.50,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                hasTerms: false,
                                isValid: true
                            }, {
                                name: 'Windows and Windscreen Insurance',
                                updated: false,
                                terms: [],
                                selected: false,
                                required: false,
                                publicID: 'ANCWindowsWindscreenInsCov_Ext',
                                description: 'Windows and Windscreen Insurance',
                                amount: {
                                    amount: 0.00,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                hasTerms: false,
                                isValid: true
                            }, {
                                name: 'Key Cover',
                                updated: false,
                                terms: [],
                                selected: false,
                                required: false,
                                publicID: 'ANCKeyCoverCov_Ext',
                                description: 'Key Cover',
                                amount: {
                                    amount: 15.99,
                                    currency: 'gbp'
                                },
                                coverageCategoryCode: 'AncStandardEXT',
                                coverageCategoryDisplayName: 'Ancillary Line Standard Coverages',
                                hasTerms: false,
                                isValid: true
                            }]
                        }]
                    }
                }]
            }
        },
        bindData: {
            policyNumber: '20000000271'
        },
        passwordToken: {
            token: 'PT20xlpAoF',
            ttlInMins: 13
        },
        errorsAndWarnings: {}
    },
    jsonrpc: '2.0'
};

export default bindAndIssueResponse;
