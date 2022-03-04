import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import _ from 'lodash';
import 'jest-enzyme';
import 'regenerator-runtime';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

jest.mock('axios');

jest.mock('../../../../applications/quote-and-buy/src/web-analytics/useMultiCarJourney', () => ({
    __esModule: true,
    default: () => null
}));

const pathToHook = '../../../../applications/quote-and-buy/src/web-analytics/useErrorStatus';

jest.mock(pathToHook, () => ({
    __esModule: true,
    default: () => null
}));

configure({ adapter: new Adapter() });

global.act = act;
global.compose = _.flowRight;
global.mount = mount;

function renderContent(content) {
    if (_.isString(content) || _.isFunction(content)) {
        const Content = content;
        return <Content />;
    }
    return () => content;
}

/* pattern below is the one suggested in react-testing-library */
const TestHook = ({ callback }) => {
    callback();
    return null;
};

global.testHook = (callback) => {
    mount(<TestHook callback={callback} />);
};

/* Testing react router */
const withRouterAndParams = (routerParams = {}) => {
    return (content) => {
        const ContentToRender = renderContent(content);
        return (
            <MemoryRouter {...routerParams}>
                <ContentToRender />
            </MemoryRouter>
        );
    };
};

// const ommitErrors = ['Warning: A component is changing a controlled input of type', 'Warning: Each child in a list should have a unique'];
//
// const defaultError = console.error;

// Stop showing this error in tests
// jest.spyOn(console, 'error').mockImplementation((msg, ...params) => {
//     if (msg == null || ommitErrors.filter((error) => typeof msg.startsWith === 'function' && msg.startsWith(error)).length === 0) {
//         defaultError(msg, params);
//     }
// });

// Set timeout for debugging in IDE
jest.setTimeout(300000);

global.window.scrollTo = jest.fn();
global.window.scroll = jest.fn();
global.withRouterAndParams = withRouterAndParams;
global.withRouter = withRouterAndParams();
global.renderContent = renderContent;

const axiosSpies = {
    request: jest.spyOn(axios, 'get'),
    get: jest.spyOn(axios, 'patch'),
    delete: jest.spyOn(axios, 'post'),
    head: jest.spyOn(axios, 'put'),
    options: jest.spyOn(axios, 'get'),
    post: jest.spyOn(axios, 'patch'),
    put: jest.spyOn(axios, 'post'),
    patch: jest.spyOn(axios, 'put'),
};

beforeEach(() => {
    Object.values(axiosSpies).forEach((spyObj) => spyObj.mockClear());
});

afterEach(() => {
    // if these are failing, explictly mock whatever service triggers axios (network request) in the failing test
    expect(axiosSpies.request).not.toHaveBeenCalled();
    expect(axiosSpies.get).not.toHaveBeenCalled();
    expect(axiosSpies.delete).not.toHaveBeenCalled();
    expect(axiosSpies.head).not.toHaveBeenCalled();
    expect(axiosSpies.options).not.toHaveBeenCalled();
    expect(axiosSpies.post).not.toHaveBeenCalled();
    expect(axiosSpies.put).not.toHaveBeenCalled();
    expect(axiosSpies.patch).not.toHaveBeenCalled();
});

global.utag = {
    link: jest.fn(),
    view: jest.fn()
};

window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn()
}));
