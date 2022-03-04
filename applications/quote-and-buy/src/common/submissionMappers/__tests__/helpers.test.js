import _ from 'lodash';
import {
    removeDataBasedOnPeriodStatus,
    populateDriversWithPersonData,
    populateAccountHolderDriver,
    populateMarketingContacts,
    populateVehicle,
    populateNCDProtection,
    populateVehicleDrivers,
    getPersonData,
    removeLobData,
    removeOfferings,
    DEFAULTS,
    populateMCDriversWithPersonData,
    populateMCAccountHolderDriver,
    checkHastingsError,
    getAnnuallyInitialPayment,
    // getPCStartDate
} from '../helpers';

const mcsubmission = {
    value: {
        quotes: [
            {
                isQuoteToBeUpdated: false,
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
                        ancillaryCoverages: [{
                            coverages: 'Test'
                        }],
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
                isQuoteToBeUpdated: false,
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
            }
        ]
    }
};

const mcCustomizesubmission = {
    value: {
        insurancePaymentType: '1',
        customQuotes: [
            {
                quote: {
                    publicID: 'csdt3:77901',
                    branchName: 'Hastings Essential',
                    branchCode: 'HE',
                    hastingsPremium: {
                        creditCardInterestRate: 0,
                        monthlyPayment: {
                            elevenMonthsInstalments: {
                                amount: 116.37,
                                currency: 'gbp'
                            },
                            firstInstalment: {
                                amount: 116.4,
                                currency: 'gbp'
                            },
                            representativeAPR: 29.9,
                            rateOfInterest: 14.9,
                            totalAmountCredit: 1215.38,
                            billingID: 'bc:36',
                            premiumAnnualCost: {
                                amount: 1396.47,
                                currency: 'gbp'
                            },
                            arrangementFee: {
                                amount: 20,
                                currency: 'gbp'
                            },
                            invoiceFrequency: 'monthly'
                        },
                        annuallyPayment: {
                            billingID: 'bc:11',
                            premiumAnnualCost: {
                                amount: 1215.38,
                                currency: 'gbp'
                            },
                            arrangementFee: {
                                amount: 20,
                                currency: 'gbp'
                            },
                            changeInPremium: {
                                amount: 1215.38,
                                currency: 'gbp'
                            },
                            invoiceFrequency: 'everyyear'
                        }
                    },
                    earnixDiscountsDTO: { }
                },
                quoteID: '0000005401',
                sessionUUID: 'f76f20e3-713b-4a49-b2d0-a6353af21d71',
                periodStartDate: {
                    year: 2021,
                    month: 7,
                    day: 31
                },
                periodEndDate: {
                    year: 2022,
                    month: 7,
                    day: 30
                },
                isParentPolicy: true,
                coverType: 'comprehensive',
                voluntaryExcess: '150',
                ncdgrantedYears: '5',
                ncdgrantedProtectionInd: true,
                producerCode: 'Default',
                insurancePaymentType: '1',
                otherOfferedQuotes: [
                ],
                coverages: {
                    privateCar: {
                        vehicleCoverages: [],
                        ancillaryCoverages: []
                    }
                }
            },
            {
                quote: {
                    publicID: 'csdt3:77935',
                    branchName: 'Hastings Direct',
                    branchCode: 'HD',
                    hastingsPremium: {
                        creditCardInterestRate: 0,
                        monthlyPayment: {
                            elevenMonthsInstalments: {
                                amount: 47.6,
                                currency: 'gbp'
                            },
                            firstInstalment: {
                                amount: 47.64,
                                currency: 'gbp'
                            },
                            representativeAPR: 29.9,
                            rateOfInterest: 14.9,
                            totalAmountCredit: 497.16,
                            billingID: 'bc:36',
                            premiumAnnualCost: {
                                amount: 571.24,
                                currency: 'gbp'
                            },
                            arrangementFee: {
                                amount: 20,
                                currency: 'gbp'
                            },
                            invoiceFrequency: 'monthly'
                        },
                        annuallyPayment: {
                            billingID: 'bc:11',
                            premiumAnnualCost: {
                                amount: 497.16,
                                currency: 'gbp'
                            },
                            arrangementFee: {
                                amount: 20,
                                currency: 'gbp'
                            },
                            changeInPremium: {
                                amount: 497.16,
                                currency: 'gbp'
                            },
                            invoiceFrequency: 'everyyear'
                        }
                    },
                    earnixDiscountsDTO: {}
                },
                quoteID: '0000019115',
                sessionUUID: 'f76f20e3-713b-4a49-b2d0-a6353af21d71',
                periodStartDate: {
                    year: 2021,
                    month: 7,
                    day: 31
                },
                periodEndDate: {
                    year: 2022,
                    month: 7,
                    day: 30
                },
                isParentPolicy: false,
                coverType: 'comprehensive',
                voluntaryExcess: '150',
                ncdgrantedYears: '5',
                ncdgrantedProtectionInd: true,
                producerCode: 'Default',
                insurancePaymentType: '1',
                otherOfferedQuotes: [
                ],
                coverages: {
                    privateCar: {
                        vehicleCoverages: [],
                        ancillaryCoverages: []
                    }
                }
            }
        ],
        mpwrapperNumber: '50000005625',
        mpwrapperJobNumber: '40000005625',
        sessionUUID: 'f76f20e3-713b-4a49-b2d0-a6353af21d71'
    }
};

