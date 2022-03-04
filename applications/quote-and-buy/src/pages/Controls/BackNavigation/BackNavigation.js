/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HDButtonRefactor } from 'hastings-components';
import * as Message from '../ControlConst';
import BackIcon from './BackIcon';
import { HOMEPAGE } from '../../../constant/const';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';

const BackNavigation = (props) => {
    const history = useHistory();

    const {
        onKeyPress, onClick, className, disabled
    } = props;

    // Takes user directly to previous screen based on routing history
    // const handleBack = () => history.goBack();
    const handleBack = () => {
        if (props.pathNav) {
            history.push({
                pathname: props.pathNav,
                state: { singleCar: true }
            });
        } else if (history.location && history.location.pathname && history.location.pathname.includes('/intro')) {
            window.location.assign(HOMEPAGE);
        } else {
            history.goBack();
        }
    };

    return (
        // will be replced by back button component
        <HDButton
            webAnalyticsEvent={{ event_action: Message.goback }}
            id="backNavMain"
            name="go-back"
            className={`go-back ${className}`}
            variant="default"
            label={Message.goback}
            onKeyPress={onKeyPress || handleBack}
            onClick={onClick || handleBack}
            disabled={disabled}
        >
            <span className="back-icon"><BackIcon /></span>
        </HDButton>
    );
};

BackNavigation.propTypes = {
    onKeyPress: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

BackNavigation.defaultProps = {
    onKeyPress: null,
    onClick: null,
    className: '',
    disabled: undefined
};

export default BackNavigation;
