import {
    getStringDate,
    getStringFromBoolean,
    getSelectedCoveragesNames,
    getAncillary,
    getVehicleModifications,
    processAncillaryData,
    processVehicleData,
    processBaseData,
    processCoverData,
    ANCILLARY,
    countCoveredVehicles,
    ancillaryDataOnly
} from '../common';

describe('common methods', () => {
    describe('getStringDate', () => {
        it('should return string version of a date', () => {
            // given
            const date = {
                day: 22,
                month: 12,
                year: 2012
            };
            // when
            const stringDate = getStringDate(date);
            // then
            expect(stringDate).toBe('2012_12_22');
        });

        it('should return string version of a date', () => {
            // given
            const date = {
                day: '01',
                month: '01',
                year: '2077'
            };
            // when
            const stringDate = getStringDate(date);
            // then
            expect(stringDate).toBe('2077_01_01');
        });
    });

    describe('getStringFromBoolean', () => {
        it('should return Yes for true value', () => {
            // then
            expect(getStringFromBoolean(true)).toBe('Yes');
        });

        it('should return No for a false value', () => {
            // then
            expect(getStringFromBoolean(false)).toBe('No');
        });
    });

    describe('getSelectedCoveragesNames', () => {
        it('should return all coverages names', () => {
            // given
            const ancillaryCoverages = [
                {
                    selected: true,
                    name: 'Ancillary 1'
                },
                {
                    selected: true,
                    name: 'Ancillary 2'
                },
                {
                    selected: true,
                    name: 'Ancillary 3'
                }
            ];
            // when
            const coveragesNames = getSelectedCoveragesNames(ancillaryCoverages);
            // then
            expect(coveragesNames).toBe('Ancillary 1, Ancillary 2, Ancillary 3');
        });

        it('should return none coverages names', () => {
            // given
            const ancillaryCoverages = [
                {
                    selected: false,
                    name: 'Ancillary 1'
                },
                {
                    selected: false,
                    name: 'Ancillary 2'
                },
                {
                    selected: false,
                    name: 'Ancillary 3'
                }
            ];
            // when
            const coveragesNames = getSelectedCoveragesNames(ancillaryCoverages);
            // then
            expect(coveragesNames).toBe('');
        });

        it('should return selected coverages names', () => {
            // given
            const ancillaryCoverages = [
                {
                    selected: true,
                    name: 'Ancillary 1'
                },
                {
                    selected: false,
                    name: 'Ancillary 2'
                },
                {
                    selected: true,
                    name: 'Ancillary 3'
                }
            ];
            // when
            const coveragesNames = getSelectedCoveragesNames(ancillaryCoverages);
            // then
            expect(coveragesNames).toBe('Ancillary 1, Ancillary 3');
        });

        it('should return an empty string when empty array', () => {
            // given
            const ancillaryCoverages = [];
            // when
            const coveragesNames = getSelectedCoveragesNames(ancillaryCoverages);
            // then
            expect(coveragesNames).toBe('');
        });
    });

    describe('getAncillary', () => {
        // given
        const ancillaryCoverages = [
            {
                name: 'Ancillary 1'
            },
            {
                name: 'Ancillary 2'
            },
            {
                name: 'Ancillary 3'
            }
        ];
        it('should return anicllary for given name', () => {
            // when
            const ancillary = getAncillary(ancillaryCoverages, 'Ancillary 2');
            // then
            expect(ancillary).toBe(ancillaryCoverages[1]);
        });

        it('should return undefined when ancillary does not exists', () => {
            // when
            const ancillary = getAncillary(ancillaryCoverages, 'Ancillary 4');
            // then
            expect(ancillary).toBe(undefined);
        });

        it('should return undefined when there are no ancillaries', () => {
            // when
            const ancillary = getAncillary([], 'Ancillary 1');
            // then
            expect(ancillary).toBe(undefined);
        });
    });

    describe('getVehicleModifications', () => {
        // given
        const translator = ({ id, defaultMessage }) => {
            switch (id) {
                case 'typekey.VehicleModifications_Ext.A': return 'A modification';
                case 'typekey.VehicleModifications_Ext.B': return 'B modification';
                default: return defaultMessage;
            }
        };
        it('should return empty string when there is no modificiations', () => {
            // given
            const modifications = [];
            // when
            const translatedModifications = getVehicleModifications(modifications, translator);
            // then
            expect(translatedModifications).toBe('');
        });

        it('should return translated modifications', () => {
            // given
            const modifications = [
                { modification: 'A' },
                { modification: 'B' }];
            // when
            const translatedModifications = getVehicleModifications(modifications, translator);
            // then
            expect(translatedModifications).toBe('A modification, B modification');
        });

        it('should return default message when translation is not available', () => {
        // given
            const modifications = [
                { modification: 'C' },
                { modification: 'D' }];
            // when
            const translatedModifications = getVehicleModifications(modifications, translator);
            // then
            expect(translatedModifications).toBe('C, D');
        });


        it('should return default message only when translation is not available', () => {
            // given
            const modifications = [
                { modification: 'A' },
                { modification: 'D' }];
                // when
            const translatedModifications = getVehicleModifications(modifications, translator);
            // then
            expect(translatedModifications).toBe('A modification, D');
        });

        it('should return default message when translator is not available', () => {
            // given
            const modifications = [
                { modification: 'A' },
                { modification: 'D' }];
                // when
            const translatedModifications = getVehicleModifications(modifications, {});
            // then
            expect(translatedModifications).toBe('A, D');
        });
    });

    describe('processAncillaryData', () => {
        // given
        const term = 'test term value';
        const ancillaryCoverages = [
            {
                name: ANCILLARY.BREAKDOWN,
                selected: true,
                amount: {
                    amount: 10
                },
                terms: [
                    { chosenTermValue: term }
                ]
            },
            {
                name: ANCILLARY.MOTOR_LEGAL_EXPENSES,
                selected: true,
                amount: {
                    amount: 20
                }
            },
            {
                name: ANCILLARY.MOTOR_PERSONAL_ACCIDENT,
                selected: true,
                amount: {
                    amount: 30
                }
            },
            {
                name: ANCILLARY.EXCESS_PROTECTOR,
                selected: true,
                amount: {
                    amount: 40
                }
            },
            {
                name: ANCILLARY.SUBSTITUTE_VEHICLE,
                selected: true,
                amount: {
                    amount: 50
                }
            },
            {
                name: ANCILLARY.KEY_COVER,
                selected: true,
                amount: {
                    amount: 60
                }
            },

        ];


        it('should return ancillary data when selected', () => {
            // when
            const data = processAncillaryData(ancillaryCoverages);

            // then
            expect(data.customer_insurance_options)
                .toBe('Breakdown, Motor Legal Expenses, Motor Personal Accident, Excess Protector, Substitute Vehicle, Key Cover');
            expect(data.customer_breakdown_cost).toBe(10);
            expect(data.customer_breakdown_cover_level).toBe(term);
            expect(data.customer_breakdown).toBe('Yes');
            expect(data.key_cover).toBe('Yes');
            expect(data.key_cover_cost).toBe(60);
            expect(data.legal_cover).toBe('Yes');
            expect(data.legal_cover_cost).toBe(20);
            expect(data.personal_accident_cover).toBe('Yes');
            expect(data.personal_accident_cover_cost).toBe(30);
            expect(data.substitute_vehicle_cover).toBe('Yes');
            expect(data.substitute_vehicle_cover_cost).toBe(50);
        });

        it('should return ancillary data when not selected', () => {
            // given
            const notSelectedAncillaries = ancillaryCoverages.map((ancillary) => ({
                ...ancillary,
                selected: false
            }));
            // when
            const data = processAncillaryData(notSelectedAncillaries);
            // then
            expect(data.customer_insurance_options).toBe('');
            expect(data.customer_breakdown_cost).toBe(10);
            expect(data.customer_breakdown_cover_level).toBe('');
            expect(data.customer_breakdown).toBe('No');
            expect(data.key_cover).toBe('No');
            expect(data.key_cover_cost).toBe(60);
            expect(data.legal_cover).toBe('No');
            expect(data.legal_cover_cost).toBe(20);
            expect(data.personal_accident_cover).toBe('No');
            expect(data.personal_accident_cover_cost).toBe(30);
            expect(data.substitute_vehicle_cover).toBe('No');
            expect(data.substitute_vehicle_cover_cost).toBe(50);
        });
    });

    describe('processVehicleData', () => {
        // given
        const vehicle = {
            coverType: 'comprehensive',
            voluntaryExcess: '250',
            numberOfDoors: 4,
            make: 'MERCEDES-BENZ',
            model: 'E250 SPORT ED125 CDI BLUE',
            vehicleModifications: [{ modification: 'A' }, { modification: 'B' }],
            isRegisteredKeeperAndLegalOwner: true,
            insurancePaymentType: '3',
            vehicleWorth: 5000,
            yearManufactured: 2012,
            ncdProtection: {
                ncdgrantedYears: '3'
            }
        };

        const translator = ({ id, defaultMessage }) => {
            switch (id) {
                case 'typekey.VehicleModifications_Ext.A': return 'A modification';
                case 'typekey.VehicleModifications_Ext.B': return 'B modification';
                default: return defaultMessage;
            }
        };

        it('should return vehicle information', () => {
            // when
            const data = processVehicleData(vehicle, translator);
            // then
            expect(data.insurance_cover_level).toBe(vehicle.coverType);
            expect(data.voluntary_excess).toBe(vehicle.voluntaryExcess);
            expect(data.car_doors).toBe(vehicle.numberOfDoors);
            expect(data.car_make).toBe(vehicle.make);
            expect(data.car_model).toBe(vehicle.model);
            expect(data.car_modifications).toBe('A modification, B modification');
            expect(data.car_owner).toBe('Yes');
            expect(data.car_value).toBe(vehicle.vehicleWorth);
            expect(data.car_year).toBe(vehicle.yearManufactured);
            expect(data.payment_frequency).toBe('Monthly');
            expect(data.ncd_years).toBe(vehicle.ncdProtection.ncdgrantedYears);
        });

        it('should return default values when translator is not available', () => {
            // when
            const data = processVehicleData(vehicle, {});
            // then
            expect(data.insurance_cover_level).toBe(vehicle.coverType);
            expect(data.voluntary_excess).toBe(vehicle.voluntaryExcess);
            expect(data.car_doors).toBe(vehicle.numberOfDoors);
            expect(data.car_make).toBe(vehicle.make);
            expect(data.car_model).toBe(vehicle.model);
            expect(data.car_modifications).toBe('A, B');
            expect(data.car_owner).toBe('Yes');
            expect(data.car_value).toBe(vehicle.vehicleWorth);
            expect(data.car_year).toBe(vehicle.yearManufactured);
            expect(data.ncd_years).toBe(vehicle.ncdProtection.ncdgrantedYears);
        });
    });

    describe('processBaseData', () => {
        // given
        const baseData = {
            accountNumber: '123456',
            isExistingCustomer: true,
            brandCode: 'HD',
            productCode: 'PrivateCar_Ext',
            productName: 'Private Car'
        };

        it('should map base data', () => {
            // when
            const data = processBaseData(baseData);
            // then
            expect(data.existing_customer).toBe('Yes');
            expect(data.insurance_product).toBe(baseData.brandCode);
            expect(data.insurance_type).toBe(baseData.productName);
            expect(data.product_code).toBe(baseData.productCode);
            expect(data.product_name).toBe(baseData.productName);
        });
    });

    describe('processCoverData', () => {
        // given
        const quoteID = '123456';
        const baseData = {
            periodStartDate: {
                day: 1,
                month: 9,
                year: 1939
            },
            periodEndDate: {
                day: 2,
                month: 9,
                year: 1945
            }
        };
        const chosenQuote = {
            branchName: 'Hastings Direct',
            branchCode: 'HD',
            hastingsPremium: {
                annuallyPayment: {
                    billingID: '1',
                    premiumAnnualCost: {
                        amount: '1200'
                    }
                },
                monthlyPayment: {
                    billingID: '2',
                    premiumAnnualCost: {
                        amount: '100'
                    }
                }
            }
        };

        it('should return annual chosen payment', () => {
            // given
            const selectedPaymentPlan = '1';
            // when
            const data = processCoverData(quoteID, baseData, chosenQuote, selectedPaymentPlan);
            // then
            expect(data.total_cost).toBe(chosenQuote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount);
        });

        it('should return monthly chosen payment', () => {
            // given
            const selectedPaymentPlan = '2';
            // when
            const data = processCoverData(quoteID, baseData, chosenQuote, selectedPaymentPlan);
            // then
            expect(data.total_cost).toBe(chosenQuote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount);
        });


        it('should return empty string when monthly payment is not availalble', () => {
            // given
            const quote = {
                branchName: 'Hastings Direct',
                brandCode: 'HD',
                hastingsPremium: {
                    annuallyPayment: {
                        billingID: '1',
                        premiumAnnualCost: {
                            amount: '900'
                        }
                    }
                }
            };
            const selectedPaymentPlan = '1';
            // when
            const data = processCoverData(quoteID, baseData, quote, selectedPaymentPlan);
            // then
            expect(data.monthly_cost).toBe('');
            expect(data.annual_cost).toBe(quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount);
        });

        it('should return empty string when annual payment is not availalble', () => {
            // given
            const quote = {
                branchName: 'Hastings Direct',
                brandCode: 'HD',
                hastingsPremium: {
                    monthlyPayment: {
                        billingID: '1',
                        premiumAnnualCost: {
                            amount: '200'
                        }
                    }
                }
            };
            const selectedPaymentPlan = '2';
            // when
            const data = processCoverData(quoteID, baseData, quote, selectedPaymentPlan);
            // then
            expect(data.annual_cost).toBe('');
            expect(data.monthly_cost).toBe(quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount);
        });

        it('should return processed data', () => {
            // given
            const selectedPaymentPlan = '1';
            // when
            const data = processCoverData(quoteID, baseData, chosenQuote, selectedPaymentPlan);
            // then
            expect(data.cover_end_date).toBe('1945_9_2');
            expect(data.cover_start_date).toBe('1939_9_1');
            expect(data.monthly_cost).toBe(chosenQuote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount);
            expect(data.annual_cost).toBe(chosenQuote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount);
            expect(data.quote_id).toBe(quoteID);
            expect(data.product_option).toBe(chosenQuote.branchName);
            expect(data.product_option_code).toBe(chosenQuote.branchCode);
            expect(data.total_cost).toBe(chosenQuote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount);
        });
        it('should return number of covered vehicles for multicar', () => {
            // given
            const mockQuote = [
                {
                    lobData: { privateCar: { coverables: { vehicles: [{ vehicle: 'mock' }] } } }
                },
                {
                    lobData: { privateCar: { coverables: { vehicles: [{ vehicle: 'mock' }] } } }
                },
            ];
            const actual = countCoveredVehicles(mockQuote);
            const expected = 2;
            expect(actual).toBe(expected);
        });
        it('should return number of covered vehicles for singlecar', () => {
            // given
            const mockQuote = undefined;
            const actual = countCoveredVehicles(mockQuote);
            const expected = 1;
            expect(actual).toBe(expected);
        });

        it('should return ancillaries only data', () => {
            // given
            const term = 'test term value';
            const ancillaryCoverages = [
                {
                    name: ANCILLARY.BREAKDOWN,
                    selected: true,
                    amount: {
                        amount: 10
                    },
                    terms: [
                        { chosenTermValue: term }
                    ]
                },
                {
                    name: ANCILLARY.MOTOR_LEGAL_EXPENSES,
                    selected: true,
                    amount: {
                        amount: 20
                    }
                },
                {
                    name: ANCILLARY.MOTOR_PERSONAL_ACCIDENT,
                    selected: true,
                    amount: {
                        amount: 30
                    }
                },
                {
                    name: ANCILLARY.EXCESS_PROTECTOR,
                    selected: true,
                    amount: {
                        amount: 40
                    }
                },
                {
                    name: ANCILLARY.SUBSTITUTE_VEHICLE,
                    selected: true,
                    amount: {
                        amount: 50
                    }
                },
                {
                    name: ANCILLARY.KEY_COVER,
                    selected: true,
                    amount: {
                        amount: 60
                    }
                },

            ];

            const data = [
                {
                    coverages: {
                        privateCar: {
                            ancillaryCoverages: [{ coverages: ancillaryCoverages }]
                        }
                    }
                }, {
                    coverages: {
                        privateCar: {
                            ancillaryCoverages: [{ coverages: ancillaryCoverages }]
                        }
                    }
                }
            ];
            // than
            const expected = {
                customer_insurance_options: [
                    'Breakdown, Motor Legal Expenses, Motor Personal Accident, Excess Protector, Substitute Vehicle, Key Cover',
                    'Breakdown, Motor Legal Expenses, Motor Personal Accident, Excess Protector, Substitute Vehicle, Key Cover'
                ],
                customer_breakdown_cost: [10, 10],
                customer_breakdown_cover_level: ['test term value', 'test term value'],
                customer_breakdown: ['Yes', 'Yes'],
                key_cover: ['Yes', 'Yes'],
                key_cover_cost: [60, 60],
                legal_cover: ['Yes', 'Yes'],
                legal_cover_cost: [20, 20],
                personal_accident_cover: ['Yes', 'Yes'],
                personal_accident_cover_cost: [30, 30],
                substitute_vehicle_cover: ['Yes', 'Yes'],
                substitute_vehicle_cover_cost: [50, 50]
            };
            const actual = ancillaryDataOnly(data);
            expect(actual).toStrictEqual(expected);
        });
        it('should return empty object with wrong data', () => {
            // given
            const ancillaryCoverages = [];

            const data = [
                {
                    coverages: {
                        privateCar: {
                            ancillaryCoverages: [{ coverages: ancillaryCoverages }]
                        }
                    }
                }, {
                    coverages: {
                        privateCar: {
                            ancillaryCoverages: [{ coverages: ancillaryCoverages }]
                        }
                    }
                }
            ];
            // than
            const expected = {};
            const actual = ancillaryDataOnly(data);
            expect(actual).toStrictEqual(expected);
        });
    });
});
