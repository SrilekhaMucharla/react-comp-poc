import React from 'react';
import { Col, Row } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import * as messages from './HDImportantInfo.messages';
import * as helper from '../../../constant/const';

const HDImportantInfo = () => {
    const importantInfo = [
        {
            title: messages.midTermAdjustments,
            content: [
                messages.midTermAdjustmentsDesc
            ]
        },
        {
            title: messages.latePayments,
            content: [
                messages.latePaymentsDesc1,
                messages.latePaymentsDesc2
            ]
        },
        {
            title: messages.rightOfWithdrawal,
            content: [
                messages.rightOfWithdrawalDesc1,
                messages.rightOfWithdrawalDesc2,
                messages.rightOfWithdrawalDesc3,
                messages.rightOfWithdrawalDesc4
            ]
        },
        {
            title: messages.consumerCreditAgreement,
            content: [
                messages.consumerCreditAgreementDesc1,
                messages.consumerCreditAgreementDesc2
            ]
        },
        {
            title: messages.cancellingAgreement,
            content: [(
                <p className="direct-debit__cancelling-your-credit-agreement">
                    <p className="text-small">{messages.cancellingAgreementDesc1}</p>
                    <p className="text-small">{messages.cancellingAgreementDesc2}</p>
                    <p className="text-small">{messages.cancellingAgreementDesc3}</p>
                    <p className="text-small">{messages.cancellingAgreementDesc4}</p>
                    <p className="text-small">{messages.cancellingAgreementDesc5}</p>
                    <p className="text-small">{messages.cancellingAgreementDesc6}</p>
                </p>

            )]
        }
    ];
    return (
        <Row className="hd-important-info-container theme-white">
            <Col>
                <HDLabelRefactor Tag="h3" text={messages.infoHeader} />
                {importantInfo.map((info) => (
                    <>
                        <HDLabelRefactor Tag="h5" text={info.title} />
                        {
                            info.content.map((cont) => (
                                <>
                                    { cont === messages.consumerCreditAgreementDesc1
                                        ? (
                                            <p className="hd-important-info-container__info-content text-small">
                                                {cont}
                                                <HDLabelRefactor
                                                    Tag="a"
                                                    text={messages.consumerCreditAgreement}
                                                    href={helper.CONSUMER_CREDIT_LINK}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className="hd-important-info-container__doc-link text-small p-0" />
                                            </p>
                                        )
                                        : (
                                            <p className="info-content text-small">
                                                {cont}
                                            </p>
                                        )
                                    }
                                </>
                            ))}
                    </>
                ))
                }
            </Col>
        </Row>
    );
};
export default HDImportantInfo;
