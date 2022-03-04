import PropTypes from 'prop-types';
import React from 'react';
import {
    HDLabelRefactor
} from 'hastings-components';
import { Container, Col } from 'react-bootstrap';
import * as messages from './HDCoverSummary.messages';

const listColOddProps = { xs: 12, md: 5 };
const listColEvenProps = { xs: 12, md: 7 };
export const policies = {
    HDcomprehensive: (
        <>
            <Col {...listColOddProps}><li>{messages.damageOtherVehicles}</li></Col>
            <Col {...listColEvenProps}><li>{messages.injuryOtherDriver}</li></Col>
            <Col {...listColOddProps}><li>{messages.injurySelf}</li></Col>
            <Col {...listColEvenProps}><li>{messages.carAccidentDamage}</li></Col>
        </>
    ),
    HEcomprehensive: (
        <>
            <Col {...listColOddProps}><li>{messages.damageOtherVehicles}</li></Col>
            <Col {...listColEvenProps}><li>{messages.injuryOtherDriverHECompr}</li></Col>
            <Col {...listColOddProps}><li>{messages.injurySelf}</li></Col>
            <Col {...listColEvenProps}><li>{messages.carAccidentDamage}</li></Col>
        </>
    ),
    HPcomprehensive: (
        <>
            <Col {...listColOddProps}><li>{messages.damageOtherVehicles}</li></Col>
            <Col {...listColEvenProps}><li>{messages.injuryOtherDriver}</li></Col>
            <Col {...listColOddProps}><li>{messages.injurySelf}</li></Col>
            <Col {...listColEvenProps}><li>{messages.carAccidentDamage}</li></Col>
            <Col {...listColOddProps}><li>{messages.motorLegal}</li></Col>
            <Col {...listColEvenProps}><li>{messages.roadsideAssistance}</li></Col>
        </>
    ),
    HPtpft: (
        <>
            <Col {...listColOddProps}><li>{messages.damageOtherVehicles}</li></Col>
            <Col {...listColEvenProps}><li>{messages.injuryOtherDriver}</li></Col>
            <Col {...listColOddProps}><li>{messages.carTheft}</li></Col>
            <Col {...listColEvenProps}><li>{messages.fireDamage}</li></Col>
            <Col {...listColOddProps}><li>{messages.motorLegal}</li></Col>
            <Col {...listColEvenProps}><li>{messages.roadsideAssistance}</li></Col>
        </>
    ),
    HDtpft: (
        <>
            <Col {...listColOddProps}><li>{messages.damageOtherVehicles}</li></Col>
            <Col {...listColEvenProps}><li>{messages.injuryOtherDriver}</li></Col>
            <Col {...listColOddProps}><li>{messages.carTheft}</li></Col>
            <Col {...listColEvenProps}><li>{messages.fireDamage}</li></Col>
        </>
    ),
};

const HDCoverSummary = ({
    coverType, brandCode, brand, isOnlineProductType
}) => {
    const coverTypeName = () => {
        let coverTypeDisplayName = '';
        if (isOnlineProductType) {
            return 'Online';
        }
        switch (coverType) {
            case 'comprehensive':
                coverTypeDisplayName = 'comprehensive';
                break;
            case 'tpft':
                coverTypeDisplayName = 'third party fire and theft';
                break;
            default:
                coverTypeDisplayName = '';
                break;
        }
        return coverTypeDisplayName;
    };

    return (
        <Container className="cover-summary-container px-0">
            <HDLabelRefactor Tag="h2" text={messages.header} className="margin-bottom-md" id="cover-summary-header" />
            <div className="margin-top-md">
                <HDLabelRefactor Tag="p" text={messages.byTakingPolicy} />
                <ul className="pad-inl-start-sm">
                    <li><span>{messages.requirementTwo}</span></li>
                    <li><span>{messages.requirementThree}</span></li>
                </ul>
                <HDLabelRefactor Tag="p" text={messages.ncdMessage} />
                <ul className="pad-inl-start-sm">
                    <li><span>{messages.ncdRequirementOne}</span></li>
                    <li><span>{messages.ncdRequirementTwo}</span></li>
                    <li><span>{messages.ncdRequirementThree}</span></li>
                </ul>
            </div>
            <p className="margin-top-lg">{messages.buyingPolicyMessage}</p>
            <p>
                {messages.yourPolicyCoversStart}
                <span className="font-bold">
                    {` ${brand} ${coverTypeName()} `}
                </span>
                {messages.yourPolicyCoversEnd}
            </p>
            <ul className="cover-summary__covers-list row pad-inl-start-sm margin-top-md">
                {policies[(brandCode + coverType)]}
            </ul>
            { isOnlineProductType && <HDLabelRefactor Tag="p" text={messages.onlinePolicyMsg} />}
        </Container>
    );
};

HDCoverSummary.propTypes = {
    coverType: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    brandCode: PropTypes.string.isRequired,
    isOnlineProductType: PropTypes.bool.isRequired,
};

export default HDCoverSummary;
