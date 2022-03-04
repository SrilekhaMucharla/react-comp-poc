import trackQuoteData from '..';
import * as trackingModule from '../../trackData';
import { SALES_JOURNEY_TYPE } from '../common';

import getDataFromQuote from '../getDataFromQuote';

jest.mock('../getDataFromQuote', () => jest.fn((data) => data));
const common = require('../common');

common.countCoveredVehicles = jest.fn((data) => ((data && data.length > 1) ? 2 : 1));

describe('trackQuoteData', () => {
    // given
    const translator = ({ defaultMessage }) => defaultMessage;

    let trackEventSpy;

    beforeEach(() => {
        trackEventSpy = jest.spyOn(trackingModule, 'trackEvent').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should gather data for single car', () => {
        // given
        const data = {
            name: 'quote 1'
        };
        // when
        trackQuoteData(data, translator);
        // then
        expect(getDataFromQuote).toHaveBeenCalledWith(data, translator);
        expect(trackEventSpy).toHaveBeenCalledWith(
            {
                name: ['quote 1'],
                number_of_vehicles: [1],
                sales_journey_type: SALES_JOURNEY_TYPE.SINGLE_CAR
            }
        );
    });

    it('should gather data for multi car', () => {
        // given
        const data = {
            quotes: [
                { name: 'quote 1' },
                { name: 'quote 2' }
            ]
        };
        // when
        trackQuoteData(data, translator);
        // then
        expect(getDataFromQuote).toHaveBeenCalledTimes(2);
        expect(getDataFromQuote).toHaveBeenNthCalledWith(1, data.quotes[0], translator);
        expect(getDataFromQuote).toHaveBeenNthCalledWith(2, data.quotes[1], translator);
        expect(trackEventSpy).toHaveBeenCalledWith(
            {
                name: ['quote 1', 'quote 2'],
                number_of_vehicles: [2],
                sales_journey_type: SALES_JOURNEY_TYPE.MULTI_CAR
            }
        );
    });
});
