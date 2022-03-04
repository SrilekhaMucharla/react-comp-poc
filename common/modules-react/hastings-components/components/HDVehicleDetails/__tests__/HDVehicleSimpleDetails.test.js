import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDVehicleSimpleDetails from '../HDVehicleSimpleDetails';

configure({ adapter: new Adapter() });

describe('<HDVehicleSimpleDetails/>', () => {
    it('render component with vrn and display name', () => {
        const vrn = 'AV12 BGE';
        const displayName = 'MERCEDES-BENZ E250 SPORT ED125 CDI BLUE';

        const tree = renderer.create(<HDVehicleSimpleDetails
            vrn={vrn}
            displayName={displayName} />)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
