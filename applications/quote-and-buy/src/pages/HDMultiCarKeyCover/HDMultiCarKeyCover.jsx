import React, { useState } from 'react';
import {
    HDQuoteTable, HDLabel, HDToggleButtonGroup, HDToast, HDQuoteDownload, HDButton
} from 'hastings-components';
import './HDMultiCarKeyCover.scss';
import * as messages from './HDMultiCarKeyCover.messages';

const HDMultiCarKeyCover = () => {
    const [keyCoverReimbursementAmount, setKeyCoverReimbursementAmount] = useState(0);
    const [keyCoverExpense, setKeyCoverExpense] = useState(0);
    const [selectedValue, setSelectedValue] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const updateCoverage = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleClickContinue = () => {
        return true;
    };

    return (
        <div className="key-cover-mc">
            <div className="mobile-padding">
                <HDLabel
                    icon={<div className="key-icon " />}
                    size="lg"
                    iconPosition="r"
                    text={(
                        <p className="key-cover-text">
                            <span className="key-cover-title">{messages.keyCoverHeading}</span>
                        </p>
                    )} />
                <p className="key-cover-paragrap">
                    {messages.keyCoverLabelText}
                </p>
                <p className="key-cover-paragraph">
                    <span>{messages.tableDescription}</span>
                </p>
            </div>
            <div className="key-cover-table">
                <HDQuoteTable
                    data={[
                        { name: messages.reimbursementLimit1, values: [keyCoverReimbursementAmount, '£1,500'] },
                        { name: messages.reimbursementLimit2, values: [keyCoverReimbursementAmount, '£1,500'] },
                        { name: messages.typeOfKey, values: ['Car only', 'All Keys'] },
                        { name: messages.stolenKeyCover, values: [true, false] },
                        { name: messages.lostKeyCover, values: [true, false] },
                        { name: messages.brokenInLockCover, values: [true, false] },
                        { name: messages.noExcess, values: [true, false] },
                        { name: messages.fullFamilyCover, values: [true, false] }
                    ]}
                    headerValues={[{
                        value: messages.columnOneHeader,
                    }, {
                        topLabel: messages.keyCoverPrefix,
                        value: messages.keyCoverHeading,
                    }]} />
            </div>
            <div className="mobile-padding">
                <div className="key-cover-details">
                    <p>{messages.damagedOutsideLock}</p>
                    <p>{messages.reportToPolice}</p>
                </div>
                <HDQuoteDownload linkText={messages.documentLink} />
                <HDLabel
                    size="lg"
                    text={(<span className="key-cover-question">{messages.needKeyProtection(keyCoverExpense || messages.keyCoverAmount)}</span>)} />
                <div className="key-cover-card key-cover-info-card">
                    <div className="key-cover-icon key-cover-info-icon" />
                    <p className="key-cover-paragraph key-cover-info-paragraph">
                        <span>{messages.needKeyProtectionInfo}</span>
                    </p>
                </div>
                <div className="select-key-cover">
                    <HDToggleButtonGroup
                        name="keyCoverSelection"
                        availableValues={availableValues}
                        value={selectedValue}
                        onChange={updateCoverage} />
                </div>
                {(selectedValue === messages.trueString || selectedValue === messages.falseString) && (
                    <div className="substitute-navigation">
                        <HDButton
                            size="lg"
                            disabled={false}
                            label="Continue"
                            onClick={handleClickContinue} />
                    </div>
                )}

                <div className="key-cover-card key-cover-message-card">
                    <div className="key-cover-icon key-cover-message-icon" />
                    <p className="key-cover-paragraph key-cover-message-paragraph">
                        <span>{messages.keyCoverFooterMessage}</span>
                    </p>
                </div>
                <div className="footer-key-cover" />
            </div>
            <HDToast onClose={() => setShowPopup(false)} show={showPopup} delay={3000}>
                <div className="popup-card">
                    <div className={`popup-icon ${selectedValue === messages.trueString ? 'popup-icon-added' : 'popup-icon-removed'}`} />
                    <p className="popup-message">
                        {selectedValue === 'true'
                            ? messages.popupMessage(keyCoverExpense || messages.keyCoverAmount)
                            : messages.removedPopupMessage}
                    </p>
                </div>
            </HDToast>
        </div>
    );
};

export default HDMultiCarKeyCover;
