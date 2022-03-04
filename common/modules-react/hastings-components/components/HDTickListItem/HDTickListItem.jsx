import React from 'react';

import PropTypes from 'prop-types';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';

import tickIcon from './icons/icons-tick.svg';
import crossIcon from './icons/icons-cross.svg';

const HDTickListItem = ({ children, title, selected }) => (
    <div className="tick-list-item-container">
        <div>{(selected) ? tickIcon() : crossIcon()}</div>
        <div className="tick-list-item__content">
            <HDLabelRefactor Tag="h5" text={title} />
            {children && <p className="tick-list-item__description">{children}</p>}
        </div>
    </div>
);

HDTickListItem.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
    selected: PropTypes.bool,
};
HDTickListItem.defaultProps = {
    children: null,
    selected: false,
};

export default HDTickListItem;
