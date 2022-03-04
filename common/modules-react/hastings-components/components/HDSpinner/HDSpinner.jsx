import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import aData from './spinnerAnimationData.json';
// import './HDSpinner.scss';
import spinnerImgnotxt from '../../../../../applications/quote-and-buy/src/assets/images/spinner/spinner_no_txt_blm_540.gif';

const HDSpinner = ({ type, diameter, color }) => {
    if (type === 'color') {
        const aDataOptions = {
            loop: true,
            autoplay: true,
            animationData: aData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <span className="dizzy-squirrel" data-testid="spinner-color">
                <img
                    src={spinnerImgnotxt}
                    height={diameter}
                    width={diameter}
                    alt=""
                />
            </span>
        );
    }

    return (
        <span className="dizzy-squirrel" data-testid="spinner-monochrome">
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: diameter || '100%' }}
            >
                <g className="monochrome">
                    <circle
                        stroke={color}
                        cx="50"
                        cy="50"
                        r="45" />
                </g>
            </svg>
        </span>
    );
};

HDSpinner.defaultProps = {
    color: '#f4f4f4',
    type: 'monochrome',
    diameter: '100%'
};

HDSpinner.propTypes = {
    diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['color', 'monochrome']),
    color: PropTypes.string
};

export default HDSpinner;
