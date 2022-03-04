    /* eslint-disable max-len */
export const personalAccidentDescription = 'Meets your need for extra financial support if you or your passengers are injured following an accident involving your car.';
export const motorLegalExpensesDescription = 'Meets your need for cover to help with legal costs if you have an accident that isn’t your fault.';
export const substituteVehicleDesription = 'Meets your need to have a replacement car like yours (including if your car is written off or stolen and not recovered).';
export const keyCoverDescription = 'Meets your need to cover the cost of replacing lost or stolen keys for you and any family who live with you.';

export const breakdown = 'Breakdown';
export const motorLegalExpenses = 'Motor Legal Expenses';
export const motorLegalExpensesLabel = 'Motor legal expenses';
export const personalAccident = 'Motor Personal Accident';
export const personalAccidentLabel = 'Personal accident';
export const substituteVehicle = 'Substitute Vehicle';
export const substituteVehicleLabel = 'Substitute vehicle';
export const keyCover = 'Key Cover';
export const keyCoverLabel = 'Key protection';
export const personalAccidentText = 'Personal Accident';
export const motorLegal = 'Motor Legal';
export const ncdText = ' No claims discount protection - included';

export const roadsideAssistanceEsssential = 'Roadside assistance in case of breakdown is essential';
export const recoveryAwayHomeNotEsential = 'Recovery away from home is not essential';
export const roadsideAssistanceAwayHomeEssential = 'Roadside assistance and recovery away from home are essential';
export const europeCoverNotEssential = 'Cover in Europe is not essential';
export const homeCoverNotEssential = 'Cover at home is not essential';
export const homeCoverEssential = 'Cover at home is essential';
export const europeCoverEssential = 'Cover in Europe is essential';

export const roadside = 'Roadside';
export const roadsideAndRecovery = 'Roadside and Recovery';
export const homestart = 'Homestart';
export const european = 'European';
export const roadsideAndRecoveryWithoutSpace = 'RoadsideAndRecovery';

export const roadsideHeader = 'Roadside assistance';
export const roadsideAndRecoveryHeader = 'Roadside and recovery';
export const homestartHeader = 'Roadside, recovery and at home';
export const europeanHeader = 'Roadside, recovery at home and European';

export const HP = 'HP';
export const HE = 'HE';

export const yourPolicy = 'Your policy';
export const yourPolicyDescription = 'Here are the main features of your policy. You\'ll find full details in the documents section.';
export const yourExcess = 'Your excess';
export const coverExtraTitle = 'Your optional extras';
export const underwriter = 'Underwriter:';
export const drivingOtherCarsLabel = 'Driving Other Cars';
export const drivingOtherCars = 'Driving other cars';
export const courtseyCar = 'Courtesy car';
export const windscreenCover = 'Windscreen cover';

export const drivingOtherCarsYDMessage = 'Third party cover for the policyholder only. Other cars cannot be owned or hired by you or your partner, '
    + 'must be insured and driven with the owner’s permission. For more information, check your insurance policy booklet.';
export const drivingOtherCarsMessage = 'Third party cover for the policyholder only. Other cars cannot be owned or hired by you or your partner, '
    + 'must be insured and driven with the owner’s permission. For more information, check your insurance policy booklet.';
export const courtseyCarMessage = 'A small car will be provided while your car is being repaired by one of our approved repairers. '
    + "It won't be provided if your car can't be repaired or it has been stolen (and not recovered).";
export const courtseyCarMessageHE = 'You can use your own repairer but your excess amount will be doubled.';
export const drivingOtherCarsNotCoveredMessage = 'There is no cover provided for driving other cars.';
export const windcsreenNotCoveredMessage = 'No cover provided for windscreen or windows.';

export const personalAccidentsCover = 'Meets your need for extra financial support if you or your passengers are injured following an accident involving your car.';
export const coverTypeOptions = [{
    value: 'comprehensive',
    label: 'Comprehensive',
},
{
    value: 'tpft',
    label: 'Third party fire and theft'
}];
export const heItems = { name: 'Courtesy car', description: courtseyCarMessage };
export const heItemsCovered = [
    { name: 'Driving other cars', description: drivingOtherCarsNotCoveredMessage },
    { name: 'Windscreen cover', description: windcsreenNotCoveredMessage }
];
export const optionalExtrasConst = [
    { name: 'Personal accident cover - £XX.XX', description: personalAccidentsCover },
    { name: 'Substitute vehicle - £XX.XX', description: substituteVehicle }
];

export const ncdiscount = 'No claims discount protection - included';

export const namedOptionalExtras = [
    { key: 'Motor Personal Accident', name: 'Personal accident cover - £XX.XX', description: personalAccidentsCover },
    { key: 'Substitute Vehicle', name: 'Substitute vehicle - £XX.XX', description: substituteVehicle },
    { key: 'Breakdown', name: 'Roadside assistance - £XX.XX', description: breakdown },
    { key: 'Excess Protector', name: 'Excess Protector - £XX.XX', description: substituteVehicle },
    { key: 'Key Cover', name: 'Key protection - £XX.XX', description: keyCover },
    { key: 'Motor Legal Expenses', name: 'Motor legal expenses - £XX.XX', description: motorLegalExpenses },
    { key: 'No claims discount protection', name: 'No claims discount protection - included', description: '' }
];

export const namedBreakdownOptionalExtras = [
    { key: 'Roadside', name: 'Roadside assistance - £XX.XX', description: roadside },
    { key: 'Roadside and Recovery', name: 'Roadside and recovery - £XX.XX', description: roadsideAndRecovery },
    { key: 'Homestart', name: 'Roadside, recovery and at home - £XX.XX', description: homestart },
    { key: 'European', name: 'Roadside, recovery, at home and European - £XX.XX', description: european }
];

export const getOptionalBreakdownExtraWithAmount = (key, amount) => {
    const optionalExtra = namedBreakdownOptionalExtras.find((ex) => ex.key === key);
    if (optionalExtra) return { ...optionalExtra, name: optionalExtra.name.replace('XX.XX', amount) };
    return null;
};

export const getOptionalExtraWithAmount = (key, amount) => {
    const optionalExtra = namedOptionalExtras.find((ex) => ex.key === key);
    if (optionalExtra) return { ...optionalExtra, name: optionalExtra.name.replace('XX.XX', amount) };
    return null;
};
