import React from 'react';
import PropTypes from 'prop-types';
import './HDFullscreenLoader.scss';

const HDFullscreenLoader = ({
    spinner, text, overlay
}) => {
    return (
        <>
            {overlay}
            <div className="hd-loader-container">
                {spinner}
                <div className="hd-loader-text-wrapper">
                    <span data-testid="loader-text">{text}</span>
                </div>
            </div>
        </>
    );
};

HDFullscreenLoader.propTypes = {
    spinner: PropTypes.element.isRequired,
    overlay: PropTypes.element.isRequired,
    text: PropTypes.string.isRequired,
};

export default HDFullscreenLoader;
