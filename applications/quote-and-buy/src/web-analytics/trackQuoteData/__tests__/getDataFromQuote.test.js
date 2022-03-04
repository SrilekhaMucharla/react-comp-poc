import getDataFromQuote from '../getDataFromQuote';
import * as helpers from '../common';

describe('getDataFromQuote', () => {
    const translator = ({ defaultMessage }) => defaultMessage;

    let processCoverDataSpy;
    let processAncillaryDataSpy;
    let processVehicleDataSpy;
    let processBaseDataSpy;

    beforeEach(() => {
        processCoverDataSpy = jest.spyOn(helpers, 'processCoverData').mockImplementation(jest.fn());
        processAncillaryDataSpy = jest.spyOn(helpers, 'processAncillaryData').mockImplementation(jest.fn());
        processVehicleDataSpy = jest.spyOn(helpers, 'processVehicleData').mockImplementation(jest.fn());
        processBaseDataSpy = jest.spyOn(helpers, 'processBaseData').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should get the data', () => {
        // given
        const quote = {
            lobData: {
                privateCar: {
                    coverables: {
                        drivers: [{}],
                        vehicles: [{
                            publicID: '4321',
                        }]
                    },
                    offerings: [{
                        branchCode: 'HD',
                        coverages: {
                            ancillaryCoverages: [
                                {
                                    publicID: '4321'
                                }
                            ]
                        }
                    }]
                }
            },
            baseData: {},
            bindData: {
                selectedPaymentPlan: '1',
                chosenQuote: '4321',
                accountNumber: '12345'

            },
            quoteData: {
                offeredQuotes: [{
                    publicID: '4321',
                    branchCode: 'HD',
                }]
            },
            quoteID: '4321'
        };

        // when
        const data = getDataFromQuote(quote, translator);
        // then
        expect(processCoverDataSpy).toHaveBeenCalled();
        expect(processAncillaryDataSpy).toHaveBeenCalled();
        expect(processVehicleDataSpy).toHaveBeenCalled();
        expect(processBaseDataSpy).toHaveBeenCalled();
        expect(data.additional_driver).toBe('No');
        expect(data.number_of_cars).toBe(1);
        expect(data.number_of_drivers).toBe(1);
        expect(data.customer_id).toBe('12345');
    });

    it('should return proper number of cars and drivers', () => {
        // given
        const quote = {
            lobData: {
                privateCar: {
                    coverables: {
                        drivers: [{}, {}, {}, {}],
                        vehicles: [{
                            publicID: '4321',
                        },
                        {
                            publicID: '4322',
                        }, {
                            publicID: '4323',
                        }]
                    },
                    offerings: [{
                        branchCode: 'HD',
                        coverages: {
                            ancillaryCoverages: [
                                {
                                    publicID: '4321'
                                }
                            ]
                        }
                    }]
                }
            },
            baseData: {},
            bindData: {
                selectedPaymentPlan: '1',
                chosenQuote: '4321',
                accountNumber: '12345'
            },
            quoteData: {
                offeredQuotes: [{
                    publicID: '4321',
                    branchCode: 'HD',
                }]
            },
            quoteID: '4321'
        };

        // when
        const data = getDataFromQuote(quote, translator);
        // then
        expect(processCoverDataSpy).toHaveBeenCalled();
        expect(processAncillaryDataSpy).toHaveBeenCalled();
        expect(processVehicleDataSpy).toHaveBeenCalled();
        expect(processBaseDataSpy).toHaveBeenCalled();
        expect(data.additional_driver).toBe('Yes');
        expect(data.number_of_cars).toBe(3);
        expect(data.number_of_drivers).toBe(4);
        expect(data.customer_id).toBe('12345');
    });
});
