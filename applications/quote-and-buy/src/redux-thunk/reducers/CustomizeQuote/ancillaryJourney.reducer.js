import {
    UPDATE_MOTOR_LEGAL_ANCILLARY_SELECTION,
    UPDATE_BREAKDOWN_ANCILLARY_SELECTION,
    UPDATE_PERSONAL_ACCIDENT_ANCILLARY_SELECTION,
    UPDATE_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION,
    UPDATE_KEY_COVER_ANCILLARY_SELECTION,
    UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS,
    IPID_DOWNLOAD_DOCUMENT_START,
    IPID_DOWNLOAD_DOCUMENT_FAIL,
    IPID_MOTOR_LEGAL_DOCUMENT_SUCCESS,
    IPID_SUBSTITUTE_VEHICLE_DOCUMENT_SUCCESS,
    IPID_PERSONAL_ACCIDENTAL_DOCUMENT_SUCCESS,
    IPID_KEY_COVER_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_EUROPEAN_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_HOMESTART_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_ROADSIDE_AND_RECOVERY_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_ROADSIDE_DOCUMENT_SUCCESS,
    IPID_CAR_INSURANCE_POLICY_DOCUMENT_SUCCESS,
    UPDATE_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION
} from '../../action.types';

const INITIAL_STATE = {
    motorLegal: false,
    breakdown: false,
    personalAccident: false,
    substituteVehicle: false,
    keyCover: false,
    breakdownPreselect: false,
    ipidsInfo: [],
    ipidDocError: null,
    ipidMotorLegalDoc: {},
    ipidBreakdownEuropeanDoc: {},
    ipidBreakdownHomeStartDoc: {},
    ipidBreakdownRoadsideRecoveryDoc: {},
    ipidBreakdownRoadsideDoc: {},
    ipidSubstituteVehicleDoc: {},
    ipidPersonalAccidentalDoc: {},
    ipidKeyCoverDoc: {},
    ipidCarPolicy: {}
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_MOTOR_LEGAL_ANCILLARY_SELECTION:
            return {
                ...state,
                motorLegal: true
            };
        case UPDATE_BREAKDOWN_ANCILLARY_SELECTION:
            return {
                ...state,
                breakdown: true
            };
        case UPDATE_PERSONAL_ACCIDENT_ANCILLARY_SELECTION:
            return {
                ...state,
                personalAccident: true
            };
        case UPDATE_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION:
            return {
                ...state,
                substituteVehicle: true
            };
        case UPDATE_KEY_COVER_ANCILLARY_SELECTION:
            return {
                ...state,
                keyCover: true
            };
        case UPDATE_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION:
            return {
                ...state,
                breakdownPreselect: true
            };
        case UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS:
            return {
                ...state,
                ipidsInfo: action.payload
            };
        case IPID_DOWNLOAD_DOCUMENT_START:
            return {
                ...state
            };
        case IPID_DOWNLOAD_DOCUMENT_FAIL:
            return {
                ...state,
                ipidDocError: action.payload
            };
        case IPID_MOTOR_LEGAL_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidMotorLegalDoc: action.payload
            };
        case IPID_SUBSTITUTE_VEHICLE_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidSubstituteVehicleDoc: action.payload
            };
        case IPID_PERSONAL_ACCIDENTAL_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidPersonalAccidentalDoc: action.payload
            };
        case IPID_KEY_COVER_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidKeyCoverDoc: action.payload
            };
        case IPID_BREAKDOWN_EUROPEAN_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidBreakdownEuropeanDoc: action.payload
            };
        case IPID_BREAKDOWN_HOMESTART_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidBreakdownHomeStartDoc: action.payload
            };
        case IPID_BREAKDOWN_ROADSIDE_AND_RECOVERY_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidBreakdownRoadsideRecoveryDoc: action.payload
            };
        case IPID_BREAKDOWN_ROADSIDE_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidBreakdownRoadsideDoc: action.payload
            };
        case IPID_CAR_INSURANCE_POLICY_DOCUMENT_SUCCESS:
            return {
                ...state,
                ipidCarPolicy: action.payload
            };
        default:
            return state;
    }
}
