import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDDatePickerRefactor from '../HDDatePickerRefactor';

let realDate;

Enzyme.configure({ adapter: new Adapter() });

describe('<HDDatePickerRefactor />', () => {
    beforeAll(() => {
        const currentDate = new Date('2019-12-15T10:24:04.395Z');
        realDate = Date;
        global.Date = class extends Date {
            constructor(date) {
                if (date) {
                    // eslint-disable-next-line constructor-super
                    return super(date);
                }

                return currentDate;
            }
        };
    });

    it('render component with min date', () => {
        const wrapper = shallow(<HDDatePickerRefactor minDate={0} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it('render component with max date', () => {
        const wrapper = shallow(<HDDatePickerRefactor maxDate={0} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it('render component with default date', () => {
        const wrapper = shallow(<HDDatePickerRefactor defaultDate={0} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it('render component with children', () => {
        const wrapper = shallow(<HDDatePickerRefactor hidePicker={false} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    afterAll(() => {
        // Cleanup
        global.Date = realDate;
    });
});
