/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    HDLabelRefactor, HDQuoteInfoRefactor
} from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import formatRegNumber from '../../../common/formatRegNumber';
import * as messages from './HDMultiCarSubVehicle.messages';

const HDMotorLegalCarItem = ({
    mcObj, index, subvehiclebuttonHandle, mcsubmissionVM, ancillaryJourneyDataModel, isProvisional, invalidateImportantStuffPage
}) => {
    const [type, settype] = useState('');
    const [registrationNumber, setregistrationNumber] = useState('');
    const [amount, setamount] = useState(0);
    const [foundAncillary, setfoundAncillary] = useState(null);
    const [car, setcar] = useState('');
    const makePath = 'lobData.privateCar.coverables.vehicles[0].make';
    const modelPath = 'lobData.privateCar.coverables.vehicles[0].model';
    const coveragePath = 'coverages.privateCar.ancillaryCoverages[0].coverages';
    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const addonHandler = (event, idx) => {
        invalidateImportantStuffPage();
        subvehiclebuttonHandle(event.target.value, idx, amount, registrationNumber, type);
    };

    useEffect(() => {
        if (mcObj) {
            let regNum = mcsubmissionVM[index].lobData.privateCar.coverables.vehicles[0].license;
            // eslint-disable-next-line prefer-template
            regNum = formatRegNumber(regNum);
            setregistrationNumber(regNum);
            let foundAncillary1 = [];
            if (_.get(mcObj, coveragePath)) {
                const brandCover = _.get(mcObj, coveragePath);
                foundAncillary1 = brandCover.filter((item) => {
                    return item.name === messages.pageTitleText;
                });
                const tempAmt = _.get(foundAncillary1[0], 'amount.amount', 0);
                const amt = `£${tempAmt.toFixed(2)}`;
                setamount(foundAncillary1.length > 0 ? amt : null);
            }
            const make = _.get(mcsubmissionVM[index], makePath);
            const model = _.get(mcsubmissionVM[index], modelPath);
            const tmpCar = `${make} ${model}`;
            setcar(tmpCar);
            setfoundAncillary(foundAncillary1);
            settype(mcObj.quote.branchCode);
        }
    }, [mcObj]);

    const checkancillarymodalSelection = (type) => {
        let btn = '';
        if (ancillaryJourneyDataModel && ancillaryJourneyDataModel.substituteVehicle.length) {
            ancillaryJourneyDataModel.substituteVehicle.forEach((mc) => {
                if (mc.quoteID === mcObj.quoteID) {
                    if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
                        btn = 'yes';
                    } else if (foundAncillary && foundAncillary.length && foundAncillary[0].selected === false && mc.substituteVehicle) {
                        btn = 'no';
                    }
                }
            });
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
                        className="reg-num--anc-car-item margin-bottom-tiny"
                        text={registrationNumber} />
                    <HDLabelRefactor
                        Tag="h3"
                        text={car}
                        className="mb-0" />
                </Col>
                <Col xs="auto">
                    {amount !== null && <HDLabelRefactor Tag="h2" text={amount} className="my-0" />}
                </Col>
            </Row>
            <HDToggleButtonGroup
                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                id="mc-substitute-vehicle-button-group"
                btnGroupClassName="grid grid--col-2 grid--col-lg-3 margin-top-md"
                btnClassName={isProvisional ? 'bg-light text-secondary border-secondary' : 'theme-white'}
                disabled={isProvisional}
                availableValues={availableValues}
                // eslint-disable-next-line no-nested-ternary
                value={checkancillarymodalSelection(messages.HD)}
                onChange={(e) => { addonHandler(e, index); }} />
            {isProvisional && (
                <HDQuoteInfoRefactor>
                    <span>{messages.infoTipText}</span>
                </HDQuoteInfoRefactor>
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
        voluntaryExcess: PropTypes.string

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
    subvehiclebuttonHandle: PropTypes.func.isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({
        substituteVehicle: PropTypes.object
    }).isRequired,
    isProvisional: PropTypes.bool.isRequired
};

export default HDMotorLegalCarItem;
