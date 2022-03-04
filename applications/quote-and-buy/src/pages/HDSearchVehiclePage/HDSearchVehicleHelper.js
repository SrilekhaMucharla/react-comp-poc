/* eslint-disable no-plusplus */
import {
    MAKE_LABEL, MODEL_LABEL, YEAR_LABEL, ENGINE_LABEL,
    FUEL_LABEL, TRANSMISSION_LABEL, DOOR_LABEL, BODY_TYPE_LABEL
} from './HDSearchVehiclePage.messages';

export const MAKE = { text: MAKE_LABEL };
export const MODEL = { text: MODEL_LABEL };
export const FUEL = { text: FUEL_LABEL };
export const REGISTRATION_YEAR = { text: YEAR_LABEL };
export const TRANSMISSION = { text: TRANSMISSION_LABEL };
export const NUMBER_OF_DOORS = { text: DOOR_LABEL };
export const ENGINE_SIZE = { text: ENGINE_LABEL };
export const BODY_TYPE = { text: BODY_TYPE_LABEL };
export const getNumberOfDoors = [...Array(9)
    .keys()]
    .map((element) => {
        // eslint-disable-next-line no-plusplus
        // eslint-disable-next-line no-param-reassign
        element++;
        return {
            value: (element).toString(),
            label: (element).toString()
        };
    });

export const getYears = (startYear, endYear) => {
    const yearsList = [];
    // eslint-disable-next-line no-plusplus
    for (let index = startYear; index <= endYear; index++) {
        yearsList.push(index);
    }
    return yearsList.map((year) => ({ value: year, label: year }));
};
