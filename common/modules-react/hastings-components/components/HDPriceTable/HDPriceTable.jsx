/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tab, Nav, Container } from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import _ from 'lodash';
import { HDQuoteInfoWarning } from 'hastings-components';
import HDQuoteInfoRefactor from '../HDQuoteInfoRefactor/HDQuoteInfoRefactor';
import * as messages from './HDPriceTable.messages';
import { getPriceWithCurrencySymbol } from '../../../../../applications/quote-and-buy/src/common/utils';
import { getDateFromParts } from '../../../../../applications/quote-and-buy/src/common/dateHelpers';
import HDMCMonthlyBreakdownHelper from '../../../../../applications/quote-and-buy/src/pages/wizard-pages/HDMCCustomizeQuoteSummaryPage/HDMCMonthlyBreakdownHelper/HDMCMonthlyBreakdownHelper';

const APR_KEY = 'APR_KEY';
const INTEREST_KEY = 'INTEREST_KEY';

const HDNavItem = ({
    children,
    eventKey,
    onSelectHandler,
    isArrowHidden
}) => {
    const navItemClassNames = classNames({
        'nav-link--arrow-hidden': isArrowHidden
    });

    return <Nav.Link eventKey={eventKey} className={navItemClassNames} onSelect={onSelectHandler}>{children}</Nav.Link>;
};

HDNavItem.propTypes = {
    eventKey: PropTypes.string.isRequired,
    onSelectHandler: PropTypes.func.isRequired,
    isArrowHidden: PropTypes.bool.isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
};

const HDNavTitle = ({ isLarge, children }) => {
    const titleClassNames = classNames(
        'nav-link__title',
        { 'nav-link__title--large': isLarge }
    );

    return <div className={titleClassNames}>{children}</div>;
};

HDNavTitle.propTypes = {
    isLarge: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
};

const HDNavPrice = ({
    isLarge, prices, isNoDd, children
}) => {
    const priceValueClassNames = classNames(
        'nav-link-price__value',
        { 'nav-link-price__value--large': isLarge }
    );

    return (
        <>
            {children}
            {prices.map((price, i) => (
                <div className="nav-link-price" data-testid="nav-price" key={i}>
                    {price.count > 0 && <span className="nav-link-price__count">{`${price.count} x `}</span>}
                    {price.count === 0 && <span className="nav-link-price__count">{`${price.count} x `}</span>}
                    <span className={priceValueClassNames}>{price.value}</span>
                    { isNoDd ? '' : <div className="pay-message">{price.payMessage}</div>}
                    <div className="nav-link-price__detail">
                        {price.detail && price.detail}
                    </div>
                </div>
            ))}
        </>
    );
};

HDNavPrice.propTypes = {
    prices: PropTypes.arrayOf(
        PropTypes.shape({
            count: PropTypes.number,
            value: PropTypes.string.isRequired,
            detail: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            payMessage: PropTypes.string
        })
    ).isRequired,
    isLarge: PropTypes.bool.isRequired,
    children: PropTypes.node,
    isNoDd: PropTypes.bool
};

HDNavPrice.defaultProps = {
    children: null,
    isNoDd: false
};

const HDNavLink = ({ isThick, onClickHandler, children }) => {
    const linkClassNames = classNames(
        'nav-link__link-underlined font-bold',
        { 'nav-link__link-underlined--thick': isThick }
    );

    return <div onClick={onClickHandler} className={linkClassNames}>{children}</div>;
};

HDNavLink.propTypes = {
    isThick: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClickHandler: PropTypes.func
};

HDNavLink.defaultProps = {
    onClickHandler: () => {}
};

const getNavLinkText = (type) => {
    if (type === 'annual') {
        return messages.priceTablePillLinkAnnual;
    }

    if (type === 'monthly') {
        return messages.priceTablePillLinkMonthly;
    }

    return messages.priceTablePillLinkAnnualNoMonthly;
};

const getDeferredText = (startDate, type) => {
    if (type === 'monthly') {
        return `Initial payment on ${startDate}`;
    }

    return `${messages.paymentOn} ${startDate}`;
};

const getQuoteCountText = (quoteCount) => (`${messages.priceTablePriceTotal1} ${quoteCount} ${messages.priceTablePriceTotal2}`);

