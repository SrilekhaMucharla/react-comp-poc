/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { HDLabelRefactor } from 'hastings-components';
import dayjs from 'dayjs';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import heLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential-oneline.svg';
import ydLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import hdLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct-oneline.svg';
import hpLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier-oneline.svg';
import * as messages from './HDSavingsPage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import warningSign from '../../../assets/images/icons/910_c_warning_circle_red.svg';
import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, HASTINGS_DIRECT, daysInAYear, QUOTE_DECLINE_ERROR_CODE
} from '../../../constant/const';
import { checkHastingsError } from '../../../common/submissionMappers/helpers';
import HDSavingsPageVRNSearch from './HDSavingsPageVRNSearch';
import formatRegNumber from '../../../common/formatRegNumber';
import { trackEvent } from '../../../web-analytics/trackData';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import { getDateFromParts } from '../../../common/dateHelpers';

const ICONS = {
    HE: heLogo,
    YD: ydLogo,
    HD: hdLogo,
    HP: hpLogo
};

const HDSavingsPageCard = ({
    carInfo, removeCarHandler, dontHaveRegHandler, firstNonRegQuoteID, showMulticarDiscount, pageMetadata, isPCWJourney
}) => {
    const multiQuoteId = useSelector((state) => state.wizardState.data.mcsubmissionVM.mpwrapperNumber.value);
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const chosenQuotePath = 'bindData.chosenQuote.value';
    const regNumber = _.get(carInfo, `${vehiclePath}.registrationsNumber.value`);
    const carMake = _.get(carInfo, `${vehiclePath}.make.value`);
    let carModel = _.get(carInfo, `${vehiclePath}.model.value`);
    carModel = carModel.split(' ');
    carModel = `${carModel[0]} ${carModel[1]}`;
    const carName = `${carMake} ${carModel}`;

    const getHDQuote = () => {
        let hdQuote;
        const chosenQuoteID = _.get(carInfo, chosenQuotePath, null) || null;
        if (carInfo && carInfo.value && carInfo.value.quoteData && carInfo.value.quoteData.offeredQuotes && chosenQuoteID) {
            hdQuote = carInfo.value.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
        } else {
            carInfo.value.quoteData.offeredQuotes.map((offeredQuote) => {
                if (offeredQuote.branchCode === HASTINGS_DIRECT) {
                    hdQuote = offeredQuote;
                }
                return null;
            });
        }

        return hdQuote;
    };

    const getBrandImage = () => {
        let image = 'HD';
        const chosenQuoteID = _.get(carInfo, chosenQuotePath, null) || null;
        if (carInfo && carInfo.value && carInfo.value.quoteData && carInfo.value.quoteData.offeredQuotes && chosenQuoteID) {
            image = carInfo.value.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID).branchCode;
        }
        return ICONS[image];
    };
    const getDaysInsured = () => {
        const startDateString = dayjs(getDateFromParts(_.get(carInfo, 'value.baseData.periodStartDate')));
        const endDateString = dayjs(getDateFromParts(_.get(carInfo, 'value.baseData.periodEndDate')));
        const dateDiff = endDateString.diff(startDateString, 'day') + 1;
        return dateDiff;
    };

    const priceValues = {
        originalPrice: _.get(getHDQuote(), 'hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0),
        multiCarDiscount: Math.abs(carInfo.value.projectedMPDiscount),
        newPrice: 0,
        arrangementFee: _.get(getHDQuote(), 'hastingsPremium.annuallyPayment.arrangementFee.amount', 0),
    };

    const priceValuesOriginalPriceInt = parseFloat(priceValues.originalPrice);
    const priceValuesArrangementFeeInt = parseFloat(priceValues.arrangementFee);


    const priceValuesforayear = {
        originalPrice: ((((priceValuesOriginalPriceInt - priceValuesArrangementFeeInt) / getDaysInsured()) * 365) + priceValuesArrangementFeeInt),
        multiCarDiscount: Math.abs(((priceValues.multiCarDiscount / getDaysInsured()) * 365)),
        newPrice: 0
    };


    priceValues.newPrice = priceValuesOriginalPriceInt - priceValues.multiCarDiscount;
    priceValuesforayear.newPrice = priceValuesforayear.originalPrice - priceValuesforayear.multiCarDiscount;

    // For checking of hastings error
    const checkHastingsErrorMessage = (quote) => {
        const errorObjectFromHelper = checkHastingsError(quote);
        const errorObject = { errorMessage: null };
        if (errorObjectFromHelper.errorCode) {
            if (errorObjectFromHelper.errorCode === UW_ERROR_CODE) { errorObject.errorMessage = messages.uwErrorMessage; }
            if (errorObjectFromHelper.errorCode === GREY_LIST_ERROR_CODE) { errorObject.errorMessage = messages.greyListErrorMessage; }
            if (errorObjectFromHelper.errorCode === CUE_ERROR_CODE) { errorObject.errorMessage = messages.cueErrorMessage(multiQuoteId); }
            if (errorObjectFromHelper.errorCode === QUOTE_DECLINE_ERROR_CODE) { errorObject.errorMessage = messages.quoteUnavailable; }
            if (errorObjectFromHelper.errorCode === 'quoteUnavailable') { errorObject.errorMessage = messages.quoteUnavailable; }
        }
        return errorObject;
    };

    const enterRegNumber = () => {
        return <HDSavingsPageVRNSearch carInfo={carInfo} dontHaveRegHandler={dontHaveRegHandler} firstNonRegQuoteID={firstNonRegQuoteID} />;
    };

    const getPriceRow = () => {
        if (priceValues.multiCarDiscount >= 1 && showMulticarDiscount) {
            return (
                <table className="car-info-card__price-table">
                    <thead className="car-info-card__price-table__head">
                        <tr className="car-info-card__price-table__head__row">
                            <th className="car-info-card__price-table__head__row__th">{messages.originalPrice}</th>
                            <th className="car-info-card__price-table__head__row__th">{messages.multiCarDiscount}</th>
                            <th className="car-info-card__price-table__head__row__th">{messages.newPrice}</th>
                        </tr>
                    </thead>
                    <tbody className="car-info-card__price-table__body">
                        <tr className="car-info-card__price-table__body__row">
                            <td className="car-info-card__price-table__body__row__td car-info-card__price-table__body__row__td--original-price">
                                <div className="price-text-striked">
                                    £
                                    {getAmountAsTwoDecimalDigit(priceValuesOriginalPriceInt)}
                                </div>
                            </td>
                            <td className="car-info-card__price-table__body__row__td">
                                £
                                {getAmountAsTwoDecimalDigit(priceValues.multiCarDiscount)}
                            </td>
                            <td className="car-info-card__price-table__body__row__td">
                                £
                                {getAmountAsTwoDecimalDigit(priceValues.newPrice)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
        return (
            <table className="car-info-card__price-table">
                <thead className="car-info-card__price-table__head">
                    <tr className="car-info-card__price-table__head__row">
                        <th className="car-info-card__price-table__head__row__th">{messages.originalPrice}</th>
                    </tr>
                </thead>
                <tbody className="car-info-card__price-table__body">
                    <tr className="car-info-card__price-table__body__row">
                        <td className="car-info-card__price-table__body__row__td">
                            £
                            {getAmountAsTwoDecimalDigit(priceValuesOriginalPriceInt)}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const renderOverlayContent = () => {
        return (
            <div className="overlay-wrapper">
                {/* <p>{overlayHeaderContent}</p> */}
                <div className="overlay-wrapper-head">
                    <div className="left-pannel overlay-wrapper-left-col">365 days</div>
                    <div className="right-pannel overlay-wrapper-right-col">
                        <div className="ledgendtext">Your cover</div>
                        {`${getDaysInsured()} days `}
                    </div>
                </div>
                <div className="overlay-wrapper-body">
                    <div className="overlay-wrapper-body-row">
                        <div className="ledgendtext">Original price</div>
                        <div className="left-pannel overlay-wrapper-left-col">
                            <span className="strikethrough">
                                £
                                {/* Quoted short term premium */}
                                {getAmountAsTwoDecimalDigit(priceValuesforayear.originalPrice)}
                            </span>
                        </div>
                        <div className="right-pannel overlay-wrapper-right-col">
                            <span className="strikethrough">
                                £
                                {getAmountAsTwoDecimalDigit(priceValuesOriginalPriceInt)}
                            </span>
                        </div>
                    </div>
                    <div className="overlay-wrapper-body-row">
                        <div className="ledgendtext">Multi Car discount</div>
                        <div className="left-pannel overlay-wrapper-left-col">
                            £
                            {getAmountAsTwoDecimalDigit(priceValuesforayear.multiCarDiscount)}
                        </div>
                        <div className="right-pannel overlay-wrapper-right-col">
                            £
                            {getAmountAsTwoDecimalDigit(priceValues.multiCarDiscount)}
                        </div>
                    </div>
                    <div className="overlay-wrapper-body-row">
                        <div className="ledgendtext">New price</div>
                        <div className="left-pannel overlay-wrapper-left-col">
                            £
                            {getAmountAsTwoDecimalDigit(priceValuesforayear.newPrice)}
                        </div>
                        <div className="right-pannel overlay-wrapper-right-col">
                            £
                            {getAmountAsTwoDecimalDigit(priceValues.newPrice)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getQuoteContainer = () => {
        const errorObject = checkHastingsErrorMessage(carInfo.value);
        if (!errorObject.errorMessage) {
            return (
                <Col xs={12} md={6} className="car-info-card__body__car-quote-section">
                    <Row className="margin-bottom-tiny align-items-center">
                        <Col className="col-super-small-auto pr-1">
                            <HDLabelRefactor
                                Tag="h5"
                                text={(
                                    <>
                                        <span>{`${getDaysInsured()} days `}</span>
                                        <span className="font-regular">of cover</span>
                                    </>
                                )}
                                className="mb-0" />
                        </Col>
                        {!carInfo.value.isParentPolicy && getDaysInsured() < daysInAYear
                        && (
                            <Col className="pl-0 text-right">
                                <HDOverlayPopup
                                    webAnalyticsEvent={{ event_action: messages.seeDaysToCompareOverlayHeadings }}
                                    webAnalyticsView={{ ...pageMetadata, page_section: messages.seeDaysToCompare }}
                                    id="cover__details-payment-breakdown-overlay"
                                    labelText={messages.seeDaysToCompareOverlayHeadings}
                                    overlayButtonsClassName="btn--link"
                                    overlayButtonIcon={(
                                        <HDLabelRefactor
                                            Tag="span"
                                            text={messages.seeDaysToCompare}
                                            className="car-info-card__body__more-info"
                                            icon={<img src={infoCircleBlue} alt="info_circle" />}
                                            iconPosition="r" />
                                    )}
                                >
                                    {renderOverlayContent()}
                                </HDOverlayPopup>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col>
                            {getPriceRow()}
                        </Col>
                    </Row>
                </Col>
            );
        }
        return (
            <Col xs={12} md={6} className="car-info-card__body__no-quote-section">
                <HDLabelRefactor id="car-info-card-no-quote-section-id" Tag="span" text={errorObject.errorMessage} className="text-white font-demi-bold" />
            </Col>
        );
    };

    const removeCarMethod = () => {
        trackEvent({
            event_value: messages.removeCar,
            event_action: `${messages.savings} - ${messages.removeCar}`,
            event_type: 'link_click',
            element_id: 'car-info-card-remove-car-btn',
        });
        removeCarHandler(carInfo.value.quoteID);
    };

    const getRemoveCarLink = () => {
        if (carInfo.value.isParentPolicy) {
            return null;
        }
        return (
            <HDLabelRefactor
                id="car-info-card-remove-car-btn"
                Tag="span"
                text={messages.removeCar}
                className="car-info-card__header__remove-car"
                onClick={removeCarMethod}
                onKeyDown={removeCarMethod} />
        );
    };

    return (
        <Container className="car-info-card">
            <Row>
                <Col xs={12} className="car-info-card__header pl-3">
                    {regNumber ? <HDLabelRefactor Tag="span" text={formatRegNumber(regNumber)} className="car-info-card__header__reg-number" />
                        : <HDLabelRefactor Tag="span" text={carName.toLowerCase()} className="car-info-card__header__car-name font-bold" />}
                    {getRemoveCarLink()}
                    {checkHastingsErrorMessage(carInfo.value).errorMessage
                        && (
                            <div className="car-info-card__header__warning-container">
                                <img src={warningSign} className="car-info-card__header__warning-sign" alt="Warning Img" />
                            </div>
                        )}
                </Col>
            </Row>
            <Row className="car-info-body car-info-card__body">
                <Col xs={12} md={6} className="car-info-card__body__car-name-section">
                    <HDLabelRefactor Tag="h5" text={carName.toLowerCase()} className="text-capitalize" />
                    <HDLabelRefactor
                        Tag="p"
                        text={(carInfo.value.isParentPolicy && isPCWJourney) ? messages.selectedCover : messages.ifYouSelect}
                        className="text-small mb-1 margin-top-tiny" />
                    <img className="car-info-card__body__hd-logo" src={getBrandImage()} alt="Hastings Direct" />
                </Col>
                {getQuoteContainer()}
            </Row>
            {!regNumber && enterRegNumber()}
        </Container>
    );
};

HDSavingsPageCard.propTypes = {
    carInfo: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    removeCarHandler: PropTypes.func,
    dontHaveRegHandler: PropTypes.func,
    firstNonRegQuoteID: PropTypes.number,
    showMulticarDiscount: PropTypes.bool,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    isPCWJourney: PropTypes.bool.isRequired,
};

HDSavingsPageCard.defaultProps = {
    removeCarHandler: null,
    dontHaveRegHandler: null,
    firstNonRegQuoteID: null,
    showMulticarDiscount: true,
};

export default HDSavingsPageCard;
