import _ from 'lodash';
import {
    processCoverData,
    processAncillaryData,
    processVehicleData,
    processBaseData,
    getStringFromBoolean
} from './common';


const getDataFromQuote = (quote, translator) => {
    const {
        baseData, lobData, quoteData, bindData, quoteID
    } = quote;

    let policy_support_type = 'Standard';
    const { chosenQuote: chosenQuoteID, selectedPaymentPlan, accountNumber } = bindData;

    const chosenQuote = quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
    const chosenQuoteBranchCode = chosenQuote.branchCode;
    const selectedOffering = lobData.privateCar.offerings.find((offering) => offering.branchCode === chosenQuoteBranchCode);

    const { drivers, vehicles } = lobData.privateCar.coverables;
    const vehicle = vehicles[0];
    const vehiclePublicID = vehicle.publicID;
    const ancillaryCoverages = selectedOffering.coverages.ancillaryCoverages
        .find((ancillaryCoverage) => ancillaryCoverage.publicID === vehiclePublicID).coverages;

    if (_.has(quote, 'isOnlineProductType')) {
        const prodType = _.get(quote, 'isOnlineProductType');
        policy_support_type = (prodType) ? 'Online' : policy_support_type;
    }

    const mappedData = {
        ...processCoverData(quoteID, baseData, chosenQuote, selectedPaymentPlan),
        ...processAncillaryData(ancillaryCoverages),
        ...processVehicleData(vehicle, translator),
        ...processBaseData(baseData),
        additional_driver: getStringFromBoolean(drivers.length > 1),
        number_of_cars: vehicles.length,
        number_of_drivers: drivers.length,
        customer_id: accountNumber,
        policy_support_type: policy_support_type,
    };

    return mappedData;
};

export default getDataFromQuote;
