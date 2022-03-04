/* eslint-disable import/prefer-default-export */
import {
    UPDATE_MC_MOTOR_LEGAL_ANCILLARY_SELECTION,
    UPDATE_MC_BREAKDOWN_ANCILLARY_SELECTION,
    UPDATE_MC_PERSONAL_ACCIDENT_ANCILLARY_SELECTION,
    UPDATE_MC_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION,
    UPDATE_MC_KEY_COVER_ANCILLARY_SELECTION,
    UPDATE_MC_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION
} from '../../action.types';
import {
    MOTOR_LEGAL, BREAKDOWN, PERSONAL_ACCIDENT, SUBSTITUTE_VEHICLE, KEY_COVER, BREAKDOWN_PRESELECT
} from '../../../constant/const';

export const updateMcAncillaryJourney = (dataObject, flag) => (dispatch) => {
    switch (flag) {
        case MOTOR_LEGAL:
            dispatch({
                type: UPDATE_MC_MOTOR_LEGAL_ANCILLARY_SELECTION,
                data: dataObject
            });
            break;
        case BREAKDOWN:
            dispatch({
                type: UPDATE_MC_BREAKDOWN_ANCILLARY_SELECTION,
                data: dataObject
            });
            break;
        case PERSONAL_ACCIDENT:
            dispatch({
                type: UPDATE_MC_PERSONAL_ACCIDENT_ANCILLARY_SELECTION,
                data: dataObject
            });
            break;
        case SUBSTITUTE_VEHICLE:
            dispatch({
                type: UPDATE_MC_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION,
                data: dataObject
            });
            break;
        case KEY_COVER:
            dispatch({
                type: UPDATE_MC_KEY_COVER_ANCILLARY_SELECTION
            });
            break;
        case BREAKDOWN_PRESELECT:
            dispatch({
                type: UPDATE_MC_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION
            });
            break;
        default:
            break;
    }
};
