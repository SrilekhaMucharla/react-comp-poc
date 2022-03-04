/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { HDPlaceholderWithHeader } from 'hastings-components';
import dayjs from 'dayjs';
import driverAddedIcon from '../../../../assets/images/icons/Icons_Driver-added.svg';
import * as messages from './HDDriverDetails.messages';
import { TranslatorContext } from '../../../../integration/TranslatorContext';

const HDDriverDetails = ({ driver }) => {
    const translator = useContext(TranslatorContext);
    const driverLicenceDetails = useSelector((state) => state.wizardState.app.driverLicenceDetails);

    const keyColsProps = { xs: 6 };
    const valueColsProps = { xs: 6 };
    const columnKeySize = 'col-xl-5';
    const columnValueSize = 'col-xl-7';
    const columnEqualSize = 'col-xl-6';

    let licenceValidated = false;
    const licenceDetails = driverLicenceDetails && driverLicenceDetails.filter((driverLicenceDetail) => (
        driverLicenceDetail && driverLicenceDetail.displayName === driver.name
        && driverLicenceDetail.dob && driver.dateOfBirth
        && driverLicenceDetail.dob.getTime() === driver.dateOfBirth.getTime()));
    if (licenceDetails && licenceDetails[0]) {
        licenceValidated = licenceDetails[0].licenceSuccessfulValidated;
    }

    return (
        <HDPlaceholderWithHeader
            className="margin-top-lg"
            key={driver.id}
            title={(
                <span>
                    {driver.name}
                    <span className="font-regular">{driver.role && ` (${driver.role})`}</span>
                </span>
            )}
            icon={<img className="hd-driver-details-header-icon" src={driverAddedIcon} alt="Added driver icon" />}
        >
            <Row className="mc-driver-details-card">
                <Col xs={{ span: 12, order: 1 }} lg={{ span: 6, order: 1 }}>
                    <Row>
                        <Col {...keyColsProps} className={`${columnKeySize} mc-driver-details-card__key`}>{messages.dateOfBirth}</Col>
                        <Col {...valueColsProps} className={`${columnValueSize} mc-driver-details-card__value`}>
                            {dayjs(driver.dateOfBirth).format('DD/MM/YYYY')}
                        </Col>
                    </Row>
                </Col>
                <Col xs={{ span: 12, order: 4 }} lg={{ span: 6, order: 2 }}>
                    <Row>
                        <Col {...keyColsProps} className={`${columnEqualSize} mc-driver-details-card__key`}>{messages.accidence}</Col>
                        <Col {...valueColsProps} className={`${columnEqualSize} mc-driver-details-card__value`}>
                            {`${driver.claimsCountInFiveYears} ${messages.inTheLastFiveYears}`}
                        </Col>
                    </Row>
                </Col>
                <Col xs={{ span: 12, order: 2 }} lg={{ span: 6, order: 3 }}>
                    <Row>
                        <Col {...keyColsProps} className={`${columnKeySize} mc-driver-details-card__key`}>{messages.occupation}</Col>
                        <Col {...valueColsProps} className={`${columnValueSize} mc-driver-details-card__value`}>
                            {translator(`typekey.OccupationType_Ext.${driver.occupationKey}`)}
                        </Col>
                    </Row>
                </Col>
                {!licenceValidated && (
                    <Col xs={{ span: 12, order: 5 }} lg={{ span: 6, order: 4 }}>
                        <Row>
                            <Col {...keyColsProps} className={`${columnEqualSize} mc-driver-details-card__key`}>{messages.convictions}</Col>
                            <Col {...valueColsProps} className={`${columnEqualSize} mc-driver-details-card__value`}>
                                {driver.convictionsCountInFiveYears > 0
                                    ? `${driver.convictionsCountInFiveYears} ${messages.inTheLastFiveYears}`
                                    : messages.none}
                            </Col>
                        </Row>
                    </Col>
                )}
                <Col xs={{ span: 12, order: 3 }} lg={{ span: 6, order: 5 }}>
                    <Row>
                        <Col {...keyColsProps} className={`${columnKeySize} mc-licence-held-years mc-driver-details-card__key`}>{messages.drivingLicence}</Col>
                        <Col {...valueColsProps} className={`${columnValueSize} mc-driver-details-card__value custom-padding-right`}>
                            {licenceValidated ? translator(`typekey.LicenceType_Ext.${driver.licenceTypeKey}`) : (`${translator(`typekey.LicenceType_Ext.${driver.licenceTypeKey}`)},
                            held for ${translator(`typekey.LicenceHeld_Ext.${driver.licenceHeldForKey}`)}`)}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </HDPlaceholderWithHeader>
    );
};

HDDriverDetails.propTypes = {
    driver: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        role: PropTypes.string,
        dateOfBirth: PropTypes.instanceOf(Date),
        licenceTypeKey: PropTypes.string,
        licenceHeldForKey: PropTypes.string,
        occupationKey: PropTypes.string,
        claimsCountInFiveYears: PropTypes.number,
        convictionsCountInFiveYears: PropTypes.number
    }).isRequired
};

export default HDDriverDetails;
