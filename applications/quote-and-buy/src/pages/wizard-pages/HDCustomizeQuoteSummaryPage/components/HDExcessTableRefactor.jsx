import PropTypes from 'prop-types';
import React from 'react';
import * as messages from '../HDExcessTable.messages';

const HDExcessTableRefactor = ({
    drivers,
    excess,
    hideTotalColumn,
    // eslint-disable-next-line react/prop-types
    tableColumnOne,
    // eslint-disable-next-line react/prop-types
    tableColumnTwo,
    className
}) => {
    const displayAmount = (value) => `£${value}`;
    const { excessName, compulsoryAmount, voluntaryAmount } = excess;

    return (
        <table className={`excess-table-ref ${className}`}>
            <thead className="excess-table-ref__head">
                <tr className="excess-table-ref__row">
                    <th className="excess-table-ref__row__th excess-table-ref__name">{excessName}</th>
                    <th className="excess-table-ref__row__th excess-table-ref__col-1">{tableColumnOne}</th>
                    <th className="excess-table-ref__row__th excess-table-ref__col-2">{tableColumnTwo}</th>
                    {(hideTotalColumn) ? <th /> : <th className="excess-table-ref__row__th excess-table-ref__total-header">{messages.totalHeader}</th>}
                </tr>
            </thead>
            <tbody className="excess-table-ref__body">
                {drivers.map((driver) => (
                    <tr className="excess-table-ref__body-row" key={driver.id ? driver.id : ''}>
                        <td className="excess-table-ref__body-row__td excess-table-ref__excess-name">{driver.name}</td>
                        <td className="excess-table-ref__body-row__td excess-table-ref__compulsory-amount">{driver.excesses ? displayAmount(driver.excesses.compulsoryAmount) : displayAmount(compulsoryAmount)}</td>
                        <td className="excess-table-ref__body-row__td excess-table-ref__voluntary-amount">{displayAmount(voluntaryAmount)}</td>
                        {(hideTotalColumn)
                            ? <td className="excess-table-ref__body-row__td" />
                            : <td className="excess-table-ref__body-row__td excess-table-ref__total-amount">{driver.excesses ? displayAmount(driver.excesses.compulsoryAmount + voluntaryAmount) : displayAmount(voluntaryAmount + compulsoryAmount)}</td> }
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

HDExcessTableRefactor.propTypes = {
    excess: PropTypes.arrayOf(ExcessProps).isRequired,
    // eslint-disable-next-line react/require-default-props
    hideTotalColumn: PropTypes.bool,
    className: PropTypes.string,
    drivers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number
    })).isRequired
};

HDExcessTableRefactor.defaultProps = {
    className: '',
};

export default HDExcessTableRefactor;
