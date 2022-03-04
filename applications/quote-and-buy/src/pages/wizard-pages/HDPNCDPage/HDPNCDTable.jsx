import PropTypes from 'prop-types';
import React from 'react';
import * as messages from './HDPNCDPage.messages';

const HDPNCDTable = ({
    ncdData
}) => {
    return (

        <table className="step-back-table">
            <thead className="step-back-table__head">
                <tr className="step-back-table__row">
                    <th className="step-back-table__row__th">{messages.stepBackTableHeaderOne}</th>
                    <th className="step-back-table__row__th">{messages.stepBackTableHeaderTwo}</th>
                </tr>
            </thead>
            <tbody className="step-back-table__body">
                { ncdData.map((discountData) => (
                    <tr className="step-back-table__body-row">
                        <td className="step-back-table__body-row__td step-back-table__years">
                            {discountData.years}
                            {messages.years(discountData.years)}
                            { discountData.years >= 9 && (
                                <span>{messages.moreMsg}</span>
                            )}
                        </td>
                        <td className="step-back-table__body-row__td step-back-table__discout">
                            { `${discountData.discount % 1 === 0 ? Math.round(discountData.discount) : discountData.discount}` }
                            {messages.percentage}
                        </td>
                    </tr>
                ))}

            </tbody>

        </table>

    );
};


export const ncdDataProps = PropTypes.shape({
    years: PropTypes.string.isRequired,
    discount: PropTypes.number.isRequired,

});


HDPNCDTable.propTypes = {

    ncdData: PropTypes.arrayOf(ncdDataProps).isRequired,
};


export default HDPNCDTable;
