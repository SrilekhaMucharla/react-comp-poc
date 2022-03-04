import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
} from '../../web-analytics';
import { HOMEPAGE } from '../../constant/const';
import * as messages from './HDErrorBoundaryPage.messages';
import '../../assets/sass-refactor/main.scss';

const HDErrorBoundaryPage = ({ errorInfo, error }) => {
    const handleGoBackToHomePage = () => {
        window.location.assign(HOMEPAGE);
    };
    return (
        <div className="error-boundary-container">
            <HDLabelRefactor Tag="h4" text={error} />
            <HDLabelRefactor Tag="p" text={errorInfo} />
            <div className="invalid-url-navigation">
                <HDButton
                    webAnalyticsEvent={{ event_action: messages.homepageButton }}
                    id="home-page-button"
                    size="lg"
                    data-testid="goto-home-buttton"
                    label={messages.homepageButton}
                    onClick={handleGoBackToHomePage} />
            </div>
        </div>
    );
};
HDErrorBoundaryPage.defaultProps = {
    error: '',
    errorInfo: ''
};
HDErrorBoundaryPage.propTypes = {
    error: PropTypes.string,
    errorInfo: PropTypes.string
};
export default HDErrorBoundaryPage;
