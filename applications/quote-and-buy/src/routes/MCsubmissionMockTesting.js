const submission = {
    sessionUUID: '5edab358-780c-4938-9b38-c6f34236c020',
    mpwrapperNumber: '50000000196',
    mpwrapperJobNumber: '40000000196',
    quotes: [
        {
            quoteID: '0000003968',
            isParentPolicy: true,
            baseData: {
                periodStatus: 'Draft',
                termType: 'Annual',
                numberOfCarsOnHousehold: 5,
                producerCode: 'Default',
                brandCode: 'HD',
                isPostalDocument: false,
                marketingContacts: {
                    allowEmail: true,
                    allowTelephone: true,
                    allowSMS: true,
                    allowPost: true
                },
                isExistingCustomer: false,
                pccurrentDate: '2021-05-25T09:46:37Z',
                productCode: 'PrivateCar_Ext',
                policyAddress: {
                    linkedID: 'None',
                    publicID: 'csdt3:18932',
                    displayName: '6 Cromwell Road, ELY, CB61AS',
                    addressLine1: '6 Cromwell Road',
                    city: 'ELY',
                    county: 'Cambridgeshire',
                    postalCode: 'CB61AS',
                    country: 'GB',
                    addressType: 'home'
                },
                periodEndDate: {
                    year: 2022,
                    month: 5,
                    day: 2
                },
                periodStartDate: {
                    year: 2021,
                    month: 5,
                    day: 2
                },
                productName: 'Private Car',
                jobType: 'Submission'
            },
            lobData: {
                privateCar: {
                    preQualQuestionSets: [],
                    coverables: {
                        drivers: [
                            {
                                fixedId: 56928,
                                publicID: 'csdt3:56928',
                                person: {
                                    publicID: 'csdt3:18213',
                                    displayName: 'Manoj Howe',
                                    firstName: 'Manoj',
                                    lastName: 'Howe',
                                    prefix: '003_Mr',
                                    maritalStatus: 'S',
                                    dateOfBirth: {
                                        year: 1979,
                                        month: 10,
                                        day: 9
                                    }
                                },
                                displayName: 'Manoj Howe',
                                dateOfBirth: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                gender: 'M',
                                isPolicyHolder: true,
                                isPolicyOwner: true,
                                licenceHeldFor: '7',
                                licenceType: 'F_FM',
                                maritalStatus: 'S',
                                resUKSinceBirth: false,
                                residingInUKSince: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                accessToOtherVehicles: 'own_motorcycle',
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
                                ownYourHome: false,
                                yearsLivedAtCurrentAddress: '3',
                                anyChildrenUnder16: false
                            }
                        ],
                        vehicles: [
                            {
                                fixedId: 34810,
                                publicID: 'csdt3:34810',
                                license: 'AV12BGE',
                                vehicleNumber: 1,
                                registrationsNumber: 'AV12BGE',
                                year: 2012,
                                make: 'MERCEDES-BENZ',
                                model: 'E250 SPORT ED125 CDI BLUE',
                                annualMileage: 120000,
                                displayName: 'MERCEDES-BENZ E250 SPORT ED125 CDI BLUE (2012) AV12BGE',
                                body: 'SALOON',
                                yearManufactured: 2012,
                                transmission: '001',
                                engineSize: 2143,
                                importType: 'no',
                                numberOfSeats: 5,
                                alarmImmobilizer: '93',
                                drivingSide: 'R',
                                purchaseDate: '2021-04-30T23:00:00Z',
                                vehicleWorth: 40000,
                                typeOfUse: '04',
                                overnightParkingArrangements: '4',
                                isCarModified: false,
                                bodyCode: '02',
                                isOvernightLocationHome: true,
                                isVehicleBought: false,
                                coverType: 'comprehensive',
                                registeredKeeper: '1_PR',
                                legalOwner: '1_PR',
                                isRegisteredKeeperAndLegalOwner: true,
                                vehicleModifications: [],
                                tracker: true,
                                voluntaryExcess: '250',
                                changeEffectiveDate: '2021-05-27T23:01:00Z',
                                ncdProtection: {
                                    ncdProtectionAdditionalAmount: 0,
                                    ncdearnedInUkFlag: true,
                                    ncdsource: '11',
                                    drivingExperience: {}
                                },
                                abiCode: '32120102',
                                numberOfDoors: 4
                            }
                        ],
                        vehicleDrivers: [
                            {
                                driverID: 56928,
                                vehicleID: 34810
                            }
                        ],
                        addInterestTypeCategory: 'PAVhcleAddlInterest'
                    },
                    offerings: [
                        {
                            branchName: 'Hastings Direct',
                            branchCode: 'HD',
                            coverages: {
                                vehicleCoverages: [
                                    {
                                        publicID: 'csdt3:34810',
                                        fixedId: 34810,
                                        vehicleName: '2012 MERCEDES-BENZ E250 SPORT ED125 CDI BLUE (AV12BGE/AV12BGE)',
                                        coverages: [
                                            {
                                                name: 'Accidental Damage',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCAccDmgCompExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Compulsory Accidental Damage Excess',
                                                        coveragePublicID: 'PCAccidentalDamageCov_Ext',
                                                        patternCode: 'PCAccDmgCompExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCAccDmgVolExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Voluntary Excess',
                                                        coveragePublicID: 'PCAccidentalDamageCov_Ext',
                                                        patternCode: 'PCAccDmgVolExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCAccDmgYngInexpDrivExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Young/Inexperienced Driver Excess',
                                                        coveragePublicID: 'PCAccidentalDamageCov_Ext',
                                                        patternCode: 'PCAccDmgYngInexpDrivExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '0.0000',
                                                        chosenTermValue: '0',
                                                        directValue: 0,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCAccidentalDamageCov_Ext',
                                                description: 'Accidental Damage',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Audio/Sat Nav',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCAudSatNavLimitPostRegCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit - Post Reg',
                                                        coveragePublicID: 'PCAudioSatNavCov_Ext',
                                                        patternCode: 'PCAudSatNavLimitPostRegCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '300.0000',
                                                        chosenTermValue: '300',
                                                        directValue: 300,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCAudSatNavLimitFirstRegCT_Ext',
                                                        type: 'OptionPCAudSatNavLimitFirstRegCT_ExtType',
                                                        name: 'Limit - At First Reg',
                                                        coveragePublicID: 'PCAudioSatNavCov_Ext',
                                                        patternCode: 'PCAudSatNavLimitFirstRegCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'Unlimited',
                                                                code: 'zqiiem3ifr5rnakeaqh3q7337r9',
                                                                optionValue: 5,
                                                                maxValue: 5
                                                            }
                                                        ],
                                                        chosenTerm: 'zqiiem3ifr5rnakeaqh3q7337r9',
                                                        chosenTermValue: 'Unlimited',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        required: true
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCAudioSatNavCov_Ext',
                                                description: 'Audio/Sat Nav',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Child Seat Cover',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCChildSeatLimitCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit',
                                                        coveragePublicID: 'PCChildSeatCov_Ext',
                                                        patternCode: 'PCChildSeatLimitCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '300.0000',
                                                        chosenTermValue: '300',
                                                        directValue: 300,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCChildSeatCov_Ext',
                                                description: 'Child Seat Cover',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Courtesy Car',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCRepairDurationCT_Ext',
                                                        type: 'BooleanCovTerm',
                                                        name: 'Duration of repairs if insurer nominated repairer used',
                                                        coveragePublicID: 'PCCourtesyCar_Ext',
                                                        patternCode: 'PCRepairDurationCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            },
                                                            {
                                                                name: 'Yes',
                                                                code: 'true',
                                                                optionValue: 1,
                                                                maxValue: 1
                                                            },
                                                            {
                                                                name: 'No',
                                                                code: 'false',
                                                                optionValue: 0,
                                                                maxValue: 1
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'bit',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCCourtesyCar_Ext',
                                                description: 'Courtesy Car',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
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
                                            },
                                            {
                                                name: 'Extended Territorial Limits (EU)',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCExtTerrDaysCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Days',
                                                        coveragePublicID: 'PCExtendedTerritorialLimitsCov_Ext',
                                                        patternCode: 'PCExtTerrDaysCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '90.0000',
                                                        chosenTermValue: '90',
                                                        directValue: 90,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Days',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCExtendedTerritorialLimitsCov_Ext',
                                                description: 'Extended Territorial Limits (EU)',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Glass Damage (Windscreen)',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCGlassDmgWreplacementdmgCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Compulsory Windscreen Replacement Damage',
                                                        coveragePublicID: 'PCGlassDamageCov_Ext',
                                                        patternCode: 'PCGlassDmgWreplacementdmgCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCGlassDmgWrepairdmgCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Compulsory Windscreen Repair Damage',
                                                        coveragePublicID: 'PCGlassDamageCov_Ext',
                                                        patternCode: 'PCGlassDmgWrepairdmgCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCGlassDamageCov_Ext',
                                                description: 'Glass Damage (Windscreen)',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Liability to third parties',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCLiabilitiesTPLimitLgExpCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit - Legal Expenses',
                                                        coveragePublicID: 'PCLiabilityThirdPartiesCov_Ext',
                                                        patternCode: 'PCLiabilitiesTPLimitLgExpCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '5000000.0000',
                                                        chosenTermValue: '5,000,000',
                                                        directValue: 5000000,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCLiabilitiesTPLimitPropDmgCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit - Property Damage',
                                                        coveragePublicID: 'PCLiabilityThirdPartiesCov_Ext',
                                                        patternCode: 'PCLiabilitiesTPLimitPropDmgCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '20000000.0000',
                                                        chosenTermValue: '20,000,000',
                                                        directValue: 20000000,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCLiabilityThirdPartiesCov_Ext',
                                                description: 'Liability to third parties',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Loss by Fire and Theft',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCLossFireTheftCompExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Compulsory Fire and Theft Excess',
                                                        coveragePublicID: 'PCLossFireTheftCov_Ext',
                                                        patternCode: 'PCLossFireTheftCompExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCLossFireTheftVolExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Voluntary Excess',
                                                        coveragePublicID: 'PCLossFireTheftCov_Ext',
                                                        patternCode: 'PCLossFireTheftVolExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCLossFireTheftCov_Ext',
                                                description: 'Loss by Fire and Theft',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Medical Expenses',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCMedExpLimitCTEXT',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit',
                                                        coveragePublicID: 'PCMedicalExpensesCov_Ext',
                                                        patternCode: 'PCMedExpLimitCTEXT',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '500.0000',
                                                        chosenTermValue: '500',
                                                        directValue: 500,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCMedicalExpensesCov_Ext',
                                                description: 'Medical Expenses',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'New Car Replacement',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCNewCarReplacementCovCT_Ext',
                                                        type: 'BooleanCovTerm',
                                                        name: 'Replace vehicle new for old subject to:\n ???\tRepairs exceeding 60% of value\n ???\tYou are the only registered keeper\n ???\tvehicle under one year old\n ???\tavailable immediately.',
                                                        coveragePublicID: 'PCNewCarReplacementCov_Ext',
                                                        patternCode: 'PCNewCarReplacementCovCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            },
                                                            {
                                                                name: 'Yes',
                                                                code: 'true',
                                                                optionValue: 1,
                                                                maxValue: 1
                                                            },
                                                            {
                                                                name: 'No',
                                                                code: 'false',
                                                                optionValue: 0,
                                                                maxValue: 1
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'bit',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCNewCarReplacementCov_Ext',
                                                description: 'New Car Replacement',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Overnight Accomodation/onward Transport',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCOvnghtAccomoOnwdTransLimitByPersonCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'PerPerson',
                                                        coveragePublicID: 'PCOvernightAccoTransCov_Ext',
                                                        patternCode: 'PCOvnghtAccomoOnwdTransLimitByPersonCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '50.0000',
                                                        chosenTermValue: '50',
                                                        directValue: 50,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCOvnghtAccomoOnwdTransLimitByAccidentCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'PerAccident',
                                                        coveragePublicID: 'PCOvernightAccoTransCov_Ext',
                                                        patternCode: 'PCOvnghtAccomoOnwdTransLimitByAccidentCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '250.0000',
                                                        chosenTermValue: '250',
                                                        directValue: 250,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCOvernightAccoTransCov_Ext',
                                                description: 'Overnight Accomodation/onward Transport',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Personal Accident Cover',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCPersonalAccCovLimitCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit',
                                                        coveragePublicID: 'PCPersonalAccidentCov_Ext',
                                                        patternCode: 'PCPersonalAccCovLimitCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '5000.0000',
                                                        chosenTermValue: '5,000',
                                                        directValue: 5000,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCPersonalAccidentCov_Ext',
                                                description: 'Personal Accident Cover',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Personal Belongings',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCPersonalBelongingsLimitCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Limit',
                                                        coveragePublicID: 'PCPersonalBlngsCov_Ext',
                                                        patternCode: 'PCPersonalBelongingsLimitCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTerm: '300.0000',
                                                        chosenTermValue: '300',
                                                        directValue: 300,
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCPersonalBlngsCov_Ext',
                                                description: 'Personal Belongings',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Theft of Keys/Transmitter',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCTheftKeyTransCompFnTheftCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Compulsory Fire and Theft Excess',
                                                        coveragePublicID: 'PCTheftKeysTransmitterCov_Ext',
                                                        patternCode: 'PCTheftKeyTransCompFnTheftCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    },
                                                    {
                                                        publicID: 'PCTheftKeyTransVolExcessCT_Ext',
                                                        type: 'DirectCovTerm',
                                                        name: 'Voluntary Excess',
                                                        coveragePublicID: 'PCTheftKeysTransmitterCov_Ext',
                                                        patternCode: 'PCTheftKeyTransVolExcessCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'Money',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCTheftKeysTransmitterCov_Ext',
                                                description: 'Theft of Keys/Transmitter',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Uninsured Driver promise',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCUninsDrivPromNCDCT_Ext',
                                                        type: 'BooleanCovTerm',
                                                        name: 'NCD Unaffected and no excess paid',
                                                        coveragePublicID: 'PCUninsuredDriverPromCov_Ext',
                                                        patternCode: 'PCUninsDrivPromNCDCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            },
                                                            {
                                                                name: 'Yes',
                                                                code: 'true',
                                                                optionValue: 1,
                                                                maxValue: 1
                                                            },
                                                            {
                                                                name: 'No',
                                                                code: 'false',
                                                                optionValue: 0,
                                                                maxValue: 1
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'bit',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCUninsuredDriverPromCov_Ext',
                                                description: 'Uninsured Driver promise',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Vandalism Promise',
                                                updated: false,
                                                terms: [
                                                    {
                                                        publicID: 'PCVandPromNCDUnaffCT_Ext',
                                                        type: 'BooleanCovTerm',
                                                        name: 'NCD Unaffected',
                                                        coveragePublicID: 'PCVandalismPromiseCov_Ext',
                                                        patternCode: 'PCVandPromNCDUnaffCT_Ext',
                                                        options: [
                                                            {
                                                                name: 'None Selected'
                                                            },
                                                            {
                                                                name: 'Yes',
                                                                code: 'true',
                                                                optionValue: 1,
                                                                maxValue: 1
                                                            },
                                                            {
                                                                name: 'No',
                                                                code: 'false',
                                                                optionValue: 0,
                                                                maxValue: 1
                                                            }
                                                        ],
                                                        chosenTermValue: '',
                                                        isAscendingBetter: true,
                                                        updated: false,
                                                        valueType: 'bit',
                                                        required: false
                                                    }
                                                ],
                                                selected: true,
                                                required: true,
                                                publicID: 'PCVandalismPromiseCov_Ext',
                                                description: 'Vandalism Promise',
                                                coverageCategoryCode: 'PCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Coverage Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            }
                                        ]
                                    }
                                ],
                                ancillaryCoverages: [
                                    {
                                        publicID: 'csdt3:34810',
                                        fixedId: 34810,
                                        vehicleName: '2012 MERCEDES-BENZ E250 SPORT ED125 CDI BLUE (AV12BGE/AV12BGE)',
                                        coverages: [
                                            {
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
                                            },
                                            {
                                                name: 'Motor Legal Expenses',
                                                updated: false,
                                                terms: [],
                                                selected: false,
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
                                            },
                                            {
                                                name: 'Motor Personal Accident',
                                                updated: false,
                                                terms: [],
                                                selected: false,
                                                required: false,
                                                publicID: 'ANCMotorPersonalAccidentCov_Ext',
                                                description: 'Motor Personal Accident',
                                                amount: {
                                                    amount: 34.99,
                                                    currency: 'gbp'
                                                },
                                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                                hasTerms: false,
                                                isValid: true
                                            },
                                            {
                                                name: 'Excess Protector',
                                                updated: false,
                                                terms: [],
                                                selected: false,
                                                required: false,
                                                publicID: 'ANCProtectorCov_Ext',
                                                description: 'Protector',
                                                amount: {
                                                    amount: 34.99,
                                                    currency: 'gbp'
                                                },
                                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                                hasTerms: true,
                                                isValid: true
                                            },
                                            {
                                                name: 'Substitute Vehicle',
                                                updated: false,
                                                terms: [],
                                                selected: false,
                                                required: false,
                                                publicID: 'ANCSubstituteVehicleCov_Ext',
                                                description: 'Substitute Vehicle',
                                                amount: {
                                                    amount: 27.5,
                                                    currency: 'gbp'
                                                },
                                                coverageCategoryCode: 'ANCCoverableStdCatGrp_Ext',
                                                coverageCategoryDisplayName: 'Ancillary Coverable Standard Coverages',
                                                hasTerms: false,
                                                isValid: true
                                            },
                                            {
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
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            quoteData: {
                offeredQuotes: [
                    {
                        publicID: 'csdt3:22314',
                        branchName: 'Hastings Direct',
                        branchCode: 'HD',
                        earnixDiscountsDTO: {}
                    }
                ]
            }
        },
        {
            quoteID: '0000003969',
            isParentPolicy: false,
            baseData: {
                periodStatus: 'Draft',
                termType: 'Annual',
                producerCode: 'Default',
                isPostalDocument: false,
                marketingContacts: {
                    allowEmail: true,
                    allowTelephone: true,
                    allowSMS: true,
                    allowPost: true
                },
                isExistingCustomer: false,
                pccurrentDate: '2021-05-25T09:46:37Z',
                productCode: 'PrivateCar_Ext',
                policyAddress: {
                    linkedID: 'None',
                    publicID: 'csdt3:18932',
                    displayName: '6 Cromwell Road, ELY, CB61AS',
                    addressLine1: '6 Cromwell Road',
                    city: 'ELY',
                    county: 'Cambridgeshire',
                    postalCode: 'CB61AS',
                    country: 'GB',
                    addressType: 'home'
                },
                periodEndDate: {
                    year: 2022,
                    month: 5,
                    day: 2
                },
                periodStartDate: {
                    year: 2021,
                    month: 5,
                    day: 2
                },
                productName: 'Private Car',
                jobType: 'Submission'
            },
            lobData: {
                privateCar: {
                    preQualQuestionSets: [],
                    coverables: {
                        drivers: [
                            {
                                fixedId: 56929,
                                publicID: 'csdt3:56928',
                                person: {
                                    publicID: 'csdt3:18214',
                                    displayName: 'Vishal Howe',
                                    firstName: 'Vishal',
                                    lastName: 'Howe',
                                    prefix: '003_Mr',
                                    maritalStatus: 'S',
                                    dateOfBirth: {
                                        year: 1979,
                                        month: 10,
                                        day: 9
                                    }
                                },
                                displayName: 'Vishal Howe',
                                dateOfBirth: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                gender: 'M',
                                isPolicyHolder: true,
                                isPolicyOwner: true,
                                licenceHeldFor: '7',
                                licenceType: 'F_FM',
                                maritalStatus: 'S',
                                resUKSinceBirth: false,
                                residingInUKSince: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                accessToOtherVehicles: 'own_motorcycle',
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
                                ownYourHome: false,
                                yearsLivedAtCurrentAddress: '3',
                                anyChildrenUnder16: false
                            },
                            {
                                fixedId: 56930,
                                publicID: 'csdt3:56928',
                                person: {
                                    publicID: 'csdt3:18215',
                                    displayName: 'Vishal Kumar',
                                    firstName: 'Vishal',
                                    lastName: 'Kumar',
                                    prefix: '003_Mr',
                                    maritalStatus: 'S',
                                    dateOfBirth: {
                                        year: 1979,
                                        month: 10,
                                        day: 9
                                    }
                                },
                                displayName: 'Vishal Kumar',
                                dateOfBirth: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                gender: 'M',
                                isPolicyHolder: false,
                                isPolicyOwner: true,
                                licenceHeldFor: '7',
                                licenceType: 'F_FM',
                                maritalStatus: 'S',
                                resUKSinceBirth: false,
                                residingInUKSince: {
                                    year: 1979,
                                    month: 10,
                                    day: 9
                                },
                                accessToOtherVehicles: 'own_motorcycle',
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
                                ownYourHome: false,
                                yearsLivedAtCurrentAddress: '3',
                                anyChildrenUnder16: false
                            }
                        ],
                        vehicles: [
                            {
                                fixedId: 34811,
                                publicID: 'csdt3:34810',
                                license: 'AV12BGE',
                                vehicleNumber: 1,
                                registrationsNumber: 'AV12BGE',
                                year: 2012,
                                make: 'MERCEDES-BENZ',
                                model: 'E250 SPORT ED125 CDI BLUE',
                                annualMileage: 120000,
                                displayName: 'MERCEDES-BENZ E250 SPORT ED125 CDI BLUE (2012) AV12BGE',
                                body: 'SALOON',
                                yearManufactured: 2012,
                                transmission: '001',
                                engineSize: 2143,
                                importType: 'no',
                                numberOfSeats: 5,
                                alarmImmobilizer: '93',
                                drivingSide: 'R',
                                purchaseDate: '2021-04-30T23:00:00Z',
                                vehicleWorth: 40000,
                                typeOfUse: '04',
                                overnightParkingArrangements: '4',
                                isCarModified: false,
                                bodyCode: '02',
                                isOvernightLocationHome: true,
                                isVehicleBought: false,
                                coverType: 'comprehensive',
                                registeredKeeper: '1_PR',
                                legalOwner: '1_PR',
                                isRegisteredKeeperAndLegalOwner: true,
                                vehicleModifications: [],
                                tracker: true,
                                voluntaryExcess: '250',
                                changeEffectiveDate: '2021-05-27T23:01:00Z',
                                ncdProtection: {
                                    ncdProtectionAdditionalAmount: 0,
                                    ncdearnedInUkFlag: true,
                                    ncdsource: '11',
                                    drivingExperience: {}
                                },
                                abiCode: '32120102',
                                numberOfDoors: 4
                            }
                        ],
                        vehicleDrivers: [
                            {
                                driverID: 56928,
                                vehicleID: 34810
                            }
                        ],
                        addInterestTypeCategory: 'PAVhcleAddlInterest'
                    },
                    offerings: [
                        {
                            coverages: {
                                vehicleCoverages: [],
                                ancillaryCoverages: []
                            }
                        }
                    ]
                }
            },
            quoteData: {
                offeredQuotes: [
                    {
                        publicID: 'csdt3:22315',
                        earnixDiscountsDTO: {}
                    }
                ]
            }
        }
    ],
    accountHolder: {
        emailAddress1: 'fan@yuppmail.com',
        publicID: 'csdt3:18213',
        displayName: 'Manoj Howe',
        subtype: 'Person',
        primaryAddress: {
            linkedID: 'None',
            publicID: 'csdt3:18932',
            displayName: '6 Cromwell Road, ELY, CB61AS',
            addressLine1: '6 Cromwell Road',
            city: 'ELY',
            county: 'Cambridgeshire',
            postalCode: 'CB61AS',
            country: 'GB',
            addressType: 'home'
        },
        additionalAddresses: [],
        accountHolder: true,
        dateOfBirth: {
            year: 1979,
            month: 10,
            day: 9
        },
        gender: 'M',
        firstName: 'Manoj',
        lastName: 'Howe',
        prefix: '003_Mr',
        maritalStatus: 'S'
    },
    accountNumber: '10000003016',
    isKeyCover: false
};

export default submission;
