import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDiv = styled.div`
    background: #a90d30;
    color: white;
    border-radius: 6px;
    padding: 10px 15px;
    margin: 0.5rem 0;
    i {
        padding-right: 5px;
    }
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDAlertRefactor instead.
 */
const HDAlert = ({ message }) => ((message) ? (
    <StyledDiv>
        <i className="fas fa-exclamation-circle" />
        {message}
    </StyledDiv>
) : null);

HDAlert.propTypes = {
    message: PropTypes.string
};

HDAlert.defaultProps = {
    message: null
};

export default HDAlert;
