/* eslint-disable no-unused-expressions */
import React, { useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { TranslatorContext } from '../../../../../../integration/TranslatorContext';
import HDYourExcessFees from '../../../../HDImportantStuffPage/HDYourExcessFees';
import { pageMetadataPropTypes } from '../../../../../../constant/propTypes';
import * as messages from './HDMCYourExcessFeesContainer.messages';

const HDMCYourExcessFeesContainer = ({
    mcsubmissionVM, multiCustomizeSubmissionVM, vehicle, pageMetadata
}) => {
    const [accVehicleDamage, setAccidentalVehicleDamage] = useState([]);
    const [theftVehicleDamage, setTheftVehicleDamage] = useState([]);
    const [windScreenVehicleDamage, setWindScreenDamage] = useState([]);
    const [loadData, setLoadData] = useState(false);
    const pcCurrentDate = _.get(mcsubmissionVM, 'quotes.value[0].baseData.pccurrentDate', new Date());
    const vehicleCoveragesPath = 'coverages.privateCar.vehicleCoverages';

    const getSingleSubmissionVM = () => {
        for (let i = 0; i < mcsubmissionVM.quotes.length; i += 1) {
            if (mcsubmissionVM.quotes.children[i].quoteID.value === vehicle.quoteID) {
                return mcsubmissionVM.quotes.children[i];
            }
        }
        return {};
    };

    const getSingleCustomSubVM = () => {
        for (let i = 0; i < multiCustomizeSubmissionVM.customQuotes.length; i += 1) {
            if (multiCustomizeSubmissionVM.customQuotes.children[i].quoteID.value === vehicle.quoteID) {
                return multiCustomizeSubmissionVM.customQuotes.children[i];
            }
        }
        return {};
    };

    useEffect(() => {
        const excCoverages = _.get(getSingleCustomSubVM(), vehicleCoveragesPath);
        const excCoveragesList = (excCoverages.value && excCoverages.value[0].coverages) ? excCoverages.value[0].coverages : [];
        excCoveragesList.forEach((cover) => {
            switch (cover.publicID) {
                case messages.accidentalDamage:
                    (cover) ? setAccidentalVehicleDamage(cover.terms) : setAccidentalVehicleDamage([]);
                    break;
                case messages.fireAndTheft:
                    (cover) ? setTheftVehicleDamage(cover.terms) : setTheftVehicleDamage([]);
                    break;
                case messages.windScreenExcess:
                    (cover) ? setWindScreenDamage(cover.terms) : setWindScreenDamage([]);
                    break;
                default:
                    break;
            }
        });
        setLoadData(true);
    }, []);

    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(getSingleSubmissionVM(), driverPath));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];

    const driversListDisplay = [];

    const viewModelService = useContext(ViewModelServiceContext);
    const translator = useContext(TranslatorContext);

    const driverDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.policyjob.lob.privatecar.coverables.dto.DriverDTO'
    );

    const getSelectedTypeList = (dto, typeListName, selectedTypeCode) => {
        const selectedTypeList = _.get(dto, typeListName).aspects.availableValues.filter((typeListEntry) => (typeListEntry.code === selectedTypeCode));
        return translator({
            id: selectedTypeList[0].name,
            defaultMessage: selectedTypeList[0].name
        });
    };

    const dateValue = (dateField) => {
        return (`0${dateField}`).slice(-2);
    };

    // We will probably need commented code in the future
    // driversList.forEach((driver, driverIndex) => {
    driversList.forEach((driver) => {
        const driverDOB = driver.dateOfBirth;
        const licenceTypeLabel = getSelectedTypeList(driverDTO, 'licenceType', driver.licenceType);
        const fullTimeOccupation = getSelectedTypeList(driverDTO, 'occupationFull', driver.occupationFull);
        const claimsCollections = driver.claimsAndConvictions.claimsDetailsCollection;
        // const convictionsCollections = driver.claimsAndConvictions.convictionsCollection;
        // const { licenceSuccessfulValidated } = wizardPagesState.drivers[driverIndex];
        const driverDisplay = {
            displayName: driver.displayName,
            isPolicyHolder: driver.isPolicyHolder,
            dateOfBirth: `${dateValue(driverDOB.day)}/${dateValue(driverDOB.month + 1)}/${driverDOB.year}`,
            occupation: fullTimeOccupation,
            // drivingLicence: licenceSuccessfulValidated
            //     ? licenceTypeLabel
            //     : `${licenceTypeLabel}, held for ${driver.licenceHeldFor} year${+driver.licenceHeldFor !== 1 ? 's' : ''}`,
            drivingLicence: licenceTypeLabel,
            accidence: `${claimsCollections.length} in the last 5 years`,
            youngAndInExpExcess: driver.youngInexperiencedDriverExcess ? driver.youngInexperiencedDriverExcess.amount : 0,
            // eslint-disable-next-line no-nested-ternary
            // convictions: licenceSuccessfulValidated
            //     ? null
            //     : (convictionsCollections.length > 0) ? `${convictionsCollections.length} in the last 5 years` : 'None'
            convictions: null
        };

        driversListDisplay.push(driverDisplay);
    });

    driversListDisplay.sort((a, b) => {
        if (a.isPolicyHolder) return -1;
        if (b.isPolicyHolder) return 1;
        return 0;
    });

    const theftDamageList = () => {
        let theftDamage = [];
        if (theftVehicleDamage.length > 0) {
            const cmpAmountPath = theftVehicleDamage.filter((amt) => amt.publicID === messages.fireAndTheftCompulsory);
            const voluntartAmountPath = theftVehicleDamage.filter((amt) => amt.publicID === messages.fireAndTheftVoluntary);
            theftDamage = [{
                excessName: messages.allDrivers,
                compulsoryAmount: cmpAmountPath[0].directValue,
                voluntaryAmount: voluntartAmountPath[0].directValue
            }];
        }

        return theftDamage;
    };

    const accidentalDamageList = () => {
        let accidentalDamageVal = [];
        if (accVehicleDamage.length > 0) {
            const cmpAmountPath = accVehicleDamage.filter((amt) => amt.publicID === messages.accidentalDamageCompulsaryKey);
            const voluntartAmountPath = accVehicleDamage.filter((amt) => amt.publicID === messages.accidentalDamageVoluntaryKey);
            accidentalDamageVal = [{
                compulsoryAmount: cmpAmountPath[0].directValue,
                voluntaryAmount: voluntartAmountPath[0].directValue
            }];
        }
        return accidentalDamageVal;
    };

    const windScreenDamageList = () => {
        let windScreenDamageVal = [];
        if (windScreenVehicleDamage.length > 0) {
            const repairPath = windScreenVehicleDamage.filter((amt) => amt.publicID === messages.windScreenExcessRepairKey);
            const replacementPath = windScreenVehicleDamage.filter((amt) => amt.publicID === messages.windScreenExcessReplacementKey);
            windScreenDamageVal = [{
                excessName: messages.allDrivers,
                compulsoryAmount: repairPath[0].directValue,
                voluntaryAmount: replacementPath[0].directValue
            }];
        }
        return windScreenDamageVal;
    };

    return (
        <>
            {loadData ? (
                <HDYourExcessFees
                    branchCode={vehicle.brandCode}
                    accidentalDamage={accidentalDamageList()}
                    theftDamage={theftDamageList()}
                    driverList={driversListDisplay}
                    windScreenDamage={windScreenDamageList()}
                    pageMetadata={pageMetadata}
                    periodStartDate={vehicle.periodStartDate}
                    pcCurrentDate={pcCurrentDate} />
            ) : null}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM
    };
};

