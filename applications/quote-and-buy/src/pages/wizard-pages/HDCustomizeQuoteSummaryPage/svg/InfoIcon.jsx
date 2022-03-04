import React from 'react';
import PropTypes from 'prop-types';

const InfoIcon = ({
    width,
    height,
    color
}) => (
    <svg width={width} height={height} viewBox="0 0 40 40" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            // eslint-disable-next-line max-len
            d="M31.6667 20C31.6667 26.1856 26.1856 31.6667 20 31.6667C13.8144 31.6667 8.33333 26.1856 8.33333 20C8.33333 13.8144 13.8144 8.33333 20 8.33333C26.1856 8.33333 31.6667 13.8144 31.6667 20ZM34 20C34 27.732 27.732 34 20 34C12.268 34 6 27.732 6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20ZM21.4 14.4C21.4 15.1732 20.7732 15.8 20 15.8C19.2268 15.8 18.6 15.1732 18.6 14.4C18.6 13.6268 19.2268 13 20 13C20.7732 13 21.4 13.6268 21.4 14.4ZM21.1669 17.2V27H18.8336V17.2H21.1669Z"
            fill={color} />
    </svg>
);

InfoIcon.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};

export default InfoIcon;
