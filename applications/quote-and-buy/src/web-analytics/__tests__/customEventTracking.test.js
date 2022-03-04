import customEventTracking from '../customEventTracking';
import { trackEvent } from '../trackData';

jest.mock('../trackData', () => ({
    trackEvent: jest.fn()
}));

describe('customEventTracking', () => {
    afterEach(() => {
        trackEvent.mockReset();
    });
    test('for all values given event with all values is sent', () => {
        const expected = {
            element_id: 'test-element',
            event_action: 'test-value',
            event_type: 'test_type',
            event_value: 'test-label',
            sales_journey_type: 'single_car',
            test_value: 'test_value'
        };
        const testData = { ...expected };
        customEventTracking(testData);
        expect(trackEvent).toHaveBeenLastCalledWith(expected);
    });
    test('for none values given event with default values is sent', () => {
        const expected = {
            element_id: 'custom-element',
            event_action: 'custom-value',
            event_type: 'custom_type',
            event_value: 'custom-label',
            sales_journey_type: 'single_car'
        };
        const testData = {};
        customEventTracking(testData);
        expect(trackEvent).toHaveBeenLastCalledWith(expected);
    });
});
