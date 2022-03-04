import PropTypes from 'prop-types';
import React from 'react';
import { Col } from 'react-bootstrap';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';
import HDTickListItem from '../HDTickListItem/HDTickListItem';
import * as messages from './HDContainer.messages';

const HDContainer = ({
    hastingsDirectLogo,
    isComprehensive,
    title, items,
    itemsNotCovered,
    isOnlineProductType
}) => {
    const coverTypeLabel = (isComprehensive) ? messages.comprehensiveLabel : messages.tpftLabel;
    const labelClass = isOnlineProductType ? "--online": "--label" ;
    const _md = isOnlineProductType ? 12 : 6;
    const _xs = isOnlineProductType ? 12 : 6;
    return (
        <div>
            {
                hastingsDirectLogo ? (
                    <>
                        <div className="policy-details-cover__title">
                            <Col xs={_xs} md={_md} lg="auto" className="pl-0">
                                <img className="policy-details-cover__logo img-fluid" src={hastingsDirectLogo} alt="logo" />
                            </Col>
                            <Col xs={_xs} md={_md} lg={8} className={`policy-details-cover__title${labelClass} px-0`} >
                                <HDLabelRefactor Tag="h5" text={coverTypeLabel} className="mb-0" />
                            </Col>
                        </div>
                    </>
                ) : (<HDLabelRefactor Tag="h4" text={title} className="policy-details-cover__extra-title" />)
            }

            <div className="policy-details-cover__list">
                {items.map((item) => (
                    <HDTickListItem
                        key={item.label || item.name}
                        title={item.label || item.name}
                        selected
                    >
                        {item.description}
                    </HDTickListItem>
                ))}
                {itemsNotCovered && itemsNotCovered.map((item) => (
                    <HDTickListItem
                        key={item.label || item.name}
                        title={item.label || item.name}
                    >
                        {item.description}
                    </HDTickListItem>
                ))}
            </div>
        </div>
    );
};

HDContainer.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
    })).isRequired,
    title: PropTypes.string,
    isComprehensive: PropTypes.bool,
    hastingsDirectLogo: PropTypes.string,
    itemsNotCovered: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
    })),
    isOnlineProductType: PropTypes.bool
};

HDContainer.defaultProps = {
    title: null,
    isComprehensive: true,
    hastingsDirectLogo: null,
    itemsNotCovered: null,
    isOnlineProductType: false
};

export default HDContainer;
