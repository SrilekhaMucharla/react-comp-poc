import React from 'react';
import { HDLabelRefactor, HDButtonRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { HOMEPAGE } from '../../../constant/const';
import * as messages from './HDBindErrorPage.messages';

const HDBindErrorPage = (props) => {
    const { submissionVM, customizeSubmissionVM, multiCarFlag, mcsubmissionVM } = props;
    const numbers = require('./PhoneNumbers.json');
    const defaultPhoneNumberKey = 'Default';
    const quoteId = multiCarFlag ? _.get(mcsubmissionVM, 'value.mpwrapperNumber', '<xxxxxx>') : _.get(submissionVM, 'quoteID.value');
    const producerCode = _.get(submissionVM, 'baseData.producerCode.value');
    const campaignCode = _.get(submissionVM, 'baseData.trackingCode.value[0].codeValue');
    const productCode = _.get(submissionVM, 'baseData.productCode.value');
    const selectedBrand = (customizeSubmissionVM) ? _.get(customizeSubmissionVM, 'quote.branchCode.value') : defaultPhoneNumberKey;
    const phoneNumberKey = (producerCode && campaignCode && productCode)
        ? `${producerCode}/${campaignCode}/${productCode}/${selectedBrand}` : selectedBrand;
    const phoneNumber = (numbers[phoneNumberKey]) ? numbers[phoneNumberKey] : numbers[selectedBrand];

    const handleContinueTriggerButton = () => {
        window.location.assign(HOMEPAGE);
    };

    return (
        <div className="page-content-wrapper background-body bind-error-wrapper">
            <div className="container bind-error-container">
                <div className="row">
                    <div className="col col-lg-6 offset-lg-3">
                        <HDLabelRefactor Tag="h2" text={messages.errorHeader} className="bind-error-header-label" />
                        <div className="bind-error-details">
                            <HDLabelRefactor Tag="p" text={messages.errorSubHeaderOne} className="bind-error-sub-header-one-label" />
                            <div className="bind-error-message-label bind-error-label">
                                <p>
                                    {messages.errorMessageOne}
                                    <span className="error-data">
                                        &nbsp;
                                        {phoneNumber}
                                        &nbsp;
                                    </span>
                                    {messages.errorMessageTwo}
                                </p>
                            </div>
                            <HDLabelRefactor Tag="p" text={messages.errorThanks} className="bind-error-thanks-label" />
                            <div className="bind-error-info-label bind-error-label">
                                <p>
                                    {messages.errorInfoOne}
                                    <span className="error-data">
                                        &nbsp;
                                        {quoteId}
                                        &nbsp;
                                    </span>
                                    {messages.errorInfoTwo}
                                </p>
                            </div>
                        </div>
                        <HDButtonRefactor
                            size="lg"
                            label={messages.homePage}
                            className="margin-top-lg"
                            onClick={handleContinueTriggerButton} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

HDBindErrorPage.propTypes = {
    submissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    multiCarFlag: PropTypes.bool,
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object })
};

HDBindErrorPage.defaultProps = {
    customizeSubmissionVM: null,
    multiCarFlag: false,
    mcsubmissionVM: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDBindErrorPage));
