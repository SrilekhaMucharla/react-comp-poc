import React from 'react';
import PropTypes from 'prop-types';

const HDBubble = ({ children, position }) => (
    <div className="hd-bubble" data-position={position}>
        <span className="hd-bubble__content">
            {children}
        </span>
    </div>
);

HDBubble.propTypes = {
    children: PropTypes.node,
    position: PropTypes.oneOf(['top'])
};

HDBubble.defaultProps = {
    position: 'top',
    children: undefined
};

export default HDBubble;
