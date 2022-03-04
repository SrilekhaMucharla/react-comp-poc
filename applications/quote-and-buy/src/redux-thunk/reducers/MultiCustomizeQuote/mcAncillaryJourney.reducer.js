import {
    UPDATE_MC_MOTOR_LEGAL_ANCILLARY_SELECTION,
    UPDATE_MC_BREAKDOWN_ANCILLARY_SELECTION,
    UPDATE_MC_PERSONAL_ACCIDENT_ANCILLARY_SELECTION,
    UPDATE_MC_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION,
    UPDATE_MC_KEY_COVER_ANCILLARY_SELECTION,
    MC_UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS,
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
    motorLegal: [],
    breakdown: [],
    personalAccident: [],
    substituteVehicle: [],
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
        case UPDATE_MC_MOTOR_LEGAL_ANCILLARY_SELECTION:
            return {
                ...state,
                motorLegal: action.data
            };
        case UPDATE_MC_BREAKDOWN_ANCILLARY_SELECTION:
            return {
                ...state,
                breakdown: action.data
            };
        case UPDATE_MC_PERSONAL_ACCIDENT_ANCILLARY_SELECTION:
            return {
                ...state,
                personalAccident: action.data
            };
        case UPDATE_MC_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION:
            return {
                ...state,
                substituteVehicle: action.data
            };
        case UPDATE_MC_KEY_COVER_ANCILLARY_SELECTION:
            return {
                ...state,
                keyCover: true
            };
        case UPDATE_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION:
            return {
                ...state,
                breakdownPreselect: true
            };
        case MC_UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS:
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
