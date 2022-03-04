import React from 'react';

const getDataforTable = (ptype) => {
    const brand = ptype;
    switch (brand) {
        case 'HE':
            return [
                {
                    name: 'Death',
                    values: ['£1,000', '£100,000']
                },
                {
                    name: 'Permanent loss of sight in one or both eyes',
                    values: ['£1,000', '£100,000']
                },
                {
                    name: 'Loss of a limb',
                    values: ['£1,000', '£100,000']
                },
                {
                    name: 'Insured people',
                    values: [
                        <>
                            <div>Policyholder and their partner</div>
                            <div className="text-small">(aged 75 and under)</div>
                        </>,
                        <>
                            <div>Policyholder and up to six passengers</div>
                            <div className="text-small">(aged 79 and under)</div>
                        </>
                    ]
                },
                {
                    name: 'Pay out if you can’t carry out normal daily activities',
                    values: ['£0', '£100 per day']
                },
                {
                    name: 'Fractured bones',
                    values: ['£0', 'Up to £5,000']
                }
            ];
        case 'comprehensive':
            return [
                {
                    name: 'Death',
                    values: ['£5,000', '£100,000']
                },
                {
                    name: 'Permanent loss of sight in one or both eyes',
                    values: ['£5,000', '£100,000']
                },
                {
                    name: 'Loss of a limb',
                    values: ['£5,000', '£100,000']
                },
                {
                    name: 'Insured people',
                    values: [
                        <>
                            <div>Policyholder and their partner</div>
                            <div className="text-small">(aged 75 and under)</div>
                        </>,
                        <>
                            <div>Policyholder and up to six passengers</div>
                            <div className="text-small">(aged 79 and under)</div>
                        </>
                    ]
                },
                {
                    name: 'Pay out if you can’t carry out normal daily activities',
                    values: ['£0', '£100 per day']
                },
                {
                    name: 'Fractured bones',
                    values: ['£0', 'Up to £5,000']
                }
            ];
        case 'tpft':
            return [
                {
                    name: 'Death',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Permanent loss of sight in one or both eyes',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Loss of a limb',
                    values: ['£0', '£100,000']
                },
                {
                    name: 'Insured people',
                    values: [
                        <>
                            <div>No One</div>
                        </>,
                        <>
                            <div>Policyholder and up to six passengers</div>
                            <div className="text-small">(aged 79 and under)</div>
                        </>
                    ]
                },
                {
                    name: 'Pay out if you can’t carry out normal daily activities',
                    values: ['£0', '£100 per day']
                },
                {
                    name: 'Fractured bones',
                    values: ['£0', 'Up to £5,000']
                }
            ];
        default:
            return [];
    }
};

export default getDataforTable;
