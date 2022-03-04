import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import './HastingDirectCustomerPage.scss';
import {
    HDInfoCard, HDLabel
} from 'hastings-components';
import { Col, Row } from 'react-bootstrap';
import { AnalyticsHDButton as HDButton, AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../web-analytics';
import BackNavigation from '../Controls/BackNavigation/BackNavigation';
import tipCirclePurple from '../../assets/images/icons/tip_circle_purple.svg';
// import { sendPageData } from '../../redux-thunk/actions';
import * as Message from './HastingDirectCustomerPage.messages';

class HastingDirectCustomerPage extends Component {
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func
        }).isRequired,
        pageMetadata: PropTypes.shape({
            page_name: PropTypes.string.isRequired,
            page_type: PropTypes.string.isRequired,
            sales_journey_type: PropTypes.string.isRequired
        }).isRequired,
    };

    // pageID = 'HastingDirectCustomerPage';

    // componentDidMount() {
    //     // eslint-disable-next-line react/prop-types
    //     const { dispatch } = this.props;
    //     const dataObj = { page_name: this.pageID };
    //     dispatch(sendPageData(dataObj));
    // }

    handleWizardFlow = () => {
        const { history } = this.props;
        history.push({
            pathname: '/intro-car-page',
            state: { singleCar: true }
        });
    };

    tooltipOverlay = (id) => (
        <HDOverlayPopup
            // eslint-disable-next-line react/destructuring-assignment
            webAnalyticsView={{ ...this.props.pageMetadata, page_section: `${Message.acceptancecriteriaprefix} Info` }}
            webAnalyticsEvent={{ event_action: `${Message.acceptancecriteriaprefix} Info` }}
            id={id}
            overlayButtonIcon={(
                <>
                    <span className="acceptance-criteria-prefix">{Message.acceptancecriteriaprefix}</span>
                    <p className="acceptance-criteria-link">
                        {Message.acceptancecriteria}
                    </p>
                </>
            )}
        >
            <div id="introOverlayContainer" className="introcustomeroverlaycontainer">
                <p id="introOverlayHeaderParagraph" className="introcustomeroverlayheader">
                    {Message.overlayHeader}
                </p>
                <p>
                    {Message.overlayBodyTitle1}
                </p>
                <ul>
                    {[
                        Message.overlayBodyLiseElementa,
                        Message.overlayBodyLiseElementb,
                        Message.overlayBodyLiseElementc,
                        Message.overlayBodyLiseElementd,
                        Message.overlayBodyLiseElemente,
                        Message.overlayBodyLiseElementf,
                        Message.overlayBodyLiseElementg,
                        Message.overlayBodyLiseElementh,
                    // eslint-disable-next-line react/no-array-index-key
                    ].map((el, index) => (<li key={index}><span>{el}</span></li>))}
                </ul>
                <p>
                    {Message.overlayBodyTitle2}
                </p>
                <ol>
                    {[
                        Message.overlayBodyListElementPart2a,
                        Message.overlayBodyListElementPart2b,
                        Message.overlayBodyListElementPart2c,
                    ].map((el) => (<li><span>{el}</span></li>))}
                </ol>
                <p>
                    {Message.overlayBodyTitle3}
                </p>
            </div>
        </HDOverlayPopup>
    );

    render() {
        return (
            <div className="introcustomerpagecontainer" id="introCustomerPageContainer">
                <div className="introcomponents" id="introComponents">
                    <Row className="grid-container" id="introGridContainer">
                        <Col lg={6} md={6} xs={12} className="item-left" id="introItemLeft">
                            <div className="item-left-container" id="introItemLeftContainer">
                                <BackNavigation />
                                <HDLabel text={Message.hello} size="xl" />
                                <div className="customer-button first-btn">
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: Message.hello }}
                                        id="existing-customer-button"
                                        variant={Message.cardbutton}
                                        label={Message.oldcustomer}
                                        // eslint-disable-next-line react/jsx-no-bind
                                        onClick={this.handleWizardFlow.bind(this)} />
                                </div>
                                <div className="customer-button">
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: Message.hello }}
                                        id="new-customer-button"
                                        variant={Message.cardbutton}
                                        label={Message.newcustomer}
                                        disabled />
                                </div>
                                <div className="tip-main-left" id="introTipMainLeft">
                                    <HDInfoCard image={tipCirclePurple} paragraphs={[Message.alreadycarbike]} />
                                </div>
                                <div className="acceptance-criteria" id="introAcceptanceCriteria">
                                    <HDLabel text="" size="sm" icon={this.tooltipOverlay('introAcceptanceCriteriaLink')} iconPosition="l" />
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12} className="item-right" id="introItemRight">
                            <div className="item-right-container" id="introItemRightContainer">
                                <div className="tip-main-right" id="introTipMainRight">
                                    <HDInfoCard
                                        isRight
                                        title={Message.titleright}
                                        paragraphs={[Message.tosaveyourself, Message.tosaveyourselfparagraph]}
                                        notes={Message.rightnotes} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

HastingDirectCustomerPage.propTypes = {};

export default HastingDirectCustomerPage;
