import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import themeStylesheet from "../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss";

const StyledLabel = styled.span`
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-bottom: 20px;
    align-items: baseline;

    .label-text {
        font-style: normal;
        font-weight: bold;
        color: ${(props) => (props.theme === 'light' ? themeStylesheet.commonCompoTextColorBlueDark : themeStylesheet.commonCompoTextColor)};
        text-align: left;
        font-family: TTNormsPro;
        span{
            vertical-align: middle;
        }        
        .additional {
            font-weight: normal;
        }
    }

    button.label-icon {
        font-size: 16px;
        border: none;
        background: transparent;
        outline: none;
        z-index: 8;
        &:focus{
            border: none;
            background: transparent;
            outline: none;
        }
    }

    .label-icon-left{
        padding-right:10px;
        height: 40px;
        font-size: 16px;
    }

    .size-lg {
        font-size: 34px !important;
        @media (max-width: 992px) { 
            font-size: 25px !important;
            line-height: 25px;
        }
    }

    .size-sm {
        font-size: 25px;
        @media (max-width: 992px) { 
            font-size: 25px;
            line-height: 25px;
        }
    }
    
    .size-xs {
        font-size: 16px !important;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        @media (max-width: 992px) { 
            text-align: left;
        }
    }
    .size-xl {        
        font-size: 42px !important;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        text-align: left;
        color: ${themeStylesheet.commonCompoTextColor};
        @media (max-width: 992px) {
            font-size: 32px !important;
            margin: 0 0 20px;
        }
    }
    .size-md {
        font-family: ${themeStylesheet.genericTitleBoldFontFace};
        font-size: 28px !important;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.32;
        letter-spacing: normal;
        color: ${themeStylesheet.commonCompoTextColor};
        text-align: center;
        @media (max-width: 992px) {
            font-size: 24px !important;
            text-align: left;
            margin:5% 0;
            line-height: 1.2;
        }
    }
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDLabelRefactor instead.
 */
const HDLabel = ({
    text,
    size,
    iconPosition,
    icon,
    additionalText,
    theme
}) => (
    <StyledLabel theme={theme}>
        <span className={`label-text size-${size}`}>
            {iconPosition === 'l' && (
                <span className={icon ? 'label-icon-left' : ''}>
                    { icon }
                </span>
            )}
            <span>{text}</span>
            {additionalText && (<span className="additional">{additionalText}</span>)}
        </span>
        {(icon && iconPosition === 'r') && (
            <span className="label-icon">
                {icon}
            </span>
        )}
    </StyledLabel>
);

HDLabel.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    size: PropTypes.oneOf(['xs', 'sm', 'lg', 'xl', 'md']),
    iconPosition: PropTypes.oneOf(['l', 'r']),
    icon: PropTypes.node,
    additionalText: PropTypes.string,
    theme: PropTypes.string,
};
HDLabel.defaultProps = {
    size: 'lg',
    iconPosition: null,
    icon: null,
    additionalText: null,
    theme: 'dark',
};

export default HDLabel;
