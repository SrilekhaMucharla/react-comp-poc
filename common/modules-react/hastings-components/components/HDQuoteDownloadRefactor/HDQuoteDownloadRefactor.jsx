import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';

const HDQuoteDownloadRefactor = ({
    linkText, showIcon, onClick, className, id
}) => {
    const onLinkClick = (event) => {
        // eslint-disable-next-line no-param-reassign
        event.target.value = linkText;
        onClick(event);
    };
    return (
        <div
            id={id}
            className={`hd-quote-download ${className}`}
            role="button"
            tabIndex="0"
            onKeyDown={onLinkClick}
            onClick={onLinkClick}
        >
            {showIcon && (
                <span className="hd-quote-download__icon mr-2 mb-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L16.0711 8.34315C16.4616 7.95262 16.4616 7.31946 16.0711 6.92893C15.6805 6.53841 15.0474 6.53841 14.6569 6.92893L9 12.5858L3.34315 6.92893C2.95262 6.53841 2.31946 6.53841 1.92893 6.92893C1.53841 7.31946 1.53841 7.95262 1.92893 8.34315L8.29289 14.7071ZM8 -4.37112e-08L8 14L10 14L10 4.37112e-08L8 -4.37112e-08Z" fill="#011831" />
                        <line y1="17" x2="18" y2="17" stroke="#011831" strokeWidth="2" />
                    </svg>
                </span>
            )}
            <div className="download-link-text">
                <HDLabelRefactor
                    href={onLinkClick}
                    Tag="a"
                    text={linkText}
                    className="hd-quote-download__link-text" />
            </div>
        </div>
    );
};


HDQuoteDownloadRefactor.propTypes = {
    linkText: PropTypes.string.isRequired,
    showIcon: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    id: PropTypes.string
};

HDQuoteDownloadRefactor.defaultProps = {
    showIcon: true,
    onClick: () => { },
    className: '',
    id: ''
};

export default HDQuoteDownloadRefactor;
