/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDLabelRefactor, HDQuoteTable, HDQuoteDownloadRefactor, HDQuoteInfoRefactor
} from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import formatRegNumber from '../../../common/formatRegNumber';
import * as messages from './HDMCPersonalAccident.messages';
import getDataforTable from './getTableData';

const HDMCPersonalAccidentCarItem = ({
    mcObj, index, pabuttonHandle, mcsubmissionVM, allsameCover, ancillaryJourneyDataModel,
    handleDownloadFile, invalidateImportantStuffPage
}) => {
    const [type, settype] = useState('');
    const [registrationNumber, setregistrationNumber] = useState('');
    const [amount, setamount] = useState(0);
    const [foundAncillary, setfoundAncillary] = useState(null);
    const [interaction, setinteraction] = useState(false);
    const [car, setcar] = useState('');
    const [dob, setDob] = useState('');
    const makePath = 'lobData.privateCar.coverables.vehicles[0].make';
    const modelPath = 'lobData.privateCar.coverables.vehicles[0].model';
    const coveragePath = 'coverages.privateCar.ancillaryCoverages[0].coverages';
    const availableValues = [{
        value: 'yes',
        name: messages.Yes,
    }, {
        value: 'no',
        name: messages.No,
    }];

    useEffect(() => {
        if (mcObj) {
            if (mcObj.quote.branchCode === messages.HE) {
                settype(mcObj.quote.branchCode);
            } else if (mcObj.quote.branchCode !== messages.HE && mcObj.coverType === messages.comprehensive) {
                settype(messages.comprehensive);
            } else if (mcObj.quote.branchCode !== messages.HE && mcObj.coverType === messages.tpft) {
                settype(messages.tpft);
            } else {
                settype(messages.comprehensive);
            }
            let regNum = mcsubmissionVM[index].lobData.privateCar.coverables.vehicles[0].license;
            // eslint-disable-next-line prefer-template
            regNum = formatRegNumber(regNum);
            setregistrationNumber(regNum);
            let foundAncillary1 = [];
            if (_.get(mcObj, coveragePath)) {
                const brandCover = _.get(mcObj, coveragePath);
                foundAncillary1 = brandCover.filter((item) => {
                    return item.name === messages.pageTitleCheck;
                });
                const tempAmt = _.get(foundAncillary1[0], 'amount.amount', 0);
                const amt = `£${tempAmt}`;
                setamount(foundAncillary1.length > 0 ? amt : null);
            }
            const dobTemp = mcsubmissionVM[index].lobData.privateCar.coverables.drivers[0].dateOfBirth;
            const dateStr = `${dobTemp.year}-${dobTemp.month}-${dobTemp.day}`;
            const dateofBirth = Math.floor((new Date() - new Date(dateStr).getTime())
                / (365.25 * 24 * 60 * 60 * 1000));
            const make = _.get(mcsubmissionVM[index], makePath);
            const model = _.get(mcsubmissionVM[index], modelPath);
            const tmpCar = `${make} ${model}`;
            setcar(tmpCar);
            setDob(dateofBirth);
            setfoundAncillary(foundAncillary1);
        }
    }, [mcObj]);

    const addonHandler = (event, idx) => {
        invalidateImportantStuffPage();
        setinteraction(true);
        pabuttonHandle(event.target.value, idx, amount, registrationNumber, type);
    };

    const checkancillarymodalSelection = (type) => {
        let btn = '';
        if (ancillaryJourneyDataModel && ancillaryJourneyDataModel.personalAccident.length) {
            ancillaryJourneyDataModel.personalAccident.forEach((mc) => {
                if (mc.quoteID === mcObj.quoteID) {
                    if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
                        btn = 'yes';
                    } else if (foundAncillary && foundAncillary.length && foundAncillary[0].selected === false && mc.personalAccident) {
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
            {!allsameCover && (
                <>
                    <p>{index === 0 ? messages.levelscompareText : messages.levelscomparenextText}</p>
                    <Row className="mt-3 mt-md-4">
                        <Col className="px-mobile-0">
                            <HDQuoteTable
                                headerValues={[{
                                    topLabel: null,
                                    value: type === messages.tpft ? messages.thirdpartyText : messages.alreadyIncluded,
                                }, {
                                    topLabel: type === messages.tpft ? '' : messages.pageTitleBefore,
                                    value: messages.patext,
                                }]}
                                data={type ? getDataforTable(type) : []} />
                        </Col>
                    </Row>
                </>
            )}
            {!allsameCover && (
                <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                    {messages.ageWarning}
                </HDQuoteInfoRefactor>
            )}
            {!allsameCover && (
                <HDQuoteDownloadRefactor
                    linkText={messages.readDocumentMessage}
                    className="my-3 my-md-4"
                    onClick={handleDownloadFile}
                    onKeyDown={handleDownloadFile} />
            )}
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
                    { amount !== null && <HDLabelRefactor Tag="h2" text={amount} className="my-0" />}
                </Col>
            </Row>
            <HDToggleButtonGroup
                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                id="mc-personal-accident-cover-button-group"
                btnGroupClassName="grid grid--col-2 grid--col-lg-3 margin-top-md"
                btnClassName="theme-white"
                availableValues={availableValues}
                // eslint-disable-next-line no-nested-ternary
                value={checkancillarymodalSelection(messages.HD)}
                onChange={(e) => { addonHandler(e, index); }}
                disabled={dob >= messages.cutoffAge} />
            {dob >= messages.cutoffAge && (
                <HDQuoteInfoRefactor>
                    <span>{messages.aboveeighty(messages.cutoffAge)}</span>
                </HDQuoteInfoRefactor>
            )}
        </>
    );
};

HDMCPersonalAccidentCarItem.propTypes = {
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
    allsameCover: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.shape({
        baseData: PropTypes.object,
        bindData: PropTypes.object,
        lobData: PropTypes.object,
        quoteData: PropTypes.object,
        isParentPolicy: PropTypes.string,
        quoteID: PropTypes.bool
    }).isRequired,
    index: PropTypes.number.isRequired,
    pabuttonHandle: PropTypes.func.isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({
        personalAccident: PropTypes.object
    }).isRequired,
    handleDownloadFile: PropTypes.func.isRequired,
};

export default HDMCPersonalAccidentCarItem;
