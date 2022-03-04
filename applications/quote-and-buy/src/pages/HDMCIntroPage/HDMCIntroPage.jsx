import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton
} from '../../web-analytics';
import mcCarImageMobile from '../../assets/images/background/rectangle-2830.png';
import mcCarImageMDesktop from '../../assets/images/background/car-info-found-it-bg.png';
import { INTRO, VRN_SEARCH_PAGE, CUSTOMIZE_QUOTE_WIZARD, ADD_ANOTHER_DRIVER } from '../../routes/BaseRouter/RouteConst';
import wizardRoutes from '../../routes/WizardRouter/RouteConst';
import {
    aboutMc, mcQuickNote, mcPointOne, mcPointTwo, mcPointThree, mcPointFour,
    mcPointFive, continueWithMC, continueWithSingelCar, goBack, multiToSingle, multiToSingleFailed
} from './HDMCIntroPage.messages';
import {
    setNavigation, setMultiCarSubmissionVM, singleToMultiProduct, setErrorStatusCode,
    clearLWRQuoteData
} from '../../redux-thunk/actions';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import mcsubmission from '../../routes/MCSubmissionVMInitial';
import HDQuoteService from '../../api/HDQuoteService';
import { getMultiToSingleParam } from '../../common/utils';
import backIcon from '../../assets/images/icons/back-icon.svg';
import customSubmission from '../wizard-pages/__helpers__/customizeSubmissionVMInitial';
import { trackAPICallFail, trackAPICallSuccess } from '../../web-analytics/trackAPICall';

