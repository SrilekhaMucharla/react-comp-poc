import _ from 'lodash';
import routes from '../RouteConst';
import { VRN_SEARCH_PAGE, CUSTOMIZE_QUOTE_WIZARD, } from '../../BaseRouter/RouteConst';
import {
    HDVehicleDetailsPage,
    HDCarLocationPage,
    HDCarMileagePage,
    HDDriverAddressPage,
    HDDriverDOBPage,
    HDDriverEmailPage,
    HDDriverHomeOwnerPage,
    HDDriverLicenceLengthPage,
    HDCompletedCarDetailsPage,
    HDDriverLicenceNumberPage,
    HDDriverLicenceTypePage,
    HDDriverMaritalStatusPage,
    HDDriverNamePage,
    HDPolicyStartDatePage,
    HDPrimaryEmployementInfoPage,
    HDSecondaryEmployementInfoPage,
    HDDriverClaimsPage,
    HDDriverConvictionsPage,
    HDYourQuotesPage,
    HDThanksPage,
    HDCarWorthPage,
    HDTrackerPage,
    HDCarUsagePage,
    HDCarPurchasePage,
    HDAddAnotherDriverPage,
    HDDriverScanOrContinuePage,
    HDTransitionPage,
    HDCoverageTransitionPage,
    HDQuoteDeclinePage,
    HDPromotionalPage,
    HDMultiCarMilestonePage,
    HDMCPolicyStartDatePage,
    HDSavingsPage,
    HDMCQuoteDeclinePage,
    HDDriverScanPage,
    HDMCHeadsUpPage,
    HDMCYourQuotesPage,

} from '../../../pages/wizard-pages';
import {
    getWizardConfig,
    getCurrentPageConfig
} from '../HDWizardConfig';
import HDMCDriverAllocationSecondary from '../../../pages/wizard-pages/HDMCDriverAllocationSecondary/HDMCDriverAllocationSecondary';
import HDMCPolicyHolderAllocation from '../../../pages/wizard-pages/HDMCPolicyHolderAllocation/HDMCPolicyHolderAllocation';
import HDMCDriverAllocation from '../../../pages/wizard-pages/HDMCDriverAllocation/HDMCDriverAllocation';
import HDMCCompletedCarDetailsPage from '../../../pages/wizard-pages/HDMCCompletedCarDetailsPage/HDMCCompletedCarDetailsPage';

