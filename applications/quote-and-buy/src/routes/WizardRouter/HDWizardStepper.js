import React from 'react';
import PropTypes from 'prop-types';
import { HDStepper } from 'hastings-components';
import useAnotherDriver from '../../pages/wizard-pages/__helpers__/useAnotherDriver';
import RemoveDriverRibbon from '../../pages/wizard-pages/HDAddAnotherDriverPage/RemoveDriverRibbon';
import { getWizardConfig, getCurrentPageConfig } from './HDWizardConfig';
import VehicleRibbon from '../../pages/wizard-pages/HDAddAnotherDriverPage/VehicleRibbon';
import routes from './RouteConst';

const HDWizardStepper = ({ location, multiCarFlag }) => {
    const [, isAnotherDriver] = useAnotherDriver(location);
    const wizardConfig = getWizardConfig(isAnotherDriver);
    const stepperSteps = Array.from(new Set(Object.values(wizardConfig.flatMap((config) => (config.stepper || [])))));
    const {
        stepper, personalDetails, milestone, path, vehicleRibbon, stepperStart, stepperTwo, stepperThree, pageMetadata
    } = getCurrentPageConfig(wizardConfig, location.pathname);
    // do not show ribbon for driver name page for policy holder
    const showRibbon = personalDetails && !(path === routes.DRIVER_NAME && !isAnotherDriver);
    let vehicleAdded = false;
    if (location.pathname === routes.MC_POLICY_START_DATE || location.pathname === routes.MC_YOURQUOTE_PAGE) {
        vehicleAdded = true;
    }
    return (
        <>
            <HDStepper
                steps={stepperSteps}
                currentStep={stepper}
                milestone={milestone}
                stepperStart={stepperStart}
                stepperTwo={stepperTwo}
                stepperThree={stepperThree} />
            {showRibbon && <RemoveDriverRibbon pageMetadata={pageMetadata} />}
            {vehicleRibbon && multiCarFlag && <VehicleRibbon vehicleAdded={vehicleAdded} />}
        </>
    );
};

HDWizardStepper.propTypes = {
    pathname: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
};

export default HDWizardStepper;
