import React from 'react';
import PropTypes from 'prop-types';


const HDQuoteInfoRefactor = ({ className, children }) => {
    return (
        <div id="quote-info-body" className={`quote-info theme-white ${className}`}>
            <p id="quote-info-icon" className="quote-info__info-icon"><span>!</span></p>
            <p id="quote-info-paragraph" className="quote-info__info-paragraph align-self-center">
                {children}
            </p>
        </div>
    );
};

HDQuoteInfoRefactor.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

HDQuoteInfoRefactor.defaultProps = {
    className: ''
};

export default HDQuoteInfoRefactor;
