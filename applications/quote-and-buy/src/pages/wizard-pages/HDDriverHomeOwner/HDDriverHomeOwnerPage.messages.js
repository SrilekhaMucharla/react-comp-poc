import { getPersonalPronoun } from '../__helpers__/pronounHelper';

export const areyouahomeowner = (isAnotherDriver) => `Are ${getPersonalPronoun(isAnotherDriver)} a homeowner?`;
export const howmanycars = 'In total, how many cars are in your household?';
export const no = 'No';
export const yes = 'Yes';
export const othervehicle = (isAnotherDriver) => `Do ${getPersonalPronoun(isAnotherDriver)} regularly use another vehicle?`;
export const content = (isAnotherDriver) => `Let us know if ${getPersonalPronoun(isAnotherDriver)} regularly drive another vehicle,`
    + ' like a partner\'s car or a work van.';
export const tip = 'Tip!';
export const required = 'Sorry, you need to answer this question';
export const homeOwner = 'Home Owner';
export const householdCars = 'Cars In Household';
export const anotherVehicle = 'Another Vehicle Usage';
