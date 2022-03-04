import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';


import customizeSubmission from '../mock/customizeSubmission.json';
import HDPNCDPage from '../HDPNCDPage';
import HDQuoteService from '../../../../api/HDQuoteService';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);


describe('<HDPNCDPage />', () => {
    let wrapper;

    jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementation((customizeSubmissionVM) => Promise.resolve({
        id: customizeSubmission.id,
        result: customizeSubmissionVM
    }));


    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });


    test('render component', () => {
        // const initialState = createInitialState();
        const store = mockStore({});

        wrapper = shallow(
            <Provider store={store}>
                <HDPNCDPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
