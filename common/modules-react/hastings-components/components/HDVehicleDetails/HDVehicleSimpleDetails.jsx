import React from 'react';
import PropTypes from 'prop-types';
import {
    Row, Col
} from 'react-bootstrap';

const HDVehicleSimpleDetails = ({ vrn, displayName, className }) => {
    return (
        <Row className={`vehicle_simple_details_row ${className}`}>
            <Col className="vehicle_simple_details_col">
                <div className="vrn_highlighted">
                    <span>{vrn}</span>
                </div>
                <div className="vheicle_detail_display_name_holder">
                    <span className="vheicle_detail_display_name">{displayName}</span>
                </div>
            </Col>
        </Row>
    );
};

HDVehicleSimpleDetails.propTypes = {
    vrn: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    className: PropTypes.string,
};

HDVehicleSimpleDetails.defaultProps = {
    className: ''
};


export default React.memo(HDVehicleSimpleDetails);
