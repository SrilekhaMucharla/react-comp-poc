import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';

// GW
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

// HD
// Full path import is required to apply mock !!
import HastingsValidationService from 'hastings-capability-validation/services/HastingsValidationService';
import HDDriverLicenceNumberPage from '../HDDriverLicenceNumberPage';
import ukDrivingLicense from '../UkDrivingLicenseGenerator';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';
import submission from '../../../../routes/SubmissionVMInitial';

const middlewares = [];
const mockStore = configureStore(middlewares);
const submissionVM = {};
let wrapper;

const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
const licenceTypeFieldname = 'licenceType';
const licenceTypePath = `${driverPath}.${licenceTypeFieldname}.value.code`;

const updateEvent = {
    target: {
        value: 'DR9AB'
    },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

// Init VM
const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

const simulateDLNChange = async (dlnInput) => {
    // Simulate entering new value
    await act(async () => {
        dlnInput.at(0)
            .props()
            .onChange(updateEvent);
    });
};

describe('<HDDriverLicenceNumberPage />', () => {
    beforeEach(() => {
        // Initialize mockstore with empty state
        const lastNameFieldName = 'lastName';
        const lastNamePath = `${driverPath}.person.${lastNameFieldName}.value`;
        const genderPath = `${driverPath}.gender.value.code`;

        const driverBornDayPath = `${driverPath}.dateOfBirth.day.value`;
        const driverBornMonthPath = `${driverPath}.dateOfBirth.month.value`;
        const driverBornYearPath = `${driverPath}.dateOfBirth.year.value`;
        const licenceNumberFieldname = 'licenseNumber';
        const licenceNumberPath = `${driverPath}.${licenceNumberFieldname}`;

        // Set default values
        _.set(submissionVM, lastNamePath, 'jones');
        _.set(submissionVM, genderPath, 'F');
        _.set(submissionVM, driverBornYearPath, 1976);
        // 0-11 month notation
        _.set(submissionVM, driverBornMonthPath, 2);
        _.set(submissionVM, driverBornDayPath, 11);
        _.set(submissionVM, licenceTypePath, 'F_FM');

        // valid license
        _.set(submissionVM, `${licenceNumberPath}.aspects.subtreeValid`, true);

        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionVM
                },
                app: {
                    step: 1,
                    prevStep: 0,
                    pages: {
                        drivers: {
                            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        }
                    }
                },
            }
        };

        const store = mockStore(initialState);

        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Provider store={store}>
                    <HDDriverLicenceNumberPage pageId="test-page" />
                </Provider>
            </ViewModelServiceContext.Provider>
        ));
    });

    test('Render component', () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Don\'t validate DLN on external service', async () => {
        HastingsValidationService.validateLicense = jest.fn(
            () => Promise.resolve({
                result: {
                    drivingLicence: {
                        drivingLicenceNumber: updateEvent.target.value
                    }
                }
            })
        );

        const dln = wrapper.find('#partTwo');
        _.set(submissionVM, licenceTypePath, 'P_PU');

        // Simulate entering new value
        await simulateDLNChange(dln);

        expect(HastingsValidationService.validateLicense)
            .toHaveBeenCalledTimes(0);
    });

    test('Validate DLN on external service', async () => {
        HastingsValidationService.validateLicense = jest.fn(
            () => Promise.resolve({
                result: {
                    drivingLicence: {
                        directiveIndicator: 4,
                        drivingLicenceNumber: 'RNEWQ801019DR9AB',
                        drivingLicenceYears: 2,
                        validFrom: '2017-06-26T23:00:00Z',
                        validTo: '2067-06-23T23:00:00Z',
                        drivingLicenceDate: '2017-06-26T23:00:00Z',
                        dvlaProcessingDate: '2018-04-22T14:03:52Z',
                        dvlaServiceVersion: '1',
                        hubProcessingDate: '2018-04-22T14:03:52Z',
                        hubServiceVersion: '1.0.0.0'
                    },
                    drivingEndorsementsCollection: [
                        {
                            code: 'SP30',
                            convictionDate: '2020-11-11T00:00:00Z',
                            custodialPeriod: 0,
                            disqualPeriod: 'PT0S ',
                            fine: 0,
                            isDisqual: false,
                            noOfPoints: 3,
                            offenceDate: '2020-09-09T23:00:00Z'
                        },
                        {
                            code: 'SP30',
                            convictionDate: '2017-11-11T00:00:00Z',
                            custodialPeriod: 0,
                            disqualEndDate: '2018-11-11T00:00:00Z',
                            disqualPeriod: 'P1Y0M0DT12H30M5S ',
                            disqualStartDate: '2017-11-11T00:00:00Z',
                            fine: 600,
                            isDisqual: true,
                            noOfPoints: 3,
                            rehabSpentDate: '2019-11-11T00:00:00Z'
                        }
                    ],
                }
            })
        );

        // Initialize mockstore with empty state
        const mockSubmissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const licenceHeldForFieldname = 'licenceHeldFor';
        const licenceHeldForPath = `${driverPath}.${licenceHeldForFieldname}`;

        const yearLicensedAvailableValues = _.get(mockSubmissionVM, licenceHeldForPath).aspects.availableValues;
        _.set(submissionVM, `${licenceHeldForPath}.aspects.availableValues`, yearLicensedAvailableValues);

        const dln = wrapper.find('#partTwo');

        // Simulate entering new value
        await simulateDLNChange(dln);

        const storeVM = wrapper.find('Provider').props().store.getState().wizardState.data.submissionVM;

        const driver = _.get(storeVM, `${driverPath}`);

        expect(HastingsValidationService.validateLicense)
            .toHaveBeenCalled();

        expect(driver.claimsAndConvictions.anyConvictions.value).toBeTruthy();
        expect(driver.claimsAndConvictions.convictionsCollection[0].drivingBanMonths).toBe(0);
        expect(driver.claimsAndConvictions.convictionsCollection[1].drivingBanMonths).toBe(12);
    });

    test('Failed request to validate DLN', async () => {
        HastingsValidationService.validateLicense = jest.fn(
            () => Promise.resolve({
                result: {
                    errorCode: '603'
                }
            })
        );

        const dln = wrapper.find('#partTwo');

        // Simulate entering new value
        await simulateDLNChange(dln);

        wrapper.update();

        const alert = wrapper.find('HDAlertRefactor');

        expect(alert.text())
            .toBeTruthy();
    });
});

describe('ukDrivingLicenseNumber', () => {
    test('Female driving license', () => {
        const drivingLicenseNumber = ukDrivingLicense('jones', 1976, 3, 11, 'F');

        expect(drivingLicenseNumber)
            .toBe('JONES753116');
    });

    test('Female driving license, date birth December', () => {
        const drivingLicenseNumber = ukDrivingLicense('jones', 1976, 12, 11, 'F');

        expect(drivingLicenseNumber)
            .toBe('JONES762116');
    });

    test('Male driving license', () => {
        const drivingLicenseNumber = ukDrivingLicense('judd', 1959, 7, 13, 'M');

        expect(drivingLicenseNumber)
            .toBe('JUDD9507139');
    });

    test('Throw error on bad input', () => {
        expect(() => { ukDrivingLicense('judd', 1959, 7, 13, 1); })
            .toThrowError();
    });
});
