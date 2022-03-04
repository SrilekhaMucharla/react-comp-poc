import React from 'react';
import HDPolicySelect from '../HDPolicySelect';

const onChangeMock = jest.fn();

/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 */
const onChangeAction = (component, path, actionName, actionValue) => {
    component
        .props().onChange({
            target: {
                name: actionName,
                value: actionValue,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};
describe('<HDPolicySelect />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <HDPolicySelect onChange={onChangeMock} infoOverlay={<div>Overlay</div>} />
        );
    });
    test('render component', () => {
        expect(wrapper).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('triggering onChange on ToggleButtons ', async () => {
        let actualValue = '';
        const expectedValue = 'online';
        const onChangeFn = (event) => {
            actualValue = event.target.value;
        };
        wrapper = mount(
            <HDPolicySelect className="mock-policy-select" selectedOption={actualValue} onChange={onChangeFn} infoOverlay={<div>Overlay</div>} />
        );
        const toggleButton = wrapper.find('.hd-create-policy-select__toggle-button').at(0);
        await act(async () => onChangeAction(toggleButton, toggleButton.props().path, toggleButton.props().name, expectedValue));
        await act(async () => wrapper.update());
        expect(actualValue).toBe(expectedValue);
    });
});
