import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsVehicleInfoLookupService } from 'hastings-capability-vehicleinfolookup';
import configureStore from 'redux-mock-store';
import submission from '../../../../routes/SubmissionVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import { HDPromotionalPage } from '../HDPromotionalPage';
import { setNavigation as setNavigationAction } from '../../../../redux-thunk/actions';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
jest.mock('hastings-capability-vehicleinfolookup');
jest.mock('../../../../common/downloadFile/helpers');
Enzyme.configure({ adapter: new Adapter() });

describe('<HDPromotionalPage />', () => {
    const pageMetadata = {
        page_name: 'page name',
        page_type: 'page type',
        sales_journey_type: 'sales journey type'
    };
    const quotValue = [{
        hastingsPremium: {
            annuallyPayment: {
                premiumAnnualCost: {
                    amount: '2755'
                }
            }
        }
    }];
    const registrationPath = { value: 'AV12BGE' };
    beforeEach(() => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const initialState = {
            monetateModel: {
                resultData: {}
            },
            wizardState: {
                data: {
                    submissionVM: submissionVM
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
    });

    test.skip('render component', () => {
        const wrapper = shallow(
            <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Retrieve manufacturers for Search Vehicle Child Component', async () => {
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
                'RENAULT', 'REVA', 'RILEY', 'ROLLS ROYCE', 'ROVER', 'SAAB', 'SAN', 'SANTANA', 'SAO',
                'SEAT', 'SECMA', 'SHANGHIEDRIVE', 'SIMCA', 'SINGER', 'SKODA', 'SMART', 'SSANGYONG',
                'STANDARD', 'STEVENS', 'SUBARU', 'SUNBEAM', 'SUZUKI', 'TALBOT', 'TATA', 'TD', 'TESLA',
                'THINK', 'TOYOTA', 'TRIUMPH', 'TVR', 'VALIANT', 'VANDEN PLAS', 'VAUXHALL', 'VENTURI', 'VEXEL',
                'VOLGA', 'VOLKSWAGEN', 'VOLVO', 'WARTBURG', 'WOLSELEY', 'YUGO/ZASTAVA', 'ZENOS']
        };

        HastingsVehicleInfoLookupService.retrieveManufacturers.mockResolvedValue(mockData);

        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('#mc-promo-page-make-model-link')).toBeTruthy();
        });
    });

    test('After Search VRN click call Vehicle details API', async () => {
        const mockData = {
            result: {
                abiCode: '32120102',
                alarmImmobilizer: '93',
                body: 'SALOON',
                bodyCode: '02',
                colour: 'SILVER',
                drivingSide: 'R',
                engineSize: '2143',
                fuelType: 'Diesel',
                importType: 'no',
                make: 'MERCEDES-BENZ',
                model: 'E250 SPORT ED125 CDI BLUE',
                numberOfDoors: 4,
                numberOfSeats: '5',
                registrationsNumber: 'BD51 SMR',
                transmission: '001',
                type: 'PrivateCar_Ext',
                weight: 2280,
                year: 2012,
                yearManufactured: 2012
            }
        };

        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValue(mockData);

        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('#vrn-search-input')).toBeTruthy();
        });
    });

    test('Check for registration number text input', async () => {
        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('#vrn-search-input')).toBeTruthy();
        });
    });

    test('HDForm exists', async () => {
        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('HDForm')).toHaveLength(1);
        });
    });

    test('Check for infocard', async () => {
        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('#mc-promo-page-additional-info-card')).toBeTruthy();
        });
    });

    test('should check whether button exists', async () => {
        expect(quotValue[0].hastingsPremium.annuallyPayment.premiumAnnualCost.amount).toBe('2755');
        const wrapper = mount(
            <Provider store={store}>
                <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
            </Provider>
        );
        const button = wrapper.find('HDButtonRefactor#mc-promo-page-find-car-btn');
        expect(button.exists()).toEqual(true);
    });

    test('Search VRN', async () => {
        let wrapper;
        const regNo = 'AV12BGE';
        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDPromotionalPage pageMetadata={pageMetadata} setNavigation={setNavigationAction} />
                </Provider>
            );
        });
        wrapper.update();
        await act(async () => {
            wrapper.find('#mc-promo-page-find-car-btn').at(0).simulate('click');
        });
        wrapper.update();
        expect(regNo).toEqual(registrationPath.value);
    });
});
