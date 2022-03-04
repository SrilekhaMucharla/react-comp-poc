/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { HastingsIpidService } from 'hastings-capability-ipid';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import {
    IPID_MATCHFORALL_START,
    IPID_MATCHFORALL_SUCCESS,
    IPID_MATCHFORALL_FAIL,
    UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS,
    IPID_DOWNLOAD_DOCUMENT_START,
    IPID_DOWNLOAD_DOCUMENT_FAIL,
    IPID_MOTOR_LEGAL_DOCUMENT_SUCCESS,
    IPID_SUBSTITUTE_VEHICLE_DOCUMENT_SUCCESS,
    IPID_PERSONAL_ACCIDENTAL_DOCUMENT_SUCCESS,
    IPID_KEY_COVER_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_EUROPEAN_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_HOMESTART_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_ROADSIDE_AND_RECOVERY_DOCUMENT_SUCCESS,
    IPID_BREAKDOWN_ROADSIDE_DOCUMENT_SUCCESS,
    IPID_CAR_INSURANCE_POLICY_DOCUMENT_SUCCESS
} from '../../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { setErrorStatusCode } from '../errorStatusCode.action';
import {
    MOTOR_LEGAL, BREAKDOWN, PERSONAL_ACCIDENT, SUBSTITUTE_VEHICLE, KEY_COVER, CAR_POLICY
} from '../../../constant/const';
import {
    base64ToArrayBuffer, saveByteArray
} from '../../../common/utils';

export const ipidEuropean = 'European';
export const ipidHomestart = 'Homestart';
export const ipidRoadsideAndRecovery = 'RoadsideAndRecovery';
export const ipidRoadside = 'Roadside';

export const getIpidMatchForAll = (ipadObject) => (dispatch) => {
    dispatch({
        type: IPID_MATCHFORALL_START
    });
    HastingsIpidService.ipidByProducerCode(ipadObject)
        .then(({ result }) => {
            dispatch({
                type: IPID_MATCHFORALL_SUCCESS,
                payload: result
            });
            dispatch({
                type: UPDATE_IPIDS_INFO_ANCILLARY_DOCUMENT_LINKS,
                payload: result.ipids
            });
            trackAPICallSuccess('Ipid By Producer Code');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: IPID_MATCHFORALL_FAIL,
                payload: error
            });
            trackAPICallFail('Ipid By Producer Code', 'Ipid By Producer Code Failed');
        });
};

export const getIpidDocumnet = (ipadObject, pageName) => (dispatch) => {
    dispatch({
        type: IPID_DOWNLOAD_DOCUMENT_START
    });
    HastingsDocretrieveService.ipidDocByUUID(ipadObject)
        .then(({ result }) => {
            switch (pageName) {
                case MOTOR_LEGAL:
                    dispatch({
                        type: IPID_MOTOR_LEGAL_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case SUBSTITUTE_VEHICLE:
                    dispatch({
                        type: IPID_SUBSTITUTE_VEHICLE_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case PERSONAL_ACCIDENT:
                    dispatch({
                        type: IPID_PERSONAL_ACCIDENTAL_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case KEY_COVER:
                    dispatch({
                        type: IPID_KEY_COVER_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case ipidEuropean:
                    dispatch({
                        type: IPID_BREAKDOWN_EUROPEAN_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case ipidHomestart:
                    dispatch({
                        type: IPID_BREAKDOWN_HOMESTART_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case ipidRoadsideAndRecovery:
                    dispatch({
                        type: IPID_BREAKDOWN_ROADSIDE_AND_RECOVERY_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case ipidRoadside:
                    dispatch({
                        type: IPID_BREAKDOWN_ROADSIDE_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                case CAR_POLICY:
                    dispatch({
                        type: IPID_CAR_INSURANCE_POLICY_DOCUMENT_SUCCESS,
                        payload: result
                    });
                    handleDownloadFile(result);
                    break;
                default:
                    break;
            }
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: IPID_DOWNLOAD_DOCUMENT_FAIL,
                payload: error
            });
        });
};

const handleDownloadFile = (result) => {
    const sampleArr = base64ToArrayBuffer(result.documentContentEncoded);
    saveByteArray(result.fileName, sampleArr);
};
