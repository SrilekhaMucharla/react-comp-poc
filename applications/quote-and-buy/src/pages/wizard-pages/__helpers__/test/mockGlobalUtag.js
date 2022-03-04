/* eslint-disable no-undef */
const mockGlobalUtag = () => {
    const mockedLink = jest.fn();
    const mockedView = jest.fn();
    global.utag = {
        link: mockedLink,
        view: mockedView
    };
    return { mockedLink, mockedView };
};

export default mockGlobalUtag;
