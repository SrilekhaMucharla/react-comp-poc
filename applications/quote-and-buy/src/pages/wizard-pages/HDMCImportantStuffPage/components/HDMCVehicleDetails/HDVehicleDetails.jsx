/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import {
    HDPlaceholderWithHeader, HDQuoteInfoRefactor, HDLabelRefactor, HDQuoteDownloadRefactor
} from 'hastings-components';
import HDMCVehicleDetailsHeader from './components/HDVehicleDetailsHeader';
import * as messages from './HDVehicleDetails.messages';
import HDMCYourPolicy from './components/HDYourPolicy';
import HDMCYourExcessFeesContainer from './components/HDMCYourExcessFeesContainer';
import HDMCYourDocuments from './components/HDMCYourDocuments/HDMCYourDocuments';
import { pageMetadataPropTypes } from '../../../../../constant/propTypes';
import Amendments from '../../../HDImportantStuffPage/Amendments/Amendments';
import HDDirectDebitOverlay from '../../../HDDirectDebitPage/HDDirectDebitPageSECIOverlay';
import { getPriceWithCurrencySymbol } from '../../../../../common/utils';
import { getAmountAsTwoDecimalDigit } from '../../../../../common/premiumFormatHelper';

export default function HDMCVehicleDetails({
    vehicle,
    quoteReference,
    pageMetadata,
    quoteData,
    isCreditAgreementVisible,
    creditAgreementData
}) {
    const startDate = dayjs(vehicle.policyStartDate);
    const endDate = dayjs(vehicle.policyEndDate).add(1, 'day');
    return (
        <HDPlaceholderWithHeader
            className="margin-top-lg"
            title={`${messages.startsOn} ${startDate.format('DD/MM/YYYY')}`}
        >
            <HDMCVehicleDetailsHeader
                policyAddress={vehicle.policyAddress}
                vehicleName={vehicle.vehicleName}
                vehicleLicense={vehicle.vehicleLicense}
                policyholder={vehicle.policyholder}
                noClaimsDiscountYears={vehicle.noClaimsDiscountYears}
                namedDrivers={vehicle.namedDrivers} />
            <HDMCYourPolicy
                starts={startDate.format('DD/MM/YYYY')}
                ends={endDate.subtract(1, 'minute').format('DD/MM/YYYY HH:mm')}
                lengthOfPolicy={`${endDate.diff(startDate, 'day')} days`}
                insurerKey={vehicle.insurerKey}
                quoteReference={quoteReference}
                brandCode={vehicle.brandCode}
                coverTypeKey={vehicle.coverTypeKey}
                vehicle={vehicle} />
            <HDMCYourExcessFeesContainer
                vehicle={vehicle}
                pageMetadata={pageMetadata} />
            <HDMCYourDocuments vehicleData={vehicle} key={vehicle.quoteID} />
            <Amendments endorsements={vehicle.endorsements} brand={vehicle.brandCode} />
            <HDCreditAgreement
                vehicle={vehicle}
                quoteData={quoteData}
                isCreditAgreementVisible={isCreditAgreementVisible}
                creditAgreementData={creditAgreementData} />
        </HDPlaceholderWithHeader>
    );
}

HDMCVehicleDetails.propTypes = {
    quoteReference: PropTypes.string.isRequired,
    isCreditAgreementVisible: PropTypes.bool.isRequired,
    quoteData: PropTypes.shape({
        instalments: PropTypes.shape({
            count: PropTypes.string,
            value: PropTypes.string,
            paymentInitial: PropTypes.string,
        }).isRequired,
        paymentBase: PropTypes.string,
        paymentCredit: PropTypes.string,
        paymentCreditCharge: PropTypes.string,
        rateOfInterest: PropTypes.string,
        representativeApr: PropTypes.string,
    }).isRequired,
    vehicle: PropTypes.shape({
        quoteID: PropTypes.string,
        insurerKey: PropTypes.string,
        coverTypeKey: PropTypes.oneOf(['comprehensive', 'tpft']),
        policyStartDate: PropTypes.instanceOf(Date),
        policyEndDate: PropTypes.instanceOf(Date),
        vehicleLicense: PropTypes.string,
        vehicleName: PropTypes.string,
        policyholder: PropTypes.string,
        noClaimsDiscountYears: PropTypes.string,
        namedDrivers: PropTypes.arrayOf(PropTypes.shape({
            displayName: PropTypes.string,
            publicID: PropTypes.string
        })),
        policyAddress: PropTypes.string,
        brandCode: PropTypes.string,
        accidentalDamage: PropTypes.shape({
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        theftDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        windscreenDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        })
    }).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    creditAgreementData: PropTypes.shape({
        amountPayable: PropTypes.number,
        totalPrice: PropTypes.number,
        interestRate: PropTypes.number,
        aprRate: PropTypes.number,
        instalmentsCount: PropTypes.number,
        initialPayment: PropTypes.number,
        subsequentPayment: PropTypes.number,
        currencyCode: PropTypes.number
    })
};

