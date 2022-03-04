import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { HDInfoCardRefactor, HDLabelRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { connect, useSelector, useDispatch } from 'react-redux';
import { AnalyticsHDButton as HDButton, AnalyticsHDLabel as HDLabel } from '../../web-analytics';
import multiCar from '../../assets/images/icons/multi-car.svg';
import oneCar from '../../assets/images/icons/one-car.svg';
import TipCirclePurple from '../../assets/images/icons/tip_circle_purple.svg';
import { CUSTOMER_JOURNEY_IDENTIFIER } from '../../customer/directintegrations/faq/epticaMapping';
import { updateEpticaId as updateEpticaIdAction, setNavigation } from '../../redux-thunk/actions';
import { ABOUT_MC_COVER } from '../../routes/BaseRouter/RouteConst';
import BackNavigation from '../Controls/BackNavigation/BackNavigation';
import * as messages from './HastingsDirectIntroCarPage.messages';
import * as monetateHelper from '../../common/monetateHelper';
import { trackEvent } from '../../web-analytics/trackData';
import { defaqtoSrc } from '../../constant/const';
import HastingsInterstitialPageHelper from '../HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';
import { producerCodeList } from '../../common/producerCodeHelper';


export const HastingsDirectIntroCarPage = ({
    history,
    updateEpticaId,
    location,
    submissionVM
}) => {
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const monetateResultModel = useSelector((state) => state.monetateModel);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const [showMutiCar, setShowMultiCar] = useState(false);
    const pcwName = useSelector((state) => state.wizardState.app.pcwName);
    const [cookies, setCookie] = useCookies(['']);
    const [producerCode, setProducerCode] = useState(null);
    const [actionType, setActionType] = useState(null);
    const producerCodeListforBackNavigation = producerCodeList.filter((code) => code !== messages.hdWebsite);

    const dispatch = useDispatch();
    useEffect(() => {
        updateEpticaId(CUSTOMER_JOURNEY_IDENTIFIER);
    }, []);
    useEffect(() => {
        let tempArray = []; let filteredArray = []; let nonFilteredArray = []; let reportingArray = []; const { monetateEngineData } = window;
        if (monetateResultModel && _.get(monetateResultModel, 'resultData', undefined)
            && Array.isArray(multiCarElements) && multiCarElements !== undefined && multiCarElements !== 'undefined') {
            setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
            reportingArray = monetateHelper.getReportingArray(multiCarElements);
            if (Array.isArray(reportingArray) && reportingArray.length) {
                reportingArray.map((element) => {
                    if (typeof window !== 'undefined' && Array.isArray(monetateEngineData)) monetateEngineData.push(element);
                });
            }


            const seenParam = monetateHelper.getSeenParam(multiCarElements);
            let producerCodeArray = monetateHelper.fetchCookieByName('mc.producerCode') && monetateHelper.fetchCookieByName('mc.producerCode');
            if (!producerCodeArray.includes(pcwName)) {
                tempArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray ? cookies['mc.v'].producerCodeSeenParamArray : [];
                producerCodeArray = producerCodeArray.concat(producerCodeArray.length && cookies['mc.producerCode'] ? `${`,${pcwName}`}` : `${pcwName}`);
                setCookie('mc.producerCode', producerCodeArray, {
                    path: '/'
                });
                tempArray.push({ producerCode: pcwName, seenMulticar: seenParam === undefined ? 'None' : seenParam.toString() });
            } else {
                filteredArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray
                && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode === pcwName);
                nonFilteredArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray
                && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode !== pcwName);
                if (filteredArray && filteredArray.length) {
                    filteredArray[0].producerCode = pcwName;
                    filteredArray[0].seenMulticar = (seenParam === undefined) ? 'None' : seenParam.toString();
                }
                tempArray = [...nonFilteredArray, ...filteredArray];
            }
            const pcSeenObj = {
                producerCodeSeenParamArray: tempArray
            };
            const val = { monetateId: cookies['mt.v'] ? cookies['mt.v'] : retrievedCookie, ...pcSeenObj };
            if (!cookies['mt.v'] && retrievedCookie) {
                setCookie('mt.v', retrievedCookie, {
                    path: '/'
                });
            }
            const obj = JSON.stringify(val);
            setCookie('mc.v', obj, {
                path: '/'
            });
        }
        if (_.has(location, 'search')) {
            const paramvalues = location.search;
            if (paramvalues !== '') {
                const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
                _.set(submissionVM, 'baseData.producerCode', parsedParams.producerCode);
                dispatch(setNavigation({
                    actionType: parsedParams.action,
                    pcwName: parsedParams.producerCode
                }));
                setProducerCode(parsedParams.producerCode);
                setActionType(parsedParams.action);
            }
        }
        if (!cookies['mt.v'] && retrievedCookie) {
            setCookie('mt.v', retrievedCookie, {
                path: '/'
            });
        }
    }, [multiCarElements]);
    const handleWizardFlow = (carType) => {
        if (carType === messages.oneCar) {
            history.push({
                pathname: '/vrn-search-page',
                state: { singleCar: true }
            });
        } else if (carType === messages.van) {
            history.push({
                pathname: '/vrn-search-page',
                state: {van: true}
            })
        }
        
        
        else {
            history.push({
                pathname: ABOUT_MC_COVER,
                state: { singleCar: true, fromPage: history.location.pathname }
            });
        }
    };

    const dontKnowLinkHandler = () => {
        trackEvent({
            event_value: messages.dontKnowLink,
            event_action: messages.dontKnowLink,
            event_type: 'checkbox_click',
            element_id: 'nbyCheckBox',
        });
        handleWizardFlow(messages.oneCar);
    };

    return (
        <div className="page-content-wrapper background-body car-intro-page-container car-bg-outer transparent-footer">
            <Container>
                { !_.includes(producerCodeListforBackNavigation, pcwName) && (
                    <Row>
                        <Col>
                            <BackNavigation />
                        </Col>
                    </Row>
                ) }
                <Row className="margin-top-lg">
                    <Col xs={12} md={6}>
                        <Row>
                            <Col className="pr-xl-5">
                                <HDLabelRefactor
                                    id="page-intro-title"
                                    Tag="h1"
                                    text={messages.headerMessage} />
                            </Col>
                        </Row>
                        <Row className="col-elem-same-height ">
                            <Col xs={6} lg={4}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.headerMessage, sales_journey_type: 'single_car' }}
                                    id="page-intro-one-car"
                                    className="hd-button-icon-row intro-car-button"
                                    label={messages.oneCar}
                                    variant="default"
                                    onClick={() => handleWizardFlow(messages.oneCar)}
                                >
                                    <span>
                                        <img src={oneCar} alt="one car icon" />
                                    </span>
                                </HDButton>
                            </Col>
                            <Col xs={6} lg={4}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.headerMessage, sales_journey_type: 'single_car' }}
                                    id="page-intro-one-car"
                                    className="hd-button-icon-row intro-car-button"
                                    label={messages.van}
                                    variant="default"
                                    onClick={() => handleWizardFlow(messages.van)}
                                >
                                    <span>
                                        <img src={oneCar} alt="one car icon" />
                                    </span>
                                </HDButton>
                            </Col>
                            {showMutiCar && (
                                <Col xs={6} lg={4}>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.headerMessage, sales_journey_type: 'single_car' }}
                                        id="page-intro-multi-car"
                                        className="hd-button-icon-row intro-car-button"
                                        label={messages.multiCar}
                                        variant="default"
                                        onClick={() => handleWizardFlow(messages.multiCar)}
                                    >
                                        <span>
                                            <img src={multiCar} alt="multi car icon" />
                                        </span>
                                    </HDButton>
                                </Col>
                            )}
                        </Row>
                        {showMutiCar && (
                            <Row className="margin-top-lg margin-top-lg-mobile">
                                <Col>
                                    <HDLabel
                                        webAnalyticsEvent={{ event_action: messages.dontKnowLink, sales_journey_type: 'single_car' }}
                                        id="page-intro-decide-later"
                                        Tag="a"
                                        text={messages.dontKnowLink}
                                        onClick={() => dontKnowLinkHandler()} />
                                </Col>
                            </Row>
                        )}
                        {showMutiCar
                        && (
                            <Row className="margin-top-lg">
                                <Col>
                                    <HDInfoCardRefactor id="page-intro-info-card" image={TipCirclePurple} paragraphs={[messages.tipBody]} />
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col sm={{ span: 12, offset: 0 }} md={{ span: 6, offset: 0 }} lg={{ span: 5, offset: 1 }} className="margin-top-only-mobile-lg">
                        <div className="info-box">
                            <div className="info-box-title">
                                <Row>
                                    <Col>
                                        <HDLabelRefactor
                                            id="page-intro-info-box-title"
                                            Tag="h3"
                                            text={messages.defaqtoTitle} />
                                    </Col>
                                </Row>
                            </div>
                            <div className="info-box-description">
                                <Row>
                                    <Col xs={4} sm={5} md={4}>
                                        <img className="img-fluid" src={defaqtoSrc} alt="Defaqto2" />
                                    </Col>
                                    <Col xs={8} sm={7} md={8}>
                                        <HDLabelRefactor
                                            id="page-intro-info-description"
                                            className="page-intro-info-box-description"
                                            Tag="p"
                                            text={messages.defaqtoDescrition} />
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col>
                                        <HDLabelRefactor
                                            id="page-intro-info-footer"
                                            className="text-small"
                                            Tag="p"
                                            text={messages.defaqtoMessage} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="car-bg" />
        </div>
    );
};
const mapStateToProps = (state) => {
    return { submissionVM: state.wizardState.data.submissionVM };
};
const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction,

};

HastingsDirectIntroCarPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    }).isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HastingsDirectIntroCarPage));
