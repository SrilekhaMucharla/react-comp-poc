import { getPersonalPronoun, getPossessivePronoun } from '../__helpers__/pronounHelper';

export const maritalStatus = (isAnotherDriver) => `What\'s ${getPossessivePronoun(isAnotherDriver)} marital status?`;
export const childrenUnder16 = (isAnotherDriver) => `Do ${getPersonalPronoun(isAnotherDriver)} have any children under 16?`;
export const no = 'No';
export const yes = 'Yes';
export const required = 'Sorry, you need to answer this question';
export const othervehicle = 'Do they regularly use another vehicle?';
export const maritalStatusInfo = 'Marital Status Info';
export const childrenUnder16Info = 'Children Under 16 Info';
export const anotherVehicleInfo = 'Another Vehicle Info';
export const content = 'Let us know if they regularly drive another vehicle, like a partner\'s car or a work van.';
