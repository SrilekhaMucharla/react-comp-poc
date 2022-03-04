import {
    IPID_MC_MATCHFORALL_START,
    IPID_MC_MATCHFORALL_SUCCESS,
    IPID_MC_MATCHFORALL_FAIL
} from '../../action.types';

const INITIAL_STATE = {
    ipidMatchForAllObj: {},
    ipidMatchForAllErrorObj: null,
    ipdaMFAFlag: false,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case IPID_MC_MATCHFORALL_START:
            return {
                ...state,
                loading: true
            };
        case IPID_MC_MATCHFORALL_SUCCESS:
            return {
                ...state,
                ipidMatchForAllObj: action.payload,
                ipidMatchForAllErrorObj: null,
                ipdaMFAFlag: false,
                loading: false
            };
        case IPID_MC_MATCHFORALL_FAIL:
            return {
                ...state,
                ipidMatchForAllObj: {},
                ipidMatchForAllErrorObj: action.payload,
                ipdaMFAFlag: false,
                loading: false
            };
        default:
            return state;
    }
}
