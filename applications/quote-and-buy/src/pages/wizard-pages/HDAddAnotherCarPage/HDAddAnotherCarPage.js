import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
// import './HDAddAnotherCarPage.scss';
import { connect } from 'react-redux';
import {
    HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics/index';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDAddAnotherCar.messages';

const HDAddAnotherCarPage = (props) => {
    const {
        submissionVM,
        setNavigation,
        pageMetadata
    } = props;
    const isCarAddAnotherFieldName = 'isAddAnotherCar';

    const availableValues = [{
        value: messages.yes,
        name: messages.yes,
        icon: 'check'
    }, {
        value: messages.no,
        name: messages.no,
        icon: 'times'
    }];

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canForward: false });
    }, []);

    if (!submissionVM) {
        return ' ';
    }

    const trackAddAnotherCarChange = (event) => {
        if (event.target.value === messages.yes || event.target.value === messages.no) {
            setNavigation({ canForward: true });
        }
    };

    const addAnotherCarOverlay = (
        <HDOverlayPopup
            webAnalyticsEvent={{ event_action: messages.testHeaderOverlay }}
            webAnalyticsView={{ ...pageMetadata, page_section: messages.testHeaderOverlay }}
            id="homeOverNightHeaderText"
            overlayButtonIcon={<i className="fa fa-info-circle" aria-hidden="true" />}
        >
            <div id="homeOverNightOverlayContainer" className="carovernightoverlaycontainer">
                <p id="homeOverNightOverlayHeader" className="carovernightoverlayheader">
                    {messages.testHeaderOverlay}
                </p>
                <p id="homeOverNightOverlayBody" className="carovernightoverlaybody">
                    {messages.testBodyOverlay}
                </p>
            </div>
        </HDOverlayPopup>
    );

    return (
        <div id="carAddAnotherMainContainer" className="caraddanothermaincontainer">
            <div id="carAddAnotherItems" className="caraddanotheritems">
                <Row id="carAddAnotherItemsRow" className="caraddanotherrow">
                    <Col id="carAddAnotherItemsCol" xs={12} md={12} className="caraddanothercol">
                        <div id="carAddAnotherInputBox" className="caraddanotherinput">
                            <div id="carAddAnotherHeaderStatic" className="caraddanotherstatic">
                                <HDInfoCardRefactor>
                                    <div className="caraddanotherstaticheader">
                                        <HDLabelRefactor Tag="h2" text={messages.moreThanOneCar} />
                                    </div>
                                    <div className="caraddanotherstaticbody">
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.simpleSetUp}
                                            icon={<i className="fas fa-check" />}
                                            iconPosition="l" />
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.carDiscount}
                                            icon={<i className="fas fa-check" />}
                                            iconPosition="l" />
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.renewalNextYear}
                                            icon={<i className="fas fa-check" />}
                                            iconPosition="l" />
                                    </div>
                                </HDInfoCardRefactor>
                            </div>
                            <div id="AddAnotherkeepTheCarOverNight" className="keepthecarovernight caraddanotherheader">
                                <HDToggleButtonGroup
                                    webAnalyticsEvent={{ event_value: messages.addAnotherCar }}
                                    id="add-another-car-button-group"
                                    name={isCarAddAnotherFieldName}
                                    availableValues={availableValues}
                                    label={{
                                        text: messages.addAnotherCar,
                                        Tag: 'p',
                                        icon: addAnotherCarOverlay,
                                        iconPosition: 'r'
                                    }}
                                    onChange={trackAddAnotherCarChange} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HDAddAnotherCarPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDAddAnotherCarPage);
