import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import '../../../../../applications/quote-and-buy/src/assets/sass-refactor/utilities/_colors.scss';
// import theme from '../../../../../applications/quote-and-buy/src/theme/theme.scss';
// import './HDInfoCard.scss';

// TODO: Hardcoded css values;
const StyledInfoCard = styled.div`
    font-size:16px;
    line-height:24px;
    padding: 16px;
    border-radius: 5px;
    text-align:left;
    background-color: $blue-light;
    color: $blue-light;
    display: grid;
    @media (max-width: 992px) {
        padding: 14px;
    }

    .info-card-title {
        font-weight:bold;
    }

    .info-card-notes {
        
    }

    .info-card-paragraph:last-child {
        margin-bottom: 0;
    }
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDInfoCardRefactor instead.
 */
const HDInfoCard = ({
    title, image, paragraphs, children, isRight, notes, className
}) => {
    return (
        <StyledInfoCard className={`i-card-container ${(isRight ? 'right ' : 'left ') + (className)}`}>
            {image && <img src={image} alt="info-card" />}
            {title && <p key="info-card-title" className="info-card-title">{title}</p>}
            {/* eslint-disable-next-line react/no-array-index-key */}
            {!!paragraphs.length && paragraphs.map((paragraph, index) => (<p key={index} className="info-card-paragraph">{paragraph}</p>))}
            {notes && <p key="info-card-notes" className="info-card-notes">{notes}</p>}
            {children}
        </StyledInfoCard>
    );
};


HDInfoCard.propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    notes: PropTypes.string,
    children: PropTypes.node,
    isRight: PropTypes.bool,
    className: PropTypes.string
};

HDInfoCard.defaultProps = {
    title: null,
    image: null,
    paragraphs: [],
    notes: null,
    children: null,
    isRight: false,
    className: null
};

export default HDInfoCard;
