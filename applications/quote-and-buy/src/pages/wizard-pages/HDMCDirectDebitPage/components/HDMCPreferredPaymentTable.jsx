import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as messages from './HDMCPreferredPaymentTable.messages';
import { getPriceWithCurrencySymbol } from '../../../../common/utils';
import formatRegNumber from '../../../../common/formatRegNumber';

const HDMCPreferredPaymentTable = ({
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
                {paymentList.map(({
                    paymentAmount, paymentDate, label
                }, i) => (
                    <tr className="hd-directdebit-payment-table__tr" key={paymentDate}>
                        <td className="hd-directdebit-payment-table__td">
                            <span>{`${dayjs(paymentDate).format('DD/MM/YYYY')}`}</span>
                            {label && (
                                <>
                                    <span>{` ${messages.initialPaymentFor} `}</span>
                                    <span className="reg-num">{formatRegNumber(label)}</span>
                                </>
                            )}
                        </td>
                        <td className="hd-directdebit-payment-table__td">{getPriceWithCurrencySymbol(paymentAmount)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const paymentProps = PropTypes.shape({
    paymentAmount: PropTypes.string.isRequired,
    label: PropTypes.string,
    paymentDate: PropTypes.shape({
        day: PropTypes.number,
        month: PropTypes.number,
        year: PropTypes.number
    }).isRequired
});

HDMCPreferredPaymentTable.propTypes = {
    paymentList: PropTypes.arrayOf(paymentProps).isRequired,
};

export default HDMCPreferredPaymentTable;
