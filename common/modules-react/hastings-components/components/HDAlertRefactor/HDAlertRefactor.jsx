import React from 'react';
import PropTypes from 'prop-types';


const HDAlertRefactor = ({ message, className }) => ((message) ? (
    <div className={`alert-container ${className}`}>
        {/* <i className="fas fa-exclamation-circle" /> */}
        {message}
    </div>
) : null);

HDAlertRefactor.propTypes = {
    message: PropTypes.string,
    className: PropTypes.string
};

HDAlertRefactor.defaultProps = {
    message: null,
    className: ''
};

export default HDAlertRefactor;
