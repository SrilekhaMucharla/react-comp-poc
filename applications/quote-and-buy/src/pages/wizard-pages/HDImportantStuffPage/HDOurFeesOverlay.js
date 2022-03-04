import React from 'react';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './HDOurFeesOverlay.messages';

const HDOurFeesOverlay = () => {
    const feesTablesData = [
        {
            header: messages.arrange,
            fees: [
                { subtype: messages.arrangeNew, fee: messages.twenty },
                { subtype: messages.additionalFee, fee: messages.twelveFifty },
                { subtype: messages.tab, fee: messages.twenty }
            ]
        },
        {
            header: messages.changePolicy,
            subheader: messages.changePolicySub,
            fees: [
                { subtype: messages.changeName, fee: messages.zero },
                { subtype: messages.changeMileage, fee: messages.zero },
                { subtype: messages.changePhone, fee: messages.zero },
                { subtype: messages.changeAddr, fee: messages.twenty },
                { subtype: messages.changeOther, fee: messages.twenty },
                { subtype: messages.changeInfo, fee: messages.policyChangesFee }
            ]
        },
        {
            header: messages.cancelPolicy,
            subheader: messages.cancelPolicyInfo,
            fees: [
                { subtype: messages.cancelPolicyOne, fee: messages.noFee },
                { subtype: messages.cancelPolicyTwo, fee: messages.fourtyFive },
                { subtype: messages.cancelPolicyFour, fee: messages.fourtyFive },
                { subtype: messages.cancelPolicyFive, fee: messages.noFee }
            ]
        },
        {
            header: messages.missPayment,
            fees: [
                { subtype: messages.missDebit, fee: messages.twelve }
            ]
        }
    ];

    return (
        <div className="our-fees-overlay">
            <HDLabelRefactor
                Tag="h2"
                text={messages.ourFees}
                className="margin-bottom-md mt-0" />
            <p>{messages.feesContentOne}</p>
            <p>{messages.feesContentTwo}</p>
            <div className="our-fees-overlay__fees">
                <p className="font-bold">
                    {messages.typeOfFee}
                </p>
                {feesTablesData.map(({ header, subheader, fees }, tableIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <table className="our-fees-overlay__fees__table" key={tableIndex}>
                        <thead>
                            <tr>
                                <th className="our-fees-overlay__fees__table__th" colSpan="2">
                                    <div>{header}</div>
                                    {subheader && <div className="font-regular">{subheader}</div>}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="our-fees-overlay__fees__table__body">
                            {fees.map(({ subtype, fee }, rowIndex) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <tr className="our-fees-overlay__fees__table__body__tr" key={rowIndex}>
                                    <td className="our-fees-overlay__fees__table__td">{subtype}</td>
                                    <td className="our-fees-overlay__fees__table__td text-right font-bold">{fee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))}
            </div>
        </div>
    );
};

export default HDOurFeesOverlay;