const numberToWord = {
    1: 'one car',
    2: 'two cars',
    3: 'three cars',
    4: 'four cars',
    5: 'five cars'
};

const getDisplayProps = (quotes) => {
    return quotes.reduce((curr, next) => {
        const updatedProps = {
            isDirectDebitAvailable: curr.isDirectDebitAvailable && !!next.paymentCredit,
            isPaymentSummaryVisible: curr.isPaymentSummaryVisible || next.ancillaries.length > 0,
            isPillTitleLarge: quotes.length > 2 && !next.paymentCredit,
            isPillPriceLarge: quotes.length < 3,
            isQuoteCountVisible: quotes.length > 2
        };

        return { ...curr, ...updatedProps };
    }, {
        isDirectDebitAvailable: true,
        isPaymentSummaryVisible: false,
        isPillTitleLarge: false,
        isPillPriceLarge: false,
        isQuoteCountVisible: false,
    });
};

export default function HDPriceTable({
    quotes,
    paymentTypeSelectionHandler,
    userSelectedOption,
    multiCustomizeSubmissionVM,
    mcsubmissionVM,
    mcPaymentScheduleModel,
    paymentsBreakdown,
    whyMonthlyPaymentAvailablityHandler
}) {
    const {
        isDirectDebitAvailable,
        isPaymentSummaryVisible,
        isPillTitleLarge,
        isPillPriceLarge,
        isQuoteCountVisible
    } = getDisplayProps(quotes);

    const [isSummaryVisible, setIsSummaryVisible] = React.useState(isPaymentSummaryVisible);

    const quoteCount = quotes.length;
    const initialActiveKey = userSelectedOption ? 'price-table-monthly-tab' : 'price-table-annual-tab';
    const selectedRef = React.useRef(initialActiveKey);

    const handleNavSelected = (eventKey) => {
        if (selectedRef.current === eventKey) {
            setIsSummaryVisible(!isSummaryVisible);
            return;
        }
        if (eventKey === 'price-table-annual-tab') {
            paymentTypeSelectionHandler(false);
        } else {
            paymentTypeSelectionHandler(true);
        }

        setIsSummaryVisible(true);
        selectedRef.current = eventKey;
    };

    const onWhyMonthlyPaymentAvailablityHandler = () => {
        setIsSummaryVisible(true);
        whyMonthlyPaymentAvailablityHandler();
    };

    const getPCStartDate = () => {
        const pcStartDate = _.get(mcsubmissionVM.value.quotes[0], 'baseData.pccurrentDate', new Date());
        const pcStartDateObject = (pcStartDate) ? new Date(pcStartDate) : new Date();
        pcStartDateObject.setHours(0, 0, 0, 0);
        return pcStartDateObject;
    };

    const getParentQuoteID = () => {
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) { return mcsubmissionVM.value.quotes[i].quoteID; }
        }
        return '';
    };

    const checkTwoCarDefCaseFromDate = () => {
        let scndQuoteStartDate = null;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            if (customQuoteObj.quoteID !== getParentQuoteID()) {
                scndQuoteStartDate = customQuoteObj.periodStartDate;
            }
            return null;
        });
        const pcDate = dayjs(getPCStartDate());
        const scndStartDate = dayjs(`${_.get(scndQuoteStartDate, 'year')}-${1 + _.get(scndQuoteStartDate, 'month')}-${_.get(scndQuoteStartDate, 'day')}`);
        return scndStartDate.diff(pcDate, 'day') > 30;
    };

    const checkInitialPaymentStatus = (id) => {
        const startDateObject = mcsubmissionVM.value.quotes.find((q) => q.quoteID === id).baseData.periodStartDate;
        const pcDate = dayjs(getPCStartDate());
        const scndStartDate = dayjs(`${_.get(startDateObject, 'year')}-${1 + _.get(startDateObject, 'month')}-${_.get(startDateObject, 'day')}`);
        return scndStartDate.diff(pcDate, 'day') > 30;
    };

    const checkBreakdown = () => {
        let checkLengthOfpaymentSchedule = false;
        if (!mcPaymentScheduleModel.mcPaymentScheduleObject) { return checkLengthOfpaymentSchedule; }
        for (let i = 0; i < mcPaymentScheduleModel.mcPaymentScheduleObject.length; i++) {
            if (mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule.length < 2) {
                checkLengthOfpaymentSchedule = true;
                break;
            }
        }
        return checkLengthOfpaymentSchedule;
    };

    const checkTwoCarDefferedCase = () => {
        if (!mcPaymentScheduleModel.mcPaymentScheduleObject) {
            return checkTwoCarDefCaseFromDate();
        }
        if (mcPaymentScheduleModel.mcPaymentScheduleObject.length > 1) {
            return mcPaymentScheduleModel.mcPaymentScheduleObject[0].paymentSchedule.length
                !== mcPaymentScheduleModel.mcPaymentScheduleObject[1].paymentSchedule.length;
        }
        return false;
    };

    const getMonthlyCominedInitialInstalment = () => {
        let monthlyCominedInitialInstalment = 0;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            monthlyCominedInitialInstalment += customQuoteObj.quote.hastingsPremium.monthlyPayment.firstInstalment.amount;
            return null;
        });
        const currencyCode = multiCustomizeSubmissionVM.value.customQuotes[0].quote.hastingsPremium.monthlyPayment.firstInstalment.currency;
        return getPriceWithCurrencySymbol({ amount: monthlyCominedInitialInstalment, currency: currencyCode });
    };

    const getMonthlyCombinedInstalment = () => {
        let monthlyCombinedInstalment = 0;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            monthlyCombinedInstalment += customQuoteObj.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount;
            return null;
        });
        const currencyCode = multiCustomizeSubmissionVM.value.customQuotes[0].quote.hastingsPremium.monthlyPayment.firstInstalment.currency;
        return getPriceWithCurrencySymbol({ amount: monthlyCombinedInstalment, currency: currencyCode });
    };

    const getMonthlyAmount = () => {
        let monthlyAmount = 0;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            monthlyAmount += customQuoteObj.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount;
            return null;
        });
        const currencyCode = multiCustomizeSubmissionVM.value.customQuotes[0].quote.hastingsPremium.monthlyPayment.premiumAnnualCost.currency;
        return getPriceWithCurrencySymbol({ amount: monthlyAmount, currency: currencyCode });
    };

    const getMonthlyPremium = (carInstalments) => {
        const currencyCode = multiCustomizeSubmissionVM.value.customQuotes[0].quote.hastingsPremium.monthlyPayment.firstInstalment.currency;
        const quoteLength = multiCustomizeSubmissionVM.value.customQuotes.length;
        if (quoteLength < 3 && carInstalments) {
            let firstInitialPayment = 0;
            if (!checkTwoCarDefCaseFromDate()) {
                firstInitialPayment = carInstalments.parentCarInstalments.paymentSchedule[0].paymentAmount.amount
                    + carInstalments.childCarInstalments.paymentSchedule[0].paymentAmount.amount;
            } else {
                firstInitialPayment = carInstalments.parentCarInstalments.paymentSchedule[0].paymentAmount.amount;
            }
            const firstRowPrice = (_.get(carInstalments, 'parentCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)).toLocaleString('en',
                { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const scndRowPrice = (_.get(carInstalments, 'parentCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)
                + _.get(carInstalments, 'childCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)).toLocaleString('en',
                { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const scndInitialPayment = carInstalments.childCarInstalments.paymentSchedule[0].paymentAmount.amount;
            return [{
                count: carInstalments.parentCarInstalments.paymentSchedule.length - carInstalments.childCarInstalments.paymentSchedule.length,
                value: getPriceWithCurrencySymbol({ amount: firstRowPrice, currency: currencyCode }),
                detail: `+ ${getPriceWithCurrencySymbol({ amount: firstInitialPayment, currency: currencyCode })} initial payment`
            }, {
                count: carInstalments.childCarInstalments.paymentSchedule.length - 1,
                value: getPriceWithCurrencySymbol({ amount: scndRowPrice, currency: currencyCode }),
                detail: checkTwoCarDefCaseFromDate() ? `+ ${getPriceWithCurrencySymbol({ amount: scndInitialPayment, currency: currencyCode })} initial payment` : null
            }];
        }

        if (quoteLength < 3) {
            return [{
                count: 11,
                value: getMonthlyCombinedInstalment(),
                detail: `+ ${getMonthlyCominedInitialInstalment()} initial payment`
            }];
        }

        return [{
            count: null,
            value: getMonthlyAmount(),
            detail: null
        }];
    };

    const generateButtonBreakdownData = () => {
        const carInstalments = {
            parentCarInstalments: null,
            childCarInstalments: null
        };
        if (mcPaymentScheduleModel && mcPaymentScheduleModel.mcPaymentScheduleObject.length > 1) {
            if (mcPaymentScheduleModel.mcPaymentScheduleObject[0].paymentSchedule.length
                > mcPaymentScheduleModel.mcPaymentScheduleObject[1].paymentSchedule.length) {
                carInstalments.parentCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[0];
                carInstalments.childCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[1];
            } else {
                carInstalments.parentCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[1];
                carInstalments.childCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[0];
            }
        }
        return carInstalments;
    };

    const getMonthlyButtonContent = () => {
        if (multiCustomizeSubmissionVM.value.customQuotes.length > 2) {
            return (
                <HDNavItem
                    onSelectHandler={handleNavSelected}
                    eventKey="price-table-monthly-tab"
                    isArrowHidden={!isSummaryVisible}
                    data-testid="nav-monthly"
                >
                    <HDNavTitle isLarge>
                        {messages.priceTablePillTitleMonthly}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getMonthlyPremium()}>
                        {isQuoteCountVisible && <div className="nav-link__count">{getQuoteCountText(quoteCount)}</div>}
                    </HDNavPrice>
                    <HDNavLink isThick={isDirectDebitAvailable}>
                        {getNavLinkText('monthly')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        if (multiCustomizeSubmissionVM.value.customQuotes.length < 3 && checkTwoCarDefferedCase()) {
            const carInstalments = generateButtonBreakdownData();
            return (
                <HDNavItem
                    onSelectHandler={handleNavSelected}
                    eventKey="price-table-monthly-tab"
                    isArrowHidden={!isSummaryVisible}
                    data-testid="nav-monthly"
                >
                    <HDNavTitle>
                        {messages.priceTablePillTitleMonthly}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getMonthlyPremium(carInstalments)}>
                        {isQuoteCountVisible && <div className="nav-link__count">{getQuoteCountText(quoteCount)}</div>}
                    </HDNavPrice>
                    <HDNavLink isThick={isDirectDebitAvailable}>
                        {getNavLinkText('monthly')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        if (multiCustomizeSubmissionVM.value.customQuotes.length < 3 && !checkTwoCarDefferedCase()) {
            return (
                <HDNavItem
                    onSelectHandler={handleNavSelected}
                    eventKey="price-table-monthly-tab"
                    isArrowHidden={!isSummaryVisible}
                    data-testid="nav-monthly"
                >
                    <HDNavTitle isLarge={isPillTitleLarge}>
                        {messages.priceTablePillTitleMonthly}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getMonthlyPremium()}>
                        {isQuoteCountVisible && <div className="nav-link__count">{getQuoteCountText(quoteCount)}</div>}
                    </HDNavPrice>
                    <HDNavLink isThick={isDirectDebitAvailable}>
                        {getNavLinkText('monthly')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        return null;
    };

    const getAnnualPremium = (annualAmount, parentAnnualAmount, childAnnualAmmount) => {
        const currencyCode = multiCustomizeSubmissionVM.value.customQuotes[0].quote.hastingsPremium.annuallyPayment.premiumAnnualCost.currency;
        if (parentAnnualAmount && childAnnualAmmount) {
            return [{
                count: 1,
                value: getPriceWithCurrencySymbol({ amount: parentAnnualAmount, currency: currencyCode }),
                payMessage: messages.payToday,
                detail: null
            }, {
                count: 1,
                value: getPriceWithCurrencySymbol({ amount: childAnnualAmmount, currency: currencyCode }),
                payMessage: messages.payLater,
                detail: null
            }];
        }
        return [{
            count: null,
            value: getPriceWithCurrencySymbol({ amount: annualAmount, currency: currencyCode }),
            detail: null,
            payMessage: ''
        }];
    };

    const getAnnualAmount = () => {
        let annualAmount = 0;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            annualAmount += customQuoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
            return null;
        });
        return annualAmount;
    };

    const getAnnuallyButtonContent = () => {
        if (multiCustomizeSubmissionVM.value.customQuotes.length > 2) {
            const annualAmount = getAnnualAmount();
            return (
                <HDNavItem onSelectHandler={isDirectDebitAvailable && handleNavSelected} eventKey="price-table-annual-tab" isArrowHidden={!isSummaryVisible} data-testid="nav-annual">
                    <HDNavTitle isLarge>
                        {messages.priceTablePillTitleAnnual}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getAnnualPremium(annualAmount)} isNoDd={isDirectDebitAvailable}>
                        {isQuoteCountVisible
                        && (
                            <div className="nav-link__count" data-testid="quote-count-text">
                                {getQuoteCountText(quoteCount)}
                            </div>
                        )}
                    </HDNavPrice>
                    <HDNavLink onClickHandler={isDirectDebitAvailable ? handleNavSelected : onWhyMonthlyPaymentAvailablityHandler} isThick={isDirectDebitAvailable} data-testid="nav-link">
                        {getNavLinkText(isDirectDebitAvailable ? 'annual' : 'noDd')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        if (multiCustomizeSubmissionVM.value.customQuotes.length < 3 && checkTwoCarDefCaseFromDate()) {
            let parentAnnualAmount;
            let childAnnualAmount;
            const parentQuoteID = getParentQuoteID();
            multiCustomizeSubmissionVM.value.customQuotes.map((quoteObject) => {
                if (quoteObject.quoteID === parentQuoteID) {
                    parentAnnualAmount = _.get(quoteObject, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', null);
                } else {
                    childAnnualAmount = _.get(quoteObject, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', null);
                }
                return null;
            });
            return (
                <HDNavItem onSelectHandler={isDirectDebitAvailable && handleNavSelected} eventKey="price-table-annual-tab" isArrowHidden={!isSummaryVisible} data-testid="nav-annual">
                    <HDNavTitle isLarge={isPillTitleLarge}>
                        {messages.priceTablePillTitleAnnual}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getAnnualPremium(null, parentAnnualAmount, childAnnualAmount)} isNoDd={isDirectDebitAvailable}>
                        {
                            isQuoteCountVisible && (
                                <div className="nav-link__count" data-testid="quote-count-text">
                                    {getQuoteCountText(quoteCount)}
                                </div>
                            )
                        }
                    </HDNavPrice>
                    <HDNavLink onClickHandler={isDirectDebitAvailable ? handleNavSelected : onWhyMonthlyPaymentAvailablityHandler} isThick={isDirectDebitAvailable} data-testid="nav-link">
                        {getNavLinkText(isDirectDebitAvailable ? 'annual' : 'noDd')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        if (multiCustomizeSubmissionVM.value.customQuotes.length < 3 && !checkTwoCarDefCaseFromDate()) {
            const annualAmount = getAnnualAmount();
            return (
                <HDNavItem onSelectHandler={isDirectDebitAvailable && handleNavSelected} eventKey="price-table-annual-tab" isArrowHidden={!isSummaryVisible} data-testid="nav-annual">
                    <HDNavTitle isLarge={isPillTitleLarge}>
                        {messages.priceTablePillTitleAnnual}
                    </HDNavTitle>
                    <HDNavPrice isLarge={isPillPriceLarge} prices={getAnnualPremium(annualAmount)} isNoDd={isDirectDebitAvailable}>
                        {isQuoteCountVisible && <div className="nav-link__count" data-testid="quote-count-text">{getQuoteCountText(quoteCount)}</div>}
                    </HDNavPrice>
                    <HDNavLink onClickHandler={isDirectDebitAvailable ? handleNavSelected : onWhyMonthlyPaymentAvailablityHandler} isThick={isDirectDebitAvailable} data-testid="nav-link">
                        {getNavLinkText(isDirectDebitAvailable ? 'annual' : 'noDd')}
                    </HDNavLink>
                </HDNavItem>
            );
        }
        return null;
    };
    // same number of instalments in payment schedule means all payments will be on the last car;
    const checkForSameDatePayments = (index) => {
        if (!mcPaymentScheduleModel.mcPaymentScheduleObject[index + 1]) return false;
        return mcPaymentScheduleModel.mcPaymentScheduleObject[index].paymentSchedule.length === mcPaymentScheduleModel.mcPaymentScheduleObject[index + 1].paymentSchedule.length;
    };

    const renderMonthlyBreakdown = (quote, index) => {
        const { id } = quote;
        const { futurePayments } = paymentsBreakdown.find((pd) => pd.quoteId === id);
        if (checkForSameDatePayments(index, id)) {
            return (<hr className="important-stuff__hr" />);
        }
        return (
            <div className="hd-price-table-content-row deferred-row">
                <div className="hd-price-table-content-row__column">
                    {`${futurePayments.followedBy} monthly payments for ${numberToWord[index + 1]}`}
                </div>
                <div className="hd-price-table-content-row__column">
                    {getPriceWithCurrencySymbol({ amount: futurePayments.amount, currency: futurePayments.currency })}
                </div>
            </div>
        );
    };

    const getDayMonthTwoDigit = (dayMonth) => {
        const dayMonthString = (`0${dayMonth}`).slice(-2);
        return dayMonthString;
    };

    const getMonthlyInitialAmount = (quote) => {
        const { id } = quote;
        const paymentScheduleData = mcPaymentScheduleModel.mcPaymentScheduleObject.find((pd) => pd.submissionID === id);
        return `£${_.get(paymentScheduleData, 'paymentSchedule[0].paymentAmount.amount', 0).toFixed(2)}`;
    };

    const getMonthlyPaymentDayStart = (quote) => {
        const { id } = quote;
        const paymentInfo = paymentsBreakdown.find((pb) => pb.quoteId === id);
        const { parentVehicle } = paymentInfo;
        if (parentVehicle) {
            return messages.initialPaymentToday;
        } if (!parentVehicle) {
            const pcStartDate = new Date(_.get(mcsubmissionVM.value.quotes[0], 'baseData.pccurrentDate'));
            pcStartDate.setHours(0, 0, 0, 0);
            const paymentScheduleData = mcPaymentScheduleModel.mcPaymentScheduleObject.find((pd) => pd.submissionID === id);
            const carInitialPaymentDate = new Date(
                `${1 + paymentScheduleData.paymentSchedule[0].paymentDate.month}/${paymentScheduleData.paymentSchedule[0].paymentDate.day}/${paymentScheduleData.paymentSchedule[0].paymentDate.year}`
            );
            if (pcStartDate.getTime() === carInitialPaymentDate.getTime()) {
                return messages.initialPaymentToday;
            }
            return `${messages.initialPaymentOn} ${getDayMonthTwoDigit(paymentScheduleData.paymentSchedule[0].paymentDate.day)}/${getDayMonthTwoDigit(1 + paymentScheduleData.paymentSchedule[0].paymentDate.month)}/${paymentScheduleData.paymentSchedule[0].paymentDate.year}`;
        }
        return messages.initialPaymentToday;
    };

    const getAnnualyPaymentDate = (quote) => {
        const { id } = quote;
        const quoteInfo = mcsubmissionVM.value.quotes.find((pb) => pb.quoteID === id);
        const { isParentPolicy } = quoteInfo;
        if (isParentPolicy) return messages.paymentToday;
        if (checkInitialPaymentStatus(id)) {
            const startDateObject = mcsubmissionVM.value.quotes.find((q) => q.quoteID === id).baseData.periodStartDate;
            const startDateDjs = dayjs(new Date(getDateFromParts(startDateObject)).setHours(0, 0, 0, 0));
            return `Payment on ${startDateDjs.subtract(7, 'd').format('DD/MM/YYYY')}`;
        }
        return messages.paymentToday;
    };

    const gettotalmonthlyPayment = () => {
        let totalpaymentAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            totalpaymentAmt += customQuote.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount;
        });
        return `£${totalpaymentAmt.toFixed(2)}`;
    };

    const gettotalannualPayment = () => {
        let totalpaymentAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            totalpaymentAmt += _.get(customQuote, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
        });
        return `£${totalpaymentAmt.toFixed(2)}`;
    };

    const gettotalmonthlyCredit = () => {
        let totalpaymentAmt = 0;
        let creditAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            totalpaymentAmt += _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            creditAmt += _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.totalAmountCredit', 0);
        });
        const creditDiff = totalpaymentAmt - creditAmt;
        return `£${creditDiff.toFixed(2)}`;
    };

    const gettotalmonthlybasePrice = () => {
        let totalpaymentAmt = 0;
        let creditAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            totalpaymentAmt += _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            creditAmt += _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.totalAmountCredit', 0);
        });
        const creditDiff = totalpaymentAmt - creditAmt;
        const priceDiff = totalpaymentAmt - creditDiff;
        return `£${priceDiff.toFixed(2)}`;
    };
    const getquoteAmount = (quote, type) => {
        let singlecarAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            if (quote.id === customQuote.quoteID && type === messages.annuallyText) {
                singlecarAmt = _.get(customQuote, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
            } else if (quote.id === customQuote.quoteID && type === messages.monthlyText) {
                singlecarAmt = _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            }
        });
        return `£${singlecarAmt.toFixed(2)}`;
    };

    const getstartDate = (quote, type) => {
        let startD = '';
        let startDTemp;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            if (quote.id === customQuote.quoteID) {
                startDTemp = _.get(customQuote, 'periodStartDate');
            }
        });
        if (startDTemp && startDTemp.year && startDTemp.month >= 0 && startDTemp.day) {
            startD = `${startDTemp.year}-${startDTemp.month + 1}-${startDTemp.day}`;
        }
        return dayjs(startD).format('DD/MM/YYYY');
    };

    const getAnnuallyPaymentAmount = (quote) => {
        let annualAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            if (quote.id === customQuote.quoteID) {
                annualAmt = _.get(customQuote, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
            }
        });
        return `£${annualAmt.toFixed(2)}`;
    };

    const getAprInterestRate = (rateKey) => {
        for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i += 1) {
            if (multiCustomizeSubmissionVM.value.customQuotes[i].quoteID === getParentQuoteID()) {
                if (rateKey === INTEREST_KEY) {
                    return _.get(multiCustomizeSubmissionVM.value.customQuotes[i], 'quote.hastingsPremium.monthlyPayment.rateOfInterest', 0);
                }
                return _.get(multiCustomizeSubmissionVM.value.customQuotes[i], 'quote.hastingsPremium.monthlyPayment.representativeAPR', 0);
            }
        }
        return 0;
    };

    return (
        <Container className="hd-price-table container--anc">
            <Tab.Container defaultActiveKey={initialActiveKey}>
                <Nav variant="pills">
                    {isDirectDebitAvailable && (
                        getMonthlyButtonContent()
                    )}
                    {getAnnuallyButtonContent()}
                </Nav>
                {isSummaryVisible && (
                    <Tab.Content className="hd-price-table-content" data-testid="payment-summary">
                        {isDirectDebitAvailable && (
                            <Tab.Pane eventKey="price-table-monthly-tab">
                                <>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">
                                            {getQuoteCountText(quoteCount)}
                                        </div>
                                        <div className="hd-price-table-content-row__column font-bold">
                                            <b>{gettotalmonthlybasePrice()}</b>
                                        </div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">
                                            {messages.priceTableTotalCreditCharge}
                                        </div>
                                        <div className="hd-price-table-content-row__column">
                                            <b>{gettotalmonthlyCredit()}</b>
                                        </div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">
                                            <b>{messages.priceTableTotalAmountPayable}</b>
                                        </div>
                                        <div className="hd-price-table-content-row__column">
                                            <b>{gettotalmonthlyPayment()}</b>
                                        </div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column hd-price-table-content-row__column--info-text">
                                            {`${messages.priceTableTotalAmountApr} ${getAprInterestRate(APR_KEY)}%
                                    ${messages.priceTableTotalAmountInterestRate} ${getAprInterestRate(INTEREST_KEY)}%`}
                                        </div>
                                    </div>
                                    <hr className="important-stuff__hr" />
                                    <HDMCMonthlyBreakdownHelper
                                        mcsubmissionVM={mcsubmissionVM}
                                        multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                                        mcPaymentScheduleModel={mcPaymentScheduleModel}
                                        pricetableQuotes={quotes} />
                                </>
                            </Tab.Pane>
                        )
                        }
                        <Tab.Pane eventKey="price-table-annual-tab">
                            <div className="hd-price-table-content-row">
                                <div className="hd-price-table-content-row__column font-medium">
                                    {getQuoteCountText(quoteCount)}
                                </div>
                                <div className="hd-price-table-content-row__column font-bold">
                                    <b>{gettotalannualPayment()}</b>
                                </div>
                            </div>
                            <hr className="important-stuff__hr" />
                            {quotes.map((quote, annualIndex) => (
                                <>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column font-bold">
                                            <span className="price-table-label-yellow">{quote.label}</span>
                                            {quote.name}
                                        </div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">{messages.priceTableTotalAmountPolicyPrice}</div>
                                        <div className="hd-price-table-content-row__column">{getquoteAmount(quote, messages.annuallyText)}</div>
                                    </div>
                                    {quote.ancillaries && quote.ancillaries.map((ancillary) => (
                                        <div className="hd-price-table-content-row">
                                            <div className="hd-price-table-content-row__column">{ancillary.name}</div>
                                            <div className="hd-price-table-content-row__column">{ancillary.value}</div>
                                        </div>
                                    ))}
                                    <hr className="important-stuff__hr" />
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">{messages.priceTableAnnualStartDate}</div>
                                        <div className="hd-price-table-content-row__column">{getstartDate(quote, messages.annuallyText)}</div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">{messages.priceTableAnnualDaysInsured}</div>
                                        <div className="hd-price-table-content-row__column">{quote.daysInsured}</div>
                                    </div>
                                    <div className="hd-price-table-content-row">
                                        <div className="hd-price-table-content-row__column">
                                            {getAnnualyPaymentDate(quote)}
                                        </div>
                                        <div className="hd-price-table-content-row__column">{getAnnuallyPaymentAmount(quote)}</div>
                                    </div>
                                    {quoteCount - 1 > annualIndex && <hr className="important-stuff__hr" />}
                                </>
                            ))}
                        </Tab.Pane>
                    </Tab.Content>
                )}
            </Tab.Container>
            <HDQuoteInfoRefactor className="text-small">
                <span>{messages.priceTableImportantInfo}</span>
            </HDQuoteInfoRefactor>
            {userSelectedOption && (
                <HDQuoteInfoWarning className="customize-quote-summary__quote-notice__quote-info text-small">
                    <span>
                        {messages.warningInfo}
                    </span>
                </HDQuoteInfoWarning>
            )}
        </Container>
    );
}

HDPriceTable.propTypes = {
    general: PropTypes.shape({
        paymentTotalBase: PropTypes.string.isRequired,
        paymentTotalCredit: PropTypes.string,
        paymentTotalCreditCharge: PropTypes.string,
        instalmentsTotal: PropTypes.shape({
            count: PropTypes.number,
            value: PropTypes.string,
            paymentInitial: PropTypes.string,
        }),
        rateOfInterest: PropTypes.string,
        representativeApr: PropTypes.string,
    }).isRequired,
    quotes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        daysInsured: PropTypes.number.isRequired,
        paymentBase: PropTypes.string.isRequired,
        paymentCredit: PropTypes.string,
        paymentCreditCharge: PropTypes.string,
        instalments: PropTypes.shape({
            count: PropTypes.number,
            value: PropTypes.string,
            paymentInitial: PropTypes.string
        }),
        ancillaries: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string
        })),
        isDeferred: PropTypes.bool
    })).isRequired,
    paymentTypeSelectionHandler: PropTypes.func.isRequired,
    userSelectedOption: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }).isRequired,
    paymentsBreakdown: PropTypes.arrayOf({
        futurePayments: PropTypes.shape({
            amount: PropTypes.number,
            currency: PropTypes.string,
            followedBy: PropTypes.number,
        }),
        initialPayment: PropTypes.shape({
            amount: PropTypes.number,
            currency: PropTypes.currency
        }),
        quoteId: PropTypes.string,
    }),
    whyMonthlyPaymentAvailablityHandler: PropTypes.func.isRequired
};

HDPriceTable.defaultProps = {
    paymentsBreakdown: null,
};
