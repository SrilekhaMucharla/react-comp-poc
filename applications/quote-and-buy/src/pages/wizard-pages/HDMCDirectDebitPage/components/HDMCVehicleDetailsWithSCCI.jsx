
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor, HDVehicleSimpleDetails } from 'hastings-components';
import mintBoxSCCILinkMessage from './HDMCVehicleDetailsWithSCCI.messages';
import HDMCOverlaySCCIPopup from './HDMCOverlaySCCIPopup';
import { pageMetadataPropTypes } from '../../../../constant/propTypes';

const HDMCVehicleDetailsWithSCCI = ({
    vrn, displayName, paymentInfo, pageMetadata
}) => {
    return (
        <>
            <Row>
                <Col>
                    <HDVehicleSimpleDetails vrn={vrn} displayName={displayName} />
                </Col>
            </Row>
            <Row>
                <Col className="scci_link_info">
                    <HDMCOverlaySCCIPopup
                        noOfPayment={paymentInfo.followedBy}
                        costOfPayment={paymentInfo.amount}
                        initialPayment={paymentInfo.initialPayment}
                        creditAgreementData={paymentInfo.creditAgreementData}
                        pageMetadata={pageMetadata}
                        overlayButtonIcon={(
                            <HDLabelRefactor
                                className="scci_link_value decorated-blue-line"
                                Tag="a"
                                text={mintBoxSCCILinkMessage} />
                        )} />
                </Col>
            </Row>
        </>
    );
};

HDMCVehicleDetailsWithSCCI.propTypes = {
    vrn: PropTypes.string,
    displayName: PropTypes.string,
    paymentInfo: PropTypes.PropTypes.shape({
        initialPayment: PropTypes.number,
        followedBy: PropTypes.number,
        amount: PropTypes.number,
        creditAgreementData: PropTypes.PropTypes.shape({})
    }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired

};

HDMCVehicleDetailsWithSCCI.defaultProps = {
    vrn: 'Vrn placeholder',
    displayName: 'Display name placeholder',
    paymentInfo: {
        initialPayment: 0,
        followedBy: 0,
        amount: 0,
        creditAgreementData: {}
    }
};

export default React.memo(HDMCVehicleDetailsWithSCCI);
