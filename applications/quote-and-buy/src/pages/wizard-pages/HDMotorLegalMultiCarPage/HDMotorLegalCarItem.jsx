/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDLabelRefactor,
    HDQuoteInfoRefactor,
} from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import * as messages from './HDMotorLegalMultiCarPage.messages';
import formatRegNumber from '../../../common/formatRegNumber';
import { getPCWName } from '../HDMotorLegal/HastingsPCWHelper';

const HDMotorLegalCarItem = ({
    mcObj, index, motorlegalbuttonHandle, mcsubmissionVM, ancillaryJourneyDataModel, motorlegalSelection
}) => {
    const [type, settype] = useState('');
    const [registrationNumber, setregistrationNumber] = useState('');
    const [amount, setamount] = useState(0);
    const [foundAncillary, setfoundAncillary] = useState(null);
    const [interaction, setinteraction] = useState(false);
    const [preselectedValue, setPreselectedValue] = useState(false);
    const [car, setcar] = useState('');
    const makePath = 'lobData.privateCar.coverables.vehicles[0].make';
    const modelPath = 'lobData.privateCar.coverables.vehicles[0].model';
    const coveragePath = 'coverages.privateCar.ancillaryCoverages[0].coverages';
    const producercodePath = 'producerCode';
    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    useEffect(() => {
        if (mcObj) {
            const prodCode = _.get(mcObj, producercodePath);
            const subVm = mcsubmissionVM.find((submissionVM) => submissionVM.quoteID === mcObj.quoteID);
            let regNum = subVm.lobData.privateCar.coverables.vehicles[0].license;
            regNum = formatRegNumber(regNum);
            setregistrationNumber(regNum);
            let foundAncillary1 = [];
            if (_.get(mcObj, coveragePath)) {
                const brandCover = _.get(mcObj, coveragePath);
                foundAncillary1 = brandCover.filter((item) => {
                    return item.name === messages.pageTitle;
                });
                const tempAmt = _.get(foundAncillary1[0], 'amount.amount', 0);
                const amt = `£${tempAmt}`;
                setamount(amt);
            }
            const make = _.get(subVm, makePath);
            const model = _.get(subVm, modelPath);
            const tmpCar = `${make} ${model}`;
            setcar(tmpCar);
            if (foundAncillary1[0].selected) {
                setPreselectedValue(true);
            }
            setfoundAncillary(foundAncillary1);
            if (prodCode === messages.defaultCode) {
                settype(mcObj.quote.branchCode);
            } else if (prodCode !== messages.defaultCode && prodCode !== 'ClearScore' && mcObj.quote.branchCode !== messages.HP) {
                settype(messages.PCW);
            } else {
                settype(mcObj.quote.branchCode);
            }
        }
    }, [mcObj]);

    const addonHandler = (event, idx) => {
        setinteraction(true);
        motorlegalbuttonHandle(event.target.value, idx, amount, registrationNumber, type);
    };

    const getPCWProducerCode = () => {
        const producerCode = _.get(mcObj, producercodePath);
        let producerIconKey = '';
        if (producerCode && producerCode !== 'Default' && producerCode !== 'ClearScore') {
            producerIconKey = getPCWName(producerCode);
            return producerIconKey;
        }
    };

    const checkancillarymodalSelection = (type) => {
        let btn = '';
        if (ancillaryJourneyDataModel && ancillaryJourneyDataModel.motorLegal.length) {
            ancillaryJourneyDataModel.motorLegal.forEach((mc) => {
                if (mc.quoteID === mcObj.quoteID) {
                    if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
                        btn = 'yes';
                    } else if (foundAncillary && foundAncillary.length && foundAncillary[0].selected === false && mc.motorLegal) {
                        btn = 'no';
                    }
                }
            });
            return btn;
        } else if (ancillaryJourneyDataModel && !ancillaryJourneyDataModel.motorLegal.length && type === messages.PCW) {
            if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
                btn = 'yes';
            } else if (motorlegalSelection[index].interacted && foundAncillary && foundAncillary.length && !foundAncillary[0].selected) {
                btn = 'no';
            } else {
                btn = null;
            }
            return btn;
        } else {
            return null;
        }
    };

    return (
        <>
            <Row className="align-items-end">
                <Col>
                    <HDLabelRefactor
                        Tag="span"
                        className="reg-num--anc-car-item margin-bottom-tiny p-1"
                        text={registrationNumber} />
                    <HDLabelRefactor
                        Tag="h3"
                        text={car}
                        className="mb-0" />
                </Col>
                {(type === messages.HD || type === messages.PCW || type === messages.HE) && (
                    <Col xs="auto">
                        <HDLabelRefactor Tag="h2" text={amount} className="my-0" />
                        {type === messages.PCW && foundAncillary[0].selected && preselectedValue && (
                            <p className="text-small mb-0 mt-n2 text-right">{messages.motorLegalIncluded}</p>
                        )}
                    </Col>
                )}
            </Row>
            {type === messages.HP && (
                <>
                    <HDLabelRefactor Tag="h2" text={messages.pageTitle} className="mb-0" />
                    <HDLabelRefactor Tag="h3" text={messages.includedHastingsPremier} className="mt-0" />
                </>
            )}
            {type === messages.PCW && foundAncillary && foundAncillary.length && foundAncillary[0].selected && preselectedValue && (
                <HDQuoteInfoRefactor>
                    {messages.pageInfoTextPCWFirst}
                    <b>{getPCWProducerCode()}</b>
                </HDQuoteInfoRefactor>
            )}
            {type === messages.HP && (<HDQuoteInfoRefactor>{messages.alreadyIncludedInfo}</HDQuoteInfoRefactor>)}
            {type !== messages.HP && (
                <HDToggleButtonGroup
                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                    id="mc-motor-legal-cover-expense-button-group"
                    btnGroupClassName="grid grid--col-2 grid--col-lg-3 margin-top-md"
                    btnClassName="theme-white"
                    availableValues={availableValues}
                    // eslint-disable-next-line no-nested-ternary
                    value={type === messages.PCW
                        // ? (foundAncillary && foundAncillary.length && foundAncillary[0].selected ? 'yes' : null)
                        // : (foundAncillary && foundAncillary.length && foundAncillary[0].selected ? 'yes' : 'no')}
                        ? (checkancillarymodalSelection(messages.PCW))
                        : (checkancillarymodalSelection(messages.HD))}
                    onChange={(e) => { addonHandler(e, index); }} />
            )}
        </>
    );
};

