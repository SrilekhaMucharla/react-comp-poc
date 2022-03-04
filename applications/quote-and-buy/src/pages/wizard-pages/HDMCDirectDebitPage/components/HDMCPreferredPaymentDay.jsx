import { HDLabelRefactor } from 'hastings-components';
import React from 'react';
import PropTypes from 'prop-types';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDDropdownList as HDDropdownList
} from '../../../../web-analytics';
import HDMCPreferredPaymentTable from './HDMCPreferredPaymentTable';
import infoCircleBlue from '../../../../assets/images/icons/Darkicons_desktopinfo.svg';
import * as messages from './HDMCPreferredPaymentDay.messages';
import {
    getDropdownOptionsRec, getMcPaymentList
} from '../_helpers_';
import { mcSubmissionPropTypes, paymentSchedulePropTypes, pageMetadataPropTypes } from '../../../../constant/propTypes';

const HDMCPreferredPaymentDay = ({
    paymentScheduleModel,
    paymentDay,
    error,
    mcSubmissionVM,
    setParentError,
    setParentNavigation,
    callFetchPaymentSchedule,
    pageMetadata
}) => {
    const handlePaymentDateChange = (e) => {
        setParentError({});

        if (e.target.value === paymentDay) {
            return;
        }

        setParentNavigation({ paymentDay: e.target.value });
        callFetchPaymentSchedule(e.target.value.value);
    };

    const handleViewPaymentDatesClick = (e) => {
        if (!paymentDay) {
            e.stopPropagation();
            setParentError((errorState) => ({ ...errorState, noPaymentDay: { message: messages.noPreferredPaymentDateError } }));
            return;
        }
    };
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <HDLabelRefactor
                    className="mt-0 mb-3"
                    Tag="h5"
                    text={messages.paymentDatePlaceholder} />
                <HDOverlayPopup
                    id="mc-dd-preferred-payment-date"
                    webAnalyticsView={{ ...pageMetadata, page_section: messages.paymentDatePlaceholder }}
                    webAnalyticsEvent={{ event_action: messages.paymentDatePlaceholder }}
                    showButtons={false}
                    labelText={messages.paymentDatePlaceholder}
                    overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
                >
                    <div className="preferred-payment-date__payment-date-overlay">
                        <p>{messages.overlayBodyOne}</p>
                        <p>{messages.overlayBodyTwo}</p>
                        <p>{messages.overlayBodyThree}</p>
                    </div>
                </HDOverlayPopup>
            </div>
            <HDDropdownList
                webAnalyticsView={{ ...pageMetadata, event_action: messages.paymentDatePlaceholder }}
                webAnalyticsEvent={{ event_action: messages.paymentDatePlaceholder }}
                id="mc-dd-preferred-payment-day"
                name="preferredPaymentDay"
                placeholder={messages.paymentDate}
                options={getDropdownOptionsRec()}
                data={paymentDay}
                // as per UI team -> these styles do not exist for dropdown (both MC na SC)
                // this requirement is therefore out of the scope, but leaving logic
                className={`mb-3 ${error.missingField ? 'drop-down-list__wrapper--error' : ''}`}
                onChange={(e) => handlePaymentDateChange(e)} />
            {error.noPaymentDay && (
                <div className="invalid-field mb-0">
                    <div className="message">{error.noPaymentDay.message}</div>
                </div>
            )}
            <HDOverlayPopup
                webAnalyticsView={{ ...pageMetadata, page_section: messages.paymentDateText }}
                webAnalyticsEvent={{ event_action: messages.paymentDateText }}
                className="my-3 theme-white"
                id="mc-dd-monthly-payments-overlay"
                showButtons={false}
                labelText="Monthly payments"
                overlayButtonIcon={(
                    <HDLabelRefactor
                        Tag="a"
                        onClick={(event) => {
                            handleViewPaymentDatesClick(event);
                        }}
                        className="decorated-blue-line decorated-blue-line--on-white"
                        text={messages.paymentDateText} />
                )}
            >
                <HDMCPreferredPaymentTable paymentList={getMcPaymentList(paymentScheduleModel.mcPaymentScheduleObject, mcSubmissionVM.value.quotes)} />
            </HDOverlayPopup>
        </>
    );
};

HDMCPreferredPaymentDay.propTypes = {
    paymentScheduleModel: PropTypes.shape(paymentSchedulePropTypes).isRequired,
    error: PropTypes.shape({
        missingField: PropTypes.shape({
            message: PropTypes.string
        }),
        noPaymentDay: PropTypes.shape({
            message: PropTypes.string
        }),
        promiseError: PropTypes.shape({
            message: PropTypes.string
        })
    }),
    mcSubmissionVM: PropTypes.shape(mcSubmissionPropTypes).isRequired,
    paymentDay: PropTypes.string.isRequired,
    setParentError: PropTypes.func.isRequired,
    setParentNavigation: PropTypes.func.isRequired,
    callFetchPaymentSchedule: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,

};

HDMCPreferredPaymentDay.defaultProps = {
    error: {}
};

export default HDMCPreferredPaymentDay;
