import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDModal from '../HDModal';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDModal/>', () => {
    it('should render component', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();
        const onCancelMock = jest.fn();
        const component = (
            <div id="portal-modal">
                <HDModal show onClose={onCloseMock} onConfirm={onConfirmMock} onCancel={onCancelMock}>
                    <div>Test</div>
                </HDModal>
            </div>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });
    // Header text
    it('should render component with header text', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();
        const onCancelMock = jest.fn();
        const component = (
            <div id="portal-modal">
                <HDModal headerText="Heading" show onClose={onCloseMock} onConfirm={onConfirmMock} onCancel={onCancelMock}>
                    <div>Test</div>
                </HDModal>
            </div>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render component with header text and confirm', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();
        const onCancelMock = jest.fn();
        const component = (
            <div id="portal-modal">
                <HDModal headerText="Heading" confirmLabel="Yes" show onClose={onCloseMock} onConfirm={onConfirmMock} onCancel={onCancelMock}>
                    <div>Test</div>
                </HDModal>
            </div>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });
    it('should render component with header text confirm and cancel', () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();
        const onCancelMock = jest.fn();
        const component = (
            <div id="portal-modal">
                <HDModal headerText="Heading" confirmLabel="Yes" cancelLabel="Go" show onClose={onCloseMock} onConfirm={onConfirmMock} onCancel={onCancelMock}>
                    <div>Test</div>
                </HDModal>
            </div>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });
});
