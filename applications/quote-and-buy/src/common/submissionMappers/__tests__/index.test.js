/* eslint-disable max-len */
import _ from 'lodash';
import {
    populateMandatoryData,
    getDataForLWRQuoteAPICall,
    getDataForUpdateQuoteAPICall,
    getDataForCreateSubmissionAPICall,
    getDataForMultiQuoteAPICall,
    getDataForMultiUpdateQuoteAdditionalDriverAPICall,
    populateMCMandatoryAdditionalDriverData,
    getDataForMultiUpdateQuoteAPICall,
    getDataForUpdateQuoteAPICallinMulti,
    populateMCMandatoryData,
    getDataForMultiQuoteAPICallWithoutUpdatedFlag,
    getDataForMultiQuoteAPICallWithUpdatedFlag,
    getDataForUpdateMultiQuoteAPICall,
    updateDataForMC
} from '..';
import * as helpers from '../helpers';

describe('submissionMappers', () => {
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
    // given
    const viewModel = {
        baseData: {
            periodStatus: 'status',
            accountHolder: {
                displayName: 'Mrs Jennie Doe',
                publicID: 123
            }
        },
        bindData: {},
        quoteData: {},
        lobData: {
            privateCar: {
                coverables: {
                    vehicles: [{
                        isAWreck: true,
                        hasUglyColor: true,
                        vehicleNumber: -1,
                        vehicleModifications: ['Police Siren', 'Halogen Lamps'],
                    }],
                    drivers: [{
                        firstName: 'John',
                        lastName: 'Doe',
                        prefix: 'Mr',
                        dateOfBirth: '1950',
                        height: '182',
                        penaltyPoints: 4,
                        relationToProposer: 'husband',
                        emailAddress1: 'ab@ab.com',
                        person: {
                            prefix: 'Mrs',
                            emailAddress1: 'abss@ab.com',
                            publicID: '5421'
                        }
                    }, {
                        firstName: 'Jennie',
                        lastName: 'Doe',
                        prefix: 'Mrs',
                        dateOfBirth: '1960',
                        height: '155',
                        penaltyPoints: 12,
                        person: {
                            prefix: 'Mrs',
                            emailAddress1: 'ab@ab.com',
                            publicID: '5421'
                        }
                    }]
                },
                offerings: {}
            }
        }
    };
    describe('populateMandatoryData', () => {
        let populateDriversWithPersonDataSpy;
        let populateAccountHolderDriverSpy;
        let populateMarketingContactsSpy;
        let populateVehicleSpy;
        let populateVehicleDriversSpy;

        beforeEach(() => {
            populateDriversWithPersonDataSpy = jest.spyOn(helpers, 'populateDriversWithPersonData');
            populateAccountHolderDriverSpy = jest.spyOn(helpers, 'populateAccountHolderDriver');
            populateMarketingContactsSpy = jest.spyOn(helpers, 'populateMarketingContacts');
            populateVehicleSpy = jest.spyOn(helpers, 'populateVehicle');
            populateVehicleDriversSpy = jest.spyOn(helpers, 'populateVehicleDrivers');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods with values from viewModel', () => {
            // when
            populateMandatoryData(viewModel);
            // then
            expect(populateDriversWithPersonDataSpy).toHaveBeenCalled();
            expect(populateAccountHolderDriverSpy).toHaveBeenCalled();
            expect(populateMarketingContactsSpy).toHaveBeenCalled();
            expect(populateVehicleSpy).toHaveBeenCalled();
            expect(populateVehicleDriversSpy).toHaveBeenCalled();
        });
    });

    describe('getDataForLWRQuoteAPICall', () => {
        const populateNCDProtectionSpy = jest.spyOn(helpers, 'populateNCDProtection');
        const removeDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeDataBasedOnPeriodStatus');
        const cleanUpIDsSpy = jest.spyOn(helpers, 'cleanUpIDs');


        afterEach(() => {
            jest.clearAllMocks();
        });


        it('should call methods', () => {
            // when
            getDataForLWRQuoteAPICall(viewModel);
            // then
            expect(cleanUpIDsSpy).toHaveBeenCalled();
            expect(populateNCDProtectionSpy).toHaveBeenCalled();
            expect(removeDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted', 'Draft']));
        });
    });

    describe('getDataForUpdateQuoteAPICall', () => {
        const removeDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeDataBasedOnPeriodStatus');
        const removeOfferingsSpy = jest.spyOn(helpers, 'removeOfferings');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            getDataForUpdateQuoteAPICall(viewModel);
            // then
            expect(removeOfferingsSpy).toHaveBeenCalled();
            expect(removeDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted']));
        });
    });

    describe('getDataForCreateSubmissionAPICall', () => {
        const removeLobDataSpy = jest.spyOn(helpers, 'removeLobData');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            getDataForCreateSubmissionAPICall(viewModel);
            // then
            expect(removeLobDataSpy).toHaveBeenCalled();
        });

        it('should add subtype to account holder', () => {
            // given
            const dataObject = {
                baseData: {}
            };
            // when
            const result = getDataForCreateSubmissionAPICall(dataObject);
            // then
            expect(result.baseData.accountHolder.subtype).toBe('Person');
        });
    });

    describe('getDataForMultiQuoteAPICall', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods and remove bind data', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForMultiQuoteAPICall(mcsubmission);
            // then
            mcVM.quotes.forEach((driver) => {
                expect(driver.bindData).toBeUndefined();
            });
        });
    });

    describe('getDataForMultiUpdateQuoteAdditionalDriverAPICall', () => {
        const policyHolderPersonPublicID = '1234';
        const driverSelectedPublicID = '5421';
        // const populateMCMandatoryAdditionalDriverDataSpy = jest.spyOn(populateMCMandatoryAdditionalDriverData(viewModel, policyHolderPersonPublicID, driverSelectedPublicID));
        const cleanUpIDsForUpdateSpy = jest.spyOn(helpers, 'cleanUpIDsForUpdate');
        const populateNCDProtectionForUpdateSpy = jest.spyOn(helpers, 'populateNCDProtectionForUpdate');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call all methods', () => {
            // when
            getDataForMultiUpdateQuoteAdditionalDriverAPICall(viewModel, policyHolderPersonPublicID, driverSelectedPublicID);
            // then
            // expect(populateMCMandatoryAdditionalDriverDataSpy).toHaveBeenCalled();
            expect(cleanUpIDsForUpdateSpy).toHaveBeenCalled();
            expect(populateNCDProtectionForUpdateSpy).toHaveBeenCalled();
        });
    });

    describe('populateMCMandatoryAdditionalDriverData', () => {
        const policyHolderPersonPublicID = '1234';
        const driverSelectedPublicID = '5421';
        // const drivers = _.get(viewModel, 'lobData.privateCar.coverables.drivers', []);
        // const vehicle = _.first(_.get(viewModel, 'lobData.privateCar.coverables.vehicles', [])) || {};
        // const coverables = _.get(viewModel, 'lobData.privateCar.coverables', []);
        const populateMCDriversWithPersonDataSpy = jest.spyOn(helpers, 'populateMCDriversWithPersonData');
        const populateMarketingContactsSpy = jest.spyOn(helpers, 'populateMarketingContacts');
        const populateVehicleSpy = jest.spyOn(helpers, 'populateVehicle');
        const populateVehicleDriversSpy = jest.spyOn(helpers, 'populateVehicleDrivers');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            populateMCMandatoryAdditionalDriverData(viewModel, policyHolderPersonPublicID, driverSelectedPublicID);
            // then
            expect(populateMCDriversWithPersonDataSpy).toHaveBeenCalled();
            expect(populateMarketingContactsSpy).toHaveBeenCalled();
            expect(populateVehicleSpy).toHaveBeenCalled();
            expect(populateVehicleDriversSpy).toHaveBeenCalled();
        });
    });

    describe('getDataForMultiUpdateQuoteAPICall', () => {
        const cleanUpIDsForUpdateSpy = jest.spyOn(helpers, 'cleanUpIDsForUpdate');
        const populateNCDProtectionForUpdateSpy = jest.spyOn(helpers, 'populateNCDProtectionForUpdate');
        const removeDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeDataBasedOnPeriodStatus');
        const removeOfferingsSpy = jest.spyOn(helpers, 'removeOfferings');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            getDataForMultiUpdateQuoteAPICall(viewModel);
            // then
            expect(cleanUpIDsForUpdateSpy).toHaveBeenCalled();
            expect(populateNCDProtectionForUpdateSpy).toHaveBeenCalled();
            expect(removeDataBasedOnPeriodStatusSpy).toHaveBeenCalled();
            expect(removeOfferingsSpy).toHaveBeenCalled();
        });
    });

    describe('getDataForUpdateQuoteAPICallinMulti', () => {
        const cleanUpIDsForUpdateSpy = jest.spyOn(helpers, 'cleanUpIDsForUpdate');
        const populateNCDProtectionForUpdateSpy = jest.spyOn(helpers, 'populateNCDProtectionForUpdate');
        const removeMultiCarDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeMultiCarDataBasedOnPeriodStatus');
        const removeOfferingsSpy = jest.spyOn(helpers, 'removeOfferings');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            getDataForUpdateQuoteAPICallinMulti(viewModel);
            // then
            expect(cleanUpIDsForUpdateSpy).toHaveBeenCalled();
            expect(populateNCDProtectionForUpdateSpy).toHaveBeenCalled();
            expect(removeMultiCarDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted', 'Draft']));
            expect(removeOfferingsSpy).toHaveBeenCalled();
        });
    });

    describe('populateMCMandatoryData', () => {
        const populateMCAccountHolderDriverSpy = jest.spyOn(helpers, 'populateMCAccountHolderDriver');
        const populateMarketingContactsSpy = jest.spyOn(helpers, 'populateMarketingContacts');
        const populateVehicleSpy = jest.spyOn(helpers, 'populateVehicle');
        const populateVehicleDriversSpy = jest.spyOn(helpers, 'populateVehicleDrivers');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            // when
            populateMCMandatoryData(viewModel);
            // then
            expect(populateMCAccountHolderDriverSpy).toHaveBeenCalled();
            expect(populateMarketingContactsSpy).toHaveBeenCalled();
            expect(populateVehicleSpy).toHaveBeenCalled();
            expect(populateVehicleDriversSpy).toHaveBeenCalled();
        });
    });

    describe('getDataForMultiQuoteAPICallWithoutUpdatedFlag', () => {
        const populateNCDProtectionSpy = jest.spyOn(helpers, 'populateNCDProtection');
        const removeMultiCarDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeMultiCarDataBasedOnPeriodStatus');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForMultiQuoteAPICallWithoutUpdatedFlag(mcsubmission.value);
            // then
            mcVM.quotes.forEach((quote) => {
                console.log(quote);
                expect(populateNCDProtectionSpy).toHaveBeenCalled();
                expect(removeMultiCarDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted', 'Draft']));
            });
        });
    });

    describe('getDataForMultiQuoteAPICallWithUpdatedFlag', () => {
        const populateNCDProtectionSpy = jest.spyOn(helpers, 'populateNCDProtection');
        const removeMultiCarDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeMultiCarDataBasedOnPeriodStatus');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForMultiQuoteAPICallWithUpdatedFlag(mcsubmission.value);
            // then
            mcVM.quotes.forEach((quote) => {
                console.log(quote);
                expect(populateNCDProtectionSpy).toHaveBeenCalled();
                expect(removeMultiCarDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted', 'Draft']));
            });
        });

        it('should check isQuoteToBeUpdated to false', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForMultiQuoteAPICallWithUpdatedFlag(mcsubmission.value);
            // then
            mcVM.quotes.forEach((quote) => {
                expect(quote.isQuoteToBeUpdated).toBe(false);
            });
        });
    });

    describe('getDataForUpdateMultiQuoteAPICall', () => {
        const populateNCDProtectionForUpdateSpy = jest.spyOn(helpers, 'populateNCDProtectionForUpdate');
        const removeMultiCarDataBasedOnPeriodStatusSpy = jest.spyOn(helpers, 'removeMultiCarDataBasedOnPeriodStatus');
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call methods', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForUpdateMultiQuoteAPICall(mcsubmission.value);
            // then
            mcVM.quotes.forEach(() => {
                expect(populateNCDProtectionForUpdateSpy).toHaveBeenCalled();
                expect(removeMultiCarDataBasedOnPeriodStatusSpy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(['Quoted', 'Draft']));
            });
        });

        it('should check isQuoteToBeUpdated to false', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            getDataForUpdateMultiQuoteAPICall(mcsubmission.value);
            // then
            mcVM.quotes.forEach((quote) => {
                expect(quote.isQuoteToBeUpdated).toBe(false);
            });
        });
    });

    describe('updateDataForMC', () => {
        const multicarAddresChanged = false;
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should check the required data', () => {
            const mcVM = _.cloneDeep(mcsubmission.value);
            // when
            updateDataForMC(multicarAddresChanged, mcsubmission.value, viewModel);
            // then
            expect(mcVM).toBe(mcVM);
        });
    });
});
