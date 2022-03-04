import {
    getRACIPIDDownloadParams,
    getIPIDDownloadParams,
    getregNumber,
    callIPIDDocumnetAPI
} from '../mcAncillaryHelpers';

describe('mcAncillaryHelpers', () => {
    it('should call getIPIDDownloadParams', () => {
        const retData = {
            documentUUID: '1234',
            referenceNumber: '12345',
            sessionUUID: '1234'
        };
        const mcancillaryJourneyDataModel = {
            ipidsInfo: [{
                ipids: [{
                    fileName: 'test-file',
                    description: 'IPID-desc',
                    uuid: '1234',
                    ancillaryCode: 'ANCMotorLegalExpensesCov_Ext'
                }]
            }]
        };
        const multiCustomizeSubmissionVM = {
            value: {
                mpwrapperNumber: '12345',
                sessionUUID: '1234'
            }
        };
        // given
        const data = {
            ancillaryJourneyDataModel: mcancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            coverExt: 'ANCMotorLegalExpensesCov_Ext'
        };
        // when
        const IPIDresponse = getIPIDDownloadParams(data);
        // then
        expect(IPIDresponse).toStrictEqual(retData);
    });

    it('should call getRACIPIDDownloadParams', () => {
        const retData = {
            documentUUID: '1234',
            referenceNumber: '12345',
            sessionUUID: '1234'
        };
        const mcancillaryJourneyDataModel = {
            ipidsInfo: [{
                ipids: [{
                    fileName: 'test-file',
                    description: 'IPID-desc',
                    uuid: '1234',
                    ancillaryCode: 'Roadside'
                }]
            }]
        };
        const multiCustomizeSubmissionVM = {
            value: {
                mpwrapperNumber: '12345',
                sessionUUID: '1234'
            }
        };
        // given
        const data = {
            ancillaryJourneyDataModel: mcancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            pageid: 'Roadside'
        };
        // when
        const IPIDresponse = getRACIPIDDownloadParams(data);
        // then
        expect(IPIDresponse).toStrictEqual(retData);
    });

    it('should call getregNumber', () => {
        const retData = 'AV12 BGE';
        const mcsubmissionVM = {
            value: {
                quotes: [{
                    lobData: {
                        privateCar: {
                            coverables: {
                                vehicles: [{
                                    license: 'AV12BGE'
                                }]
                            }
                        }
                    },
                    quoteID: '1234'
                }]
            }
        };
        const mcObj = {
            quoteID: '1234'
        };
        const regResponse = getregNumber(0, mcsubmissionVM, mcObj);
        // then
        expect(regResponse).toBe(retData);
    });

    it('should call callIPIDDocumnetAPI', () => {
        const data = { uuid: '1234567890' };
        const pageID = 'Test';
        const param = {
            multiCustomizeSubmissionVM: {
                value: {
                    mpwrapperNumber: '123456776543',
                    sessionUUID: '1234567890'
                }
            }
        };
        const docParam = {
            documentUUID: '1234567890',
            referenceNumber: '123456776543',
            sessionUUID: '1234567890'
        };
        const ipidApiObject = callIPIDDocumnetAPI(data, pageID, param);
        // then
        expect(ipidApiObject).toStrictEqual(docParam);
    });
});
