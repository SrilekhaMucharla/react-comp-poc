import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

function HDCustomizeQuoteWelcomePage(props) {
    useEffect(() => {
        props.toggleContinueElement(true); // pass false to explicitly make parent continue button invisible
    }, [props]);

    return (
        <div>WELCOME PAGE</div>
    );
}

HDCustomizeQuoteWelcomePage.propTypes = {
    toggleContinueElement: PropTypes.func
};

HDCustomizeQuoteWelcomePage.defaultProps = {
    toggleContinueElement: () => {
    }
};
export default withRouter(HDCustomizeQuoteWelcomePage);