HDMCYourExcessFeesContainer.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({
        customQuotes: PropTypes.object
    }).isRequired,
    vehicle: PropTypes.shape({
        quoteID: PropTypes.string,
        insurerKey: PropTypes.string,
        coverTypeKey: PropTypes.oneOf(['comprehensive', 'tpft']),
        policyStartDate: PropTypes.instanceOf(Date),
        periodStartDate: PropTypes.shape({
            year: PropTypes.number,
            month: PropTypes.number,
            day: PropTypes.number
        }),
        policyEndDate: PropTypes.instanceOf(Date),
        vehicleLicense: PropTypes.string,
        vehicleName: PropTypes.string,
        policyholder: PropTypes.string,
        noClaimsDiscountYears: PropTypes.string,
        namedDrivers: PropTypes.arrayOf(PropTypes.shape({
            displayName: PropTypes.string,
            publicID: PropTypes.string
        })),
        policyAddress: PropTypes.string,
        brandCode: PropTypes.string,
        accidentalDamage: PropTypes.shape({
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        theftDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        }),
        windscreenDamage: PropTypes.shape({
            name: PropTypes.string,
            compulsoryAmount: PropTypes.number,
            voluntaryamount: PropTypes.number
        })
    }).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

export default connect(mapStateToProps)(HDMCYourExcessFeesContainer);
