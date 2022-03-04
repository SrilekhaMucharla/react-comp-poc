import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import { Row, Container } from 'react-bootstrap';
import {
    AnalyticsHDButton as HDButton,
} from '../../web-analytics';
import { HOMEPAGE } from '../../constant/const';
import { MISCELLANEOUS } from '../../customer/directintegrations/faq/epticaMapping';
import * as messages from './HDInvalidURLErrorPage.messages';
import '../../assets/sass-refactor/main.scss';
import { updateEpticaId as updateEpticaIdAction } from '../../redux-thunk/actions';

const HDInvalidURLErrorPage = ({ fromWizard, updateEpticaId }) => {
    useEffect(() => {
        updateEpticaId(MISCELLANEOUS);
    }, []);


    const handleGoBackToHomePage = () => {
        window.location.assign(HOMEPAGE);
    };

    const invalidUrlClass = fromWizard === 'yes' ? 'invalid-url-container invalid-url-container-override' : 'invalid-url-container';
    const invalidUrlClassContainer = fromWizard !== 'yes' ? 'invalid-url-container-general' : '';
    return (
        <Container fluid>
            <Row>
                <Container className={invalidUrlClassContainer}>
                    <Row>
                        <div className={invalidUrlClass}>
                            <HDLabelRefactor Tag="h4" text={messages.header} />
                            <HDLabelRefactor Tag="p" text={messages.subHeader} />
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
                    </Row>
                </Container>
            </Row>
        </Container>
    );
};

const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction
};

HDInvalidURLErrorPage.defaultProps = {
    fromWizard: 'No',
    updateEpticaId: () => {},
};
HDInvalidURLErrorPage.propTypes = {
    fromWizard: PropTypes.string,
    updateEpticaId: PropTypes.func,
};
export default connect(null, mapDispatchToProps)(HDInvalidURLErrorPage);
