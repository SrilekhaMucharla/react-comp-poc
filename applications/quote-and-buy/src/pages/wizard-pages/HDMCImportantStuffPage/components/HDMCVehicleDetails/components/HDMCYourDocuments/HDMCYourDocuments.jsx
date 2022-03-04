import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Container, Col, Row } from 'react-bootstrap';
import { HDLabelRefactor, HDQuoteDownloadRefactor } from 'hastings-components';
import {
    getMCIpidDocument
} from '../../../../../../../redux-thunk/actions';
import {
    mcIPidAncillaryAPIObject,
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../../../../../common/utils';
import {
    CAR_POLICY, HASTINGS_ESSENTIAL, HASTINGS_DIRECT, HASTINGS_PREMIER, YOU_DRIVE, MOTOR_LEGAL, PERSONAL_ACCIDENT, SUBSTITUTE_VEHICLE, KEY_COVER
} from '../../../../../../../constant/const';
import handlePolicyBookletDownloadFile from '../../../../../../../common/downloadFile/handlePolicyBookletDownloadFile';
import * as messages from './HDMCYourDocuments.messages';
import './HDMCYourDocuments.scss';


const HDMCYourDocuments = (props) => {
    const {
        dispatch,
        mcancillaryJourneyDataModel,
        multiCustomizeSubmissionVM,
        vehicleData
    } = props;
    const [selectedAncillary, setSelectedAncillary] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const customQuotesArr = _.get(multiCustomizeSubmissionVM, 'value.customQuotes');
    const referenceNum = _.get(multiCustomizeSubmissionVM, 'value.mpwrapperNumber');
    const customQuoteObj = customQuotesArr.filter((obj) => { return obj.quoteID === vehicleData.quoteID; });
    const branchCode = _.get(customQuoteObj[0], 'quote.branchCode');
    const inceptionDate = _.get(customQuoteObj[0], 'periodStartDate');

    useEffect(() => {
        if (customQuoteObj[0]) {
            customQuoteObj[0].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                const tempArray = [];
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID) {
                        if (nestedData.selected) tempArray.push(nestedData.publicID);
                    }
                    setSelectedAncillary(tempArray);
                    if (nestedData.publicID === messages.ANCBreakdownCovExt) {
                        const isTermAvailable = _.get(customQuoteObj[0], `coverages.privateCar.ancillaryCoverages[${index1}].coverages[${index2}].terms`);
                        if (isTermAvailable.length) {
                            // eslint-disable-next-line array-callback-return
                            isTermAvailable.map((termObject) => {
                                setSelectedTerm(termObject.chosenTermValue);
                            });
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    }, [customQuoteObj]);

    const getMatchingValue = () => {
        let matchingStringValue;
        switch (branchCode) {
            case HASTINGS_ESSENTIAL:
                matchingStringValue = messages.carPolicyIdentifierHE;
                break;
            case HASTINGS_DIRECT:
                matchingStringValue = messages.carPolicyIdentifierHD;
                break;
            case YOU_DRIVE:
                matchingStringValue = messages.carPolicyIdentifierYD;
                break;
            case HASTINGS_PREMIER:
                if (selectedTerm === messages.roadside) {
                    matchingStringValue = messages.roadside;
                } else if (selectedTerm === messages.european) {
                    matchingStringValue = messages.european;
                } else if (selectedTerm === messages.homestart) {
                    matchingStringValue = messages.homestart;
                } else { matchingStringValue = messages.roadsideAndRecoveryWithoutSpace; }
                break;
            default:
                break;
        }
        return matchingStringValue;
    };

    const callIpidAPI = (data, ancCode) => {
        const docParam = mcIPidAncillaryAPIObject(data, customQuoteObj[0], referenceNum);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, ancCode), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, ancCode));
        }
    };
    const initialDownloadDocs = (fileName, fileString) => {
        const ipidsInfoObj = _.get(mcancillaryJourneyDataModel, 'ipidsInfo', []);
        const ipidsInfoObjEach = ipidsInfoObj.filter((ipid) => { return ipid.jobNumber === vehicleData.quoteID; });
        const ipiddata = _.get(ipidsInfoObjEach[0], 'ipids', []);
        if (ipiddata.length) {
            // eslint-disable-next-line array-callback-return
            ipiddata.map((data) => {
                if (fileName !== CAR_POLICY) {
                    if (data.ancillaryCode === fileName) {
                        callIpidAPI(data, fileString);
                    }
                } else if (data.description === getMatchingValue()) {
                    callIpidAPI(data, CAR_POLICY);
                } else if (data.ancBreakdownCoverCode === getMatchingValue()) {
                    callIpidAPI(data, CAR_POLICY);
                } else if (data.description === messages.carPolicyIdentifierHDTPFT
                    || data.description === messages.carPolicyIdentifierHETPFT
                    || data.description === messages.carPolicyIdentifierYDTPFT) {
                    callIpidAPI(data, CAR_POLICY);
                }
            });
        } else {
            // Error handling if documnet is not available
        }
    };

    // handle dynamic file download
    const handleDownloadFile = (param) => {
        switch (param) {
            case messages.carPolicy:
                initialDownloadDocs(CAR_POLICY, CAR_POLICY);
                break;
            case messages.ANCBreakdownCovExt:
                if (selectedTerm === messages.roadside) initialDownloadDocs(messages.roadside, messages.roadside);
                if (selectedTerm === messages.roadsideAndRecovery) {
                    initialDownloadDocs(messages.roadsideAndRecoveryWithoutSpace, messages.roadsideAndRecoveryWithoutSpace);
                }
                if (selectedTerm === messages.homestart) initialDownloadDocs(messages.homestart, messages.homestart);
                if (selectedTerm === messages.european) initialDownloadDocs(messages.european, messages.european);
                break;
            case messages.ANCMotorLegalExpensesCovExt:
                initialDownloadDocs(messages.ANCMotorLegalExpensesCovExt, MOTOR_LEGAL);
                break;
            case messages.ANCSubstituteVehicleCovExt:
                initialDownloadDocs(messages.ANCSubstituteVehicleCovExt, SUBSTITUTE_VEHICLE);
                break;
            case messages.ANCKeyCoverCovExt:
                initialDownloadDocs(messages.ANCKeyCoverCovExt, KEY_COVER);
                break;
            case messages.ANCMotorPersonalAccidentCovExt:
                initialDownloadDocs(messages.ANCMotorPersonalAccidentCovExt, PERSONAL_ACCIDENT);
                break;
            default:
                break;
        }
    };

    const linkTextMapping = (publicID) => {
        if (publicID === messages.ANCSubstituteVehicleCovExt) return messages.substituteVehicle;
        if (publicID === messages.ANCMotorPersonalAccidentCovExt) return messages.personalAccidentText;
        if (publicID === messages.ANCMotorLegalExpensesCovExt) return messages.motorLegal;
        if (publicID === messages.ANCKeyCoverCovExt) return messages.keyCover;
        if (publicID === messages.ANCBreakdownCovExt) return messages.breakdown;
        return null;
    };

    return (
        <Container fluid>
            <Row>
                <Col className="ipid-details-wrapper">
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.yourDocument}
                        className="mt-0 mb-3"
                        id="ipid-details-header-label" />
                    <Row>
                        <Col className="ipid-details__col" md={6} sm={12}>
                            <HDLabelRefactor
                                Tag="div"
                                text={messages.productInfoDocument}
                                className="font-bold"
                                id="ipid-details-prod-info-label" />
                            <div>
                                <HDQuoteDownloadRefactor
                                    showIcon
                                    linkText={messages.CarInsurance}
                                    onClick={() => handleDownloadFile(messages.carPolicy)}
                                    className="ipid-details__car-insurance-link" />
                            </div>
                            {selectedAncillary.map((publicID) => (
                                <div>
                                    <HDQuoteDownloadRefactor
                                        showIcon
                                        linkText={linkTextMapping(publicID)}
                                        onClick={() => handleDownloadFile(publicID)}
                                        className="ipid-details__download-file-link" />
                                </div>
                            ))}
                        </Col>
                        <Col className="ipid-details__col" md={6} sm={12}>
                            <HDLabelRefactor
                                Tag="div"
                                text={messages.policyBooklet}
                                className="font-bold mt-3 mt-md-0"
                                id="ipid-details-policy-booklets-label" />
                            <div>
                                <HDQuoteDownloadRefactor
                                    showIcon
                                    linkText={messages.CarText}
                                    onClick={() => handlePolicyBookletDownloadFile(branchCode, inceptionDate)}
                                    className="ipid-details__car-insurance-link" />
                            </div>
                            <div>
                                <HDQuoteDownloadRefactor
                                    showIcon
                                    linkText={messages.AdditionalProducts}
                                    onClick={() => handlePolicyBookletDownloadFile(messages.additionalProducts, inceptionDate)}
                                    className="ipid-details__additional-products-link" />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

HDMCYourDocuments.propTypes = {
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    dispatch: PropTypes.shape({}),
    mcancillaryJourneyDataModel: PropTypes.shape({ motorLegal: PropTypes.bool }),
    vehicleData: PropTypes.shape({ quoteID: PropTypes.string }),
};

HDMCYourDocuments.defaultProps = {
    dispatch: null,
    mcancillaryJourneyDataModel: null,
    multiCustomizeSubmissionVM: null,
    vehicleData: null
};

const mapStateToProps = (state) => {
    return {
        mcancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    getMCIpidDocument
});


export default connect(mapStateToProps, mapDispatchToProps)(HDMCYourDocuments);
