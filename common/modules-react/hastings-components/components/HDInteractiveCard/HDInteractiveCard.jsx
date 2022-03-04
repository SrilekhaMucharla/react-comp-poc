import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import theme from "../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss";

const StyledInteractiveCard = styled.div`
  background: ${theme.commonCompoBGColorWhite};
  color: ${theme.commonCompoTextColorBlueDark};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content {
    font-family: ${theme.genericTitleBoldFontFace};
    color: ${theme.commonCompoTextColorBlueDark};
    font-size: 16px;
    line-height: 1.2;
  }
  .icons {
    display: flex;
    width: 64px;
    justify-content: space-around;
  }
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDInteractiveCardRefactor instead.
 */
const HDInteractiveCard = ({ children, icons }) => (
    <StyledInteractiveCard>
        <div className="content">
            {children}
        </div>
        <div className="icons">
            {icons}
        </div>
    </StyledInteractiveCard>
);

HDInteractiveCard.propTypes = {
    children: PropTypes.node.isRequired,
    icons: PropTypes.node
};

HDInteractiveCard.defaultProps = {
    icons: null
};

export default HDInteractiveCard;
