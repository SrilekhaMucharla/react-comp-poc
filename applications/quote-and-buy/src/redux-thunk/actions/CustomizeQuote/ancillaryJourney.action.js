/* eslint-disable import/prefer-default-export */
import {
    UPDATE_MOTOR_LEGAL_ANCILLARY_SELECTION,
    UPDATE_BREAKDOWN_ANCILLARY_SELECTION,
    UPDATE_PERSONAL_ACCIDENT_ANCILLARY_SELECTION,
    UPDATE_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION,
    UPDATE_KEY_COVER_ANCILLARY_SELECTION,
    UPDATE_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION
} from '../../action.types';
import {
    MOTOR_LEGAL, BREAKDOWN, PERSONAL_ACCIDENT, SUBSTITUTE_VEHICLE, KEY_COVER, BREAKDOWN_PRESELECT
} from '../../../constant/const';

export const updateAncillaryJourney = (dataObject) => (dispatch) => {
    switch (dataObject) {
        case MOTOR_LEGAL:
            dispatch({
                type: UPDATE_MOTOR_LEGAL_ANCILLARY_SELECTION
            });
            break;
        case BREAKDOWN:
            dispatch({
                type: UPDATE_BREAKDOWN_ANCILLARY_SELECTION
            });
            break;
        case PERSONAL_ACCIDENT:
            dispatch({
                type: UPDATE_PERSONAL_ACCIDENT_ANCILLARY_SELECTION
            });
            break;
        case SUBSTITUTE_VEHICLE:
            dispatch({
                type: UPDATE_SUBSTITUTE_VEHICLE_ANCILLARY_SELECTION
            });
            break;
        case KEY_COVER:
            dispatch({
                type: UPDATE_KEY_COVER_ANCILLARY_SELECTION
            });
            break;
        case BREAKDOWN_PRESELECT:
            dispatch({
                type: UPDATE_BREAKDOWN_PRESELECT_ANCILLARY_SELECTION
            });
            break;
        default:
            break;
    }
};
