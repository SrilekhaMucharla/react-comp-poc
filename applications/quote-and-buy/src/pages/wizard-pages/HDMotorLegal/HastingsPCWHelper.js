import * as messages from './HDMotorLegalPage.messages';
// eslint-disable-next-line import/prefer-default-export
export const getPCWName = (producerCode) => {
    switch (producerCode) {
        case messages.compareTheMarket: return messages.compareTheMarketLabel;
        case messages.moneySupmarket: return messages.moneySupmarketLabel;
        case messages.confusedCom: return messages.confusedComLabel;
        case messages.goCompare: return messages.goCompareLabel;
        case messages.quoteZone: return messages.quoteZoneLabel;
        case messages.uSwitch: return messages.uSwitchLabel;
        case messages.insurerGroup: return messages.insurerGroupLabel;
        case messages.experian: return messages.experianLabel;
        default: return messages.compareTheMarketLabel;
    }
};
