import _ from 'lodash';

export const ANCILLARY = {
    BREAKDOWN: 'Breakdown',
    MOTOR_LEGAL_EXPENSES: 'Motor Legal Expenses',
    MOTOR_PERSONAL_ACCIDENT: 'Motor Personal Accident',
    EXCESS_PROTECTOR: 'Excess Protector',
    SUBSTITUTE_VEHICLE: 'Substitute Vehicle',
    KEY_COVER: 'Key Cover'
};

export const SALES_JOURNEY_TYPE = {
    SINGLE_CAR: 'single_car',
    MULTI_CAR: 'multi_car'
};

export const getStringDate = ({ year, month, day }) => `${year}_${month}_${day}`;

export const getStringFromBoolean = (isTrue) => (isTrue ? 'Yes' : 'No');

export const getSelectedCoveragesNames = (ancillaryCoverages) => ancillaryCoverages.filter((ancillaryCoverage) => ancillaryCoverage.selected)
    .map((ancillaryCoverage) => ancillaryCoverage.name)
    .join(', ');

export const getAncillary = (ancillaryCoverages, ancillaryName) => ancillaryCoverages.find((ancillary) => ancillary.name === ancillaryName);

export const getVehicleModifications = (modifications, translator) => {
    if (translator instanceof Function) {
        return modifications.map((modification) => translator({
            id: `typekey.VehicleModifications_Ext.${modification.modification}`,
            defaultMessage: modification.modification
        })).join(', ');
    }
    return modifications.map((modification) => modification.modification).join(', ');
};

const getInsuranceType = (insuranceType) => ((insuranceType === '3') ? 'Monthly' : 'Annual');

export const processAncillaryData = (ancillaryCoverages) => {
    const breakdownCover = getAncillary(ancillaryCoverages, ANCILLARY.BREAKDOWN);
    const motorLegalExpensesCover = getAncillary(ancillaryCoverages, ANCILLARY.MOTOR_LEGAL_EXPENSES);
    const motorPersonalAccidentCover = getAncillary(ancillaryCoverages, ANCILLARY.MOTOR_PERSONAL_ACCIDENT);
    const substituteVehicleCover = getAncillary(ancillaryCoverages, ANCILLARY.SUBSTITUTE_VEHICLE);
    const keyCover = getAncillary(ancillaryCoverages, ANCILLARY.KEY_COVER);

    return {
        customer_insurance_options: getSelectedCoveragesNames(ancillaryCoverages),
        customer_breakdown_cost: breakdownCover.amount.amount,
        customer_breakdown_cover_level: breakdownCover.selected ? breakdownCover.terms[0].chosenTermValue : '',
        customer_breakdown: getStringFromBoolean(breakdownCover.selected),
        key_cover: getStringFromBoolean(keyCover.selected),
        key_cover_cost: keyCover.amount.amount,
        legal_cover: getStringFromBoolean(motorLegalExpensesCover.selected),
        legal_cover_cost: motorLegalExpensesCover.amount.amount,
        personal_accident_cover: getStringFromBoolean(motorPersonalAccidentCover.selected),
        personal_accident_cover_cost: motorPersonalAccidentCover.amount.amount,
        substitute_vehicle_cover: getStringFromBoolean(substituteVehicleCover.selected),
        substitute_vehicle_cover_cost: substituteVehicleCover.amount.amount,
    };
};

export const processVehicleData = (vehicle, translator) => {
    return {
        insurance_cover_level: vehicle.coverType,
        voluntary_excess: vehicle.voluntaryExcess,
        car_doors: vehicle.numberOfDoors,
        car_make: vehicle.make,
        car_model: vehicle.model,
        car_modifications: getVehicleModifications(vehicle.vehicleModifications, translator),
        car_owner: getStringFromBoolean(vehicle.isRegisteredKeeperAndLegalOwner),
        car_value: vehicle.vehicleWorth,
        payment_frequency: getInsuranceType(vehicle.insurancePaymentType),
        car_year: vehicle.yearManufactured,
        ncd_years: vehicle.ncdProtection.ncdgrantedYears,
    };
};

export const processBaseData = (baseData) => {
    return {
        existing_customer: getStringFromBoolean(baseData.isExistingCustomer),
        insurance_product: baseData.brandCode,
        insurance_type: baseData.productName,
        product_code: baseData.productCode,
        product_name: baseData.productName,
    };
};

export const processCoverData = (quoteID, baseData, chosenQuote, selectedPaymentPlan) => {
    const { periodStartDate, periodEndDate } = baseData;
    const { annuallyPayment, monthlyPayment } = chosenQuote.hastingsPremium;
    const chosenPayment = annuallyPayment && annuallyPayment.billingID === selectedPaymentPlan
        ? annuallyPayment
        : monthlyPayment || { premiumAnnualCost: { amount: '' } };

    return {
        cover_end_date: getStringDate(periodEndDate),
        cover_start_date: getStringDate(periodStartDate),
        monthly_cost: monthlyPayment ? monthlyPayment.premiumAnnualCost.amount : '',
        annual_cost: annuallyPayment ? annuallyPayment.premiumAnnualCost.amount : '',
        quote_id: quoteID,
        product_option: chosenQuote.branchName,
        product_option_code: chosenQuote.branchCode,
        total_cost: chosenPayment.premiumAnnualCost.amount
    };
};

export const countCoveredVehicles = (quotes) => {
    let vehicleNumber = 0;
    if (quotes && quotes.length > 1) {
        quotes.forEach((quote) => { vehicleNumber += quote.lobData.privateCar.coverables.vehicles.length; });
    } else {
        vehicleNumber = 1;
    }
    return vehicleNumber;
};

export const ancillaryDataOnly = (offeredQuotes) => {
    const mappedQuotes = [];
    offeredQuotes.forEach((quote) => {
        const coverages = _.get(quote, 'coverages.privateCar.ancillaryCoverages[0].coverages', []);
        if (coverages.length > 0) {
            const processedData = processAncillaryData(coverages);
            mappedQuotes.push(processedData);
        }
    });
    const combinedQuotes = mappedQuotes.reduce((acc, obj) => {
        const entries = Object.entries(obj);
        for (let i = 0; i < entries.length; i += 1) {
            const [key, value] = entries[i];
            acc[key] = [...acc[key] || [], value];
        }
        return acc;
    }, {});
    return { ...combinedQuotes };
};
