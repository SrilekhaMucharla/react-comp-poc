import HastingsInterstitialPageHelper from '../HastingsInterstitialPageHelper';
import {
    MOTOR_LEGAL_ANC, RAC_ANC, PERSONAL_ACCIDENT_ANC, SUBSTITUTE_VEHICLE_ANC, KEY_COVER_ANC
} from '../../../constant/const';

describe('HastingsInterstitialPageHelper - splitAtIndex', () => {
    test('splitAtIndex', () => {
        const expected = ['test1', 'test2'];
        const data = 'test1=test2';
        const actual = HastingsInterstitialPageHelper.splitAtIndex(data);
        expect(actual).toStrictEqual(expected);
    });
});

describe('HastingsInterstitialPageHelper - updatePreSelectedAncillaries', () => {
    test('updatePreSelectedAncillaries - all', () => {
        const expected = {
            breakdown: true,
            keyCover: true,
            motorLegal: true,
            personalAccident: true,
            substituteVehicle: true,
        };
        const ancilariesSelected = `${MOTOR_LEGAL_ANC},${RAC_ANC},${PERSONAL_ACCIDENT_ANC},${SUBSTITUTE_VEHICLE_ANC},${KEY_COVER_ANC}`;
        const ancillaryJourneyModel = {};
        const ancillaryJourneyContinueSelectionModel = {};
        HastingsInterstitialPageHelper.updatePreSelectedAncillaries(
            ancilariesSelected,
            ancillaryJourneyModel,
            ancillaryJourneyContinueSelectionModel
        );
        expect(ancillaryJourneyModel).toStrictEqual(expected);
    });

    test('updatePreSelectedAncillaries - none', () => {
        const expected = {};
        const ancilariesSelected = 'test';
        const ancillaryJourneyModel = {};
        const ancillaryJourneyContinueSelectionModel = {};
        HastingsInterstitialPageHelper.updatePreSelectedAncillaries(
            ancilariesSelected,
            ancillaryJourneyModel,
            ancillaryJourneyContinueSelectionModel
        );
        expect(ancillaryJourneyModel).toStrictEqual(expected);
    });

    test('updatePreSelectedAncillariesMC', () => {
        const expected = {
            breakdown: [{ breakdown: true, test: 'test' }],
            keyCover: true,
            motorLegal: [{ motorLegal: true, test: 'test' }],
            personalAccident: [{ personalAccident: true, test: 'test' }],
            substituteVehicle: [{ substituteVehicle: true, test: 'test' }]
        };
        const ancilariesSelected = `${MOTOR_LEGAL_ANC},${RAC_ANC},${PERSONAL_ACCIDENT_ANC},${SUBSTITUTE_VEHICLE_ANC},${KEY_COVER_ANC}`;
        const ancillaryJourneyModel = {};
        const quoteIds = [{ test: 'test' }];
        HastingsInterstitialPageHelper.updatePreSelectedAncillariesMC(ancilariesSelected, ancillaryJourneyModel, quoteIds);
        expect(ancillaryJourneyModel).toStrictEqual(expected);
    });

    test('updatePreSelectedAncillariesMC', () => {
        const expected = {};
        const ancilariesSelected = 'test';
        const ancillaryJourneyModel = {};
        const quoteIds = [{ test: 'test' }];
        HastingsInterstitialPageHelper.updatePreSelectedAncillariesMC(ancilariesSelected, ancillaryJourneyModel, quoteIds);
        expect(ancillaryJourneyModel).toStrictEqual(expected);
    });
});

describe('HastingsInterstitialPageHelper - getParams', () => {
    test('getParams - page', () => {
        const expected = {
            page: 'test',
            test: 'test'
        };
        const paramsArray = [
            'page', 'dGVzdA==',


            'Legal', 'dGVzdA==',
            'Breakdown', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - quoteref', () => {
        const expected = {
            quoteID: 'test',
            test: 'test'
        };
        const paramsArray = [
            'quoteref', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - action', () => {
        const expected = {
            action: 'test',
            test: 'test'
        };
        const paramsArray = [
            'action', 'test'
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - producerCode', () => {
        const expected = {
            producerCode: 'test',
            test: 'test'
        };
        const paramsArray = [
            'producerCode', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - campaignCode', () => {
        const expected = {
            campaignCode: 'test',
            test: 'test'
        };
        const paramsArray = [
            'campaignCode', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - surname', () => {
        const expected = {
            lastName: 'test',
            test: 'test'
        };
        const paramsArray = [
            'surname', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - polHolderPostcode', () => {
        const expected = {
            postalCode: 'test',
            test: 'test'
        };
        const paramsArray = [
            'polHolderPostcode', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - brand', () => {
        const expected = {
            productBand: 'test',
            test: 'test'
        };
        const paramsArray = [
            'brand', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - lob', () => {
        const expected = {
            lob: 'test',
            test: 'test'
        };
        const paramsArray = [
            'lob', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - email', () => {
        const expected = {
            email: 'test',
            test: 'test'
        };
        const paramsArray = [
            'email', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - anc', () => {
        const expected = {
            selectedAncillaries: 'test',
            test: 'test'
        };
        const paramsArray = [
            'anc', 'dGVzdA=='
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - Legal', () => {
        const expected = {
            isLegalAnc: true,
            test: 'test'
        };
        const paramsArray = [
            'Legal', 'Legal'
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - Legal error', () => {
        const expected = {
            test: 'test'
        };
        const paramsArray = [
            'Legal'
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - Breakdown', () => {
        const expected = {
            isBreakDownAnc: true,
            test: 'test'
        };
        const paramsArray = [
            'Breakdown', 'Breakdown'
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - Breakdown error', () => {
        const expected = {
            test: 'test'
        };
        const paramsArray = [
            'Breakdown'
        ];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });

    test('getParams - Breakdown error', () => {
        const expected = { test: 'test' };
        const paramsArray = ['test'];
        const parsedParams = { test: 'test' };
        const actual = HastingsInterstitialPageHelper.getParams(paramsArray, parsedParams);
        expect(actual).toStrictEqual(expected);
    });
});

describe('HastingsInterstitialPageHelper - parseQueryParams', () => {
    test('parseQueryParams', () => {
        const expected = {
            page: 'test',
            quoteID: 'test',
        };
        const data = 'page=dGVzdA==&quoteref=dGVzdA==';
        const actual = HastingsInterstitialPageHelper.parseQueryParams(data);
        expect(actual).toStrictEqual(expected);
    });
});
