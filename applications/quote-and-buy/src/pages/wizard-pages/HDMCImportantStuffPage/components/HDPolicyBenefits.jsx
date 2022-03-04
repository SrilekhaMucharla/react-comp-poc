import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { HDContainer } from 'hastings-components';
import _ from 'lodash';
import HastingsDirectLogo from '../../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct-oneline.svg';
import HastingsPremierLogo from '../../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier-oneline.svg';
import HastingsEssentialLogo from '../../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential-oneline.svg';
import * as messages from './HDPolicyBenefits.messages';
import { getAmountAsTwoDecimalDigit } from '../../../../common/premiumFormatHelper';

const HDPolicyBenefits = ({
    policyType, brand, vehicle
}) => {
    // main arr
    // we are not looking the right choosen quote for right car, might be problems since customizeSubmissionVM is used like this atm,
    // not quoteID:customQuote; - Potentinal defects
    const customizeSubmissionVM = useSelector((state) => state.wizardState.data.multiCustomizeSubmissionVM.value.customQuotes);
    const customizeSubmissionVMSelect = useSelector((state) => state.wizardState.data.multiCustomizeSubmissionVM);
    const [optionalExtras, setOptionalExtras] = useState(null);
    const [isNCD, setIsNCD] = useState(false);
    let isDrivingOtherCarsSelected = false;
    // eslint-disable-next-line array-callback-return

    const policies = {
        HD: {
            logo: HastingsDirectLogo,
            items: [
                { name: messages.courtseyCar, description: messages.courtseyCarMessage }
            ],
        },
        HE: {
            logo: HastingsEssentialLogo,
            items: [
                { name: messages.courtseyCar, description: messages.courtseyCarMessageHE }
            ],
            itemsNotCovered: [
                { name: messages.windscreenCover, description: messages.windcsreenNotCoveredMessage }
            ]
        },
        HP: {
            logo: HastingsPremierLogo,
            items: [
                { name: messages.motorLegalExpensesLabel },
                { name: messages.roadsideHeader },
                { name: messages.courtseyCar, description: messages.courtseyCarMessage }
            ],
        },
    };

    const hastOptionalCoverages = () => {
        return optionalExtras !== null;
    };

    const descriptionForBreakdown = (cov) => {
        const choosenTerm = cov.terms[0].chosenTermValue;
        const optionalExtra = {};
        switch (choosenTerm) {
            case messages.roadside:
                optionalExtra.name = `${messages.roadsideHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceEsssential}</span></li>
                        <li><span>{messages.recoveryAwayHomeNotEsential}</span></li>
                        <li><span>{messages.homeCoverNotEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.roadsideAndRecovery:
                optionalExtra.name = `${messages.roadsideAndRecoveryHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceAwayHomeEssential}</span></li>
                        <li><span>{messages.homeCoverNotEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.homestart:
                optionalExtra.name = `${messages.homestartHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceAwayHomeEssential}</span></li>
                        <li><span>{messages.homeCoverEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.european:
                optionalExtra.name = `${messages.europeanHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.europeCoverEssential}</span></li>
                    </ul>
                );
                break;
            default:
                optionalExtra.name = '';
                optionalExtra.description = '';
                break;
        }
        return optionalExtra;
    };

    const ancillariesDescription = (cov) => {
        let optionalExtra = {};
        switch (cov.name) {
            case messages.breakdown:
                if (cov.terms.length > 0) {
                    optionalExtra = descriptionForBreakdown(cov);
                }

                break;
            case messages.motorLegalExpenses:
                optionalExtra.name = `${messages.motorLegalExpensesLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.motorLegalExpensesDescription;
                break;
            case messages.personalAccident:
                optionalExtra.name = `${messages.personalAccidentLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.personalAccidentDescription;
                break;
            case messages.substituteVehicle:
                optionalExtra.name = `${messages.substituteVehicleLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.substituteVehicleDesription;
                break;
            case messages.keyCover:
                optionalExtra.name = `${messages.keyCoverLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.keyCoverDescription;
                break;
            default:
                optionalExtra.name = '';
                optionalExtra.description = '';
                break;
        }
        return optionalExtra;
    };

    const ncdDescription = () => {
        const optionalExtra = {};
        optionalExtra.name = messages.ncdText;
        optionalExtra.description = '';
        return optionalExtra;
    };

    const optionalExtrasCreate = (coverages, isNCDAvailable) => {
        const optionalExtrasList = [];
        let isNCDSelected = {};
        coverages.forEach((cov) => {
            if (!(brand === messages.HP && (cov.name === messages.breakdown || cov.name === messages.motorLegalExpenses))) {
                const optionalExtra = ancillariesDescription(cov);
                optionalExtrasList.push(optionalExtra);
            }
        });
        if (isNCDAvailable || isNCD) { isNCDSelected = ncdDescription(); optionalExtrasList.push(isNCDSelected); }
        return optionalExtrasList;
    };

    useEffect(() => {
        let offeredQuotesNew = null;
        customizeSubmissionVM.map((element) => {
            if (element.quoteID === vehicle.quoteID) {
                offeredQuotesNew = element;
            }
        });
        setIsNCD(offeredQuotesNew.ncdgrantedProtectionInd);
        const offeredQuotes = [offeredQuotesNew];
        const extraCoverables = offeredQuotes.map((oq) => {
            const { coverages } = oq;
            const { privateCar } = coverages;
            const { ancillaryCoverages } = privateCar;
            const selectedOptional = ancillaryCoverages[0].coverages.filter((cov) => cov.selected);
            return selectedOptional;
        });
        if (extraCoverables.length > 0) {
            extraCoverables.forEach((extracov) => {
                const coverables = optionalExtrasCreate(extracov, offeredQuotesNew.ncdgrantedProtectionInd);
                setOptionalExtras(coverables);
            });
        }
    }, [customizeSubmissionVM, setOptionalExtras]);

    const getItemsCovered = (currentItems, coveredFlag) => {
        const items = currentItems || [];
        customizeSubmissionVM.forEach((element) => {
            // eslint-disable-next-line max-len
            isDrivingOtherCarsSelected = element.coverages.privateCar.vehicleCoverages[0].coverages.find((vehicleCov) => vehicleCov.name.toUpperCase() === messages.drivingOtherCarsLabel.toUpperCase()).selected;
            const isCheck = items.find((item) => item.name === messages.drivingOtherCars);
            if (coveredFlag && element.quote.branchCode === brand) {
                if (isDrivingOtherCarsSelected && !isCheck) {
                    items.push({ name: messages.drivingOtherCars, description: messages.drivingOtherCarsMessage });
                }
            } else if (!coveredFlag && element.quote.branchCode === brand) {
                if (!isDrivingOtherCarsSelected && !isCheck) {
                    items.push({ name: messages.drivingOtherCars, description: messages.drivingOtherCarsNotCoveredMessage });
                }
            }
        });
        return items;
    };

    return (
        <Row>
            <Col className="mc-policy-benefits__cover margin-top-md">
                <HDContainer
                    hastingsDirectLogo={policies[brand].logo}
                    isComprehensive={(policyType === 'comprehensive')}
                    items={getItemsCovered(policies[brand].items, true)}
                    itemsNotCovered={getItemsCovered(policies[brand].itemsNotCovered, false)} />
                {hastOptionalCoverages() && (optionalExtras.length > 0) && (
                    <HDContainer
                        title={messages.coverExtraTitle}
                        items={optionalExtras} />
                )}
            </Col>
        </Row>
    );
};

HDPolicyBenefits.propTypes = {
    policyType: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    vehicle: PropTypes.shape({
        quoteID: PropTypes.string
    }).isRequired,
};

export default HDPolicyBenefits;
