import React from 'react';
import PropTypes from 'prop-types';
import HDLabelRefactor from '../../HDLabelRefactor/HDLabelRefactor';
import * as messages from '../HDPolicySelect.messages';

const HDUpdateButton = ({
    className,
    imageSource,
    header,
    list,
    saveValue,
    selectedOption,
}) => {
    return (
        <div className={`update-button${(className) ? ` ${className}` : ''}`}>
            <div className="update-button-head">
                <img className="hd-update-button__logo" alt="button" src={imageSource} />
            </div>
            <div className="update-button-body">
                <HDLabelRefactor className="hd-update-button__label" Tag="p" text={header} />
                <ul>
                    {(list) && list.map((listItem, index) => {
                        if (index === 3) {
                            return (
                                <li key={`option-${index + 1}`} className="text-left">
                                    <HDLabelRefactor className="hd-update-button__list-item font-weight-bold text-left" Tag="span" text={listItem} />
                                    <HDLabelRefactor className="hd-update-button__list-item text-left" Tag="span" text={messages.commonListItem4} />
                                </li>
                            );
                        }
                        return (
                            <li>
                                <HDLabelRefactor className="hd-update-button__list-item" Tag="p" text={listItem} />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="update-button-footer">
                <span className="radio-mock" />
                {saveValue && (
                    <div className="update-button-footer__save-value">
                        <span className="fa fa-pound-sign" />
                        <span>{saveValue}</span>
                        {!selectedOption && (
                            <span>more</span>
                        )}
                        {(selectedOption === messages.policyType) && (
                            <span>cheaper</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

HDUpdateButton.defaultProps = {
    className: null,
    selectedOption: null,
};

HDUpdateButton.propTypes = {
    className: PropTypes.string,
    imageSource: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
    saveValue: PropTypes.string.isRequired,
    selectedOption: PropTypes.string,
};

HDUpdateButton.typeName = 'HDUpdateButton';

export default HDUpdateButton;
