/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    HDLabelRefactor, HDForm
} from 'hastings-components';
// import './HDCarUsagePage.scss';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDCarUsage.messages';
import * as helper from './HDCarUsageHelper';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';

function HastingsCarUsage(props) {
    const [showDiv, setShowDiv] = useState(false);
    const [businessUseValue, setBusinessUseValue] = useState(false);
    const [businessUse, setBusinessUse] = useState();
    const {
        submissionVM, setNavigation, typeOfUseValue, pageMetadata
    } = props;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const typeOfUseName = 'typeOfUse';
    const typeOfUsePath = `${vehiclePath}.${typeOfUseName}`;
    const businessUseValues = helper.usagePersonList;

    const typeOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.carUsage} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.carUsage} Info` }}
            showButtons={false}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
            labelText={messages.carUsageQuestion}
            id="car-usage-overlay"
        >
            <HDLabelRefactor
                Tag="h5"
                text={messages.carUsageOption1}
                id="car-usage-ovl-opt1-label" />
            <p>{messages.carUsageOption1Desc}</p>
            <HDLabelRefactor
                Tag="h5"
                text={messages.carUsageOption2}
                id="car-usage-ovl-opt2-label" />
            <p>{messages.carUsageOption2Desc}</p>
            <HDLabelRefactor
                Tag="h5"
                text={messages.carUsageOption3}
                id="car-usage-ovl-opt3-label" />
            <p>{messages.carUsageOption3Desc}</p>
        </HDOverlayPopup>
    );

    const checkSelectedBusinessValue = () => {
        if (typeOfUseValue.code === '19' || typeOfUseValue.code === '20' 
        || typeOfUseValue.code === '18'|| typeOfUseValue.code === '02'|| typeOfUseValue.code === '06') { return true; }
    };

    // toggle div visibility after typeOfUseValue change
    useEffect(() => {
        setShowDiv(!typeOfUseValue || checkSelectedBusinessValue());
    }, [typeOfUseValue]);

    // intial set on component mount (needs to be below upper useEffect for special case at the beginning)
    useEffect(() => {
        setShowDiv(typeOfUseValue && checkSelectedBusinessValue());
        if (typeOfUseValue && checkSelectedBusinessValue()) { setBusinessUse(messages.businessUse); }
    }, []);


    const validationSchema = yup.object({
        [typeOfUseName]: yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(typeOfUsePath, null, submissionVM),
    });

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid, showForward: true });
    };

    const businessUsePopulate = (event, hdProps) => {
        hdProps.setFieldTouched(`${typeOfUseName}`, false, false);
        setBusinessUse(null);
        if (event.target.value === messages.businessUse) {
            setBusinessUse(messages.businessUse);
        }
        setShowDiv(!typeOfUseValue || checkSelectedBusinessValue());
    };

    const selectBuisnesUse = (event) => {
        setBusinessUseValue(event.target.value);
        _.set(submissionVM, `${typeOfUsePath}.value`, event.target.value.value);
    };

    useEffect(() => {
        setNavigation({ canForward: false, showForward: true });
    }, []);

    const mainList = helper.usageList;
    return (
        <Container className="car-usage-container">
            <Row>
                <Col>
                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        {(hdProps) => {
                            return (
                                <>
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: messages.carUsageQuestion }}
                                        id="usage-person-button-group"
                                        path={typeOfUsePath}
                                        name={typeOfUseName}
                                        label={{
                                            Tag: 'h2',
                                            text: messages.carUsageQuestion,
                                            icon: typeOverlay,
                                            iconPosition: 'r'
                                        }}
                                        data={businessUse}
                                        availableValues={mainList}
                                        onChange={(event) => businessUsePopulate(event, hdProps)}
                                        btnGroupClassName="grid grid--col-lg-3 btn-tall-height"
                                        noErrorMessage />
                                    <div hidden={!showDiv} className="margin-top-xl">
                                        <hr />
                                        <HDDropdownList
                                            webAnalyticsEvent={{ event_action: messages.usagePersonQuestion }}
                                            id="business-use"
                                            name={typeOfUseName}
                                            path={typeOfUsePath}
                                            label={{ text: messages.usagePersonQuestion, Tag: 'h2' }}
                                            options={businessUseValues}
                                            placeholder="Please select"
                                            selectSize="md-8"
                                            theme={messages.dropdownTheme}
                                            onChange={selectBuisnesUse}
                                            value={businessUseValue}
                                            isSearchable={false}
                                        />
                                    </div>
                                </>
                            );
                        }}
                    </HDForm>
                </Col>
            </Row>
        </Container>
    );
}
const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        typeOfUseValue: state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].typeOfUse.value,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HastingsCarUsage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    typeOfUseValue: PropTypes.shape({ code: PropTypes.string }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HastingsCarUsage.defaultProps = {
    typeOfUseValue: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsCarUsage);
