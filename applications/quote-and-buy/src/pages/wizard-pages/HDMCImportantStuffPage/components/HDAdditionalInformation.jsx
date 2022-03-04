import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor, HDPlaceholderWithHeader, HDQuoteInfoRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../../web-analytics';
import HDOurFeesOverlay from '../../HDImportantStuffPage/HDOurFeesOverlay';
import * as messages from './HDAdditionalInformation.messages';
import HDInsurersOverlay from '../../HDImportantStuffPage/HDInsurersOverlay';
import { pageMetadataPropTypes } from '../../../../constant/propTypes';

const HDAdditionalInformation = ({ pageMetadata, isCreditAgreementVisible }) => {
    const displayParagraphs = (paragraphs) => (
        paragraphs.map((paragraph, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i}>{paragraph}</p>
        )));
    const feesTableData = [
        { type: messages.ourFeesTableData1, fee: messages.ourFeesTableData2 },
        { type: messages.ourFeesTableData3, fee: messages.ourFeesTableData4 },
        { type: messages.ourFeesTableData5, fee: messages.ourFeesTableData6 },
        { type: messages.ourFeesTableData7, fee: messages.ourFeesTableData8 },
        { type: messages.ourFeesTableData9, fee: messages.ourFeesTableData10 },
        { type: messages.ourFeesTableData11, fee: messages.ourFeesTableData12 }
    ];

    return (
        <>
            <Row className="mc-important-stuff__additional-information__header">
                <Col>
                    <HDLabelRefactor
                        Tag="h1"
                        text={messages.additionalInformationMainHeading}
                        className="mt-0 mb-2" />
                    <p className="mb-0">{messages.additionalInformationMainParagraph}</p>
                </Col>
            </Row>
            <Row>
                <Col className="px-mobile-0">
                    <HDPlaceholderWithHeader
                        title={(
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.yourCreditAgreementsHeader}
                                className="my-2" />
                        )}
                        theme="dark-header"
                        className="mc-your-credit-agreement"
                    >
                        <Row>
                            <Col className="mc-your-credit-agreement__content">
                                <HDLabelRefactor Tag="h4" text={messages.makingChangesToPolicyHeader} className="mt-2 mt-md-0" />
                                <p>{messages.makingChangesToPolicyText}</p>
                                {isCreditAgreementVisible && (
                                    <div>
                                        <HDLabelRefactor
                                            Tag="h4"
                                            text={messages.ChangingTheLoanHolder}
                                            className="mc-important-stuff__additional-information__subheader" />
                                        <p>{messages.ChangingTheLoanHolderSubheading}</p>
                                    </div>
                                )}
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.latePaymentsHeader}
                                    className="mc-important-stuff__additional-information__subheader" />
                                <p>{messages.latePaymentsText1}</p>
                                <p>{messages.latePaymentsText2}</p>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.withdrawalHeader}
                                    className="mc-important-stuff__additional-information__subheader" />
                                <p>{messages.withdrawalText1}</p>
                                <p>{messages.withdrawalText2}</p>
                                <p>{messages.withdrawalText3}</p>
                                <p>{messages.withdrawalText4}</p>
                            </Col>
                        </Row>
                    </HDPlaceholderWithHeader>
                </Col>
            </Row>
            <Row>
                <Col className="px-mobile-0">
                    <HDPlaceholderWithHeader
                        title={(
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.ourFeesMainHeading}
                                className="my-1" />
                        )}
                        theme="dark-header"
                        className="mc-our-fees"
                    >
                        <Row>
                            <Col className="mc-our-fees__content">
                                <p>{messages.ourFeesParagraph1}</p>
                                <p>{messages.ourFeesParagraph2}</p>
                                <table className="mc-our-fees__content__table">
                                    <thead>
                                        <tr>
                                            <th className="mc-our-fees__content__table__th font-bold text-md-lg">
                                                {messages.ourFeesTableHeader1}

                                            </th>
                                            <th className="mc-our-fees__content__table__th font-medium text-right text-md-lg">
                                                {messages.ourFeesTableHeader2}

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="mc-our-fees__content__table__body">
                                        {feesTableData.map(({ type, fee }, rowIndex) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <tr className="mc-our-fees__content__table__body__tr" key={rowIndex}>
                                                <td className="mc-our-fees__content__table__td">{type}</td>
                                                <td className="mc-our-fees__content__table__td text-right font-bold">{fee}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-small mt-3 mt-md-4 mb-1">{messages.ourFeesParagraph3}</p>
                                <p className="text-small mb-0">{messages.ourFeesParagraph4}</p>
                                <HDOverlayPopup
                                    webAnalyticsView={{ ...pageMetadata, page_section: messages.ourfees }}
                                    webAnalyticsEvent={{ event_action: messages.ourfees }}
                                    id="our-fees-all-fees-overlay"
                                    showButtons={false}
                                    overlayButtonIcon={(
                                        <HDLabelRefactor
                                            Tag="a"
                                            text={messages.ourFeesLink}
                                            className="my-3 mt-md-4 mb-md-0 d-inline-block decorated-blue-line decorated-blue-line--on-white" />
                                    )}
                                >
                                    <HDOurFeesOverlay />
                                </HDOverlayPopup>
                            </Col>
                        </Row>
                    </HDPlaceholderWithHeader>
                </Col>
            </Row>
            <Row>
                <Col className="px-mobile-0">
                    <HDPlaceholderWithHeader
                        title={(
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.otherThingsMainHeading}
                                className="my-1" />
                        )}
                        theme="dark-header"
                        className="mc-other-things"
                    >
                        <Row>
                            <Col className="mc-other-things__content">
                                <HDLabelRefactor Tag="h4" text={messages.otherThingsHeading1} className="mt-2 mt-md-0" />
                                <p>{messages.otherThingsParagraph1}</p>
                                <p>{messages.otherThingsParagraph2}</p>
                                <p>{messages.otherThingsParagraph3}</p>
                                <p>{messages.otherThingsParagraph4}</p>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.otherThingsHeading2}
                                    className="mc-important-stuff__additional-information__subheader" />
                                <p>{messages.otherThingsParagraph5}</p>
                                <p>{messages.otherThingsParagraph6}</p>
                                <p>{messages.otherThingsParagraph7}</p>
                                <p>{messages.otherThingsParagraph8}</p>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.otherThingsHeading3}
                                    className="mc-important-stuff__additional-information__subheader" />
                                <p>{messages.otherThingsParagraph9}</p>
                                <p>{messages.otherThingsParagraph10}</p>
                                <HDOverlayPopup
                                    webAnalyticsEvent={{ event_action: messages.otherThingsLink }}
                                    webAnalyticsView={{ ...pageMetadata, page_section: messages.otherThingsLink }}
                                    id="insurer"
                                    showButtons={false}
                                    overlayButtonIcon={(
                                        <HDLabelRefactor
                                            Tag="a"
                                            text={messages.otherThingsLink}
                                            className="margin-top-md mb-0 decorated-blue-line decorated-blue-line--cq-1" />
                                    )}
                                >
                                    <HDInsurersOverlay />
                                </HDOverlayPopup>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.otherThingsHeading4}
                                    className="mc-important-stuff__additional-information__subheader" />
                                <p>{messages.otherThingsParagraph11}</p>
                                <p className="mb-0">{messages.otherThingsParagraph12}</p>
                                <HDLabelRefactor
                                    className="mt-5 mb-3"
                                    Tag="h4"
                                    text={messages.cpaHeader} />
                                <Row className="payment-page__cpa-content">
                                    <Col>
                                        {displayParagraphs(messages.cpaContent)}
                                    </Col>
                                </Row>
                                <HDQuoteInfoRefactor>
                                    {messages.cpaExtraInfoContent}
                                </HDQuoteInfoRefactor>
                            </Col>
                        </Row>
                    </HDPlaceholderWithHeader>
                </Col>
            </Row>
            <HDQuoteInfoRefactor className="mt-0 mb-md-5">
                <span>{messages.otherThingsImportantInfo}</span>
            </HDQuoteInfoRefactor>
        </>
    );
};

HDAdditionalInformation.propTypes = {
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    isCreditAgreementVisible: PropTypes.bool.isRequired,
};

export default HDAdditionalInformation;
