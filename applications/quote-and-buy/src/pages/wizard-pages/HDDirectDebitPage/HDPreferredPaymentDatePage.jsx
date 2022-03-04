/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    HastingsPaymentService,
} from 'hastings-capability-payment';
import { HDLabelRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDModal as HDModal,
} from '../../../web-analytics';
import { setNavigation } from '../../../redux-thunk/actions';
import * as messages from './HDPreferredPaymentDatePage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import HDPreferredPaymentTable from './HDPreferredPaymentTable';
import useLoader from '../../Controls/Loader/useFullscreenLoader';

const HDPreferredPaymentDatePage = (props) => {
    const {
        updateDDIVM,
        onFormValidation,
        pageMetadata
    } = props;
    const dispatch = useDispatch();
    const [HDLoader, showLoader, hideLoader] = useLoader();
    const [, setError] = useState(null);
    const [showPaymentError, setPaymentError] = useState(null);
    const [paymentSchedule, setPaymentSchedule] = useState([]);
    const [showPaymentScheduleModal, setShowPaymentScheduleModal] = useState(false);
    const [viewDetailsClicked, setViewDetailsClicked] = useState([]);
    const paymentDay = useSelector((state) => state.wizardState.app.paymentDay);

    const preferredPaymentApiCall = (val) => {
        const { sessionUUID, quoteID } = updateDDIVM;
        const formData = { preferredPaymentDate: val };
        const dto = {
            sessionUUID,
            quoteId: quoteID,
            preferredPaymentDay: val
        };
        showLoader();
        HastingsPaymentService.fetchPaymentDetails(dto)
            .then(({ result: paymentScheduleValue }) => {
                setPaymentSchedule(paymentScheduleValue);
                // Success : HDThanksPage : push to show the monthly payment schedule
                dispatch(setNavigation({
                    scPaymentSchedule: paymentScheduleValue
                }));
                onFormValidation({ formName: 'preferredPaymentDate', value: true, dataForUpdate: formData });
            })
            .catch(() => {
                // Error : HDThanksPage : push to show the monthly payment schedule
                dispatch(setNavigation({
                    scPaymentSchedule: []
                }));
                setError(messages.errorMessage);
                onFormValidation({ formName: 'preferredPaymentDate', value: false, dataForUpdate: formData });
            }).finally(() => {
                hideLoader();
            });
    };

    useEffect(() => {
        setViewDetailsClicked(false);
        if (paymentDay) {
            preferredPaymentApiCall(paymentDay.value);
        }
    }, []);

    const tooltipOverlay = () => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.paymentDatePlaceholder }}
            webAnalyticsEvent={{ event_action: messages.paymentDatePlaceholder }}
            id="preffered-payment-date"
            showButtons={false}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <div className="preferred-payment-date__payment-date-overlay">
                <h4 className="mb-4">{ messages.paymentDatePlaceholder}</h4>
                <p>{messages.overlayBodyOne}</p>
                <p>{messages.overlayBodyTwo}</p>
                <p>{messages.overlayBodyThree}</p>
            </div>
        </HDOverlayPopup>
    );

    const handlePaymentChange = (e) => {
        const data = {};
        data.label = e.target.value.value;
        data.value = e.target.value.value;
        const formData = { preferredPaymentDate: data.value };
        onFormValidation({ formName: 'preferredPaymentDate', value: false, dataForUpdate: formData });
        dispatch(setNavigation({
            paymentDay: data
        }));
        setPaymentError(false);
        preferredPaymentApiCall(e.target.value.value);
    };

    const closeModificationPopup = () => {
        setShowPaymentScheduleModal(false);
    };

    const showPaymentSchedule = () => {
        if (paymentDay && paymentDay.length < 1) {
            setPaymentError(true);
        } else {
            setShowPaymentScheduleModal(true);
        }
        setViewDetailsClicked(true);
    };

    const daysList = useMemo(() => _.range(1, 32).map((val) => ({
        value: val.toString(),
        label: val.toString()
    })), []);

    return (
        <Row className="preferred-payment-date theme-white">
            <Col>
                <Row className="mb-3">
                    <Col xs={12} md={9} className="pr-md-5">
                        <HDLabelRefactor
                            Tag="h5"
                            infoCircleBlue
                            iconPosition="r"
                            icon={tooltipOverlay()}
                            text={messages.paymentDatePlaceholder} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={9} className="pr-md-5">
                        <HDDropdownList
                            webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.paymentDatePlaceholder }}
                            id="payment-date-dropdown"
                            path="monthListPath"
                            name="monthList"
                            placeholder={messages.payemntDate}
                            options={daysList}
                            data={paymentDay || {}}
                            onChange={(e) => handlePaymentChange(e)} />
                        {(showPaymentError && viewDetailsClicked) && (
                            <div className="invalid-field mb-0">
                                <div className="message">{messages.paymentError}</div>
                            </div>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            Tag="a"
                            text={messages.paymentDateText}
                            className="preferred-payment-date__view-details"
                            onClick={showPaymentSchedule} />
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.summary} - ${messages.modalHeaderText}` }}
                            webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.modalHeaderText}` }}
                            id="monthly-payments-modal"
                            show={showPaymentScheduleModal}
                            customStyle={messages.wide}
                            headerText={messages.modalHeaderText}
                            onClose={closeModificationPopup}
                            hideFooter
                        >
                            <HDPreferredPaymentTable paymentList={paymentSchedule} />
                        </HDModal>
                    </Col>
                </Row>
            </Col>
            {HDLoader}
        </Row>
    );
};


HDPreferredPaymentDatePage.propTypes = {
    updateDDIVM: PropTypes.shape({ value: PropTypes.object.isRequired, sessionUUID: PropTypes.number, quoteID: PropTypes.number }).isRequired,
    onFormValidation: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};
HDPreferredPaymentDatePage.defaultProps = {
    onFormValidation: () => {}
};

export default HDPreferredPaymentDatePage;