describe('HDWizardConfig', () => {
    // given
    const wizardConfig = getWizardConfig(false);
    const getConfig = (page) => wizardConfig.find((config) => config.WizardPage === page);

    describe('When testing conf for HDVehicleDetailsPage', () => {
        // given
        const config = getConfig(HDVehicleDetailsPage);

        it('should have id', () => {
            expect(config.id).toBe('HastingsCarDetails');
        });

        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(VRN_SEARCH_PAGE);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.CAR_WORTH);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.VEHICLE_DETAILS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDCarLocationPage', () => {
        // given
        const config = getConfig(HDCarLocationPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsCarLocation');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.MILEAGE);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.CAR_DETAILS);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.CAR_LOCATION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDCarMileagePage', () => {
        // given
        const config = getConfig(HDCarMileagePage);

        it('should have id', () => {
            expect(config.id).toBe('HastingsCarMileage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.CAR_USAGE);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.CAR_LOCATION);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MILEAGE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverAddressPage', () => {
        // given
        const config = getConfig(HDDriverAddressPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_Address');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.DRIVER_EMAIL);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.HOMEOWNER);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_ADDRESS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverDOBPage', () => {
        // given
        const config = getConfig(HDDriverDOBPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_DOB');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 0 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_NAME);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { isPolicyHolder: true };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_EMAIL);
        });

        it('should return proper page for forward func for additional driver', () => {
            // given
            const mockedState = { isPolicyHolder: false };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_MARITAL_STATUS);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_DOB);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverEmailPage', () => {
        // given
        const config = getConfig(HDDriverEmailPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_Email');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.DRIVER_DOB);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_ADDRESS);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_EMAIL);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverHomeOwnerPage', () => {
        // given
        const config = getConfig(HDDriverHomeOwnerPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_HomeOwner');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.DRIVER_ADDRESS);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_MARITAL_STATUS);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.HOMEOWNER);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverLicenceLengthPage', () => {
        // given
        const config = getConfig(HDDriverLicenceLengthPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_DrivingLicence_Length');
        });
        it('should return DRIVING_LICENSE_TYPE page when licence is other than allowed', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].licenceType.value.code', 'other');
            // when
            const [path, state] = config.backward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return DRIVING_LICENSE_NUMBER page when licence is allowed', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].licenceType.value.code', 'F_FM');
            // when
            const [path, state] = config.backward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_NUMBER);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 0 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_CLAIMS);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_LENGTH);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDCompletedCarDetailsPage', () => {
        // given
        const config = getConfig(HDCompletedCarDetailsPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsCarDetails_Complete');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.CAR_LOCATION);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_SCAN_OR_CONTINUE);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.CAR_DETAILS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverLicenceNumberPage', () => {
        // given
        const config = getConfig(HDDriverLicenceNumberPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_DrivingLicence_Number');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { drvierIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = {
                drvierIndex: 1,
                drivers: {
                    0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                    1: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false }
                }
            };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_LENGTH);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return proper page for skip func', () => {
            // given
            const mockedState = { drvierIndex: 1 };
            // when
            const [path, state] = config.skip({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_CLAIMS);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_NUMBER);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverLicenceTypePage', () => {
        // given
        const config = getConfig(HDDriverLicenceTypePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_DrivingLicence');
        });
        it('should return PRIMARY_EMPLOYMENT page for U employment status', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'U');
            // when
            const [path] = config.backward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.PRIMARY_EMPLOYMENT);
        });

        it('should return PRIMARY_EMPLOYMENT page for N employment status', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'N');
            // when
            const [path, state] = config.backward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.PRIMARY_EMPLOYMENT);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return SECONDARY_EMPLOYMENT page for other employment statuses', () => {
            // given
            const mockedState = { driverIndex: 0 };

            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'other');
            // when
            const [path, state] = config.backward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.SECONDARY_EMPLOYMENT);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return DRIVING_LICENSE_LENGTH page when licence is other than allowed', () => {
            // given
            const mockedState = { driverIndex: 0 };

            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].licenceType.value.code', 'other');
            // when
            const [path, state] = config.forward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_LENGTH);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return DRIVING_LICENSE_NUMBER page when licence is allowed', () => {
            // given
            const mockedState = {
                driverIndex: 0,
                drivers: {
                    0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false }
                }
            };

            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].licenceType.value.code', 'F_FM');
            // when
            const [path, state] = config.forward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_NUMBER);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverMaritalStatusPage', () => {
        // given
        const config = getConfig(HDDriverMaritalStatusPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_MaritalStatus');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { isPolicyHolder: true };
            // when
            const [path] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.HOMEOWNER);
        });

        it('should return proper page for backward func for additional driver', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_DOB);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.PRIMARY_EMPLOYMENT);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_MARITAL_STATUS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HastingsScanOrContinue', () => {
        // given
        const config = getConfig(HDDriverScanOrContinuePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsScanOrContinue');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { isPolicyHolder: true };
            // when
            const [path] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.CAR_DETAILS);
        });

        it('should return proper page for backward func and additional driver', () => {
            // when
            const [path, state] = config.backward({}, { driverIndex: 1 });
            // then
            expect(path).toBe(routes.ADD_ANOTHER_DRIVER);
            expect(state).toStrictEqual({ driverIndex: 0, removeDriver: true });
        });

        it('should return proper page for backward func and main driver', () => {
            // when
            const [path] = config.backward({}, { driverIndex: 0 });
            // then
            expect(path).toBe(routes.CAR_DETAILS);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 1, isDriverEdit: true, isPolicyHolder: false };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_SCAN);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_SCAN_OR_CONTINUE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverNamePage', () => {
        // given
        const config = getConfig(HDDriverNamePage);

        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails');
        });

        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 0 };
            // when
            const [path] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_SCAN_OR_CONTINUE);
        });

        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_DOB);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_NAME);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDPolicyStartDatePage', () => {
        // given
        const config = getConfig(HDPolicyStartDatePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPolicyStart');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.ADD_ANOTHER_DRIVER);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.QUOTE_DECLINE);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.POLICY_START_DATE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Cover');
        });
    });
    describe('When testing conf for HDPrimaryEmployementInfoPage', () => {
        // given
        const config = getConfig(HDPrimaryEmployementInfoPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_EmploymentStatus');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_MARITAL_STATUS);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return DRIVING_LICENSE_TYPE page for U employment status', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'U');
            // when
            const [path, state] = config.forward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return DRIVING_LICENSE_TYPE page for N employment status', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'N');
            // when
            const [path, state] = config.forward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
            expect(state).toStrictEqual(mockedState);
        });

        it('should return SECONDARY_EMPLOYMENT page for other employment statuses', () => {
            // given
            const mockedState = { driverIndex: 0 };
            const submissionVM = {};
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.children[0].fullEmpStatus.value.code', 'other');
            // when
            const [path, state] = config.forward(submissionVM, mockedState);
            // then
            expect(path).toBe(routes.SECONDARY_EMPLOYMENT);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.PRIMARY_EMPLOYMENT);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDSecondaryEmployementInfoPage', () => {
        // given
        const config = getConfig(HDSecondaryEmployementInfoPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_AnotherJob');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.PRIMARY_EMPLOYMENT);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_TYPE);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.SECONDARY_EMPLOYMENT);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverClaimsPage', () => {
        // given
        const config = getConfig(HDDriverClaimsPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_Claims');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = {
                driverIndex: 1,
                drivers: {
                    0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                    1: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false }
                }
            };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVING_LICENSE_LENGTH);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_CONVICTIONS);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_CLAIMS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDDriverConvictionsPage', () => {
        // given
        const config = getConfig(HDDriverConvictionsPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_Convictions');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_CLAIMS);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path, state] = config.forward();
            // then
            expect(path).toBe(routes.ADD_ANOTHER_DRIVER);
            expect(state).toStrictEqual({ driverIndex: 0, removeDriver: false });
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_CONVICTIONS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDYourQuotesPage', () => {
        // given
        const config = getConfig(HDYourQuotesPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsYourQuotes');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.POLICY_START_DATE);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.COVERAGE_TRANSITION);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.YOUR_QUOTES);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Cover');
        });
    });
    describe('When testing conf for HDCarWorthPage', () => {
        // given
        const config = getConfig(HDCarWorthPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsCarWorth');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.VEHICLE_DETAILS);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.TRACKER);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.CAR_WORTH);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDTrackerPage', () => {
        // given
        const config = getConfig(HDTrackerPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsTracker');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.CAR_WORTH);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.CAR_PURCHASE);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.TRACKER);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDCarUsagePage', () => {
        // given
        const config = getConfig(HDCarUsagePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsCarUsage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.CAR_PURCHASE);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.MILEAGE);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.CAR_USAGE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for HDCarPurchasePage', () => {
        // given
        const config = getConfig(HDCarPurchasePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsLegalOwner');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.TRACKER);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.CAR_USAGE);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.CAR_PURCHASE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for ThanksPage', () => {
        // given
        const config = getConfig(HDThanksPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsThanksPage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.YOUR_QUOTES);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.THANKS);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.THANKS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Quote');
        });
    });

    describe('When testing conf for HDAddAnotherDriverPage', () => {
        // given
        const config = getConfig(HDAddAnotherDriverPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPersonalDetails_Complete');
        });
        it('should return proper page for backward func', () => {
            // given
            const mockedState = { driverIndex: 1 };
            // when
            const [path, state] = config.backward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_CONVICTIONS);
            expect(state).toStrictEqual(mockedState);
        });
        it('should return proper page for forward func', () => {
            // given
            const mockedState = { driverIndex: { }, isDriverEdit: false };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.TRANSITION);
        });

        it('should return proper page for forward func when editing dirver', () => {
            // given
            const mockedState = { driverIndex: 1, isDriverEdit: true };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_NAME);
        });

        it('should return proper page for forward func when editing vehicle', () => {
            // given
            const mockedState = { driverIndex: 1, isVehicleEdit: true };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.VEHICLE_DETAILS);
        });

        it('should return proper page for forward func when editing dirver', () => {
            // given
            const mockedState = { driverIndex: 1, isDriverEdit: true };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_NAME);
        });

        it('should return proper page for forward func when editing vehicle', () => {
            // given
            const mockedState = { driverIndex: 1, isVehicleEdit: true };
            // when
            const [path] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.VEHICLE_DETAILS);
        });

        it('should return proper page for forward func for adding another driver', () => {
            // given
            const mockedState = { isPolicyHolder: false, isDriverEdit: false, driverIndex: 1 };
            // when
            const [path, state] = config.forward({}, mockedState);
            // then
            expect(path).toBe(routes.DRIVER_SCAN_OR_CONTINUE);
            expect(state).toStrictEqual(mockedState);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.ADD_ANOTHER_DRIVER);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });

    describe('when testing getCurrentPageConfig', () => {
        it('should return proper config based on pathname', () => {
            // given
            const pathName = wizardConfig[0].path;
            // then
            expect(getCurrentPageConfig(wizardConfig, pathName)).toBe(wizardConfig[0]);
        });

        it('should return empty pathname when there is no config with pathname', () => {
            // given
            const pathName = 'Kansas - Carry on Wayward Son';
            const exp = {
                path: '',
                gridsContainerSize: {
                    md: { span: 6, offset: 3 },
                    lg: { span: 6, offset: 3 },
                }
            };
            // then
            expect(getCurrentPageConfig(wizardConfig, pathName)).toStrictEqual(exp);
        });
    });

    describe('When testing conf for Quote decline page', () => {
        // given
        const config = getConfig(HDQuoteDeclinePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsQuoteDeclinePage');
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(CUSTOMIZE_QUOTE_WIZARD);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.QUOTE_DECLINE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe(undefined);
        });
    });
    describe('When testing conf for HDCoverageTransitionPage', () => {
        // given
        const config = getConfig(HDCoverageTransitionPage);

        it('should have id', () => {
            expect(config.id).toBe('HastingsCoverageTransitionPage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.YOUR_QUOTES);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(CUSTOMIZE_QUOTE_WIZARD);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.COVERAGE_TRANSITION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Quote');
        });
    });
    describe('When testing conf for HDTransitionPage', () => {
        // given
        const config = getConfig(HDTransitionPage);

        it('should have id', () => {
            expect(config.id).toBe('HastingsTransitionPage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.ADD_ANOTHER_DRIVER);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.POLICY_START_DATE);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.TRANSITION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });

    describe('When testing conf for MultiCar Promotional page', () => {
        // given
        const config = getConfig(HDPromotionalPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsPromotion');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.YOUR_QUOTES);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(CUSTOMIZE_QUOTE_WIZARD);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.PROMOTION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Quote');
        });
    });

    describe('When testing conf for MultiCar Milestone page', () => {
        // given
        const config = getConfig(HDMultiCarMilestonePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCMilestonePage');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.DRIVER_CONVICTIONS);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.MC_DRIVER_ALLOCATION_SECONDARY);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_MILESTONE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });

    describe('When testing conf for MultiCar Policy Start Date page', () => {
        // given
        const config = getConfig(HDMCPolicyStartDatePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCPolicyStart');
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_POLICY_START_DATE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Cover');
        });
    });

    describe('When testing conf for MultiCar Saving page', () => {
        // given
        const config = getConfig(HDSavingsPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCSavingsPage');
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_SAVINGS_PAGE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Cover');
        });
    });

    describe('When testing conf for MultiCar Quote decline page', () => {
        // given
        const config = getConfig(HDMCQuoteDeclinePage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCQuoteDecline');
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(CUSTOMIZE_QUOTE_WIZARD);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_QUOTE_DECLINE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Quote');
        });
    });

    describe('When testing conf for Multi car Driver scan page', () => {
        // given
        const config = getConfig(HDDriverScanPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsScanDrivingLicence');
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_NAME);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.DRIVER_SCAN);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });

    describe('When testing conf for Multicar scan and continue page', () => {
        // given
        const config = getConfig(HDMCHeadsUpPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCDriverScanOrContinuePage');
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_SCAN);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_DRIVER_SCAN_OR_CONTINUE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });

    describe('When testing conf for MultiCar Driver allocation secondary page', () => {
        // given
        const config = getConfig(HDMCDriverAllocationSecondary);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCDriverAllocationSecondary');
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.DRIVER_SCAN_OR_CONTINUE);
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_DRIVER_ALLOCATION_SECONDARY);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for MultiCar Policy holder allocation page', () => {
        // given
        const config = getConfig(HDMCPolicyHolderAllocation);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCPolicyHolderAllocation');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.MC_CAR_DETAILS);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.MC_DRIVER_ALLOCATION_SECONDARY);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_POLICY_HOLDER_ALLOCATION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for MultiCar driver allocation page', () => {
        // given
        const config = getConfig(HDMCDriverAllocation);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCPersonalDetails_Complete');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.DRIVER_CONVICTIONS);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.TRANSITION);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_DRIVER_ALLOCATION);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for MultiCar complete car details page', () => {
        // given
        const config = getConfig(HDMCCompletedCarDetailsPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCDetailsComplete');
        });
        it('should return proper page for backward func', () => {
            // when
            const [path] = config.backward();
            // then
            expect(path).toBe(routes.CAR_LOCATION);
        });
        it('should return proper page for forward func', () => {
            // when
            const [path] = config.forward();
            // then
            expect(path).toBe(routes.MC_DRIVER_SCAN_OR_CONTINUE);
        });

        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_CAR_DETAILS);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Details');
        });
    });
    describe('When testing conf for MultiCar yoour quotes page', () => {
        // given
        const config = getConfig(HDMCYourQuotesPage);
        it('should have id', () => {
            expect(config.id).toBe('HastingsMCYourQuotePage');
        });
        it('should have proper path for the page', () => {
            // when
            const { path } = config;
            // then
            expect(path).toBe(routes.MC_YOURQUOTE_PAGE);
        });
        it('should return proper step for stepper', () => {
            // when
            const { stepper } = config;
            // then
            expect(stepper).toBe('Cover');
        });
    });
});
