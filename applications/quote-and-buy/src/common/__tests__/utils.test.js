import {
    mcIpidMatchForAllAPIObject,
    mcIPidAncillaryAPIObject,
    getUpdateSelectedVersionForMPAPI,
    subtractFloats,
    sumFloats,
    getMultiToSingleParam,
    getAmount,
    iPidMatchForAllAPIObject,
    iPidAncillaryAPIObject,
    getMarketingPreferencesAPI,
    getBindAndIssueAPIObject,
    checkPCWJourney,
    returnIsMonthlyPaymentAvailable,
    returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM,
    returnIsMonthlyAvailableForMCCustomizeSubmissionVM,
    returnIsMonthlyAvailableForMCSubmissionVM,
    isHigherBrandsAvailable,
    returnAncillaryCoveragesObject,
    getMCError,
    isDateBeforeInception,
    setVehicleDetailsInCustomizeQuote,
    getMCMarketingPreferencesAPI,
    getMCAmount
} from '../utils';

const mcsubmissionVM = {
    value: {
        sessionUUID: '123456756',
        accountNumber: '0987654321',
        quotes: [{
            quoteID: '123456789',
            isParentPolicy: true,
            lobData: {
                privateCar: {
                    coverables: {
                        vehicles: [{
                            ncdProtection: {
                                drivingExperience: {
                                    drivingExperienceYears: null,
                                    drivingExperienceType: null,
                                    drivingExperienceFlag: null
                                }
                            }
                        }],
                        drivers: [{
                            person: {
                                accountHolder: {
                                },
                                cellNumber: '1234567890',
                                emailAddress1: 'test@yuppmail.com'
                            },
                            isPolicyHolder: true
                        }]
                    },
                    offerings: {}
                },
            },
            baseData: {
                periodStatus: 'Quoted',
                marketingContacts: {
                    allowEmail: true,
                    allowTelephone: true,
                    allowSMS: true,
                    allowPost: true
                },
                brandCode: 'HD'
            },
            bindData: {},
            quoteData: {}
        },
        {
            isParentPolicy: false,
            lobData: {
                privateCar: {
                    coverables: {
                        vehicles: [{
                            ncdProtection: {
                                drivingExperience: {
                                    drivingExperienceYears: null,
                                    drivingExperienceType: null,
                                    drivingExperienceFlag: null
                                }
                            }
                        }]
                    },
                    offerings: {}
                },
            },
            baseData: {
                periodStatus: 'Quoted'
            },
            bindData: {},
            quoteData: {}
        }]
    }
};

const customizeSubmissionVMWithoutValue = {
    quoteID: '123456',
    sessionUUID: '123456756',
    quote: {
        hastingsPremium: {
            monthlyPayment: {
                amount: 200
            }
        },
        branchCode: 'HD'
    },
    coverages: {
        privateCar: {
            ancillaryCoverages: [
                {
                    coverages: [{
                        selected: true
                    }]
                }
            ]
        }
    }
};

const customizeSubmissionVMWithValue = {
    value: {
        quoteID: '123456',
        sessionUUID: '123456756',
        quote: {
            hastingsPremium: {
                monthlyPayment: {
                    amount: 200
                }
            },
            branchCode: 'HD'
        },
        periodStartDate: '',
        coverType: '',
        coverages: {
            privateCar: {
                ancillaryCoverages: [
                    {
                        coverages: [{
                            selected: true
                        }]
                    }
                ]
            }
        }
    }
};

const multiCustomizeSubmissionVM = {
    value: {
        quoteID: '123456',
        sessionUUID: '123456756',
        customQuotes: [{
            quote: {
                hastingsPremium: {
                    monthlyPayment: {
                        amount: 200
                    }
                }
            }
        }]
    }
};

