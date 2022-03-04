import React from 'react';
import PropTypes from 'prop-types';
import HDSpinner from '../HDSpinner/HDSpinner';
import './HDLoader.scss';

const HDLoader = ({ spinner, text }) => {
    return (
        <>
            <div className="hd-loader-overlay" />
            <div className="hd-loader-container">
                {spinner}
                <div className="hd-loader-text-wrapper">
                    <span data-testid="loader-text">{text}</span>
                </div>
            </div>
        </>
    );
};

HDLoader.defaultProps = {
    spinner: <HDSpinner />,
    text: 'We\'re working on it..'
};

HDLoader.propTypes = {
    spinner: PropTypes.element,
    text: PropTypes.string,
};

export default HDLoader;
