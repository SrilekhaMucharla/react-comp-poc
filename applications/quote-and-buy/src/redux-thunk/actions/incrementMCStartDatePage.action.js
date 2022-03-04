/* eslint-disable import/prefer-default-export */
import {
    INCREMENT_MC_START_DATE_PAGE,
    DECREMENT_MC_START_DATE_PAGE
} from '../action.types';

export const incrementMCStartDatePageIndex = () => (
    {
        type: INCREMENT_MC_START_DATE_PAGE
    }
);

export const decrementMCStartDatePageIndex = () => (
    {
        type: DECREMENT_MC_START_DATE_PAGE
    }
);
