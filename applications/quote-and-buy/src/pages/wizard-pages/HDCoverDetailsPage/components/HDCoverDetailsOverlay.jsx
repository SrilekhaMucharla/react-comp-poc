import React from 'react';
import PropTypes from 'prop-types';
import {
    HDLabelRefactor,
    HDQuoteInfoRefactor
} from 'hastings-components';
import { Row, Col } from 'react-bootstrap';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDDropdownList as HDDropdownList,
} from '../../../../web-analytics';
import {
    seeFullDetailsLink, coverType, customizeQuote, coverDetailsOverlayPriceInfo
} from '../HDCoverDetails.messages';
import Tick from '../../../../assets/images/icons/tick-icon.svg';
import { pageMetadataPropTypes } from '../../../../constant/propTypes';

export default function HDCoverDetailsOverlay({
    children,
    branchName,
    onChange,
    policyStartDate,
    paymentTypeText,
    benefits,
    selectedCoverType,
    options,
    pageMetadata,
    headerBar
}) {
    const isDropdownDisabled = branchName === 'Hastings Essential';

    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${customizeQuote} - ${seeFullDetailsLink}` }}
            webAnalyticsEvent={{ event_action: `${customizeQuote} - ${seeFullDetailsLink}` }}
            id="cover-details-overlay"
            showButtons={false}
            labelText="Your policy details"
            overlayButtonIcon={(
                <HDLabelRefactor
                    Tag="a"
                    className="decorated-blue-line theme-white"
                    text={seeFullDetailsLink} />
            )}
            headerBar={headerBar}
        >
            <hr />
            <Row className="cover-details__overlay-policy-header">
                <Col>
                    <Row className="mb-2">
                        <Col xs={5}>
                            <HDLabelRefactor
                                Tag="span"
                                text="Cover level:" />
                        </Col>
                        <Col>
                            <HDLabelRefactor
                                Tag="span"
                                className="font-medium"
                                text={branchName} />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs={5} className="align-self-center">
                            <HDLabelRefactor
                                Tag="span"
                                className="align-items-center"
                                text="Cover type:" />
                        </Col>
                        <Col>
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${customizeQuote} - ${coverType}` }}
                                id="cover-type-dropdown"
                                customClassName="cover-details__overlay-dropdown font-medium"
                                isDisabled={isDropdownDisabled}
                                options={options}
                                value={selectedCoverType}
                                onChange={onChange} />
                        </Col>
                    </Row>
                    <Row className="cover-details__overlay-policy-row mb-2">
                        <Col>
                            <HDQuoteInfoRefactor className="customize-quote-summary__quote-notice__quote-info text-regular">
                                <div>{coverDetailsOverlayPriceInfo}</div>
                            </HDQuoteInfoRefactor>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs={5}>
                            <HDLabelRefactor
                                Tag="span"
                                text="Start date:" />
                        </Col>
                        <Col>
                            <HDLabelRefactor
                                Tag="span"
                                className="font-medium"
                                text={policyStartDate} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>
                            <HDLabelRefactor
                                Tag="span"
                                text="Payment terms:" />
                        </Col>
                        <Col>
                            <HDLabelRefactor
                                Tag="span"
                                className="font-medium"
                                text={paymentTypeText} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row className="mb-3">
                <Col>
                    <HDLabelRefactor
                        Tag="h5"
                        className="m-0 font-weight-bold"
                        text="What's included:" />
                </Col>
            </Row>
            <Row className="cover-details__overlay-benefits-list d-block">
                {benefits.map((benefit) => (
                    <Col>
                        <Row className="cover-details__overlay-benefits font-medium">
                            <Col>
                                <HDLabelRefactor
                                    Tag="span"
                                    text={benefit.label}
                                    icon={<img src={Tick} alt="tick" />}
                                    iconPosition="l" />
                            </Col>
                        </Row>
                        <Row className="cover-details__overlay-description">
                            <Col>
                                <HDLabelRefactor
                                    Tag="span"
                                    text={benefit.description} />
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
            {children}
        </HDOverlayPopup>
    );
}

HDCoverDetailsOverlay.propTypes = {
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    children: PropTypes.node.isRequired,
    branchName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    policyStartDate: PropTypes.string.isRequired,
    paymentTypeText: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(PropTypes.shape({ benefit: PropTypes.string, description: PropTypes.string })).isRequired,
    selectedCoverType: PropTypes.shape({ value: PropTypes.oneOf(['comprehensive', 'thirdParty']), label: PropTypes.string }).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.oneOf(['comprehensive', 'thirdParty']), label: PropTypes.string })).isRequired,
    headerBar: PropTypes.shape({})
};

HDCoverDetailsOverlay.defaultProps = {
    headerBar: null
};
