import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import useMultiCarJourney from '../useMultiCarJourney';

jest.mock('../useMultiCarJourney', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('../useMultiCarJourney');
    return {
        __esModule: true,
        ...originalModule,
    };
});


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

describe('useMultiCarJourney', () => {
    it('should return true when flag is set to true', async () => {
        // given
        const state = {
            wizardState: {
                app: {
                    multiCarFlag: true
                }
            }
        };
        // when
        let isMultiCar;
        await testHook(() => {
            isMultiCar = useMultiCarJourney();
        }, state);
        // then
        expect(isMultiCar).toBeTruthy();
    });


    it('should return false when flag is set to false', async () => {
        // given
        const state = {
            wizardState: {
                app: {
                    multiCarFlag: false
                }
            }
        };
            // when
        let isMultiCar;
        await testHook(() => {
            isMultiCar = useMultiCarJourney();
        }, state);
        // then
        expect(isMultiCar).toBeFalsy();
    });
});
