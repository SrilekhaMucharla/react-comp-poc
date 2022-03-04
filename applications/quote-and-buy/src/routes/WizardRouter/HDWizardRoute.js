import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { updateEpticaId as updateEpticaIdAction } from '../../redux-thunk/actions';

const HDWizardRoute = ({
    handleForward,
    handleBackward,
    handleSkip,
    path,
    WizardPage,
    pageId,
    epticaId,
    updateEpticaId,
    pageMetadata,
    personalDetails
}) => {
    useEffect(() => {
        updateEpticaId(epticaId);
    }, [epticaId]);

    const isAdditionalDriver = !_.get(useLocation(), 'state.isPolicyHolder', true);
    const mappedPageMetadata = {
        ...pageMetadata,
        page_name: personalDetails ? `${pageMetadata.page_name}_${isAdditionalDriver ? 'AD' : 'MD'}` : pageMetadata.page_name
    };

    return (
        <Route
            exact
            path={path}
            render={
                (props) => (
                    <WizardPage
                        {...props}
                        handleForward={handleForward}
                        handleBackward={handleBackward}
                        handleSkip={handleSkip}
                        pageMetadata={mappedPageMetadata}
                        pageId={pageId} />
                )} />
    );
};

const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction
};

HDWizardRoute.propTypes = {
    pageId: PropTypes.string.isRequired,
    handleBackward: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    handleSkip: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    WizardPage: PropTypes.elementType.isRequired,
    epticaId: PropTypes.string.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    personalDetails: PropTypes.bool.isRequired
};

export default connect(null, mapDispatchToProps)(HDWizardRoute);
