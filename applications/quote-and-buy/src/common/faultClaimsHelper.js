import _ from 'lodash';

const claimsDetailPath = 'lobData.privateCar.coverables.drivers.children[0].claimsAndConvictions.claimsDetailsCollection';

export const faultyClaims = (submissionVM) => {
    const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
    const validationDate = new Date(new Date().getFullYear() - 4, new Date().getMonth(), 1);
    return claimsDetails ? claimsDetails.filter((claim) => claim.wasItMyFault === true && validationDate <= new Date(claim.accidentDate)) : '';
};


export default faultyClaims;