HDMCVehicleDetails.defaultProps = {
    creditAgreementData: null
};

// eslint-disable-next-line no-unused-vars
const HDYourDocuments = () => {
    const ipids = [
        messages.carInsurance, messages.personalAccident, messages.substituteVehicle
    ];

    const booklets = [
        messages.carInsurance, messages.additionalProducts
    ];

    return (
        <Row>
            <Col className="mc-vehicle-details__ipid-details-wrapper mt-2">
                <HDLabelRefactor
                    Tag="h4"
                    text={messages.yourDocuments}
                    className="mt-0 mb-3"
                    id="mc-ipid-details-header-label" />
                <Row>
                    <Col className="mc-vehicle-details__ipid-details__col" md={6} sm={12}>
                        <HDLabelRefactor
                            Tag="div"
                            text={messages.insurerProductDocuments}
                            className="font-bold"
                            id="mc-ipid-details-prod-info-label" />
                        {ipids.map((label) => (
                            <div>
                                <HDQuoteDownloadRefactor
                                    showIcon
                                    linkText={label} />
                            </div>
                        ))}
                    </Col>
                    <Col className="mc-vehicle-details__ipid-details__col" md={6} sm={12}>
                        <HDLabelRefactor
                            Tag="div"
                            text={messages.policyBooklets}
                            className="font-bold mt-3 mt-md-0"
                            id="mc-ipid-details-policy-booklets-label" />
                        {booklets.map((label) => (
                            <div>
                                <HDQuoteDownloadRefactor
                                    showIcon
                                    linkText={label} />
                            </div>
                        ))}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

const HDCreditAgreement = ({ vehicle, isCreditAgreementVisible, creditAgreementData }) => {
    return (
        <>
            {isCreditAgreementVisible && (
                <Row>
                    <Col className="mc-vehicle-details__credit-agreement">
                        <HDLabelRefactor
                            Tag="h4"
                            text={messages.creditAgreement}
                            className="margin-bottom-md" />
                        <HDQuoteInfoRefactor className="mt-0 margin-bottom-md margin-bottom-lg-lg">
                            <p className="mb-2">
                                {messages.important}
                                {' '}
                                <HDDirectDebitOverlay
                                    trigger={(
                                        <HDLabelRefactor
                                            Tag="a"
                                            text={messages.scciText}
                                            className="mc-vehicle-details__scci-link decorated-blue-line decorated-blue-line--on-white p-0" />
                                    )}
                                    dataList={{
                                        firstPayment: `${getAmountAsTwoDecimalDigit(creditAgreementData.initialPayment)}`,
                                        elevenMonths: `${getAmountAsTwoDecimalDigit(creditAgreementData.subsequentPayment)}`,
                                        paymentScheduleCount: `${creditAgreementData.instalmentsCount - 1}`
                                    }} />
                                {' '}
                                {messages.document}
                            </p>
                            <p className="mb-0">
                                {messages.importantPleaseRead}
                            </p>
                        </HDQuoteInfoRefactor>
                        <div className="mc-vehicle-details__credit-agreement-box">
                            <HDLabelRefactor
                                Tag="h5"
                                text={(
                                    <>
                                        {messages.creditAgreementFor}
                                        {' '}
                                        <span className="mc-vehicle-details__credit-agreement__reg-num ml-2">
                                            {vehicle.vehicleLicense}
                                        </span>
                                    </>
                                )}
                                className="d-flex align-items-center" />
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            {messages.totalPrice}
                                        </Col>
                                        <Col xs="auto" className="font-bold pl-0">
                                            {getPriceWithCurrencySymbol({ amount: creditAgreementData.totalPrice, currency: creditAgreementData.currencyCode })}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="mc-important-stuff--info-text-2 text-small mt-1">
                                            {messages.includingOptionalExtras}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {messages.totalCreditCharge}
                                </Col>
                                <Col xs="auto" className="font-bold pl-0">
                                    {getPriceWithCurrencySymbol({
                                        amount: creditAgreementData.amountPayable - creditAgreementData.totalPrice,
                                        currency: creditAgreementData.currencyCode
                                    })}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            {messages.totalAmountPayable}
                                        </Col>
                                        <Col xs="auto" className="font-bold pl-0">
                                            {getPriceWithCurrencySymbol({
                                                amount: creditAgreementData.amountPayable,
                                                currency: creditAgreementData.currencyCode
                                            })}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="mc-important-stuff--info-text-2 text-small mt-1">
                                            {`APR ${creditAgreementData.aprRate}% Interest rate ${creditAgreementData.interestRate}%`}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr className="important-stuff__hr" />
                            <Row>
                                <Col>
                                    {messages.initialPayment}
                                </Col>
                                <Col xs="auto" className="font-bold pl-0">
                                    {getPriceWithCurrencySymbol({ amount: creditAgreementData.initialPayment, currency: creditAgreementData.currencyCode })}
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col>
                                    {creditAgreementData.instalmentsCount - 1}
                                    {' '}
                                    {messages.monthlyPayments}
                                </Col>
                                <Col xs="auto" className="font-bold pl-0">
                                    {getPriceWithCurrencySymbol({ amount: creditAgreementData.subsequentPayment || 0, currency: creditAgreementData.currencyCode })}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            )}
        </>
    );
};

HDCreditAgreement.propTypes = {
    vehicle: PropTypes.shape({
        quoteID: PropTypes.string,
        insurerKey: PropTypes.string,
        coverTypeKey: PropTypes.oneOf(['comprehensive', 'tpft']),
        policyStartDate: PropTypes.instanceOf(Date),
        policyEndDate: PropTypes.instanceOf(Date),
        vehicleLicense: PropTypes.string,
        vehicleName: PropTypes.string,
        policyholder: PropTypes.string,
        noClaimsDiscountYears: PropTypes.string,
        namedDrivers: PropTypes.arrayOf(PropTypes.shape({
            displayName: PropTypes.string,
            publicID: PropTypes.string
        })),
        policyAddress: PropTypes.string,
        brandCode: PropTypes.string,
        accidentalDamage: PropTypes.shape({
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        theftDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        windscreenDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        })
    }).isRequired,
    isCreditAgreementVisible: PropTypes.bool.isRequired,
    quoteData: PropTypes.shape({
        instalments: PropTypes.shape({
            count: PropTypes.string,
            value: PropTypes.string,
            paymentInitial: PropTypes.string,
        }).isRequired,
        paymentBase: PropTypes.string,
        paymentCredit: PropTypes.string,
        paymentCreditCharge: PropTypes.string,
        rateOfInterest: PropTypes.string,
        representativeApr: PropTypes.string,
    }).isRequired,
    creditAgreementData: PropTypes.shape({
        amountPayable: PropTypes.number,
        totalPrice: PropTypes.number,
        interestRate: PropTypes.number,
        aprRate: PropTypes.number,
        instalmentsCount: PropTypes.number,
        initialPayment: PropTypes.number,
        subsequentPayment: PropTypes.number,
        currencyCode: PropTypes.number
    })
};

HDCreditAgreement.defaultProps = {
    creditAgreementData: null
};


// const HDAmendments = () => (
//     <Row>
//         <Col className="mc-vehicle-details__amendment-policy-wrapper mt-2">
//             <HDLabelRefactor
//                 Tag="h4"
//                 text={messages.amendments}
//                 id="mc-important-stuff-amendments-header"
//                 className="mt-0 mb-3" />
//             <HDLabelRefactor
//                 Tag="h5"
//                 text={messages.endorsement}
//                 id="mc-important-stuff-amendments-subheader"
//                 className="mb-3" />
//             <HDLabelRefactor
//                 Tag="p"
//                 text={messages.doubleVoluntary}
//                 className="font-bold" />
//             <p className="mb-0">
//                 {messages.nominatedRepairers}
//             </p>
//         </Col>
//     </Row>
// );
