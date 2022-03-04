import {
    VEHICLE_DETAILS, SEND_PAGE_DATA, SEND_EVENT_DATA, MARK_RERATE_MODAL_AS_DISPLAYED, SET_BACK_NAVIGATION_DISPLAY_FLAG, SET_OBJECT_BEFORE_EDIT,
    UPDATE_EPTICA_ID, UPDATE_EMAIL_SAVE_PROGRESS, MARK_NO_DD_MODAL_AS_DISPLAYED, MC_MILESETONE_EDIT
} from '../action.types';

export const globalData = (state = {}, action) => {
    const data = action.payload;
    const userId = 'userId@email.com';
    switch (action.type) {
        case VEHICLE_DETAILS:
            return action.payload;
        case SEND_PAGE_DATA:
            // eslint-disable-next-line no-case-declarations
            data.user_id = userId;
            // eslint-disable-next-line no-undef
            utag.view(action.payload);
            return action.payload;
        case SEND_EVENT_DATA:
            data.user_id = userId;
            // eslint-disable-next-line no-undef
            utag.link(action.payload);
            return action.payload;
        default:
            return state;
    }
};

export const vehicleDetails = (state = {}, action) => {
    switch (action.type) {
        case VEHICLE_DETAILS:
            return action.payload;
        default:
            return state;
    }
};

export const rerateModal = (state = { status: false }, action) => {
    switch (action.type) {
        case MARK_RERATE_MODAL_AS_DISPLAYED:
            return {
                ...state,
                status: true,
            };
        default:
            return state;
    }
};

export const epticaId = (state = null, action) => {
    switch (action.type) {
        case UPDATE_EPTICA_ID:
            return action.payload || null;
        default:
            return state;
    }
};

export const emailSaveProgress = (state = null, action) => {
    switch (action.type) {
        case UPDATE_EMAIL_SAVE_PROGRESS:
            return action.payload || null;
        default:
            return state;
    }
};

export const noDDModal = (state = { status: false }, action) => {
    switch (action.type) {
        case MARK_NO_DD_MODAL_AS_DISPLAYED:
            return ({
                ...state,
                status: true,
            });
        default:
            return state;
    }
};

export const getPriceNavigationFlag = (state = {}, action) => {
    switch (action.type) {
        case SET_BACK_NAVIGATION_DISPLAY_FLAG:
            return action.payload;
        default:
            return state;
    }
};

export const getObjectBeforeEdit = (state = {}, action) => {
    switch (action.type) {
        case SET_OBJECT_BEFORE_EDIT:
            return action.payload;
        default:
            return state;
    }
};

export const setmilestoneEdit = (state = { trigger: false }, action) => {
    switch (action.type) {
        case MC_MILESETONE_EDIT:
            return action.payload;
        default:
            return state;
    }
};
