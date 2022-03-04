import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { HDInfoBox, HDLabelRefactor } from 'hastings-components';
import HDPolicyBenefits from '../../HDPolicyBenefits';
import * as messages from './HDYourPolicy.messages';
import { policies } from '../../../../HDImportantStuffPage/HDCoverSummary';
import { TranslatorContext } from '../../../../../../integration/TranslatorContext';

const HDMCYourPolicy = ({
    quoteReference,
    lengthOfPolicy,
    starts,
    ends,
    insurerKey,
    coverTypeKey,
    brandCode,
    vehicle
}) => {
    const translator = useContext(TranslatorContext);

    const policyDetailsItems = [
        { key: messages.quoteReference, value: quoteReference },
        { key: messages.lengthOfPolicy, value: lengthOfPolicy },
        { key: messages.starts, value: starts },
        { key: messages.ends, value: ends },
        { key: messages.insurer, value: ((insurerKey) ? translator(`typekey.Insurers_Ext.${insurerKey}`) : '') },
    ];

    return (
        <Row className="mc-your-policy-container">
            <Col className="margin-bottom-md">
                <Row>
                    <Col className="px-md-0">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.yourPolicy}
                            className="mb-2 margin-top-lg"
                            id="mc-your-policy-label" />
                        <p>{messages.youreBuyingBecause}</p>
                        <p>
                            {messages.your}
                            <span className="font-bold">
                                {` ${translator(`typekey.BrandCode_EXT.${brandCode}`)} `}
                                <span className="text-lowercase">{`${translator(`typekey.CoverageCategory_EXT.${coverTypeKey}`)} `}</span>
                            </span>
                            {messages.policyCovers}
                        </p>
                        <ul className="mc-your-policy__covers-list row pad-inl-start-sm margin-top-md margin-top-lg-lg margin-bottom-md margin-bottom-lg-lg">
                            {policies[(brandCode + coverTypeKey)]}
                        </ul>
                        <p>{messages.mainFeatures}</p>
                        <hr className="margin-top-md margin-bottom-md margin-bottom-lg-lg" />
                        <HDInfoBox policyDetails={policyDetailsItems} />
                    </Col>
                </Row>
                <HDPolicyBenefits
                    policyType={coverTypeKey}
                    brand={brandCode}
                    vehicle={vehicle} />
            </Col>
        </Row>
    );
};

HDMCYourPolicy.propTypes = {
    quoteReference: PropTypes.string.isRequired,
    lengthOfPolicy: PropTypes.number.isRequired,
    starts: PropTypes.string.isRequired,
    ends: PropTypes.string.isRequired,
    insurerKey: PropTypes.string.isRequired,
    coverTypeKey: PropTypes.oneOf(['comprehensive', 'tpft']).isRequired,
    brandCode: PropTypes.oneOf(['HE', 'HD', 'HP', 'YD']).isRequired,
    vehicle: PropTypes.shape({
        quoteID: PropTypes.string
    }).isRequired,
};

export default HDMCYourPolicy;
