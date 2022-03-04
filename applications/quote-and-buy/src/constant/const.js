import styles from '../assets/sass-refactor/utilities/_export.scss';

const VEHICLE_LOOKUP_SERVICE = 'http://bx2-dev-dtpc02.test.hastings.local:9080/pc/service/unauthenticated/edgev10/vehicleinfo/lookup';
export const CONSUMER_CREDIT_LINK = 'https://hastingsdirect.com/documents/example-of-customer-credit-agreement.pdf';
export const HOMEPAGE = 'https://hastingsdirect.com';

// Monetate fields
export const MONETATE_API_URL = 'https://engine.monetate.net/api/engine/v1/decide/Hastings';
export const MONETATE_CHANNEL = 'a-6cc42a29/d/csdt2.hastingsdirect.com';
export const MONETATE_CHANNEL_CSDT3 = 'a-6cc42a29/d/csdt3.hastingsdirect.com';
export const MONETATE_CHANNEL_PROD = 'a-6cc42a29/p/hastingsdirect.com';
export const PRODUCER_CODE = 'HD_Website';
export const EVENT_URL = 'https://www.hastingsdirect.com/';
export const PAGE_TYPE = 'home';
export const MONETATE_DECISION_EVENT = 'monetate:decision:DecisionRequest';
export const MONETATE_PAGE_EVENT = 'monetate:context:PageView';
export const MONETATE_CUSTOM_EVENT = 'monetate:context:CustomVariables';

export default VEHICLE_LOOKUP_SERVICE;
export const payAnnuallyHeader = 'Pay in full';
export const payMonthlyHeader = 'Pay monthly';

// ancillary constant
export const MOTOR_LEGAL = 'MOTOR_LEGAL';
export const BREAKDOWN = 'BREAKDOWN';
export const PERSONAL_ACCIDENT = 'PERSONAL_ACCIDENT';
export const SUBSTITUTE_VEHICLE = 'SUBSTITUTE_VEHICLE';
export const KEY_COVER = 'KEY_COVER';
export const CAR_POLICY = 'CAR_POLICY';
export const BREAKDOWN_PRESELECT = 'BREAKDOWN_PRESELECT';
// customize quote summary constants
export const PAYMENT_TYPE_ANNUALLY_CODE = '1';
export const PAYMENT_TYPE_MONTHLY_CODE = '3';
export const FIRST_NAME = 'FIRST_NAME';
export const APR_RATE = 'APR_RATE';
export const INTEREST_RATE = 'INTEREST_RATE';

// error code constants
export const UW_ERROR_CODE = 805;
export const GREY_LIST_ERROR_CODE = 802;
export const CUE_ERROR_CODE = 803;
export const QUOTE_DECLINE_ERROR_CODE = 716;
export const QUOTE_RATE_ERROR_CODE = 705;
export const SESSION_TIMEOUT_ERROR = 408;
export const VALIDATION_ERROR = 409;

// brands
export const HASTINGS_ESSENTIAL = 'HE';
export const HASTINGS_DIRECT = 'HD';
export const HASTINGS_PREMIER = 'HP';
export const YOU_DRIVE = 'YD';

export const ADDITIONAL_PRODUCT = 'AP';
export const UPGRADE = 'UPGRADE';
export const DOWNGRADE = 'DOWNGRADE';

export const BLACK_EMAIL_LIST = ['unknown@unknown.com', 'nospam@thevaninsurer.co.uk', 'nospam@thebikeinsurer.co.uk'];

// Worldpay
export const WORLDPAY_MERCHANT_CODE = 'HASGWWEBDC';
export const WORLDPAY_MERCHANT_CODE_MC = 'HASGWMTOCC';

// Below two constants will be removed once actual URL params are mapped for Multicar Landing Pages
export const POSTAL_CODE = 'CV37 0AQ'; // 'CV37 0AQ';
export const QUOTE_ID = '50000000280'; // '50000000128';

// Driver
export const drivingLicensePlaceOfBirthValue = 'UNITED KINGDOM';
export const driverAddressCountry = 'GB';

