import React from 'react';
import HDRadioButtonList from '../HDRadioButtonList';
import HDImageRadionButton from '../../HDImageRadioButton/HDImageRadioButton';

const mockChange = jest.fn();
const testItems = [
    { label: 'Test01', id: 1, value: 'Value01' },
    { label: 'Test02', id: 2, value: 'Value02' },
    { label: 'Test03', id: 3, value: 'Value03' },
    { label: 'Test04', id: 4, value: 'Value04' },
    { label: 'Test05', id: 5, value: 'Value05' },
];
const KEY_CODE_ENTER = 13;

const getWrapper = () => {
    return mount(<HDRadioButtonList onChange={mockChange} items={testItems} />);
};

describe('<HDRadioButtonList>', () => {
    afterEach(() => {
        mockChange.mockClear();
    });
    test('component renders', () => {
        const wrapper = getWrapper();
        expect(wrapper.length).toEqual(1);
    });
    test('onChange triggers function call and returns selected label', () => {
        // first
        const wrapper = getWrapper();
        // than
        const item = wrapper.find(HDImageRadionButton).at(0).parent();
        // than
        act(() => item.props().onClick({ target: {} }));
        // expect
        expect(mockChange.mock.calls.length).toEqual(1);
        // and
        expect(mockChange.mock.calls[0].includes(testItems[0])).toBeTruthy();
    });
    test('Clicking on item container triggers function call and returns selected label', () => {
        // first
        const wrapper = getWrapper();
        // than
        const item = wrapper.find('.hd-radio-button-list_item-container').at(1);
        // than
        act(() => item.props().onClick({ target: {} }));
        // expect
        expect(mockChange.mock.calls.length).toEqual(1);
        // and
        expect(mockChange.mock.calls[0].includes(testItems[1])).toBeTruthy();
    });
    test('Key down on item container triggers function call and returns selected label', () => {
        // first
        const wrapper = getWrapper();
        // than
        const item = wrapper.find('.hd-radio-button-list_item-container').at(2);
        // than
        act(() => item.props().onKeyDown({ target: {}, keyCode: KEY_CODE_ENTER }));
        // expect
        expect(mockChange.mock.calls.length).toEqual(1);
        // and
        expect(mockChange.mock.calls[0].includes(testItems[2])).toBeTruthy();
    });
});
