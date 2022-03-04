import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDMCPNCDTable from '../HDMCPNCDTable';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDPNCDTable />', () => {
    let wrapper = null;

    beforeEach(async () => {
        wrapper = await mount(
            <HDMCPNCDTable
                ncdData={[
                    { years: '2', discount: 15 },
                    { years: '3', discount: 25 },
                    { years: '4', discount: 28 },
                    { years: '5', discount: 30 },
                ]} />,

        );
    });

    it('should render the component and match snapshot', async () => {
        expect(wrapper).toMatchSnapshot();
    });
});
