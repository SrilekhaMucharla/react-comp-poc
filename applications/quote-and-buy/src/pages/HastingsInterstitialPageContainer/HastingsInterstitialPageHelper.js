/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Base64 } from 'js-base64';
import {
    MOTOR_LEGAL_ANC, RAC_ANC, PERSONAL_ACCIDENT_ANC, SUBSTITUTE_VEHICLE_ANC, KEY_COVER_ANC
} from '../../constant/const';

export default class HastingsInterstitialPageHelper {
    static splitAtIndex(value) {
        const splitIndex = value.indexOf('=');
        const paramsArray = [value.substring(0, splitIndex), value.substring(splitIndex + 1)];
        return paramsArray;
    }

    static updatePreSelectedAncillaries(ancilariesSelected, ancillaryJourneyModel, ancillaryJourneyContinueSelectionModel) {
        if (ancilariesSelected) {
            const ancilariesSelectedList = ancilariesSelected.split(',');
            ancilariesSelectedList.forEach((ancilarySelected) => {
                switch (ancilarySelected) {
                    case MOTOR_LEGAL_ANC: ancillaryJourneyModel.motorLegal = true; ancillaryJourneyContinueSelectionModel.showContinueOnML = true;
                        break;
                    case RAC_ANC: ancillaryJourneyModel.breakdown = true; ancillaryJourneyContinueSelectionModel.showContinueOnRAC = true;
                        break;
                    case PERSONAL_ACCIDENT_ANC: ancillaryJourneyModel.personalAccident = true; ancillaryJourneyContinueSelectionModel.showContinueOnPAC = true;
                        break;
                    case SUBSTITUTE_VEHICLE_ANC: ancillaryJourneyModel.substituteVehicle = true; ancillaryJourneyContinueSelectionModel.showContinueOnSV = true;
                        break;
                    case KEY_COVER_ANC: ancillaryJourneyModel.keyCover = true;
                        break;
                    default:
                        break;
                }
            });
        }
    }

    static updatePreSelectedAncillariesMC(ancilariesSelected, mcancillaryJourneyModel, quoteIds) {
        if (ancilariesSelected) {
            const ancilariesSelectedList = ancilariesSelected.split(',');
            ancilariesSelectedList.forEach((ancilarySelected) => {
                switch (ancilarySelected) {
                    case MOTOR_LEGAL_ANC:
                        // eslint-disable-next-line no-case-declarations
                        const motorLegal = quoteIds.map((quoteId) => ({ ...quoteId, motorLegal: true }));
                        mcancillaryJourneyModel.motorLegal = motorLegal;
                        break;
                    case RAC_ANC:
                        // eslint-disable-next-line no-case-declarations
                        const breakdown = quoteIds.map((quoteId) => ({ ...quoteId, breakdown: true }));
                        mcancillaryJourneyModel.breakdown = breakdown;
                        break;
                    case PERSONAL_ACCIDENT_ANC:
                        // eslint-disable-next-line no-case-declarations
                        const personalAccident = quoteIds.map((quoteId) => ({ ...quoteId, personalAccident: true }));
                        mcancillaryJourneyModel.personalAccident = personalAccident;
                        break;
                    case SUBSTITUTE_VEHICLE_ANC:
                        // eslint-disable-next-line no-case-declarations
                        const substituteVehicle = quoteIds.map((quoteId) => ({ ...quoteId, substituteVehicle: true }));
                        mcancillaryJourneyModel.substituteVehicle = substituteVehicle;
                        break;
                    case KEY_COVER_ANC:
                        mcancillaryJourneyModel.keyCover = true;
                        break;
                    default:
                        break;
                }
            });
        }
    }

    static getParams(paramsArray, parsedParams) {
        switch (paramsArray[0]) {
            case 'page': return { ...parsedParams, page: Base64.decode(paramsArray[1]) };
            case 'quoteref': return { ...parsedParams, quoteID: Base64.decode(paramsArray[1]) };
            case 'action': return { ...parsedParams, action: paramsArray[1] };
            case 'producerCode': return { ...parsedParams, producerCode: Base64.decode(paramsArray[1]) };
            case 'campaignCode': return { ...parsedParams, campaignCode: Base64.decode(paramsArray[1]) };
            case 'surname': return { ...parsedParams, lastName: Base64.decode(paramsArray[1]) };
            case 'polHolderPostcode': return { ...parsedParams, postalCode: Base64.decode(paramsArray[1]) };
            case 'brand': return { ...parsedParams, productBand: Base64.decode(paramsArray[1]) };
            case 'lob': return { ...parsedParams, lob: Base64.decode(paramsArray[1]) };
            case 'email': return { ...parsedParams, email: Base64.decode(paramsArray[1]) };
            case 'anc': return { ...parsedParams, selectedAncillaries: Base64.decode(paramsArray[1]) };
            case 'Legal':
                if (paramsArray[1] === 'Legal') {
                    return { ...parsedParams, isLegalAnc: true };
                    // eslint-disable-next-line no-else-return
                } else {
                    return { ...parsedParams };
                }
            case 'Breakdown':
                if (paramsArray[1] === 'Breakdown') {
                    return { ...parsedParams, isBreakDownAnc: true };
                    // eslint-disable-next-line no-else-return
                } else {
                    return { ...parsedParams };
                }
            default: return { ...parsedParams };
        }
    }

    static parseQueryParams(queryParamsEncoded) {
        const queryparams = decodeURIComponent(queryParamsEncoded);
        const valuesArray = queryparams ? queryparams.split('&') : null;
        let parsedParams = {};
        if (valuesArray) {
            valuesArray.forEach(
                (value) => {
                    const paramsArray = HastingsInterstitialPageHelper.splitAtIndex(value);
                    paramsArray[0] = paramsArray[0].includes('?') ? paramsArray[0].slice(1) : paramsArray[0];
                    parsedParams = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
                }
            );
            return parsedParams;
        }
        return {
            page: 1,
            quoteID: 123456789,
            action: 'action',
            producerCode: 'producer_code',
            campaignCode: 'producer_code',
            lastName: 'test',
            postalCode: 'AVFTH',
            productBand: 'test',
            lob: 'tests'
        };
    }
}