describe('helpers', () => {
    describe('removeDataBasedOnPeriodStatus', () => {
        // given
        let mockedObj;
        const status = 'Status 1';

        beforeEach(() => {
            mockedObj = {
                baseData: {
                    periodStatus: status
                },
                bindData: {},
                quoteData: {},
                lobData: {
                    privateCar: {
                        offerings: {}
                    }
                }
            };
        });

        it('should remove data if periodStatus is matching', () => {
            // when
            removeDataBasedOnPeriodStatus(mockedObj, [status]);
            // then
            expect(mockedObj.bindData).toBeUndefined();
            expect(mockedObj.quoteData).toBeUndefined();
        });

        it('should not remove data if periodStatus is not matching', () => {
            // given
            const otherStatus = 'Status 2';
            // when
            removeDataBasedOnPeriodStatus(mockedObj, [otherStatus]);
            // then
            expect(mockedObj.bindData).toBeDefined();
            expect(mockedObj.quoteData).toBeDefined();
        });
    });
    describe('removeOfferings', () => {
        // given
        const mockedObj = {
            baseData: {},
            bindData: {},
            quoteData: {},
            lobData: {
                privateCar: {
                    offerings: {}
                }
            }
        };

        it('should remove offerings', () => {
            // when
            removeOfferings(mockedObj);
            // then
            expect(mockedObj.lobData.privateCar.offerings).toBeUndefined();
        });
    });
    describe('populateDriversWithPersonData', () => {
        it('should populate driver with data and not override other existing data', () => {
            // given
            const baseDrivers = [{
                firstName: 'John',
                lastName: 'Doe',
                prefix: 'Mr',
                dateOfBirth: '1950',
                height: '182',
                penaltyPoints: 4,
                emailAddress1: 'ab@ab.com'
            }, {
                firstName: 'Jennie',
                lastName: 'Doe',
                prefix: 'Mrs',
                dateOfBirth: '1960',
                height: '155',
                penaltyPoints: 12,
                emailAddress1: 'ab@ab.com'
            }];
            const drivers = _.cloneDeep(baseDrivers);
            // when
            populateDriversWithPersonData(drivers);
            // then
            drivers.forEach((driver, index) => {
                const {
                    firstName, lastName, prefix, dateOfBirth, person, isPolicyOwner, isPolicyHolder, dvlaReportedMedCond, tempID, height, penaltyPoints
                } = driver;
                expect(isPolicyHolder).toBeFalsy();
                expect(isPolicyOwner).toBeFalsy();
                expect(dvlaReportedMedCond).toBe(DEFAULTS.DVLA_REPORTED_MED_COND);
                expect(tempID).toBeDefined();
                expect(firstName).toBe(baseDrivers[index].firstName);
                expect(lastName).toBe(baseDrivers[index].lastName);
                expect(prefix).toBe(baseDrivers[index].prefix);
                expect(dateOfBirth).toBe(baseDrivers[index].dateOfBirth);
                expect(height).toBe(baseDrivers[index].height);
                expect(penaltyPoints).toBe(baseDrivers[index].penaltyPoints);
                expect(person.firstName).toBe(baseDrivers[index].firstName);
                expect(person.lastName).toBe(baseDrivers[index].lastName);
                expect(person.prefix).toBe(baseDrivers[index].prefix);
                expect(person.dateOfBirth).toBe(baseDrivers[index].dateOfBirth);
            });
        });
    });

    describe('populateAccountHolderDriver', () => {
        it('should populate data only for account holder', () => {
            // given
            const baseDrivers = [{
                firstName: 'John',
                lastName: 'Doe',
                prefix: 'Mr',
                dateOfBirth: '1950',
                height: '182',
                penaltyPoints: 4,
                relationToProposer: 'husband'
            }, {
                firstName: 'Jennie',
                lastName: 'Doe',
                prefix: 'Mrs',
                dateOfBirth: '1960',
                height: '155',
                penaltyPoints: 12,
            }];
            const accountHolderData = {
                displayName: 'Mrs Jennie Doe',
                publicID: 123
            };
            const drivers = _.cloneDeep(baseDrivers);
            // when
            populateAccountHolderDriver(drivers, accountHolderData);
            // then
            const [driver, accountHolder] = drivers;
            expect(accountHolder.person.displayName).toBe(accountHolderData.displayName);
            expect(accountHolder.person.publicID).toBe(accountHolderData.publicID);
            expect(accountHolder.isPolicyHolder).toBeTruthy();
            expect(accountHolder.isPolicyOwner).toBeTruthy();
            expect(accountHolderData.prefix).toBe(accountHolder.person.prefix);
            expect(driver.person).toBeUndefined();
            expect(driver.isPolicyHolder).toBeFalsy();
            expect(driver.isPolicyOwner).toBeFalsy();
        });
    });

    describe('populateMarketingContacts', () => {
        it('should fill marketing contacts', () => {
            // given
            const mockedObj = {
                baseData: {}
            };
            // when
            populateMarketingContacts(mockedObj);
            // then
            const {
                allowEmail, allowPost, allowSMS, allowTelephone
            } = mockedObj.baseData.marketingContacts;
            expect(allowEmail).toBe(DEFAULTS.ALLOW_EMAIL);
            expect(allowPost).toBe(DEFAULTS.ALLOW_POST);
            expect(allowSMS).toBe(DEFAULTS.ALLOW_SMS);
            expect(allowTelephone).toBe(DEFAULTS.ALLOW_TELEPHONE);
        });

        it('should override existing marketing contacts', () => {
            // given
            const mockedObj = {
                baseData: {
                    marketingContacts: {
                        allowPostPigeon: true,
                        allowHogwatsLetter: true
                    }
                }
            };
            // when
            populateMarketingContacts(mockedObj);
            // then
            const {
                allowPostPigeon, allowHogwatsLetter
            } = mockedObj.baseData.marketingContacts;
            expect(allowPostPigeon).toBeUndefined();
            expect(allowHogwatsLetter).toBeUndefined();
        });
    });

    describe('populateVehicle', () => {
        let vehicle;
        beforeEach(() => {
            vehicle = {
                isAWreck: true,
                hasUglyColor: true,
                vehicleNumber: -1,
                vehicleModifications: ['Police Siren', 'Halogen Lamps'],
            };
        });
        it('should add defaults values if not populated', () => {
            // when
            populateVehicle(vehicle);
            // then
            const {
                tempID, vehicleNumber, voluntaryExcess, coverType
            } = vehicle;
            expect(voluntaryExcess).toBe(DEFAULTS.VOLUNTARY_EXCESS);
            expect(coverType).toBe(DEFAULTS.COVER_TYPE);
            expect(vehicleNumber).toBe(DEFAULTS.VEHICLE_NUMBER);
            expect(tempID).toBeDefined();
        });

        it('should not add defaults values if populated', () => {
            const volExc = 'Over 9999!';
            const covT = 'Super Saiyan';
            const regNum = 'H4ST1N8S';
            const abiC = '32120102';
            const bodyC = '02';

            // given
            vehicle = {
                ...vehicle,
                voluntaryExcess: volExc,
                coverType: covT,
                vehicleNumber: -1,
                registrationNumber: regNum,
                abiCode: abiC,
                bodyCode: bodyC
            };
            // when
            populateVehicle(vehicle);
            // then
            const {
                voluntaryExcess, tempID, coverType, abiCode, bodyCode, registrationNumber
            } = vehicle;
            expect(voluntaryExcess).toBe(volExc);
            expect(coverType).toBe(covT);
            expect(registrationNumber).toBe(regNum);
            expect(abiCode).toBe(abiC);
            expect(bodyCode).toBe(bodyC);
            expect(tempID).toBeDefined();
        });
    });

    describe('populateNCDProtection', () => {
        it('should use defaults when ncdProtection data not provided ', () => {
            // given
            const vehicle = {};
            // when
            populateNCDProtection(vehicle);
            // then
            const {
                nCDGrantedYears, nCDEarnedInUkFlag, nCDSource, drivingExperience: {
                    protectNCD, drivingExperienceYears, drivingExperienceType, drivingExperienceFlag
                }
            } = vehicle.ncdProtection;
            expect(nCDGrantedYears).toBe(DEFAULTS.NCD_GRANTED_YEARS);
            expect(nCDEarnedInUkFlag).toBe(DEFAULTS.NCD_EARNED_IN_UK_FLAG);
            expect(nCDSource).toBe(DEFAULTS.NCD_SOURCE);
            expect(protectNCD).toBe(DEFAULTS.PROTECT_NCD);
            expect(drivingExperienceYears).toBe(DEFAULTS.DRIVING_EXPIRIENCE_YEARS);
            expect(drivingExperienceType).toBe(DEFAULTS.DRIVING_EXPIRIENCE_TYPE);
            expect(drivingExperienceFlag).toBe(DEFAULTS.DRIVING_EXPIRIENCE_FLAG);
        });

        it('should not use defaults when ncdProtection data provided ', () => {
            // given
            const baseVehicle = {
                ncdProtection: {
                    ncdgrantedYears: '123',
                    nCDEarnedInUkFlag: false,
                    nCDSource: '123',
                    drivingExperience: {
                        protectNCD: true,
                        drivingExperienceYears: 123,
                        drivingExperienceType: 'the best type',
                        drivingExperienceFlag: true
                    }
                }
            };
            const vehicle = _.cloneDeep(baseVehicle);
            // when
            populateNCDProtection(vehicle);
            // then
            const {
                nCDGrantedYears, nCDEarnedInUkFlag, nCDSource, drivingExperience: {
                    protectNCD, drivingExperienceYears, drivingExperienceType, drivingExperienceFlag
                }
            } = vehicle.ncdProtection;
            expect(nCDGrantedYears).toBe(baseVehicle.ncdProtection.ncdgrantedYears);
            expect(nCDEarnedInUkFlag).toBe(DEFAULTS.NCD_EARNED_IN_UK_FLAG);
            expect(nCDSource).toBe(DEFAULTS.NCD_SOURCE);
            expect(protectNCD).toBe(baseVehicle.ncdProtection.drivingExperience.protectNCD);
            expect(drivingExperienceYears).toBe(baseVehicle.ncdProtection.drivingExperience.drivingExperienceYears);
            expect(drivingExperienceType).toBe(baseVehicle.ncdProtection.drivingExperience.drivingExperienceType);
            expect(drivingExperienceFlag).toBe(baseVehicle.ncdProtection.drivingExperience.drivingExperienceFlag);
        });
    });

    describe('populateVehicleDrivers', () => {
        it('should populate ids mapping', () => {
            // given
            const vehicle = {
                tempID: 'vehicle id'
            };
            const drivers = [
                { tempID: '1st driver' },
                { tempID: '2nd driver' }
            ];
            const coverables = {};
            // when
            populateVehicleDrivers(coverables, vehicle, drivers);
            // then
            const { vehicleDrivers } = coverables;
            vehicleDrivers.forEach((vehicleDriver, index) => {
                expect(vehicleDriver.driverTempID).toBe(drivers[index].tempID);
                expect(vehicleDriver.vehicleTempID).toBe(vehicle.tempID);
            });
        });
    });

    describe('getPersonData', () => {
        // given
        const person = {
            firstName: 'Charles',
            lastName: 'A. Testa',
            prefix: 'Mister',
        };
        const driver = {
            firstName: 'Chuck',
            lastName: 'Testa',
            prefix: 'Mr',
            dateOfBirth: '1956',
            person
        };

        it('should return driver data if provided', () => {
            // when
            const result = getPersonData(driver);
            // then
            const {
                firstName, lastName, prefix, dateOfBirth
            } = result;
            expect(firstName).toBe(driver.firstName);
            expect(lastName).toBe(driver.lastName);
            expect(prefix).toBe(driver.prefix);
            expect(dateOfBirth).toBe(driver.dateOfBirth);
        });

        it('should return person data if driver data not provided', () => {
            // given
            const notFullyFilledDriver = {
                person,
                dateOfBirth: 'some date'
            };
            // when
            const result = getPersonData(notFullyFilledDriver);
            // then
            const {
                firstName, lastName, prefix, dateOfBirth
            } = result;
            expect(firstName).toBe(person.firstName);
            expect(lastName).toBe(person.lastName);
            expect(prefix).toBe(person.prefix);
            expect(dateOfBirth).toBe(notFullyFilledDriver.dateOfBirth);
        });
    });

    describe('removeLobData', () => {
        it('should remove lobData from the object', () => {
            // giern
            const dataObject = {
                baseData: {},
                lobData: {}
            };
            // when
            removeLobData(dataObject);
            // then
            expect(dataObject.lobData).toBeUndefined();
        });
    });

    describe('populateMCDriversWithPersonData', () => {
        it('should populate MC policy holder driver with data and not override other existing data', () => {
            // given
            const baseDrivers = [{
                firstName: 'John',
                lastName: 'Doe',
                prefix: 'Mr',
                dateOfBirth: '1950',
                height: '182',
                penaltyPoints: 4,
                person: {
                    publicID: 'CSDT:123456'
                },
                dvlaReportedMedCond: '99_NO',
                tempID: 'ADHTEBSJKJS'
            }, {
                firstName: 'Jennie',
                lastName: 'Doe',
                prefix: 'Mrs',
                dateOfBirth: '1960',
                height: '155',
                penaltyPoints: 12,
                person: {
                    publicID: 'CSDT:123456'
                },
                dvlaReportedMedCond: '99_NO',
                tempID: 'ADHTEBSJKJS'
            }];
            const drivers = _.cloneDeep(baseDrivers);
            // when
            populateMCDriversWithPersonData(drivers);
            // then
            drivers.forEach((driver) => {
                const {
                    fixedId, publicID, relationToProposer, isPolicyOwner, isPolicyHolder, dvlaReportedMedCond, tempID
                } = driver;
                expect(isPolicyHolder).toBeFalsy();
                expect(isPolicyOwner).toBeFalsy();
                expect(dvlaReportedMedCond).toBeDefined();
                expect(tempID).toBeDefined();
                expect(fixedId).toBe(undefined);
                expect(publicID).toBe(undefined);
                expect(relationToProposer).toBe(undefined);
            });
        });
    });

    describe('populateMCAccountHolderDriver', () => {
        it('should populate data only for MC account holder', () => {
            // given
            const baseDrivers = [{
                firstName: 'John',
                lastName: 'Doe',
                prefix: 'Mr',
                dateOfBirth: '1950',
                height: '182',
                penaltyPoints: 4,
                relationToProposer: 'husband',
                isPolicyHolder: true,
                isPolicyOwner: true,
                person: {
                    publicID: 'CSDT:123456'
                },
                dvlaReportedMedCond: '99_NO',
                tempID: '83a5fe53-844e-4860-9f64-8993d8c873e9'
            }, {
                firstName: 'Jennie',
                lastName: 'Doe',
                prefix: 'Mrs',
                dateOfBirth: '1960',
                height: '155',
                penaltyPoints: 12,
                relationToProposer: 'wife',
                isPolicyHolder: true,
                isPolicyOwner: true,
                person: {
                    publicID: 'CSDT:123457'
                },
                dvlaReportedMedCond: '99_NO',
                tempID: '83a5fe53-844e-4860-9f64-8993d8c873e9'
            }];
            const accountHolderData = {
                displayName: 'Mrs Jennie Doe',
                publicID: 123,
                person: {
                    prefix: 'Mr'
                },
                prefix: 'Mr',
            };
            const drivers = _.cloneDeep(baseDrivers);
            // when
            populateMCAccountHolderDriver(drivers, accountHolderData);
            // then
            drivers.forEach((driver) => {
                const {
                    fixedId, publicID, relationToProposer, isPolicyOwner, isPolicyHolder, dvlaReportedMedCond, tempID
                } = driver;
                expect(isPolicyHolder).toBeTruthy();
                expect(isPolicyOwner).toBeTruthy();
                expect(dvlaReportedMedCond).toBeDefined();
                expect(tempID).toBeDefined();
                expect(fixedId).toBeUndefined();
                expect(publicID).toBeUndefined();
                expect(relationToProposer).toBe(driver.relationToProposer);
            });
        });
    });
    describe('checkHastingsError', () => {
        // given
        let mockedObj;
        const status = 'Quoted';
        const errorObject = { errorMessage: null, errorCode: [716, 802, 805, 803] };

        beforeEach(() => {
            mockedObj = {
                baseData: {
                    periodStatus: status
                },
                bindData: {},
                lobData: {
                    privateCar: {
                        offerings: {}
                    }
                },
                quoteData: {
                    offeredQuotes: [{
                        hastingsErrors: [
                            {
                                publicErrorMessage: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorCode: 716,
                                technicalErrorDetails: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorMessage: 'Error occured while calling QuoteRate service, unable to get response'
                            },
                            {
                                publicErrorMessage: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorCode: 802,
                                technicalErrorDetails: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorMessage: 'Error occured while calling QuoteRate service, unable to get response'
                            },
                            {
                                publicErrorMessage: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorCode: 805,
                                technicalErrorDetails: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorMessage: 'Error occured while calling QuoteRate service, unable to get response'
                            },
                            {
                                publicErrorMessage: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorCode: 803,
                                technicalErrorDetails: 'Error occured while calling QuoteRate service, unable to get response',
                                technicalErrorMessage: 'Error occured while calling QuoteRate service, unable to get response'
                            }
                        ],
                    }]
                }
            };
        });

        it('should check the error code', () => {
            // when
            checkHastingsError(mockedObj);
            // then
            const mockedObject = mockedObj.quoteData.offeredQuotes[0].hastingsErrors;
            mockedObject.forEach((dto, index) => {
                expect(dto.technicalErrorCode).toBe(errorObject.errorCode[index]);
            });
        });
    });

    describe('getAnnuallyInitialPayment', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        let initialPaymentAmount = 0;
        it('should call methods', () => {
            // when
            getAnnuallyInitialPayment(mcsubmission, mcCustomizesubmission);
        });

        it('should check initialPaymentAmount is available', () => {
            const mcVM = _.cloneDeep(mcCustomizesubmission.value.customQuotes);
            // when
            getAnnuallyInitialPayment(mcsubmission, mcCustomizesubmission);
            // then
            mcVM.forEach((quote) => {
                initialPaymentAmount = quote.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
            });
            expect(initialPaymentAmount).toBeDefined();
        });
    });
});
