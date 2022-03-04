import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    background-color: #d4e6e9;
    border-radius: 6px;
    padding: 12px;
    margin: 15px 0;
    text-align: left;
    .substitute-vehicle-info-icon {
      padding-right: 12px;
      span {
        background-color: #0e838a;
        padding: 2.5px 9px;
        border-radius: 100%;
        color: #fff;
        font-weight: bold;
      }
    }
    .substitute-vehicle-info-paragraph {
      font-size: 16px;
      margin-bottom: 0;
      color: #011831;
    }
  `;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDQuoteInfoRefactor instead.
 */
const HDQuoteInfo = ({ children }) => {
    return (
        <StyledDiv>
            <p className="substitute-vehicle-info-icon"><span>!</span></p>
            <p className="substitute-vehicle-info-paragraph">
                {children}
            </p>
        </StyledDiv>
    );
};

HDQuoteInfo.propTypes = {
    children: PropTypes.node.isRequired
};


export default HDQuoteInfo;
