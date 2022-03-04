import getDataFromQuote from './getDataFromQuote';
import { countCoveredVehicles, SALES_JOURNEY_TYPE } from './common';
import { trackEvent } from '../trackData';

const trackQuoteData = (data, translator) => {
    try {
        let mappedQuotes = [];
        const { quotes } = data;


        const isMultiCar = quotes !== undefined;
        if (isMultiCar) {
            for (let i = 0; i < quotes.length; i += 1) {
                mappedQuotes.push(getDataFromQuote(quotes[i], translator));
            }
        } else {
            mappedQuotes = [getDataFromQuote(data, translator)];
        }

        mappedQuotes.push({ number_of_vehicles: countCoveredVehicles(quotes) });

        const combinedQuotes = mappedQuotes.reduce((acc, obj) => {
            const entries = Object.entries(obj);
            for (let i = 0; i < entries.length; i += 1) {
                const [key, value] = entries[i];
                acc[key] = [...acc[key] || [], value];
            }
            return acc;
        }, {});

        const mappedData = {
            ...combinedQuotes,
            sales_journey_type: isMultiCar ? SALES_JOURNEY_TYPE.MULTI_CAR : SALES_JOURNEY_TYPE.SINGLE_CAR
        };

        trackEvent(mappedData);
    } catch (err) {
        console.log('Something went wrong with data mapping: ', err);
    }
};

export default trackQuoteData;
