import React from 'react';
import HDCheckboxButtonList from '../HDCheckboxButtonList';
import HDImageRadionButton from '../../HDImageRadioButton/HDImageRadioButton';

const mockChange = jest.fn();

const testContentDiv = <div id="test-content">Test Content</div>;
const testContentDivLazy = () => <div id="test-content-lazy">Test Content Lazy</div>;
const testItems = [
    { label: 'Test01', id: 1, value: {} },
    { label: 'Test02', id: 2, value: {} },
    {
        label: 'Test03', id: 3, value: {}, content: testContentDiv
    },
    {
        label: 'Test04', id: 4, value: {}, content: testContentDivLazy
    },
    { label: 'Test05', id: 5, value: {} },
];
const selectedTestItems = [
    testItems[2],
    testItems[3],
];
const KEY_CODE_ENTER = 13;

const getWrapper = (props) => {
    return mount(<HDCheckboxButtonList onChange={mockChange} items={testItems} selectedItems={selectedTestItems} {...props} />);
};

describe('<HDCheckboxButtonList>', () => {
    afterEach(() => {
        mockChange.mockClear();
    });

    test('component renders', () => {
        const wrapper = getWrapper();
        expect(wrapper.length).toEqual(1);
    });

    test('Clicking on item triggers function call with clicked element data as argument', async () => {
        // first
        const wrapper = getWrapper();
        // than
        const item = wrapper.find(HDImageRadionButton).at(0).parent();
        // than
        await act(async () => item.props().onClick({ target: {} }));
        wrapper.update();
        // expect
        expect(mockChange.mock.calls.length).toEqual(1);
        // and
        expect(mockChange.mock.calls[0][1]).toStrictEqual(testItems[0]);
    });

    test('Key down on item container triggers function call and returns array of labels', () => {
        // first
        const wrapper = getWrapper();
        // than
        const item = wrapper.find('#hd-checkbox-button-list-item-button').at(2);
        // than
        act(() => item.props().onKeyDown({ target: {}, keyCode: KEY_CODE_ENTER }));
        // expect
        expect(mockChange.mock.calls.length).toEqual(1);
        // and
        expect(mockChange.mock.calls[0][1]).toStrictEqual(testItems[2]);
    });

    test('Items passed as selected are checked', async () => {
        const wrapper = getWrapper();
        const items = wrapper.find('#hd-checkbox-button-list-item-button');
        expect(items.at(2).find('input').props()).toHaveProperty('checked', true);
        expect(items.at(3).find('input').props()).toHaveProperty('checked', true);
    });

    test('Content is rendered for checked item if present', async () => {
        const wrapper = getWrapper();
        expect(wrapper.find('div#test-content').exists()).toEqual(true);
    });

    test('Lazy-loaded content is rendered for checked item if present', async () => {
        const wrapper = getWrapper();
        expect(wrapper.find('div#test-content-lazy').exists()).toEqual(true);
    });

    test('Content is not rendered when item is not checked', async () => {
        const wrapper = getWrapper({ selectedItems: [] });
        expect(wrapper.find('div#test-content').exists()).toEqual(false);
    });

    test('Lazy-loaded content is not rendered when item is not checked', async () => {
        const wrapper = getWrapper({ selectedItems: [] });
        expect(wrapper.find('div#test-content-lazy').exists()).toEqual(false);
    });
});
