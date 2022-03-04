
import React from 'react';
import { mount } from 'enzyme';
import HDAccordionRefactor from '../HDAccordionRefactor';

const header = 'Test header';
const content = (<div className="test">Test content</div>);

describe('<HDAccordionRefactor />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    test('render component', () => {
        const wrapper = mount(
            <HDAccordionRefactor cards={[
                {
                    header: header,
                    content: content
                }
            ]} />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('clicking toggle should show content', async () => {
        // first
        const wrapper = mount(
            <HDAccordionRefactor cards={[
                {
                    header: header,
                    content: content
                }
            ]} />
        );
        // and expect
        expect(wrapper.find(HDAccordionRefactor)).toHaveLength(1);
        // than
        const button = wrapper.find('.hd-accordion__toggle').at(0);
        await act(async () => button.simulate('click'));
        wrapper.update();
        // and expect
        expect(wrapper.find('.collapsing')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
    test('clicking toggle should show content', async () => {
        // first
        const wrapper = mount(
            <HDAccordionRefactor cards={[
                {
                    header: header,
                    content: content
                }
            ]} />
        );
        // and expect
        expect(wrapper.find(HDAccordionRefactor)).toHaveLength(1);
        // than
        let button = wrapper.find('.hd-accordion__toggle').at(0);
        await act(async () => button.simulate('click'));
        wrapper.update();
        // than
        button = wrapper.find('.hd-accordion__toggle').at(1);
        await act(async () => button.simulate('click'));
        await act(async () => wrapper.update());

        await act(async () => {
            jest.runAllTimers();
        });
        wrapper.update();

        // and expect
        expect(wrapper.find('.collapse')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('setting supportInnerHTML to true will show inner html', async () => {
        // first
        const wrapper = mount(
            <HDAccordionRefactor
                supportInnerHTML
                cards={[
                    {
                        header: header,
                        content: content
                    }
                ]} />
        );
        // and expect
        expect(wrapper.find(HDAccordionRefactor)).toHaveLength(1);
        expect(wrapper.find('.hd-accordion__inner-html')).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
