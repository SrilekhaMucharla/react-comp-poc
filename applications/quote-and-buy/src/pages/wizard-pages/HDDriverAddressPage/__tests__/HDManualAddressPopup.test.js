import React from 'react';
import { mount } from 'enzyme';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import { HDButtonRefactor } from 'hastings-components';
import HDManualAddresssPopup from '../HDManualAddressPopup';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

describe('<HDManualAddresssPopup />', () => {
    createPortalRoot();

    let wrapper;

    const addressLookupMatches = [{
        matchAccuracy: 0.7,
        address: {
            matchAccuracy: 0.7,
            address: {
                addressLine1: '1 Westbourne Court',
                addressLine2: 'Cooden Drive',
                addressLine3: '',
                city: 'BEXHILL-ON-SEA',
                county: 'East Sussex',
                postalCode: 'TN393AA'
            }
        }
    }];
    jest.spyOn(HastingsAddressLookupService, 'lookupAddressByPostCode').mockResolvedValue({ result: { matches: addressLookupMatches } });

    beforeEach(() => {
        jest.clearAllTimers();
        jest.useFakeTimers();
        const address = {
            addressLine1: 'Test St 123',
            addressLine2: 'xxx',
            addressLine3: 'xxx',
            postalCode: 'XX23XX',
            city: 'Test City',
        };
        const handleConfirm = jest.fn();
        const trigger = (<div>TEST</div>);
        wrapper = mount(<HDManualAddresssPopup
            onConfirm={handleConfirm}
            initialAddress={address}
            trigger={trigger} />);
    });

    it('render component with all props', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('fill form and confirm', async () => {
        await act(async () => wrapper.find('HDOverlayPopup[id="manual-address-popup"] .hd-overlay-btn').invoke('onClick')());
        wrapper.update();

        let textField = wrapper.find('input').at(0);

        await act(async () => textField.props().onChange({
            target: {
                name: textField.prop('name'),
                value: 'Test Drive 100'
            }
        }));

        textField = wrapper.find('input').at(1);
        await act(async () => textField.props().onChange({
            target: {
                name: textField.prop('name'),
                value: 'test line2'
            }
        }));

        textField = wrapper.find('ForwardRef').at(2);
        await act(async () => textField.props().onChange({
            target: {
                name: textField.prop('name'),
                value: 'testline3'
            }
        }));

        textField = wrapper.find('input').at(3);
        await act(async () => textField.props().onChange({
            target: {
                name: textField.prop('name'),
                value: 'Test city'
            }
        }));

        wrapper.update();

        await act(async () => wrapper.find(HDButtonRefactor).at(0).props().onClick());
        wrapper.update();

        jest.runOnlyPendingTimers();
        wrapper.update();

        expect(wrapper.find('input')).toHaveLength(0);
    });
});
