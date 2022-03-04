import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './HDHeader.messages';

export default function HDHeader({ multicarReference }) {
    return (
        <header>
            <HDLabelRefactor
                id="important-stuff-header"
                className="text-white"
                Tag="h1"
                text={messages.importantStuffHeading} />
            <HDLabelRefactor
                id="important-stuff-subheader"
                className="text-white"
                Tag="p"
                text={messages.headerMainParagraph} />
            {multicarReference && (
                <p>
                    <span className="mc-important-stuff--info-text-1">{messages.headerSpan}</span>
                    <br />
                    <span className="font-bold">{multicarReference}</span>
                </p>
            )}
        </header>
    );
}

HDHeader.propTypes = {
    multicarReference: PropTypes.string.isRequired
};
