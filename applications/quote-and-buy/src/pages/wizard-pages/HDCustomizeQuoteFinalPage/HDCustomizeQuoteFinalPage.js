import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { AnalyticsHDToggleButtonGroup as HDToggleButtonGroup } from '../../../web-analytics/index';

function HDCustomizeQuoteFinalPage(props) {
    const [toggleStatus, setToggleStatus] = useState(0);
    const toggleValues = [{
        value: '1',
        name: 'yes',
        icon: 'check'
    }, {
        value: '2',
        name: 'no',
        icon: 'times'
    }];

    useEffect(() => {
        props.toggleContinueElement(false); // pass true to explicitly make parent continue button visible
    }, [props]);

    useEffect(() => {
        if (toggleStatus > 0) {
            props.navigate(true); // pass false to go back
        }
    }, [toggleStatus]);

    const toggleChange = (data) => {
        setToggleStatus(data.target.value);
    };

    return (
        <div>
            THANK YOU !!!
            <HDToggleButtonGroup
                webAnalyticsEvent={{ event_action: 'thank you' }}
                id="customize-quote-button-group"
                onChange={toggleChange}
                availableValues={toggleValues} />
        </div>
    );
}

HDCustomizeQuoteFinalPage.propTypes = {
    navigate: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    changeTabbed: PropTypes.func,
    toggleContinueElement: PropTypes.func
};

HDCustomizeQuoteFinalPage.defaultProps = {
    navigate: () => {
    },
    changeTabbed: () => {
    },
    toggleContinueElement: () => {
    }
};

export default withRouter(HDCustomizeQuoteFinalPage);