describe('utils', () => {
    it('should return mcIpidMatchForAllAPIObject', () => {
        // given
        const customMultiQuoteData = {
            value: {
                quotes: [{
                    quoteID: '600023',
                    lobData: {
                        privateCar: {
                            coverables: {
                                vehicles: [
                                    {
                                        coverType: 'HP'
                                    }
                                ]
                            }
                        }
                    },
                    baseData: {
                        periodEndDate: {
                            day: '1',
                            month: '3',
                            year: '1987'
                        },
                        brandCode: 'HP',
                        productCode: 'HP'
                    }
                },
                {
                    quoteID: '600024',
                    lobData: {
                        privateCar: {
                            coverables: {
                                vehicles: [
                                    {
                                        coverType: 'HP'
                                    }
                                ]
                            }
                        }
                    },
                    baseData: {
                        periodEndDate: {
                            day: '1',
                            month: '3',
                            year: '1987'
                        },
                        brandCode: 'HP',
                        productCode: 'HP'
                    }
                }]
            }
        };
        const ipidVariants = [{
            product: 'HP',
            brand: 'HP',
            inceptionDate: {
                day: '1',
                month: '3',
                year: '1987'
            },
            vehicleCoverType: 'HP',
            jobNumber: '600023'
        },
        {
            product: 'HP',
            brand: 'HP',
            inceptionDate: {
                day: '1',
                month: '3',
                year: '1987'
            },
            vehicleCoverType: 'HP',
            jobNumber: '600024'
        }];
        const ipidObject = {
            MultiProductIpidVariants: ipidVariants
        };
        // when
        const formattedMakeAndModel = mcIpidMatchForAllAPIObject(customMultiQuoteData);
        // then
        expect(formattedMakeAndModel).toStrictEqual(ipidObject);
    });

    it('should return mcIPidAncillaryAPIObject', () => {
        const data = {
            uuid: '0000014'
        };
        const referenceNumber = '50000000815';
        const docParam = {
            documentUUID: '0000014',
            referenceNumber: '50000000815',
            sessionUUID: '123456756'
        };
        // when
        const mcAncillaryObj = mcIPidAncillaryAPIObject(data, customizeSubmissionVMWithoutValue, referenceNumber);
        // then
        expect(mcAncillaryObj).toStrictEqual(docParam);
    });

    it('should return getUpdateSelectedVersionForMPAPI', () => {
        const submissionVM = {
            value: {
                quoteID: '600024'
            }
        };
        const selectedBrandName = 'Hastings Direct';
        const param = {
            quoteID: '600024',
            sessionUUID: '123456756',
            branch: 'Hastings Direct'
        };
        // when
        const mcupdateSelectedVersionForMPObj = getUpdateSelectedVersionForMPAPI(submissionVM, mcsubmissionVM, selectedBrandName);
        // then
        expect(mcupdateSelectedVersionForMPObj).toStrictEqual(param);
    });

    it('should return subtractFloats', () => {
        const first = 500;
        const second = 200;
        const param = 300;
        // when
        const subtractFloatsObj = subtractFloats(first, second);
        // then
        expect(subtractFloatsObj).toStrictEqual(param);
    });

    it('should return sumFloats', () => {
        const first = 100;
        const second = 200;
        const param = 300;
        // when
        const sumFloatsObj = sumFloats(first, second);
        // then
        expect(sumFloatsObj).toStrictEqual(param);
    });

    test.skip('should return getMultiToSingleParam', () => {
        const param = {
            accountHolder: {},
            accountNumber: '12345',
            quotes: [{
                isParentPolicy: true
            },
            {
                isParentPolicy: false
            }],
            mpwrapperJobNumber: '1234568',
            mpwrapperNumber: '21432423',
            sessionUUID: '123456756'
        };
        // when
        const getMultiToSingleParamObj = getMultiToSingleParam(mcsubmissionVM);
        // then
        expect(getMultiToSingleParamObj).toStrictEqual(param);
    });

    it('should return getAmount', () => {
        const paymentType = 100;
        const annualAmount = 200;
        const monthlyAmount = 20;
        const payMonthlyHeader = 'Pay monthly';
        const param = {
            price: monthlyAmount || 0,
            text: payMonthlyHeader,
            currency: '£',
            prefix: '11 x'
        };
        // when
        const getAmountObj = getAmount(paymentType, annualAmount, monthlyAmount);
        // then
        expect(getAmountObj).toStrictEqual(param);
    });

    it('should return iPidMatchForAllAPIObject', () => {
        const submissionVM = {
            value: {
                baseData: {
                    productCode: 'test_test'
                }
            }
        };
        const param = {
            product: 'test_test',
            brand: 'HD',
            inceptionDate: '',
            vehicleCoverType: ''
        };
        // when
        const base64ToArrayBufferObj = iPidMatchForAllAPIObject(submissionVM, customizeSubmissionVMWithValue);
        // then
        expect(base64ToArrayBufferObj).toStrictEqual(param);
    });

    it('should return iPidAncillaryAPIObject', () => {
        const data = {
            uuid: '100-200-300'
        };
        const param = {
            documentUUID: '100-200-300',
            referenceNumber: '123456',
            sessionUUID: '123456756'
        };
        // when
        const iPidAncillaryAPIObjectObj = iPidAncillaryAPIObject(data, customizeSubmissionVMWithValue);
        // then
        expect(iPidAncillaryAPIObjectObj).toStrictEqual(param);
    });

    it('should return getMarketingPreferencesAPI', () => {
        const submissionVM = {
            quoteID: '123456',
            sessionUUID: '123456756',
            baseData: {
                accountNumber: '1234569874937209',
                brandCode: 'HD',
                accountHolder: {
                    cellNumber: '1234567890',
                    emailAddress1: 'test@yuppmail.com'
                },
                marketingContacts: null
            }
        };
        const param = {
            sessionUUID: '123456756',
            quoteNumber: '123456',
            accountNumber: '1234569874937209',
            brand: 'HD',
            cellNumber: '1234567890',
            emailAddress1: 'test@yuppmail.com',
            marketingContacts: null
        };
        // when
        const getMarketingPreferencesAPIObj = getMarketingPreferencesAPI(submissionVM);
        // then
        expect(getMarketingPreferencesAPIObj).toStrictEqual(param);
    });

    it('should return getBindAndIssueAPIObject', () => {
        const submissionVM = {
            quoteID: '123456',
            sessionUUID: '123456756',
            baseData: {
                accountNumber: '1234569874937209',
                brandCode: 'HD',
                accountHolder: {
                    cellNumber: {
                        value: '1234567890'
                    },
                    emailAddress1: 'test@yuppmail.com'
                },
                marketingContacts: null,
                producerCode: {
                    value: 'completed'
                },
            },
            bindData: {
                paymentDetailsInfo: {
                    value: 'Something'
                },
                contactPhone: '1234567890'
            }
        };
        const paymentdetailsinfoDto = {
            value: {}
        };
        const bindAndIssueData = {
            orderCode: '111234567333',
            merchantCode: '02'
        };
        const amount = '200';
        const paymentFrequency = '1';
        const param = submissionVM;
        // when
        const getBindAndIssueAPIObj = getBindAndIssueAPIObject(submissionVM, paymentdetailsinfoDto, bindAndIssueData, amount, paymentFrequency);
        // then
        expect(getBindAndIssueAPIObj).toStrictEqual(param);
    });

    it('should return checkPCWJourney', () => {
        const isPCWJourney = true;
        // given
        const PCWJourneyInfo = checkPCWJourney(mcsubmissionVM, isPCWJourney);
        // then
        expect(PCWJourneyInfo).toStrictEqual(true);
    });

    it('should return returnIsMonthlyPaymentAvailable', () => {
        // given
        const isMonthlyPaymentAvailable = returnIsMonthlyPaymentAvailable(multiCustomizeSubmissionVM);
        // then
        expect(isMonthlyPaymentAvailable).toStrictEqual(false);
    });

    it('should return returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM', () => {
        const PAYMENT_TYPE_MONTHLY_CODE = '3';
        // given
        const isMonthlyPaymentAvailable = returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM(multiCustomizeSubmissionVM);
        // then
        expect(isMonthlyPaymentAvailable).toStrictEqual(PAYMENT_TYPE_MONTHLY_CODE);
    });

    it('should return returnIsMonthlyAvailableForMCCustomizeSubmissionVM', () => {
        const PAYMENT_TYPE_ANNUALLY_CODE = '1';
        // given
        const isMonthlyPaymentAvailable = returnIsMonthlyAvailableForMCCustomizeSubmissionVM(multiCustomizeSubmissionVM);
        // then
        expect(isMonthlyPaymentAvailable).toStrictEqual(PAYMENT_TYPE_ANNUALLY_CODE);
    });

    it('should return returnIsMonthlyAvailableForMCSubmissionVM', () => {
        const PAYMENT_TYPE_ANNUALLY_CODE = '1';
        // given
        const isMonthlyAvailableForMCSubmissionVM = returnIsMonthlyAvailableForMCSubmissionVM(mcsubmissionVM);
        // then
        expect(isMonthlyAvailableForMCSubmissionVM).toStrictEqual(PAYMENT_TYPE_ANNUALLY_CODE);
    });

    it('should return isHigherBrandsAvailable', () => {
        const submissionVM = {
            quoteID: '123456',
            sessionUUID: '123456756',
            baseData: {
                accountNumber: '1234569874937209',
                brandCode: 'HD',
                accountHolder: {
                    cellNumber: {
                        value: '1234567890'
                    },
                    emailAddress1: 'test@yuppmail.com'
                },
                marketingContacts: null,
                producerCode: {
                    value: 'completed'
                },
            },
            bindData: {
                paymentDetailsInfo: {
                    value: 'Something'
                },
                contactPhone: '1234567890'
            }
        };
        const currentBrand = customizeSubmissionVMWithValue.value.quote.branchCode;
        // given
        const isHigherBrandsAvailableData = isHigherBrandsAvailable(currentBrand, customizeSubmissionVMWithValue, submissionVM);
        // then
        expect(isHigherBrandsAvailableData).toStrictEqual(false);
    });

    it('should return returnAncillaryCoveragesObject', () => {
        // given
        const ancillaryCoveragesObject = returnAncillaryCoveragesObject(customizeSubmissionVMWithoutValue);
        // then
        expect(ancillaryCoveragesObject).toBeDefined();
    });

    it('should return  getMCError', () => {
        // const errorObject = {
        //     parentError: true,
        //     errorCode: 8051
        // };
        // given
        const getMCErrorObject = getMCError(mcsubmissionVM);
        // then
        expect(getMCErrorObject).toBeDefined();
    });

    it('should return isDateBeforeInception', () => {
        const date = {
            day: 21,
            month: 10,
            year: 2021,
        };
        // given
        const isDateBeforeInceptionCalculation = isDateBeforeInception(date);
        // then
        expect(isDateBeforeInceptionCalculation).toBeTruthy();
    });

    test.skip('should return setVehicleDetailsInCustomizeQuote', () => {
        const internalSubmissionVM = {
            quoteID: '123456',
            sessionUUID: '123456756',
            baseData: {
                accountNumber: '1234569874937209',
                brandCode: 'HD',
                accountHolder: {
                    cellNumber: {
                        value: '1234567890'
                    },
                    emailAddress1: 'test@yuppmail.com'
                },
                marketingContacts: null,
                producerCode: {
                    value: 'completed'
                },
            },
            lobData: {
                privateCar: {
                    coverables: {
                        vehicles: {
                            children: [{
                                ncdProtection: {
                                    drivingExperience: {
                                        drivingExperienceYears: null,
                                        drivingExperienceType: null,
                                        drivingExperienceFlag: null
                                    }
                                },
                                alarmImmobilizer: {
                                    aspects: {
                                        availableValues: {
                                            filters: ['93']
                                        }
                                    }
                                },
                                drivingSide: 'R',
                            }]
                        }
                    },
                    offerings: {}
                },
            },
            bindData: {
                paymentDetailsInfo: {
                    value: 'Somthing'
                },
                contactPhone: '1234567890'
            }
        };
        const vehicleData = {
            result: {
                type: 'PrivateCar_Ext',
                engineSize: '1086',
                transmission: '002',
                abiCode: '22521301',
                bodyCode: '14',
                numberOfSeats: '5',
                weight: 1405,
                colour: 'RED',
                numberOfDoors: 5,
                year: 2010,
                make: 'HYUNDAI',
                model: 'I10 ES',
                body: 'HATCHBACK',
                fuelType: 'Petrol',
                drivingSide: 'R',
                alarmImmobilizer: '93',
                importType: 'no',
                registrationsNumber: 'MF10EUX',
                yearManufactured: 2010
            }
        };
        // given
        const vehicleDetailsInCustomizeQuote = setVehicleDetailsInCustomizeQuote(vehicleData, 'MF10EUX', internalSubmissionVM);
        // then
        expect(vehicleDetailsInCustomizeQuote).toBeDefined();
    });

    it('should return getMCMarketingPreferencesAPI', () => {
        const paramObject = {
            sessionUUID: '123456756',
            quoteNumber: '123456789',
            accountNumber: '0987654321',
            brand: 'HD',
            cellNumber: '1234567890',
            emailAddress1: 'test@yuppmail.com',
            marketingContacts: {
                allowEmail: true,
                allowTelephone: true,
                allowSMS: true,
                allowPost: true
            }
        };
        // given
        const getMCMarketingPreferencesAPIObject = getMCMarketingPreferencesAPI(mcsubmissionVM, 0);
        // then
        expect(getMCMarketingPreferencesAPIObject).toStrictEqual(paramObject);
    });

    it('should return getMCAmount', () => {
        const paymentType = 100;
        const annualAmount = 200;
        const monthlyAmount = 20;
        // given
        const getMCAmountObj = getMCAmount(paymentType, annualAmount, monthlyAmount, mcsubmissionVM);
        // then
        expect(getMCAmountObj).toBeDefined();
    });
});
