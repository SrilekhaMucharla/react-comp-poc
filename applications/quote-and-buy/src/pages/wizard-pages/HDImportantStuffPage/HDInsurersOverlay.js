/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './HDInsurersOverlayPage.messages';

const insurersData = [
    {
        mainSubject: {
            header: messages.mainInsurer,
            content: messages.insurerText
        },
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: true },
            { header: messages.van, value: true },
            { header: messages.home, value: true }
        ]
    },
    {
        mainSubject: {
            header: messages.mainInsurer,
            content: messages.covea
        },
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: false },
            { header: messages.van, value: true },
            { header: messages.home, value: false }
        ]
    },
    {
        mainSubject: {
            header: messages.mainInsurer,
            content: messages.sabre
        },
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: false },
            { header: messages.van, value: false },
            { header: messages.home, value: false }
        ]
    },

];

const productsData = [
    {
        mainSubject: {
            header: messages.product,
            content: messages.breakdown
        },
        subjects: [
            {
                header: messages.admin,
                content: messages.rac
            },
            {
                header: messages.subInsurer,
                content: <span className="insurers-overlay__insurer--rac-text">{messages.racInsurance}</span>
            }
        ],
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: true },
            { header: messages.van, value: true },
            { header: messages.home, value: false }
        ]
    },
    {
        mainSubject: {
            header: messages.product,
            content: messages.keyProtect
        },
        subjects: [
            {
                header: messages.admin,
                content: messages.uris
            },
            {
                header: messages.subInsurer,
                content: messages.inter
            }
        ],
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: false },
            { header: messages.van, value: false },
            { header: messages.home, value: true }
        ]
    },
    {
        mainSubject: {
            header: messages.product,
            content: messages.legal
        },
        subjects: [
            {
                header: messages.admin,
                content: messages.carpenters
            },
            {
                header: messages.subInsurer,
                content: messages.allianz
            }
        ],
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: true },
            { header: messages.van, value: true },
            { header: messages.home, value: false }
        ]
    },
    {
        mainSubject: {
            header: messages.product,
            content: messages.personalAccident
        },
        subjects: [
            {
                header: messages.admin,
                content: messages.canopius
            },
            {
                header: messages.subInsurer,
                content: messages.lloyd
            }
        ],
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: true },
            { header: messages.van, value: true },
            { header: messages.home, value: false }
        ]
    },
    {
        mainSubject: {
            header: messages.product,
            content: messages.substitute
        },
        subjects: [
            {
                header: messages.admin,
                content: messages.uris
            },
            {
                header: messages.subInsurer,
                content: messages.ukGeneral
            }
        ],
        items: [
            { header: messages.car, value: true },
            { header: messages.bike, value: false },
            { header: messages.van, value: true },
            { header: messages.home, value: false }
        ]
    },
];

const InsurerBox = ({ mainSubject, subjects, items }) => (
    <Container fluid className="insurers-overlay__insurer-box">
        <Row>
            <Col className="insurers-overlay__insurer-box__main-subject">
                <div className="font-bold margin-bottom-tiny">
                    {mainSubject.header}
                </div>
                <div>{mainSubject.content}</div>
            </Col>
            {items.map(({ header, value }, tableIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <Col xs="auto" className="insurers-overlay__insurer-box__insurance-item" key={tableIndex}>
                    {header}
                    <i className={`fa fa-${value ? 'check' : 'times'}-circle`} aria-hidden="true" />
                </Col>
            ))}
        </Row>
        {subjects && subjects.map(({ header, content }, tableIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={tableIndex}>
                <Col className="insurers-overlay__insurer-box__subject">
                    <div className="font-bold margin-bottom-tiny margin-top-md">
                        {header}
                    </div>
                    <div>{content}</div>
                </Col>
            </Row>
        ))}
    </Container>
);

const HDInsurersOverlay = () => {
    return (
        <>
            <HDLabelRefactor Tag="h2" text={messages.insurer} className="mt-0" />
            <p>{messages.insurerContentOne}</p>
            <p>{messages.insurerContentTwo}</p>
            <p className="insurers-overlay__mb--section-break">
                {messages.insurerContentThree}
                <a
                    href={messages.policyLink}
                    className="insurers-overlay__link"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {messages.privacyNoticeText}
                </a>
                {messages.insurerContentFour}
            </p>
            {insurersData.map((insurerData, tableIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <InsurerBox {...insurerData} key={tableIndex} />
            ))}
            <p className="insurers-overlay__mt--section-break">{messages.followingText}</p>
            {productsData.map((insurerData, tableIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <InsurerBox {...insurerData} key={tableIndex} />
            ))}
        </>
    );
};

export default HDInsurersOverlay;
