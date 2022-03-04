/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
import {
    MAX_VEHICLES, MONETATE_DECISION_EVENT, MONETATE_PAGE_EVENT, EVENT_URL, PAGE_TYPE, PRODUCER_CODE, MONETATE_CHANNEL
} from '../constant/const';


export const getReportingArray = (response) => {
    if (response && response.length) {
        const resultArray = [];
        response.map((element) => {
            if (element.hasOwnProperty('impressionReporting')) {
                element.impressionReporting.map((singleObj) => {
                    resultArray.push(singleObj);
                });
            }
        });
        return resultArray;
    }
    return [];
};
export const fetchCookieByName = (cname) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};
export const getSeenParam = (multiCarElements) => {
    let multiCarParams;
    if (multiCarElements && multiCarElements.length) {
        multiCarElements.map((element) => {
            if (element.json && element.json.hasOwnProperty('multiCar')) {
                multiCarParams = element.json.multiCar;
            }
        });
    } else {
        return undefined;
    }
    return multiCarParams;
};

export const getMultiCarParams = (multiCarElements) => {
    let multiCarParams;
    if (multiCarElements && multiCarElements.length) {
        multiCarElements.map((element) => {
            if (element.json && element.json.hasOwnProperty('multiCar')) {
                multiCarParams = element.json.multiCar;
            }
        });
    } else {
        return false;
    }
    return multiCarParams;
};

export const getMaxVehicles = (multiCarElements) => {
    let multiCarParams;
    if (multiCarElements && multiCarElements.length) {
        multiCarElements.map((element) => {
            multiCarParams = element.json.nCars;
        });
    } else {
        return MAX_VEHICLES;
    }
    return multiCarParams;
};
export const getChannelId = () => {
    return process.env.REACT_APP_MONETATE_CHANNEL_ID || MONETATE_CHANNEL;
};
export const getDecisionEvents = () => {
    return { eventType: MONETATE_DECISION_EVENT, requestId: '12352', includeReporting: true };
};

export const constructCustomEvents = (cookie, producerCode) => {
    const producerCodeArray = fetchCookieByName('mc.producerCode') && fetchCookieByName('mc.producerCode');
    const filteredArray = cookie && cookie.producerCodeSeenParamArray
    && cookie.producerCodeSeenParamArray.filter((element) => element.producerCode === producerCode);
    const seenParam = filteredArray && filteredArray.length && filteredArray[0].seenMulticar ? filteredArray[0].seenMulticar : undefined;
    const seenVal = (seenParam !== undefined && seenParam !== 'None') ? seenParam.toString() : undefined;
    if (cookie && producerCodeArray.includes(producerCode) && seenVal !== undefined) {
        return {
            eventType: 'monetate:context:CustomVariables',
            customVariables: [{
                variable: 'producer_code',
                value: producerCode || PRODUCER_CODE
            },
            {
                variable: 'seenMultiCar',
                value: seenVal
            }]
        };
    } else {
        return {
            eventType: 'monetate:context:CustomVariables',
            customVariables: [{
                variable: 'producer_code',
                value: producerCode || PRODUCER_CODE
            }]
        };
    }
};
export const getPageViewEvents = () => {
    return {
        eventType: MONETATE_PAGE_EVENT,
        url: EVENT_URL,
        pageType: PAGE_TYPE
    };
};
export const getEventTypes = (cookie, producerCode) => {
    const decisionObject = getDecisionEvents();
    const customEventObject = constructCustomEvents(cookie, producerCode);
    const pageObject = getPageViewEvents();
    return [{ ...decisionObject },
        { ...customEventObject },
        { ...pageObject }];
};