HDMotorLegalCarItem.propTypes = {
    mcObj: PropTypes.shape({
        quote: PropTypes.object,
        coverType: PropTypes.string,
        coverages: PropTypes.object,
        insurancePaymentType: PropTypes.string,
        ncdgrantedProtectionInd: PropTypes.bool,
        ncdgrantedYears: PropTypes.string,
        otherOfferedQuotes: PropTypes.object,
        periodEndDate: PropTypes.object,
        periodStartDate: PropTypes.object,
        producerCode: PropTypes.string,
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string,
        voluntaryExcess: PropTypes.string,
        isParentPolicy: PropTypes.bool,

    }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        baseData: PropTypes.object,
        bindData: PropTypes.object,
        lobData: PropTypes.object,
        quoteData: PropTypes.object,
        isParentPolicy: PropTypes.string,
        quoteID: PropTypes.bool
    }).isRequired,
    index: PropTypes.number.isRequired,
    motorlegalbuttonHandle: PropTypes.func.isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({
        motorLegal: PropTypes.object
    }).isRequired,
    motorlegalSelection: PropTypes.shape({
        selection: PropTypes.bool,
        index: PropTypes.number,
        interacted: PropTypes.bool,
        producerCode: PropTypes.string,
        branchCode: PropTypes.string,
        quoteId: PropTypes.string
    }).isRequired
};

export default HDMotorLegalCarItem;
