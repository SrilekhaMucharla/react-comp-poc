import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

function processSubmission(method, data) {
    return BaseTransportService.send(
        getProxiedServiceUrl('quote'),
        {
            'Content-Type': 'application/json; charset=utf-8'
        },
        {
            jsonrpc: '2.0',
            method,
            params: [data]
        }
    );
}

function customizeSubmission(method, data) {
    return BaseTransportService.send(
        getProxiedServiceUrl('customquote'),
        {
            'Content-Type': 'application/json; charset=utf-8'
        },
        {
            jsonrpc: '2.0',
            method,
            params: [data]
        }
    );
}

export default class HDQuoteService {
    static createSubmission(data) {
        return processSubmission('create', data);
    }

    static createQuote(data) {
        return processSubmission('lwrSaveAndQuote', data);
    }

    static updateQuote(data) {
        return processSubmission('updateDraftSubmission', data);
    }

    static retrieveQuote(data) {
        return processSubmission('retrieve', data);
    }

    static retrievemulticarQuote(data) {
        return processSubmission('retrieveMultiProduct', data);
    }

    static retrieveSubmission(data) {
        return processSubmission('retrieveSubmission', data);
    }

    static customUpdateQuote(data) {
        return customizeSubmission('updateQuote', data);
    }

    static updateQuoteCoverages(data) {
        return customizeSubmission('updateQuoteCoverages', data);
    }

    static updateMarketingPreference(data) {
        return processSubmission('updateMarketingPreferences', data);
    }

    static updateMarketingPreferencesForMC(data) {
        return processSubmission('updateMarketingPreferencesForMC', data);
    }

    static sendEmailNotification(data) {
        return processSubmission('sendEmailNotification', data);
    }

    static customUpdateMultiQuote(data) {
        return customizeSubmission('updateMultiQuote', data);
    }

    static customUpdateMultiQuoteCoverages(data) {
        return customizeSubmission('updateMultiQuoteCoverages', data);
    }

    static updateMultiQuote(data) {
        return processSubmission('updateDraftMultiProduct', data);
    }

    static multiQuote(data) {
        return processSubmission('multiQuote', data);
    }

    static multiToSingleQuote(data) {
        return processSubmission('multiToSingleProduct', data);
    }

    static bindAndIssueService(data) {
        return processSubmission('bindAndIssue', data);
    }

    static updateSelectedVersion(data) {
        return processSubmission('updateSelectedVersion', data);
    }

    static updateProduct(data) {
        return processSubmission('updateProduct', data);
    }

    static singleToMultiProduct(data) {
        return processSubmission('singleToMultiProduct', data);
    }

    static applyDiscountOnMulticar(data) {
        return processSubmission('applyDiscountOnMulticar', data);
    }

    static updateSelectedVersionForMP(data) {
        return processSubmission('updateSelectedVersionForMP', data);
    }

    static mcBindAndIssue(data) {
        return processSubmission('mpBindAndIssue', data);
    }
}
