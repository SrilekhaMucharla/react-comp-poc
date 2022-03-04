/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import _ from 'lodash';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HastingsVehicleInfoLookupService } from 'hastings-capability-vehicleinfolookup';
import { HDDropdownList, HDButton, HDForm } from 'hastings-components';
import productMetadata from '../../../generated/metadata/product-metadata.json';
import submission from '../../../routes/SubmissionVMInitial';
import HDSearchVehiclePage from '../HDSearchVehiclePage';
import defaultTranslator from '../../wizard-pages/__helpers__/testHelper';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
jest.mock('hastings-capability-vehicleinfolookup');

describe('<HDSearchVehiclePage />', () => {
    let component;
    beforeEach(() => {
        if (component) component.unmount();
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
    });
    test('render component', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDSearchVehiclePage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('Search make', async () => {
        const mockData = {
            result: ['AC', 'AIXAM', 'ALFA ROMEO', 'ALLARD', 'ALPINA', 'ALPINE', 'ALVIS', 'AMC', 'ANT',
                'ARM SIDDELEY', 'ARO', 'ASIA', 'ASTON MARTIN', 'AUDI', 'AUSTIN', 'AUTO UNION', 'BENTLEY', 'BITTER',
                'BMW', 'BOND', 'BORGWARD', 'BRISTOL', 'BUGATTI', 'BUICK', 'CADILLAC', 'CATERHAM', 'CHEVROLET', 'CHRYS AUS',
                'CHRYSLER', 'CITROEN', 'CLUB CAR', 'COLT', 'DACIA', 'DAEWOO', 'DAF', 'DAIHATSU', 'DAIMLER', 'DALLAS', 'DATSUN', 'DE TOMASO',
                'DELOREAN', 'DFSK', 'DODGE', 'DS', 'ERA', 'FACEL VEGA', 'FAIRTHORPE', 'FERRARI', 'FIAT', 'FORD', 'FSO',
                'GEM', 'GILBERN', 'GINETTA', 'GOGGOMOBIL',
                'HILLMAN', 'HINDUSTAN', 'HOLDEN', 'HONDA', 'HUMBER', 'HUMMER', 'HYUNDAI', 'INFINITI', 'ISO RIVOLTA',
                'ISUZU', 'JAGUAR', 'JEEP', 'JENSEN', 'JIAYUAN',
                'JOWETT', 'KHALEEJ', 'KIA', 'LADA', 'LAMBORGHINI', 'LANCHESTER', 'LANCIA', 'LANDROVER', 'LEXUS', 'LIGIER', 'LINCOLN', 'LONSDALE', 'LOTUS',
                'MAHINDRA', 'MARANELLO', 'MARCOS', 'MARLIN', 'MASERATI', 'MAYBACH', 'MAZDA', 'MCLAREN', 'MERCEDES-BENZ', 'MERCURY',
                'MG', 'MG-MOTOR UK', 'MIA', 'MICROCAR', 'MINI', 'MITSUBISHI', 'MORGAN', 'MORRIS', 'MOSKVICH', 'MOSLER', 'MYCAR', 'NAC MG',
                'NISSAN', 'NOBLE', 'NSU', 'OKA', 'OPEL', 'PANHARD', 'PANTHER', 'PERODUA', 'PEUGEOT', 'PGO', 'PORSCHE', 'PORTARO', 'PROTON', 'RELIANT',
                'RENAULT', 'REVA', 'RILEY', 'ROLLS ROYCE', 'ROVER', 'SAAB', 'SAN', 'SANTANA', 'SAO', 'SEAT', 'SECMA', 'SHANGHIEDRIVE', 'SIMCA', 'SINGER', 'SKODA', 'SMART', 'SSANGYONG', 'STANDARD', 'STEVENS', 'SUBARU', 'SUNBEAM', 'SUZUKI', 'TALBOT', 'TATA', 'TD', 'TESLA', 'THINK', 'TOYOTA', 'TRIUMPH', 'TVR', 'VALIANT', 'VANDEN PLAS', 'VAUXHALL', 'VENTURI', 'VEXEL',
                'VOLGA', 'VOLKSWAGEN', 'VOLVO', 'WARTBURG', 'WOLSELEY', 'YUGO/ZASTAVA', 'ZENOS']
        };

        HastingsVehicleInfoLookupService.retrieveManufacturers.mockResolvedValue(mockData);

        const wrapper = mount(
            <Provider store={store}>
                <HDSearchVehiclePage />
            </Provider>
        );
        await act(async () => {
            const makeField = wrapper.find('#make_select_lookup');
            expect(makeField).toMatchSnapshot();
        });
    });
    test('Check if make object type matches', async () => {
        const mockData = {
            result: {
                matches: ['16', '16/80', '16/90', '2 LITRE', '2-1 BUCKLAND', '3 LITRE', '428', 'ACE', 'ACE AUTO', 'ACE BRISTOL',
                    'ACE BRISTOL CABRIOLET', 'ACECA', 'ACECA BRISTOL', 'COBRA 289', 'COBRA 427', 'COBRA CONVERTIBLE', 'COBRA MK IV',
                    'GREYHOUND', 'ME', 'SHELBY COBRA'
                ]
            }
        };

        HastingsVehicleInfoLookupService.retrieveModels.mockResolvedValue(mockData);
        const handleChange = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <HDSearchVehiclePage />
            </Provider>
        );

        await act(async () => {
            expect(wrapper.find('#make_select_lookup')).toEqual({});
        });
    });
    test('Check all fields are rendered', async () => {
        const wrapper = mount(
            <Provider store={store}>
                <HDSearchVehiclePage model />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('HDDropdownList[name="make"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="model"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="fuelType"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="year"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="numberOfDoors"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="transmission"]')).toBeTruthy();
            expect(wrapper.find('HDDropdownList[name="bodyType"]')).toBeTruthy();
        });
    });
});