// policy booklet links
export const singleCarHPBefore2020 = '/documents/Policy_documents/Car/HP-PC-GW-11-20.pdf';
export const singleCarHDBefore2020 = '/documents/Policy_documents/Car/HD-PC-GW-11-20.pdf';
export const singleCarHEBefore2020 = '/documents/Policy_documents/Car/HE-PC-GW-11-20.pdf';
export const singleCarYDBefore2020 = '/documents/Policy_documents/Car/HDYD-PC-GW-07-20.pdf';
export const singleCarAdditionalProductBefore2020 = '/documents/Policy_documents/Car/HD-PC-AP-GW-07-19.pdf';
export const singleCarHPAfter2020 = '/documents/Policy_documents/Car/HP-PC-GW-10-21.pdf';
export const singleCarHDAfter2020 = '/documents/Policy_documents/Car/HD-PC-GW-10-21.pdf';
export const singleCarHEAfter2020 = '/documents/Policy_documents/Car/HE-PC-GW-10-21.pdf';
export const singleCarYDAfter2020 = '/documents/Policy_documents/Car/HDYD-PC-GW-08-21.pdf';
export const singleCarAdditionalProductAfter2020 = '/documents/Policy_documents/Car/HD-PC-AP-GW-07-19.pdf';
export const hastingsRoot = 'https://hastingsdirect.com';
export const defaqtoSrc = '../../img/defaqto/defaqto-5-star-rated-car.svg';
// Timeout
export const WARNING_TIME = 15;
export const LOGOUT_TIME = 10;

// payment page const
export const currencyShortToSymbol = {
    gbp: '£',
    usd: '$',
    eur: '€'
};

// Provisional license types
export const provisionalLicenceTypes = ['P_PU', 'O_PE', 'U_PN', '0_PW'];

export const OPENING_HOURS = [
    { days: 'Monday to Friday', hours: '8am - 7pm' },
    { days: 'Saturday', hours: '9am - 5pm' },
    { days: 'Sunday', hours: '9am - 1pm' }
];

export const PRIVACY_HEADER_HEIGHT = parseInt(styles.privacyHeaderHeight, 10);
export const HEADER_HEIGHT_MOBILE = parseInt(styles.headerHeightMobile, 10);

export const daysInAYear = 365;

// Below ref number is used to populate ref numbers in mc thanks page, later correct ref number from bind api will be used
export const mcRefNumber = '200000027758';
export const MAX_AGE_COVERED_PERSON = 79;
export const MAX_DRIVERS_PER_CAR = 5;
export const MAX_VEHICLES = 5;

export const COVERAGE_ACCIDENTAL_DAMAGE_KEY = 'PCAccidentalDamageCov_Ext';
export const COVERAGE_FIRE_THEFT_KEY = 'PCLossFireTheftCov_Ext';
export const COVERAGE_WINDSCREEN_DAMAGE_KEY = 'PCGlassDamageCov_Ext';

export const accidentalDamageCompulsoryKey = 'PCAccDmgCompExcessCT_Ext';
export const accidentalDamageVoluntaryKey = 'PCAccDmgVolExcessCT_Ext';
export const windScreenExcessRepairKey = 'PCGlassDmgWrepairdmgCT_Ext';
export const windScreenExcessReplacementKey = 'PCGlassDmgWreplacementdmgCT_Ext';
export const fireAndTheftCompulsory = 'PCLossFireTheftCompExcessCT_Ext';
export const fireAndTheftVoluntary = 'PCLossFireTheftVolExcessCT_Ext';

// Ancillary Constants
export const MOTOR_LEGAL_DEFAULTVALUE = 29.99;
export const BREAKDOWN_DEFAULT_VALUE = 34.99;

// Ancillary abbreviation
export const MOTOR_LEGAL_ANC = 'ml';
export const RAC_ANC = 'rac';
export const PERSONAL_ACCIDENT_ANC = 'pa';
export const SUBSTITUTE_VEHICLE_ANC = 'sv';
export const KEY_COVER_ANC = 'kc';

// Promotional page savings percentage
export const MC_HARDSELL_JSON = '/json/mchardsell.json';

// Default producer code value
export const DEFAULT_PRODUCER_CODE = 'Default';
