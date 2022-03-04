import PropTypes from 'prop-types';
import React from 'react';
import * as messages from './HDPreferredPaymentTable.messages';

const dateDisplayValue = (dateField) => {
    return (`0${dateField}`).slice(-2);
};

const HDPreferredPaymentTable = ({
    paymentList
}) => {
    return (
        <table className="hd-directdebit-payment-table">
            <thead className="hd-directdebit-payment-table__thead">
                <tr className="hd-directdebit-payment-table__tr">
                    <th className="hd-directdebit-payment-table__th">{messages.paymentDate}</th>
                    <th className="hd-directdebit-payment-table__th">{messages.amount}</th>
                </tr>
            </thead>
            <tbody className="hd-directdebit-payment-table__tbody">
                {paymentList.map(({ paymentAmount, paymentDate }) => (
                    <tr className="hd-directdebit-payment-table__tr" key={paymentAmount.id}>
                        <td className="hd-directdebit-payment-table__td">
                            <span>{dateDisplayValue(paymentDate.day)}</span>
                            <span>/</span>
                            <span>{dateDisplayValue(paymentDate.month + 1)}</span>
                            <span>/</span>
                            <span>{paymentDate.year}</span>
                        </td>
                        <td className="hd-directdebit-payment-table__td">
                            <span>{messages.pound}</span>
                            {(paymentAmount.amount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const paymentProps = PropTypes.shape({
    amount: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired
});

HDPreferredPaymentTable.propTypes = {
    paymentList: PropTypes.arrayOf(paymentProps).isRequired,

};

export default HDPreferredPaymentTable;
