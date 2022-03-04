import dayjs from 'dayjs';
import _ from 'lodash';

export const getAncillaryCoverages = (ancillaries) => {
    return ancillaries.map((anc) => ({
        name: anc.name, required: anc.required, selected: anc.selected, amount: anc.amount
    }));
};

export const getVehicleCoverages = (vehicleCoverages) => {
    return vehicleCoverages.map((cov) => ({ name: cov.name, publicID: cov.publicID, terms: cov.terms }));
};

export const getExcessCoverages = (offerings, brandCode, vehiclePublicId) => {
    return offerings
        .flatMap((o) => o.branchCode === brandCode
            && o.coverages.vehicleCoverages.find((ac) => ac.publicID === vehiclePublicId))
        .filter(Boolean)
        .reduce((anc, next) => ({ ...anc, next }))
        .coverages.map((cov) => ({ name: cov.name, publicID: cov.publicID, terms: cov.terms }));
};

const getDriver = (accumulator, current) => {
    const driverFixedId = current.fixedId;

    return {
        ...accumulator,
        [driverFixedId]: {
            ...current,
        },
    };
};

const getVehicles = (vehicles, vehicleCoverages, ancillaryCoverages, coverType) => {
    const ancillaries = ancillaryCoverages[0].coverages;
    return vehicles.reduce((accumulator, current) => {
        const vehicleFixedId = current.fixedId;

        return {
            ...accumulator,
            [vehicleFixedId]: {
                ...current,
                coverType,
                ancillaries: getAncillaryCoverages(ancillaries),
                excesses: getVehicleCoverages(vehicleCoverages)
            }
        };
    }, {});
};

const getQuote = (chosenQuote, baseData, quoteID) => {
    const {
        periodStartDate, periodEndDate, policyAddress, insurer, pccurrentDate
    } = baseData;
    const currentDate = new Date(pccurrentDate).setHours(0, 0, 0, 0);
    const now = new Date().setHours(0, 0, 0, 0);
    // asumption that deferred status is calculated by diffing the pcccurent date and now agains 30 days diff
    const isDeferred = dayjs(currentDate).diff(dayjs(now), 'd') > 30;
    return {
        [quoteID]: {
            isDeferred: isDeferred,
            startDate: periodStartDate,
            endDate: periodEndDate,
            policyAddress: `${policyAddress.addressLine1}, ${policyAddress.city}, ${policyAddress.postalCode}`,
            insurer: insurer,
            ...chosenQuote
        },
    };
};

const getDataFromQuote = (singleQuote, customQuote) => {
    const {
        baseData,
        lobData,
        quoteData,
        bindData,
        quoteID
    } = singleQuote;
    const { coverages: { privateCar: { ancillaryCoverages, vehicleCoverages } } } = customQuote;

    const productKey = _.camelCase(baseData.productName);

    const { coverables } = lobData[productKey];
    const { drivers, vehicles } = coverables;
    const driversProp = drivers.reduce(getDriver, {});
    const { coverType } = customQuote;
    const vehiclesProp = getVehicles(vehicles, vehicleCoverages, ancillaryCoverages, coverType);

    const chosenQuote = quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === bindData.chosenQuote);
    const quoteProp = getQuote(chosenQuote, baseData, quoteID);

    const driverIds = Object.keys(driversProp);
    const vehicleIds = Object.keys(vehiclesProp);
    const quoteId = Object.keys(quoteProp);

    return {
        quote: { byId: { [quoteId]: { ...quoteProp[quoteId], vehicles: vehicleIds, drivers: driverIds } }, allIds: quoteId },
        drivers: { byId: driversProp, allIds: driverIds },
        vehicles: { byId: vehiclesProp, allIds: vehicleIds },
    };
};

export default function mapResponseToProps(customizeQuote) {
    const { mpwrapperNumber, quotes, customQuotes } = customizeQuote;

    const mappedProps = quotes.reduce((propsAccumulator, currentQuote) => {
        const customQuote = customQuotes.find((cq) => cq.quoteID === currentQuote.quoteID);
        const {
            quote,
            drivers,
            vehicles,
        } = getDataFromQuote(currentQuote, customQuote);

        return {
            quotes: {
                byId: { ...propsAccumulator.quotes.byId, ...quote.byId },
                allIds: [...propsAccumulator.quotes.allIds, ...quote.allIds]
            },
            drivers: {
                byId: { ...propsAccumulator.drivers.byId, ...drivers.byId },
                allIds: [...propsAccumulator.drivers.allIds, ...drivers.allIds]
            },
            vehicles: {
                byId: { ...propsAccumulator.vehicles.byId, ...vehicles.byId },
                allIds: [...propsAccumulator.vehicles.allIds, ...vehicles.allIds]
            },
        };
    }, {
        quotes: {
            byId: {},
            allIds: []
        },
        drivers: {
            byId: {},
            allIds: []
        },
        vehicles: {
            byId: {},
            allIds: []
        },
    });

    return { ...mappedProps, mcQuoteReference: mpwrapperNumber };
}
