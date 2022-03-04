import { trackAPICallSuccess, trackAPICallFail } from '../trackAPICall';

const mockedLink = jest.fn();

global.utag = {
    link: mockedLink,
};
describe('trackAPICall', () => {
    // given
    const eventAction = 'event action';
    const errorMessage = 'error message';

    it('should call trackEvent with SUCCESS', () => {
        // when
        trackAPICallSuccess(eventAction);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: 'SUCCESS',
            event_type: 'API call',
            event_action: eventAction
        });
    });

    it('should call trackEvent with FAIL', () => {
        // when
        trackAPICallFail(eventAction, errorMessage);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: 'FAIL',
            event_type: 'API call',
            event_action: eventAction,
            error_message: errorMessage
        });
    });
});
