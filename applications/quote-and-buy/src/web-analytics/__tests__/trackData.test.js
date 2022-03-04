import { trackView, trackEvent } from '../trackData';

const mockedView = jest.fn();
const mockedLink = jest.fn();

global.utag = {
    link: mockedLink,
    view: mockedView
};
describe('web analytics', () => {
    // given
    const dataObj = { obj: 'test-object' };
    it('should call utag link when trackEvent', () => {
        // when
        trackEvent(dataObj);
        // then
        expect(mockedLink).toHaveBeenCalledWith(dataObj);
    });

    it('should call utag view when trackView', () => {
        // when
        trackView(dataObj);
        // then
        expect(mockedView).toHaveBeenCalledWith(dataObj);
    });
});
