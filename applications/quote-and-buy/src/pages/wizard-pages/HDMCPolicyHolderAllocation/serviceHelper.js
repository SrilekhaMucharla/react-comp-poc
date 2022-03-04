import _ from 'lodash';

const MCQuotesPath = 'value.quotes';
// parse the driver data to display
export const parseDriverDisplayData = (driver) => {
    if (!driver) return null;
    const {
        person = {}, firstName, lastName
    } = driver;
    const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
    return { label: name, id: person.publicID, value: driver };
};

// Filter : get driver list from multicarSubmissionVM except repeated drivers
export const getFilteredDriverData = (mcsubmissionVM) => {
    const allQuoteDriverObject = [];
    const quoteList = _.get(mcsubmissionVM, MCQuotesPath, []);
    quoteList.forEach((quoteObject) => {
        const diverlist = _.get(quoteObject, 'lobData.privateCar.coverables.drivers', []);
        diverlist.forEach((driverObject) => {
            allQuoteDriverObject.push(driverObject);
        });
    });
    const distintValues = _.uniqBy(allQuoteDriverObject, (elem) => [elem.person.publicID].join());
    return distintValues || [];
};
