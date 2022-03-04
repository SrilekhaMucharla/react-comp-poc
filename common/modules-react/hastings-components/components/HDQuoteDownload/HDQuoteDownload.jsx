import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDiv = styled.div`    
display: inline-flex;
cursor: pointer;

.download-link-text {
  line-height: 1.7;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-decoration-color: #0085ff;
  text-decoration-thickness: 3px;
  margin-bottom: 0;
}`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDQuoteDownloadRefactor instead.
 */
const HDQuoteDownload = ({
    linkText, showIcon, onClick, className, id
}) => {
    return (
        <StyledDiv id={id} onClick={onClick} className={className}>
            {showIcon && (
                <p className="mr-2 mb-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L16.0711 8.34315C16.4616 7.95262 16.4616 7.31946 16.0711 6.92893C15.6805 6.53841 15.0474 6.53841 14.6569 6.92893L9 12.5858L3.34315 6.92893C2.95262 6.53841 2.31946 6.53841 1.92893 6.92893C1.53841 7.31946 1.53841 7.95262 1.92893 8.34315L8.29289 14.7071ZM8 -4.37112e-08L8 14L10 14L10 4.37112e-08L8 -4.37112e-08Z" fill="#011831" />
                        <line y1="17" x2="18" y2="17" stroke="#011831" strokeWidth="2" />
                    </svg>
                </p>
            )}
            <p className="download-link-text">{linkText}</p>
        </StyledDiv>
    );
};


HDQuoteDownload.propTypes = {
    linkText: PropTypes.string.isRequired,
    showIcon: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    id: PropTypes.string
};

HDQuoteDownload.defaultProps = {
    showIcon: true,
    onClick: () => { },
    className: '',
    id: ''
};

export default HDQuoteDownload;
