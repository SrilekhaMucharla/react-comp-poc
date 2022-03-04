/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React from 'react';


const HDTableCell = ({
    label,
    value,
    topDescription,
    bottomDescription,
    extraLines,
    boldText,
    style
}) => (
    <div label={label} style={style} className="hd-table-cell">
        {label && (
            <div className="hd-table-cell__label">
                {label}
            </div>
        )}
        <div>
            {topDescription && (
                <div>
                    {topDescription}
                </div>
            )}
            {(typeof value === 'boolean') ? (
                <i className={`fas fa-${(value) ? 'check' : 'times'} fa-lg`} />
            ) : (
                <div className="hd-table-cell__value">
                    {(typeof value === 'number') ? value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
                </div>
            )}
            {bottomDescription && (
                <div className="hd-table-cell__bottom-descr">
                    {bottomDescription}
                </div>
            )}
        </div>
        {!!extraLines.length && (
            <div className="hd-table-cell__extra-line">
                {extraLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
        )}
        <div className="hd-table-cell__bold-text">
            {boldText}
        </div>
    </div>
);

HDTableCell.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    topDescription: PropTypes.string,
    bottomDescription: PropTypes.string,
    extraLines: PropTypes.arrayOf(PropTypes.string),
    boldText: PropTypes.string,
    style: PropTypes.shape({
        gridRow: PropTypes.string,
        gridColumn: PropTypes.string
    })
};

HDTableCell.defaultProps = {
    topDescription: null,
    bottomDescription: null,
    extraLines: [],
    boldText: null,
    label: null,
    style: undefined
};

export default HDTableCell;