const HDMCIntroPage = (props) => {
    const {
        history,
        mcsubmissionVM,
        submissionVM,
        singleToMultiProductModel,
        customizeSubmissionVM
    } = props;
    const dispatch = useDispatch();
    const viewModelService = useContext(ViewModelServiceContext);
    const [multicarsubmissionVMCreated, setmulticarSubmissionVMCreated] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const submissionVMBeforeEdit = useSelector((state) => state.getObjectBeforeEdit && state.getObjectBeforeEdit.data);
    if (viewModelService) {
        if (!multicarsubmissionVMCreated && _.get(mcsubmissionVM, 'value.accountNumber') === undefined) {
            dispatch(setMultiCarSubmissionVM({
                mcsubmissionVM: viewModelService.create(
                    {},
                    'pc',
                    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
                ),
            }));
            setmulticarSubmissionVMCreated(true);
        }
    }

    // for multi to single
    const multiToSingleHandler = () => {
        if (_.get(submissionVM, 'value.quoteID', false)) {
            history.push({
                pathname: wizardRoutes.ADD_ANOTHER_DRIVER
            });
        } else {
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    _.set(submissionVM, 'value', result);
                    dispatch(setNavigation({ quoteID: result.quoteID, sessionUUID: result.sessionUUID }));
                    hideLoader();
                    history.push({
                        pathname: wizardRoutes.ADD_ANOTHER_DRIVER
                    });
                    trackAPICallSuccess(multiToSingle);
                }).catch((error) => {
                    hideLoader();
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                });
        }
    };

    const continueSingleCarHandler = () => {
        dispatch(setNavigation({ multiCarFlag: false }));
        if (_.get(mcsubmissionVM, 'value.quotes.length', false)) {
            showLoader();
            multiToSingleHandler();
        } else {
            const fromPageVal = _.get(history, 'location.state.fromPage', false);
            if ((fromPageVal === INTRO) || !fromPageVal) {
                history.push({
                    pathname: VRN_SEARCH_PAGE,
                    state: {
                        singleCar: true,
                        fromPage: history.location.pathname
                    }
                });
            } else {
                history.push({
                    pathname: fromPageVal
                });
            }
        }
    };

    useEffect(() => {
        dispatch(setNavigation({ multiCarFlag: false }));
        window.scroll(0, 0);
    }, []);

    const checkPageForSingleToMulti = () => {
        if (history.location.state && (history.location.state.fromPage === wizardRoutes.ADD_ANOTHER_DRIVER
                || history.location.state.fromPage === CUSTOMIZE_QUOTE_WIZARD)) {
            return true;
        }
        return false;
    };

    const continueMultiCarHandler = () => {
        dispatch(setNavigation({ multiCarFlag: true, hideGoBack: false }));
        _.set(mcsubmissionVM, 'value', mcsubmission);
        if (checkPageForSingleToMulti()) {
            showLoader();
            if (history.location.state.fromPage === CUSTOMIZE_QUOTE_WIZARD) { dispatch(setNavigation({ softSellJourney: true })); }
            if (isEditQuoteJourney && history.location.state.fromPage === ADD_ANOTHER_DRIVER) {
                const brandCode = _.get(submissionVMBeforeEdit, 'submission.baseData.brandCode', 'HD');
                _.set(submissionVM, 'value.baseData.brandCode', brandCode);
            }
            dispatch(setNavigation({ singleToMultiJourney: true, isEditQuoteJourney: false }));
            dispatch(singleToMultiProduct(submissionVM, mcsubmissionVM));
            setAPITriggerPoint(true);
        } else {
            history.push({
                pathname: VRN_SEARCH_PAGE,
                state: { singleCar: false, multiCarFlag: true, fromPage: history.location.pathname }
            });
        }
    };

    useEffect(() => {
        if (!_.isEmpty(singleToMultiProductModel.multiQuoteObj) && !singleToMultiProductModel.loading && aPITriggerPoint) {
            // success
            dispatch(setNavigation({ multiCarFlag: true }));
            dispatch(clearLWRQuoteData());
            const isCustomSubVMCreated = _.get(customizeSubmissionVM, 'value', false);
            const isCustomSubVMHasID = _.get(customizeSubmissionVM, 'value.quoteID', false);
            if (isCustomSubVMCreated && isCustomSubVMHasID) {
                _.set(customizeSubmissionVM, 'value', customSubmission);
            }
            _.set(mcsubmissionVM, 'value', singleToMultiProductModel.multiQuoteObj);
            hideLoader();
            history.push({
                pathname: VRN_SEARCH_PAGE,
                state: { resetSubmission: true, fromPage: history.location.pathname }
            });
            setAPITriggerPoint(false);
        }
        if (singleToMultiProductModel.quoteError && !singleToMultiProductModel.loading && aPITriggerPoint) {
            // failure
            hideLoader();
            setAPITriggerPoint(false);
        }
    }, [singleToMultiProductModel.multiQuoteObj, singleToMultiProductModel.loading, singleToMultiProductModel.quoteError]);

    const handleBackNavigation = () => {
        if (_.get(mcsubmissionVM, 'value.quotes.length', false)) {
            showLoader();
            multiToSingleHandler();
        } else {
            const fromPageVal = _.get(history, 'location.state.fromPage', false);
            if (fromPageVal) {
                history.push({ pathname: fromPageVal });
            } else {
                history.push({ pathname: INTRO });
            }
        }
    };

    return (
        <div className="mc-intro-container">
            <div className="mc-intro__arc-header arc-header" />
            <Container className="mc-intro__content-container">
                <Row>
                    <Col>
                        {/* Added this because we need multi to single api call in some scenario */}
                        <HDButton
                            webAnalyticsEvent={{ event_action: goBack }}
                            id="backNavMain"
                            name="go-back"
                            className="go-back margin-bottom-md"
                            variant="default"
                            label={goBack}
                            onClick={handleBackNavigation}
                        >
                            <img className="back-icon" src={backIcon} alt="Back" />
                        </HDButton>
                        <HDLabelRefactor Tag="h1" text={aboutMc} className="margin-bottom-tiny" />
                        <HDLabelRefactor Tag="h5" text={mcQuickNote} className="margin-bottom-lg" />
                        <div className="mc-intro__info-box elevated-box">
                            <div className="mc-intro__info-box__img-container">
                                <img src={mcCarImageMobile} alt="Multi Car Img" className="mc-intro__info-box__img-container__image-mob" />
                                <img src={mcCarImageMDesktop} alt="Multi Car Img" className="mc-intro__info-box__img-container__image-desk" />
                            </div>
                            <div className="mc-intro__info-box__points">
                                <ul>
                                    <li>
                                        <HDLabelRefactor Tag="p" text={mcPointOne} className="mc-intro__info-box__points__item" />
                                    </li>
                                    <li>
                                        <HDLabelRefactor Tag="p" text={mcPointTwo} className="mc-intro__info-box__points__item" />
                                    </li>
                                    <li>
                                        <HDLabelRefactor Tag="p" text={mcPointThree} className="mc-intro__info-box__points__item" />
                                    </li>
                                    <li>
                                        <HDLabelRefactor Tag="p" text={mcPointFour} className="mc-intro__info-box__points__item" />
                                    </li>
                                    <li>
                                        <HDLabelRefactor Tag="p" text={mcPointFive} className="mc-intro__info-box__points__item" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Row className="mc-intro__cta-footer">
                            <Col xs={12} md={6}>
                                <HDButton
                                    id="mc-intro-continue-with-mc-button"
                                    webAnalyticsEvent={{ event_action: continueWithMC }}
                                    onClick={continueMultiCarHandler}
                                    label={continueWithMC}
                                    variant="primary"
                                    className="theme-white btn-block mc-intro__cta-footer__mc-btn"
                                    size="md" />
                            </Col>
                            <Col xs={12} md={6}>
                                <HDButton
                                    id="mc-intro-continue-with-sc-button"
                                    webAnalyticsEvent={{ event_action: continueWithSingelCar }}
                                    onClick={continueSingleCarHandler}
                                    label={continueWithSingelCar}
                                    variant="secondary"
                                    className="theme-white btn-block mc-intro__cta-footer__sc-btn"
                                    size="md" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            {HDFullscreenLoader}
        </div>
    );
};

HDMCIntroPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func,
        location: PropTypes.object,
    }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape([])
    }).isRequired,
    singleToMultiProductModel: PropTypes.shape({
        multiQuoteObj: PropTypes.object,
        loading: PropTypes.bool,
        quoteError: PropTypes.object
    }).isRequired,
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }),
    customizeSubmissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    })
};

HDMCIntroPage.defaultProps = {
    submissionVM: null,
    customizeSubmissionVM: null
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        submissionVM: state.wizardState.data.submissionVM,
        singleToMultiProductModel: state.singleToMultiProductModel,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigation
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCIntroPage);
