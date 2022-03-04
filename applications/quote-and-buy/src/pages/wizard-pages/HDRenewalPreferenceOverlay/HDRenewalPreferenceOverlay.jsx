import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HDInfoCardRefactor } from 'hastings-components';
import {
    AnalyticsHDDropdownList as HDDropdownList
} from '../../../web-analytics';
import * as messages from './HDRenewalPreferenceOverlay.messages';
import * as helper from './HDRenewalPreferenceHelper';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';


const HDRenewalPreference = ({
    apiFailure, onOptOutReasonSelect, otherReasonValidated, headerText, isMultiCar
}) => {
    const [optOutReasonValue, setOutOutReasonValue] = useState();
    const [optOutReasonCode, setOutOutReasonCode] = useState();
    const optingOutFieldName = 'Optingout';
    const optOutDropdownList = helper.optOutReasonList;
    const enterReason = 'Enter reason';


    const selectOptOutReason = (event) => {
        const data = event.target.value;
        onOptOutReasonSelect(data.value);
        setOutOutReasonValue(data);
        setOutOutReasonCode(data.value);
    };

    const setOtherReason = (event) => {
        if (event && event.target.value.length > 0) {
            otherReasonValidated('true');
        } else {
            otherReasonValidated('false');
        }
    };

    const getInfoTipText = () => {
        switch (optOutReasonCode) {
            case '01':
                return [messages.infoTipTextR1];

            case '02':
                return [messages.infoTipTextR2];

            case '03':
                return [messages.infoTipTextR3];

            default:
                return [messages.infoTipTextR1];
        }
    };

    const dropDownLabel = { text: messages.optingOutReason, Tag: 'h5' };
    return (
        <div>
            <div>
                <div className="mb-3">
                    {messages.optingOutTextOne(headerText)}
                </div>
                <div className="mb-3">
                    {messages.optingOuttextTwo(!isMultiCar ? messages.yourPolicy : '')}
                </div>
                <div className="mb-3">
                    <div className="mb-3">
                        {messages.factsText}
                    </div>
                    <ul className="mb-3">
                        <li>
                            {messages.factsTextOne}
                        </li>
                        <li>
                            {messages.factsTexttwo}
                        </li>
                        <li>
                            {messages.factsTextThree}
                        </li>
                        <li>
                            {messages.factsTextFour}
                        </li>
                    </ul>
                </div>
                <hr className="renewal-preference-hr-line" />
            </div>

            <div>
                <HDDropdownList
                    selectSize="lg"
                    path={optingOutFieldName}
                    name={optingOutFieldName}
                    id="car-location-where-parking-loc"
                    className="capitalized-first-letter"
                    label={dropDownLabel}
                    options={optOutDropdownList}
                    value={optOutReasonValue}
                    onChange={selectOptOutReason} />
            </div>
            {apiFailure && (
                <div className="invalid-response">
                    {messages.errorMsg}
                </div>
            )}
            {(optOutReasonValue && optOutReasonCode !== '04' && !apiFailure) && (
                <div className="info-tip-renewal-prefrence">
                    <HDInfoCardRefactor
                        id="car-worth-info-card"
                        className="car-worth__info-card"
                        image={tipCirclePurple}
                        theme="light"
                        size="thin"
                        paragraphs={getInfoTipText()} />

                </div>
            )}
            {(optOutReasonValue && optOutReasonCode === '04') && (
                <div>
                    <textarea
                        id="optout"
                        className="reasonlist-Comment-section info-tip-renewal-prefrence"
                        name="optout"
                        placeholder={enterReason}
                        maxLength="128"
                        onChange={setOtherReason} />

                    <div className="info-tip-renewal-prefrence">{messages.otherCommentReason}</div>
                </div>
            )}
            <div />

        </div>
    );
};

HDRenewalPreference.propTypes = {
    apiFailure: PropTypes.bool.isRequired,
    onOptOutReasonSelect: PropTypes.func.isRequired,
    otherReasonValidated: PropTypes.func.isRequired,
    headerText: PropTypes.string.isRequired,
    isMultiCar: PropTypes.bool.isRequired
};

export default HDRenewalPreference;
