import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './Endorsement.messages';

const Endorsement = ({
    number,
    title,
    description
}) => (
    <>
        <HDLabelRefactor
            Tag="h5"
            text={`${messages.amendmentSubHeaderText} ${number}`}
            id="important-stuff-amendments-subheader"
            className="margin-top-md mb-3" />
        <HDLabelRefactor
            Tag="p"
            text={title}
            id="important-stuff-amendments-title"
            className="important-stuff__amendment-policy-wrapper__info-text font-bold" />
        <p
            id="important-stuff-amendments-description"
            className="important-stuff__amendment-policy-wrapper__info-text mb-0"
        >
            {description}
        </p>
    </>
);

Endorsement.propTypes = {
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default Endorsement;
