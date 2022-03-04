import {
    VEHICLE_DETAILS, SEND_PAGE_DATA, SEND_EVENT_DATA, MARK_RERATE_MODAL_AS_DISPLAYED, SET_BACK_NAVIGATION_DISPLAY_FLAG,
    SET_OBJECT_BEFORE_EDIT, UPDATE_EPTICA_ID, UPDATE_EMAIL_SAVE_PROGRESS, MARK_NO_DD_MODAL_AS_DISPLAYED, MC_MILESETONE_EDIT
} from '../action.types';

export const setVehicleDetails = (data) => (
    {
        type: VEHICLE_DETAILS,
        payload: data
    }
);

export const sendPageData = (data) => (
    {
        type: SEND_PAGE_DATA,
        payload: data
    }
);

export const sendEventData = (data) => (
    {
        type: SEND_EVENT_DATA,
        payload: data
    }
);

export const markRerateModalAsDisplayed = () => ({
    type: MARK_RERATE_MODAL_AS_DISPLAYED,
});

export const markNoDDModalAsDisplayed = () => ({
    type: MARK_NO_DD_MODAL_AS_DISPLAYED
});

export const setBackNavigationFlag = (data) => ({
    type: SET_BACK_NAVIGATION_DISPLAY_FLAG,
    payload: data
});

export const setObjectBeforeEdit = (data) => ({
    type: SET_OBJECT_BEFORE_EDIT,
    payload: data
});

export const updateEpticaId = (epticaId) => ({
    type: UPDATE_EPTICA_ID,
    payload: epticaId
});

export const updateEmailSaveProgress = (email) => ({
    type: UPDATE_EMAIL_SAVE_PROGRESS,
    payload: email
});

export const mcMilestoneEdit = (data) => (
    {
        type: MC_MILESETONE_EDIT,
        payload: data
    }
);
