import PropTypes from 'prop-types';
import React from 'react';
import * as messages from '../HDCustomizeQuoteSummaryPage/HDExcessTable.messages';

const HDExcessTable = ({
    name,
    excesses,
    hideTotalColumn,
    // eslint-disable-next-line react/prop-types
    tableColumnOne,
    // eslint-disable-next-line react/prop-types
    tableColumnTwo,
    className
}) => {
    const displayAmount = (value) => `£${value}`;

    return (
        <table className={`excess-table ${className}`}>
            <thead className="excess-table__head">
                <tr className="excess-table__row">
                    <th className="excess-table__row__th excess-table__name">{name}</th>
                    <th className="excess-table__row__th excess-table__col-1">{tableColumnOne}</th>
                    <th className="excess-table__row__th excess-table__col-2">{tableColumnTwo}</th>
                    {(hideTotalColumn) ? <th /> : <th className="excess-table__row__th excess-table__total-header">{messages.totalHeader}</th>}
                </tr>
            </thead>
            <tbody className="excess-table__body">
                {excesses.map(({ excessName, voluntaryAmount, compulsoryAmount }, rowIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr className="excess-table__body-row" key={rowIndex}>
                        <td className="excess-table__body-row__td excess-table__excess-name">{excessName}</td>
                        <td className="excess-table__body-row__td excess-table__compulsory-amount">{displayAmount(compulsoryAmount)}</td>
                        <td className="excess-table__body-row__td excess-table__voluntary-amount">{displayAmount(voluntaryAmount)}</td>
                        {(hideTotalColumn)
                            ? <td className="excess-table__body-row__td" />
                            : <td className="excess-table__body-row__td excess-table__total-amount">{displayAmount(voluntaryAmount + compulsoryAmount)}</td> }
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const ExcessProps = PropTypes.shape({
    excessName: PropTypes.string.isRequired,
    voluntaryAmount: PropTypes.number.isRequired,
    compulsoryAmount: PropTypes.number.isRequired,
});

HDExcessTable.propTypes = {
    name: PropTypes.string.isRequired,
    excesses: PropTypes.arrayOf(ExcessProps).isRequired,
    // eslint-disable-next-line react/require-default-props
    hideTotalColumn: PropTypes.bool,
    className: PropTypes.string
};

HDExcessTable.defaultProps = {
    className: ''
};

export default HDExcessTable;
