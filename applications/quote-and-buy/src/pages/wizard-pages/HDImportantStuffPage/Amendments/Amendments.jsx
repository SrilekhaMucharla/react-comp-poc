import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import _ from 'lodash';
import Endorsement from './Endorsement';
import * as messages from './Amendments.messages';

const Amendments = ({ endorsements, brand }) => {
    let endorsmentsList = endorsements;
    if (brand !== messages.HE) {
        endorsmentsList = _.map(endorsmentsList, (data) => {
            if (data.endorsementCode !== messages.endorsmente31Code) {
                return data;
            }
        });
        endorsmentsList = _.without(endorsmentsList, undefined);
    }
    if (endorsmentsList && endorsmentsList.length) {
        return (
            <Row className="my-5">
                <Col className="px-mobile-0">
                    <div className="important-stuff__amendment-policy-wrapper elevated-box">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.amendmentHeaderText}
                            id="important-stuff-amendments-header"
                            className="mt-0 mb-3" />
                        {endorsmentsList.map(({ endorsementCode, endorsementTitle, endorsementDescription }, index) => (
                            <Endorsement
                                key={endorsementCode}
                                title={endorsementTitle}
                                description={endorsementDescription}
                                number={index + 1} />
                        ))}
                    </div>
                </Col>
            </Row>
        );
    }
    return null;
};


Amendments.propTypes = {
    endorsements: PropTypes.arrayOf(PropTypes.shape({
        endorsementTitle: PropTypes.string.isRequired,
        endorsementDescription: PropTypes.string.isRequired,
        endorsementCode: PropTypes.string.isRequired,
    })).isRequired,
    brand: PropTypes.string.isRequired
};


export default Amendments;
