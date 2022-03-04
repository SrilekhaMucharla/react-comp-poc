import React from 'react';
import PropTypes from 'prop-types';

const HDRibbon = ({
    text, actionText, onClick, onKeyDown, tabIndex, className
}) => {
    if (text === null && actionText === null) {
        return null;
    }

    return (
        <div className={`ribbon ${className}`}>
            {text && <div className="text">{text}</div>}
            {actionText && (
                <div
                    className="action"
                    role="button"
                    onKeyDown={onKeyDown}
                    tabIndex={tabIndex}
                    onClick={onClick}
                    data-testid="action-button"
                >
                    {actionText}
                </div>
            )}
        </div>
    );
};

HDRibbon.propTypes = {
    text: PropTypes.string,
    actionText: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    tabIndex: PropTypes.number
};

HDRibbon.defaultProps = {
    text: null,
    actionText: '',
    onClick: () => {},
    onKeyDown: () => {},
    tabIndex: 0
};

export default HDRibbon;
