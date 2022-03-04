import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import useErrorStatus from '../useErrorStatus';
import { UW_ERROR_CODE } from '../../constant/const';


const TestHook = ({ callback }) => {
    callback();
    return null;
};


async function testHook(callback, state) {
    let wrapper;
    const store = configureStore([])(state);
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <TestHook callback={callback} />
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('useErrorStatus Hook', () => {
    beforeEach(() => {
        jest.mock('../useErrorStatus', () => {
            // Require the original module to not be mocked...
            const originalModule = jest.requireActual('../useErrorStatus');
            return {
                __esModule: true,
                ...originalModule,
            };
        });
    });

    afterEach(() => {
        jest.mock('../useErrorStatus', () => ({
            __esModule: true,
            default: () => null
        }));
    });

    it.concurrent('expect UW_ERROR_CODE', async () => {
        // given
        const state = {
            errorStatus: {
                errorStatusCode: 805
            }
        };
        // when
        let error;
        await testHook(() => {
            error = useErrorStatus();
        }, state);
        // then
        expect(error).toBe(UW_ERROR_CODE);
    });
});
