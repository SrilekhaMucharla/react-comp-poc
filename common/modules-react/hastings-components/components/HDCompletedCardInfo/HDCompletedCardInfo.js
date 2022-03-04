import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import driverIcon from '../../icons/Icons_Account.svg';
import carIcon from '../../icons/Illustrations_1-car.svg';
import trashIcon from '../../icons/Icons_Trash.svg';
import tickIcon from '../../icons/Icons_Tick.svg';
import editICon from '../../icons/Icons_Edit.svg';
import purpleTickIcon from '../../icons/Icon_Tick_Purple.svg';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';

const HDCompletedCardInfo = ({
    text,
    additionalText,
    variant,
    onEdit,
    onDelete,
    onEditKeyDown,
    onDeleteKeyDown,
    editTabIndex,
    deleteTabIndex,
    className
}) => {
    return (
        <div className={`completed-info-card${(className) ? ` ${className}` : ''}`}>
            <div className="completed-info-card__icon">
                {variant === 'driver'
                    ? <img className="completed-info-card__icon-main" src={driverIcon} alt="Driver" />
                    : <img className="completed-info-card__icon-main" src={carIcon} alt="Car" />}
                {variant === 'driver'
                    ? <img className="completed-info-card__tick" src={tickIcon} alt="tick" />
                    : <img className="completed-info-card__purple-tick" src={purpleTickIcon} alt="tick" />}

            </div>
            <div className="completed-info-card__text">
                {text && (<div className={classNames('completed-info-card__main-text', variant)}>{text}</div>)}
                <HDLabelRefactor className="completed-info-card__additional-text" Tag="p" text={additionalText} />
            </div>
            {onEdit && (
                <div
                    className={`completed-info-card__icon-edit mb-3 ${(onDelete)
                        ? 'mr-1'
                        : ''}`}
                    role="button"
                    onKeyDown={onEditKeyDown}
                    tabIndex={editTabIndex}
                    onClick={onEdit}
                >
                    <img src={editICon} alt="Edit" />
                </div>
            )}
            {(onDelete) && (
                <div className="completed-info-card__icon-delete mb-3" role="button" onKeyDown={onDeleteKeyDown} tabIndex={deleteTabIndex} onClick={onDelete}>
                    <img src={trashIcon} alt="Delete" />
                </div>
            )}
        </div>
    );
};

HDCompletedCardInfo.propTypes = {
    text: PropTypes.string,
    additionalText: PropTypes.string,
    variant: PropTypes.oneOf(['driver', 'car']).isRequired,
    editTabIndex: PropTypes.number,
    deleteTabIndex: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onEditKeyDown: PropTypes.func,
    onDeleteKeyDown: PropTypes.func,
    className: PropTypes.string
};

HDCompletedCardInfo.defaultProps = {
    editTabIndex: 0,
    deleteTabIndex: 1,
    onEdit: null,
    onDelete: null,
    onEditKeyDown: () => {},
    onDeleteKeyDown: () => {},
    text: '',
    additionalText: '',
    className: null
};

export default HDCompletedCardInfo;
