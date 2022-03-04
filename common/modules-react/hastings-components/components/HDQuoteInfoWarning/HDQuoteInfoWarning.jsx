import React from 'react';
import PropTypes from 'prop-types';
import warningInfo from '../../../../../applications/quote-and-buy/src/assets/images/wizard-images/hastings-icons/icons/Info.svg';

const HDQuoteInfoWarning = ({ className, children }) => {
    return (
        <div id="quote-info-body" className={`quote-info-warning theme-white ${className}`}>
            <img src={warningInfo} alt="Car Icon" />
            <p id="quote-info-paragraph" className="quote-info__info-paragraph align-self-center">
                {children}
            </p>
        </div>
    );
};

HDQuoteInfoWarning.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

HDQuoteInfoWarning.defaultProps = {
    className: ''
};

export default HDQuoteInfoWarning;
